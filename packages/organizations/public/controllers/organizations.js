'use strict';

var app = angular.module('mean.organizations', ['ui.bootstrap', 'xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.controller('OrganizationsController',
    ['$scope', '$rootScope', '$stateParams', '$location', '$state', '$http', 'Organizations', 'Actor', 'Activists', 'Members', 'Events', 'Supports',
    function ($scope, $rootScope, $stateParams, $location, $state, $http, Organizations, Actor, Activists, Members, Events, Supports) {

        (function initRegions(){
            $scope.regions = [
                {'value': '0.Вся Україна', 'label': 'Вся Україна'}
            ];
            $scope.region = $scope.regions[0];
            $http({method: 'GET', url: '/regions'}).
                success(function(data, status, headers, config) {
                    $scope.regions = data;
                    $scope.region = $scope.regions.filter(function (region) {
                        return '' + region.value === '' + $stateParams.region;
                    })[0] || $scope.regions[0];
                });
        })();

        $scope.setRegion = function (region) {
            $scope.region = region;
            $scope.find();
        };

        $scope.isNew = $state.is('organizations-create');

        $scope.init = function () {
            if (!$scope.isNew) {
                $scope.findOne();
            } else {
                $scope.organization = new Organizations();
            }
        };

        $scope.find = function (v) {
            var q = {region: $scope.region.value.indexOf('0.') === 0 ? undefined : $scope.region._id};
            if (v) {
                q.title2seek = v;
            }
            Organizations.query(q, function (organizations) {
                $scope.organizations = organizations;
            });
        };

        $scope.findOne = function () {
            Organizations.get({
                organizationId: $stateParams.organizationId
            }, function (organization) {
                $scope.organization = organization;
                $scope.canEdit = $scope.isOwner(organization);
            });
        };

        $scope.findAuthenticated = function () {
            if ($scope.global.authenticated) {
                Actor.getActivist().then(function (activist) {
                    if (activist) {
                        Members.query({
                            activistId: activist._id,
                            organizationId: $stateParams.organizationId
                        }, function (members) {
                            $scope.member = members[0];
                        });
                    }
                });
            }
        };

        $scope.join = function () {
            Actor.getActivist().then(function (activist) {
                if (activist) {
                    var member = new Members({
                        activist: activist._id,
                        organization: $stateParams.organizationId
                    });
                    member.$save(function () {
                        $state.go('organizations-view', {}, {reload: true});
                    });
                }
            });
        };

        $scope.leave = function () {
            $scope.member.$remove(function() {
                $state.go('organizations-view', {}, {reload: true});
            });
        };

        $scope.findMembers = function () {
            Members.query({
                organizationId: $stateParams.organizationId
            }, function (members) {
                $scope.members = members;
            });
        };

        $scope.findEvents = function () {
            Events.query({
                organizationId: $stateParams.organizationId
            }, function (events) {
                $scope.events = events;
            });
        };

        $scope.findEventsSupported = function () {
            Supports.query({
                organizationId: $stateParams.organizationId
            }, function (supports) {
                $scope.supports = supports;
            });
        };

        $scope.inlineEdit = function inlineEdit(form) {
            if ($scope.canEdit) {
                form.$show();
            }
        };

        $scope.create = function () {
            $scope.organization.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.goBack();
                }
            });
        };

        $scope.update = function(data) {
            var organization = $scope.organization;
            if (data) {
                organization[data.path] = data.data;
            }
            if (!organization.updated) {
                organization.updated = [];
            }
            organization.updated.push(new Date().getTime());
            organization.$update(function() {
                if (!data) {
                    $state.goBack();
                }
            });
        };

        $scope.cancel = function cancel() {
            $state.goBack();
        };

        $scope.remove = function (organization) {
            if (organization) {
                organization.$remove(function (response) {
                    if (!response.errors) {
                        for (var i in $scope.organizations) {
                            if ($scope.organizations[i] === organization) {
                                $scope.organizations.splice(i, 1);
                            }
                        }
                    }
                });
            } else {
                $scope.organization.$remove(function (response) {
                    $state.goBack();
                });
            }
        };


        $scope.beforeImageUpdate = function() {
            var el = window.document.getElementById('organization_image_id');
            el.width = 100;
            el.height = 100;
        };

        $scope.afterImageUpdate = function() {
            var el = window.document.getElementById('organization_image_id');
            el.width = 200;
            el.height = 200;
        };

        (function loadGoogleMapsApiScript() {
            window.initializeGoogleMapsApi4Organization = function () {
                $scope.geocoder = new window.google.maps.Geocoder();
                function getCityFromSuggestion(suggestion) {
                    for (var i in suggestion.address_components) {
                        var address_component = suggestion.address_components[i];
                        if (address_component.types.indexOf('locality') > -1) {
                            return address_component.long_name;
                        }
                    }
                }
                function setCityFromSuggestion(suggestion) {
                    var city = getCityFromSuggestion(suggestion);
                    $scope.organization.city = city;
                    $scope.suggestions = {};
                }
                function getRegionFromSuggestion(suggestion) {
                    for (var i in suggestion.address_components) {
                        var address_component = suggestion.address_components[i];
                        if (address_component.types.indexOf('administrative_area_level_1') > -1) {
                            return address_component.long_name;
                        }
                    }
                }
                function getRegionByRegionLabel(regionLabel) {
                    if (regionLabel) {
                        for(var i in $scope.regions) {
                            if ($scope.regions[i].label === regionLabel) {
                                return $scope.regions[i];
                            }
                        }
                        var region = {value: regionLabel, label: regionLabel};
                        var promise = $http({method: 'PUT', url: '/regions', data: region})
                            .success(function(region){
                                if (region) {
                                    $scope.regions.push(region);
                                }
                            });
                        return promise;
                    }
                }
                function setRegionFromSuggestion(suggestion) {
                    function setResolvedRegion(region) {
                        region = (region && region.data) ? region.data : region;
                        $scope.organization.region = (region && region._id) ? region._id : null;
                    }
                    var regionLabel = getRegionFromSuggestion(suggestion);
                    var region = getRegionByRegionLabel(regionLabel);
                    if (region && region.then) {
                        region.then(setResolvedRegion);
                    } else {
                        setResolvedRegion(region);
                    }
                }

                $scope.$watch('organization.city', function(v,p,s) {
                    if (v && p && v !== p) {
                        $scope.geocoder.geocode({
                            'address': $scope.organization.city,
                            region: 'UA',
                            componentRestrictions: {
                                country: 'UA'
                            }
                        }, function(results, status) {
                            if (status === window.google.maps.GeocoderStatus.OK) {
                                $scope.suggestions = {};
                                var firstSuggestion;
                                results.forEach(function(suggestion) {
                                    suggestion.city = getCityFromSuggestion(suggestion);
                                    if (!firstSuggestion) firstSuggestion = suggestion;
                                    if (suggestion.city && suggestion.city !== v) {
                                        $scope.suggestions[suggestion.city] = suggestion;
                                    }
                                });
                                if (firstSuggestion && firstSuggestion.city) {
                                    setRegionFromSuggestion(firstSuggestion);
                                } else {
                                    $scope.organization.region = null;
                                }
                                $scope.$apply();
                            }
                        });
                    }
                });
                $scope.suggestions = {};
                $scope.selectSuggestion = function(suggestion) {
                    setCityFromSuggestion(suggestion);
                    setRegionFromSuggestion(suggestion);
                };
            };
            if (!window.google) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '//maps.googleapis.com/maps/api/js?language=uk&region=UA' + '&callback=initializeGoogleMapsApi4Organization';
                window.document.body.appendChild(script);
            } else {
                window.initializeGoogleMapsApi4Organization();
            }
        })();

        $scope.$watch('organizationTitle2Seek', function(v,p,s) {
            $scope.find(v);
        });
    }
]);

