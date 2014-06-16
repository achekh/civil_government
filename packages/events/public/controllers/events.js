'use strict';

angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', '$state', 'Events', 'Activists',
    function ($scope, $stateParams, $location, $state, Events, Activists) {

        $scope.isNew = $state.is('events-create');

//        $scope.activist = null;
//        Activists.query({userId: $scope.global.user._id}, function (response) {
//            $scope.activist = response[0];
//        });

        $scope.init = function () {
            if (!$scope.isNew) {
                $scope.findOne();
            }
        };

        $scope.find = function () {
            Events.query(function (events) {
                $scope.events = events;
            });
        };

        $scope.findOne = function () {
            Events.get({
                eventId: $stateParams.eventId
            }, function (event) {
                $scope.event = event;
            });
        };

        $scope.create = function () {
            var events = new Events({
                description: this.description,
                title: this.title,
                organization: this.organization,
                datetime: this.date + ' ' + this.time,
                status: this.status,
                sites: this.sites,
                min_part: this.min_part,
                max_part: this.max_part,
                gps: this.gps
            });
            events.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $location.path('events/' + response._id);
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
            event.$update(function() {
                $location.path('events/' + event._id);
            });
        };

        $scope.remove = function (event) {
            if (event) {
                event.$remove();
                for (var i in $scope.events) {
                    if ($scope.events[i] === event) {
                        $scope.events.splice(i, 1);
                    }
                }
            } else {
                $scope.event.$remove(function (response) {
                    $location.path('events');
                });
            }
        };

    }
]);
