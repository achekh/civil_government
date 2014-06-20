'use strict';

angular.module('mean.events').controller('EventsController',
    ['$scope', '$stateParams', '$location', '$state', 'Events', 'EventStatuses', 'Activists', 'Members',
    function ($scope, $stateParams, $location, $state, Events, EventStatuses, Activists, Members) {

        $scope.isNew = $state.is('events-create');
        $scope.statuses = EventStatuses.all;
        $scope.getLabel = EventStatuses.getLabel;

        $scope.init = function () {
            if (!$scope.isNew) {
                $scope.findOne();
            }
            $scope.findActivistOrganizations();
            $scope.datetime = new Date();
        };

        $scope.findActivistOrganizations = function findActivistOrganizations() {
            $scope.activistOrganizations = [];
            // find current user activist
            Activists.query({userId: $scope.global.user._id}, function (activists) {
                if (activists.length) {
                    // activist found
                    $scope.activist = activists[0];
                    //find activist organizations, where the activist is the leader of an organization
                    Members.query({activistId: $scope.activist._id, isLeader: true}, function (members) {
                        members.forEach(function(member) {
                            $scope.activistOrganizations.push({
                                value: member.organization,
                                label: member.organization.title
                            });
                        });
                    });
                } else {
                    // current user have no activist yet
                    // go create one
                    $state.go('activists-create');
                }
            });
        };

        $scope.find = function () {
            return Events.query(function (events) {
                $scope.events = events;
            });
        };

        $scope.findOne = function () {
            return Events.get({
                eventId: $stateParams.eventId
            }, function (event) {
                $scope.event = event;
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
                organization: this.organization._id,
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
