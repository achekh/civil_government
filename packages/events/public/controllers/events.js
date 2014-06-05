'use strict';

angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Global', 'Events',
    function ($scope, $stateParams, $location, Global, Events) {

        $scope.global = Global;
        $scope.find = function () {
            Events.query(function (events) {
                $scope.events = events;
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
            events.$save(function (resp) {
                if (resp.errors) {
                    $('#errors').show();
                    $('#errors ul').empty();
                    $.each(resp.errors, function (key, val) {
                        $('#errors ul').append('<li>' + val.message + '</val>');
                    });
                } else {
                    $location.path('events');
                }
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
        $scope.show = function () {
            console.log('we here;');
        };
    }
]);
