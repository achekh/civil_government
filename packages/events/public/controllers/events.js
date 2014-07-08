'use strict';

angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', '$state', '$http', 'Events', 'EventStatuses', 'Activists', 'Participants', 'Members',
    function ($scope, $stateParams, $location, $state, $http, Events, EventStatuses, Activists, Participants, Members) {

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

        $scope.canParticipate = false;

        $scope.event = null;
        $scope.participant = null;

        $scope.isHead = function () {
            return $scope.event && $scope.isOwner($scope.event.organization);
        };

        $scope.isParticipant = function () {
            return $scope.participant && $scope.isOwner($scope.participant.activist);
        };

        $scope.isCoordinator = function () {
            return $scope.isParticipant() && $scope.participant.coordinator;
        };

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

            $scope.canParticipate = false;

            return Events.get({
                eventId: $stateParams.eventId
            }, function (event) {

                $scope.event = event;

                if ($scope.isAuthenticated()) {

                    Participants.query({
                        activistId: $scope.global.activist._id,
                        eventId: event._id
                    }, function (participants) {

                        if (!participants.errors) {

                            if (participants.length === 0) {

                                Members.query({
                                    activistId: $scope.global.activist._id,
                                    organizationId: event.organization._id
                                }, function (members) {

                                    if (!members.errors) {
                                        if (members.length === 1) {
                                            $scope.canParticipate = true;
                                        }
                                    }

                                });

                            } else if (participants.length === 1) {

                                $scope.canParticipate = true;
                                $scope.participant = participants[0];

                            }

                        }

                    });

                }

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
                gps: this.gps
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
            event.datetime = this.date + ' ' + this.time;
            event.status = this.status;
            event.sites = this.sites;
            event.min_part = this.min_part;
            event.max_part = this.max_part;
            event.gps = this.gps;
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

    }
]);
