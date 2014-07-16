'use strict';

angular.module('mean.activists')
    .controller('ActivistsController', ['$scope', '$modal', '$rootScope', '$state', '$stateParams', '$http', 'Activists', 'Events', 'Participants', 'Members',
    function ($scope, $modal, $rootScope, $state, $stateParams, $http, Activists, Events, Participants, Members) {

        var handleGetActivistSuccess = function (activist) {
            $scope.activist = activist;
            $scope.canEdit = $scope.hasAuthorization(activist);
            $scope.isOwner = $scope.isOwner(activist);
            $scope.findOwnedEvents();
            $scope.findParticipatedEvents();
            $scope.findOrganizations();
        };

        $scope.init = function () {
            if ($stateParams.activistId) {
                // find activist by id
                Activists.get({activistId: $stateParams.activistId}, function (activist) {
                    handleGetActivistSuccess(activist);
                });
            } else {
                // find current user activist
                Activists.query({userId: $scope.global.user._id}, function (activists) {
                    if (activists.length) {
                        // activist found
                        handleGetActivistSuccess(activists[0]);
                    } else {
                        // current user have no activist yet
                        // go create one
                        $state.go('activists-create');
                    }
                });
            }
        };

//        $scope.open = function () {
//            $scope.fromProfile = true;
//            $scope.modelInstanceFromProfile = $modal.open({
//                templateUrl: 'activists/views/edit.html', size: 'lg', scope: $scope, backdrop: 'static'
//            });
//            $scope.modelInstanceFromProfile.result.then(function () {
//                $scope.init();
//            });
//        };

        $scope.findOwnedEvents = function findMyEvents() {
            $scope.eventsOwned = [];
            Events.query({userId: $scope.activist.user._id}, function (events) {
                $scope.eventsOwned = events;
            });
        };

        $scope.findParticipatedEvents = function findEventsParticipated() {
            $scope.eventsParticipated = [];
            Participants.query({activistId: $scope.activist._id}, function (participants) {
                participants.forEach(function (participant) {
                    $scope.eventsParticipated.push(participant.event);
                });
            });
        };

        $scope.findOrganizations = function findOrganizations() {
            $scope.organizations = [];
            Members.query({activistId: $scope.activist._id}, function (members) {
                members.forEach(function (member) {
                    $scope.organizations.push(member.organization);
                });
            });
        };

        $scope.findLeaders = function() {
            Activists.query({
                sortBy: '-eventsTotal',
                region: $scope.region.value.indexOf('0.') === 0 ? undefined : $scope.region._id
            }, function(leaders) {
                $scope.leaders = leaders;
            });
        };

        $scope.getLeaderInSystemDurationSeconds = function(leader) {
            return (new Date().getTime() - new Date(leader.created).getTime()) / 1000;
        };

        $scope.nowDate = new Date();

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
            $scope.findLeaders();
        };

    }])
    .controller('ActivistsEditController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', 'Activists',
    function ($scope, $rootScope, $state, $stateParams, $location, $http, Activists) {

        $scope.isNew = $state.is('activists-create');

        $scope.init = function () {
            Activists.save({}, function(activist) {
                $scope.activist = activist;
            });
        };

        $scope.update = function () {
            var activist = $scope.activist;
            activist.$update(function (activist) {
                $rootScope.$emit('activist-updated', activist);
                $state.go('activists-view');
            }, function(err){
                $scope.errors = err.data;
            });
        };

        $scope.cancel = function () {
            $rootScope.$emit('activist-canceled');
            $state.go('activists-view');
        };

        (function loadGoogleMapsApiScript() {
            window.initializeGoogleMapsApi4Activist = function () {
                $scope.geocoder = new window.google.maps.Geocoder();
                $http({method: 'GET', url: '/regions'}).success(function(regions) {$scope.regions = regions;});
                function getCountryFromSuggestion(suggestion) {
                    for (var i in suggestion.address_components) {
                        var address_component = suggestion.address_components[i];
                        if (address_component.types.indexOf('country') > -1) {
                            return address_component.long_name;
                        }
                    }
                }
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
                    $scope.activist.city = city;
                    var country = getCountryFromSuggestion(suggestion);
                    $scope.activist.country = country;
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
                        $scope.activist.region = (region && region._id) ? region._id : null;
                    }
                    var regionLabel = getRegionFromSuggestion(suggestion);
                    var region = getRegionByRegionLabel(regionLabel);
                    if (region && region.then) {
                        region.then(setResolvedRegion);
                    } else {
                        setResolvedRegion(region);
                    }
                }

                $scope.$watch('activist.city', function(v,p,s) {
                    if (v && p && v !== p) {
                        $scope.geocoder.geocode({
                            'address': $scope.activist.city,
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
                                    $scope.activist.region = null;
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
                script.src = '//maps.googleapis.com/maps/api/js?language=uk&region=UA' + '&callback=initializeGoogleMapsApi4Activist';
                window.document.body.appendChild(script);
            } else {
                window.initializeGoogleMapsApi4Activist();
            }
        })();

    }
]);
