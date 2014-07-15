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
                region: $scope.region.value === '0.Вся Україна' ? undefined : $scope.region._id
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
    .controller('ActivistsEditController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Activists',
    function ($scope, $rootScope, $state, $stateParams, $location, Activists) {

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

    }
]);
