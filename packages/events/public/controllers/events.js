'use strict';

angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', '$state', '$http', 'Events', 'EventStatuses', 'Members', 'Actor',
    function ($scope, $stateParams, $location, $state, $http, Events, EventStatuses, Members, Actor) {

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

        $scope.init = function () {
            if ($scope.isNew && $scope.isAuthenticated()) {
                $scope.datetime = new Date();
                $scope.organizationOptions = [];
                Members.query({activistId: $scope.global.activist._id}, function (members) {
                    members.forEach(function (member) {
                        $scope.organizationOptions.push({
                            value: member.organization._id,
                            label: member.organization.title
                        });
                    });
                });
            } else {
                $scope.findOne();
            }
        };

        $scope.find = function () {
            return Events.query({region: $scope.region.value === '0.Вся Україна' ? undefined : $scope.region._id}, function (events) {
                $scope.events = events;
            });
        };

        $scope.findOne = function () {
            return Events.get({
                eventId: $stateParams.eventId
            }, function (event) {
                $scope.event = event;
                $scope.isParticipant = Actor.isParticipant();
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
                gps: this.gps,
                google_maps_api_address: this.google_maps_api_address
            });
            return events.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.go('events-view', {eventId: response._id});
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
            event.gps = this.gps;
            event.google_maps_api_address = this.google_maps_api_address;
            if (!event.updated) {
                event.updated = [];
            }
            event.updated.push(new Date().getTime());
            return event.$update(function() {
                $state.go('events-view', {eventId: event._id});
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
                function getRegionFromSuggestion(suggestion) {
                    for (var i in suggestion.address_components) {
                        var address_component = suggestion.address_components[i];
                        if (address_component.types.indexOf('administrative_area_level_1') > -1) {
                            return address_component.long_name;
                        }
                    }
                }
                function setAddress(suggestion) {
                    $scope.address = $scope.address_ = suggestion.formatted_address;
                    $scope.google_maps_api_address = suggestion;
                    $scope.suggestions = {};
                    console.log(getRegionFromSuggestion(suggestion));
                }
                function seekAddress(location) {
                    $scope.geocoder.geocode({
                        'location': location,
                        region: 'RU'
                    }, function(results, status) {
                        if (status === window.google.maps.GeocoderStatus.OK) {
                            setAddress(results[0]);
                            $scope.$apply();
                        }
                    });
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
                            region: 'RU',
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
                };
                function setEventLocationMarker() {
                    if ($scope.event && $scope.event.google_maps_api_address && ($state.is('events-create') || $state.is('events-edit'))) {
                        $scope.event.google_maps_api_address.geometry.location = new window.google.maps.LatLng($scope.event.google_maps_api_address.geometry.location.k,$scope.event.google_maps_api_address.geometry.location.B);
                        $scope.selectSuggestion($scope.event.google_maps_api_address);
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
                    script.src = 'https://maps.googleapis.com/maps/api/js?language=RU&key=AIzaSyDSZPReGhVdinuojwY1kctnXqy0YSF1GYU' + '&callback=initializeGoogleMapsApi';
                    window.document.body.appendChild(script);
                } else {
                    window.initializeGoogleMapsApi();
                }
            }
        })();

    }
]);
