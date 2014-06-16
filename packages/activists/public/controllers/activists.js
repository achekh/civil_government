'use strict';

var app = angular.module('mean.activists', ['ui.bootstrap']);

app.controller('ActivistsController', ['$scope', '$modal', '$rootScope', '$state', '$stateParams', 'Activists', 'Events', 'Participants',
    function ($scope, $modal, $rootScope, $state, $stateParams, Activists, Events, Participants) {

        var handleGetActivistSuccess = function (activist) {
            $scope.activist = activist;
            $scope.canEdit = $scope.hasAuthorization(activist);
            $scope.isOwner = $scope.isOwner(activist);
            $scope.findOwnedEvents();
            $scope.findParticipatedEvents();
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

        $scope.findLeaders = function() {
            Activists.query({sortBy: '-eventsTotal', limitTo: 3}, function(leaders) {
                $scope.leaders = leaders;
            });
        };

        $scope.getLeaderInSystemDurationSeconds = function(leader) {
            return (new Date().getTime() - new Date(leader.created).getTime()) / 1000;
        };

        $scope.nowDate = new Date();

    }
]);

app.controller('ActivistsEditController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Activists',
    function ($scope, $rootScope, $state, $stateParams, $location, Activists) {

        $scope.isNew = $state.is('activists-create');

        $scope.init = function () {
            Activists.save({}, function(activist) {
                $scope.activist = activist;
            });
        };

        $scope.update = function () {
            var activist = $scope.activist;
            if (!activist.updated) {
                activist.updated = [];
            }
            activist.updated.push(new Date().getTime());
            activist.$update(function (response) {
                $rootScope.$emit('activist-updated', response);
                $state.go('activists-view');
            });
        };

        $scope.cancel = function () {
            $state.go('activists-view');
        };

    }
]);
