'use strict';

angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', '$state', '$http', 'Events', 'EventStatuses', 'EventActions', 'Members', 'Actor', 'Modal',
    function ($scope, $stateParams, $location, $state, $http, Events, EventStatuses, EventActions, Members, Actor, Modal) {

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

        $scope.isNew = $state.is('events-create');
        $scope.statuses = EventStatuses;

        $scope.event = null;
        $scope.isParticipant = false;

        $scope.initOrganizationOptions = function() {
            $scope.organizationOptions = [];
            Actor.getActivist().then(function (activist) {
                if (activist) {
                    Members.query({activistId: activist._id}, function (members) {
                        members.forEach(function (member) {
                            $scope.organizationOptions.push({
                                value: member.organization._id,
                                label: member.organization.title
                            });
                        });
                    });
                }
            });
        };

        $scope.init = function () {
            if ($scope.isNew && $scope.isAuthenticated()) {
                $scope.datetime = new Date();
                $scope.initOrganizationOptions();
            } else {
                $scope.findOne();
                $scope.initOrganizationOptions();
            }
        };

        $scope.find = function (v) {
            var q = {region: $scope.region.value.indexOf('0.') === 0 ? undefined : $scope.region._id};
            if (v) {
                q.title2seek = v;
            }
            Events.query(q, function (events) {
                $scope.events = events;
            });
        };

        $scope.findOne = function () {
            $scope.event = null;
            $scope.isParticipant = false;
            return Events.get({
                eventId: $stateParams.eventId
            }, function (event) {
                $scope.event = event;
                $scope.isParticipant = Actor.isParticipant();
                $scope.description = event.description;
                $scope.title = event.title;
                $scope.organization = event.organization;
                $scope.datetime = event.datetime;
                $scope.status = event.status;
                $scope.sites = event.sites;
                $scope.min_part = event.min_part;
                $scope.max_part = event.max_part;
                $scope.address = $scope.address_ = event.address;
                $scope.gps = $scope.gps_ = event.gps;
                $scope.region = event.region ? event.region._id : undefined;
                $scope.google_maps_api_address = event.google_maps_api_address;
            });
        };

        $scope.submit = function () {
            if ($scope.isNew) {
                return $scope.create();
            } else {
                return $scope.update();
            }
        };

        $scope.cancel = function() {
            $state.goBack();
        };

        $scope.create = function () {
            var events = new Events({
                description: this.description,
                title: this.title,
                organization: this.organization,
                datetime: this.datetime,
                status: this.status,
                sites: this.sites,
                min_part: this.min_part,
                max_part: this.max_part,
                address: this.address,
                gps: this.gps,
                region: this.region ? this.region._id : undefined,
                google_maps_api_address: this.google_maps_api_address
            });
            return events.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.goBack();
                }

            });
        };

        $scope.update = function() {
            var event = $scope.event;
            event.description = this.description;
            event.title = this.title;
            event.organization = this.organization;
            event.datetime = this.datetime;
            event.status = this.status;
            event.sites = this.sites;
            event.min_part = this.min_part;
            event.max_part = this.max_part;
            event.address = this.address;
            event.gps = this.gps;
            event.region = this.region ? this.region._id : undefined;
            event.google_maps_api_address = this.google_maps_api_address;
            return event.$update(function(response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.goBack();
                }
            });
        };

        $scope.remove = function (event) {
            if (event) {
                return event.$remove(function () {
                    for (var i in $scope.events) {
                        if ($scope.events[i] === event) {
                            $scope.events.splice(i, 1);
                        }
                    }
                });
            } else {
                return $scope.event.$remove(function (response) {
                    $location.path('events');
                });
            }
        };


        // event actions
        function getEventActions () {
            $scope.eventActions = null;
            EventActions.getActions().then(function (actions) {
                $scope.eventActions = actions;
            });
        }

        getEventActions();

        function eventActionSuccess () {
            if ($state.is('events-view')) {
                $scope.findOne();
            } else {
                $scope.find();
            }
            getEventActions();
        }

        $scope.approveEvent = function () {
            Modal.confirm({message: 'Затвердити подію?'}).result.then(
                function (obj) {
                    if (obj.result === 'yes') {
                        $scope.eventActions.approve().then(eventActionSuccess);
                    }
                }
            );
        };

        $scope.cancelEvent = function () {
            Modal.confirm({message: 'Відмінити подію?'}).result.then(
                function (obj) {
                    if (obj.result === 'yes') {
                        $scope.eventActions.cancel().then(eventActionSuccess);
                    }
                }
            );
        };

        $scope.startEvent = function () {
            Modal.confirm({message: 'Розпочати подію?'}).result.then(
                function (obj) {
                    if (obj.result === 'yes') {
                        $scope.eventActions.start().then(eventActionSuccess);
                    }
                }
            );
        };

        $scope.finishEvent = function () {
            Modal.custom({
                templateUrl: 'packages/events/public/views/modal/finish.html',
                controller: function ($scope, $modalInstance) {
                    $scope.win = function () {
                        $modalInstance.close({result: 'win', input: $scope.data.inputText});
                    };
                    $scope.defeat = function () {
                        $modalInstance.close({result: 'defeat', input: $scope.data.inputText});
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss({result: 'cancel'});
                    };
                    $scope.data = {};
                    $scope.data.inputText = '';
                }
            }).result.then(
                function (obj) {
                    if (obj.result === 'win') {
                        $scope.eventActions.finish().then(function () {
                            $scope.eventActions.win(obj.input).then(eventActionSuccess);
                        });
                    } else if (obj.result === 'defeat') {
                        $scope.eventActions.finish().then(function () {
                            $scope.eventActions.defeat(obj.input).then(eventActionSuccess);
                        });
                    }
                }
            );
        };

        $scope.defeatEvent = function () {
            Modal.prompt({
                message: 'Завершити подію поразкою?',
                inputTextPlaceholder: 'Опишіть результат'
            }).result.then(
                function (obj) {
                    if (obj.result === 'ok') {
                        $scope.eventActions.defeat(obj.input).then(eventActionSuccess);
                    }
                }
            );
        };

        $scope.winEvent = function () {
            Modal.prompt({
                message: 'Завершити подію перемогою?',
                inputTextPlaceholder: 'Опишіть результат'
            }).result.then(
                function (obj) {
                    if (obj.result === 'ok') {
                        $scope.eventActions.win(obj.input).then(eventActionSuccess);
                    }
                }
            );
        };

        (function loadGoogleMapsApiScript() {
            window.initializeGoogleMapsApi = function () {
                $scope.geocoder = new window.google.maps.Geocoder();
                var locCenter = new window.google.maps.LatLng(50.450294,30.523772);
                var mapOptions = {
                    zoom: 12,
                    center: locCenter
                };
                $scope.map = new window.google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                var panoramaOptions = {
                    position: locCenter,
                    pov: {
                        heading: 0,
                        pitch: 10
                    }
                };
                $scope.panorama = new window.google.maps.StreetViewPanorama(document.getElementById('pano-canvas'), panoramaOptions);
                $scope.map.setStreetView($scope.panorama);
                window.google.maps.event.addListener($scope.panorama, 'visible_changed', function() {
                    $scope.panoramaVisible = $scope.panorama.getVisible();
                    window.setTimeout(function(){$scope.$apply();});
                });
                function setMarker(location) {
                    $scope.marker = $scope.marker || new window.google.maps.Marker({
                        position: location,
                        map: $scope.map,
                        title: 'Подiя адбудеца тут!'
                    });
                    $scope.marker.setPosition(location);
                    $scope.map.setCenter(location);
                    $scope.panorama.setPosition(location);
                    $scope.panorama.setVisible(true);
                }
                function setGps(location) {
                    $scope.gps = $scope.gps_ = location.toUrlValue();
                }
                function setAddress(suggestion) {
                    $scope.address = $scope.address_ = suggestion.formatted_address;
                    $scope.google_maps_api_address = suggestion;
                    $scope.suggestions = {};
                }
                function seekAddress(location) {
                    $scope.geocoder.geocode({
                        'location': location,
                        region: 'UA'
                    }, function(results, status) {
                        if (status === window.google.maps.GeocoderStatus.OK) {
                            setAddress(results[0]);
                            setRegionFromSuggestion(results[0]);
                            $scope.$apply();
                        }
                    });
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
                        $scope.region = region;
                    }
                    var regionLabel = getRegionFromSuggestion(suggestion);
                    var region = getRegionByRegionLabel(regionLabel);
                    if (region && region.then) {
                        region.then(setResolvedRegion);
                    } else {
                        setResolvedRegion(region);
                    }
                }
                window.google.maps.event.addListener($scope.map, 'click', function (event) {
                    setMarker(event.latLng);
                    setGps(event.latLng);
                    seekAddress(event.latLng);
                    $scope.$apply();
                });
                $scope.$watch('address', function() {
                    if ($scope.address && $scope.address !== $scope.address_) {
                        $scope.geocoder.geocode({
                            'address': $scope.address,
                            region: 'UA',
                            componentRestrictions: {
                                country: 'UA'
                            }
                        }, function(results, status) {
                            if (status === window.google.maps.GeocoderStatus.OK) {
                                $scope.suggestions = {};
                                results.forEach(function(suggestion) {
                                    $scope.suggestions[suggestion.formatted_address] = suggestion;
                                });
                                $scope.$apply();
                            }
                        });
                    }
                });
                $scope.$watch('gps', function() {
                    if ($scope.gps && $scope.gps !== $scope.gps_) {
                        try {
                            var ps = $scope.gps.split(',');
                            if (ps.length === 2) {
                                var location = new window.google.maps.LatLng(Number(ps[0]),Number(ps[1]));
                                setMarker(location);
                                seekAddress(location);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
                $scope.suggestions = {};
                $scope.selectSuggestion = function(suggestion) {
                    setMarker(suggestion.geometry.location);
                    setGps(suggestion.geometry.location);
                    setAddress(suggestion);
                    setRegionFromSuggestion(suggestion);
                };
                function setEventLocationMarker() {
                    if ($scope.event && $scope.event.google_maps_api_address && ($state.is('events-create') || $state.is('events-edit'))) {
                        var suggestion = $scope.event.google_maps_api_address;
                        suggestion.geometry.location = new window.google.maps.LatLng(suggestion.geometry.location.k,suggestion.geometry.location.B);
                        setMarker(suggestion.geometry.location);
                    }
                }
                if ($scope.event) {
                    setEventLocationMarker();
                }
                $scope.$watch('event', function() {
                    setEventLocationMarker();
                });
            };
            if ($state.is('events-create') || $state.is('events-edit')) {
                if (!window.google) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = '//maps.googleapis.com/maps/api/js?language=uk&region=UA' + '&callback=initializeGoogleMapsApi';
                    window.document.body.appendChild(script);
                } else {
                    window.initializeGoogleMapsApi();
                }
            }
        })();

        $scope.$watch('eventTitle2Seek', function(v,p,s) {
            $scope.find(v);
        });

    }
]);
