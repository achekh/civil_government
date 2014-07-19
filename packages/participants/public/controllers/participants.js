'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Participants', 'ParticipantStatuses', 'Actor', 'Modal',
    function($scope, $rootScope, $state, $stateParams, Participants, ParticipantStatuses, Actor, Modal) {

        $scope.package = {
            name: 'participants'
        };

        function toBoolean(value) {
            var result;
            if (typeof(value) === 'boolean') {
                result = value;
            } else if (typeof(value) === 'string') {
                if (value.toLowerCase() === 'true') {
                    result = true;
                } else if (value.toLowerCase() === 'false') {
                    result = false;
                }
            }
            return result;
        }

        $scope.eventId = $stateParams.eventId;
        $scope.activistId = $stateParams.activistId;
        $scope.coordinator = toBoolean($stateParams.coordinator);
        $scope.appeared = toBoolean($stateParams.appeared);
        $scope.confirmed = toBoolean($stateParams.confirmed);

        $scope.participantStatuses = ParticipantStatuses;
        $scope.participantStatus = $scope.participantStatuses.getStatus($scope.appeared, $scope.confirmed);

        $scope.setParticipantStatus = function (status) {
            $scope.participantStatus = status;
            $scope.appeared = status.appeared;
            $scope.confirmed = status.confirmed;
            $scope.find();
        };

        // get current actor
        function getActor () {
            return Actor.getActor().then(function (actor) {
                $scope.actor = actor;
            });
        }

        $scope.actor = {};
        getActor();

        // get participants

        $scope.participants = [];

        $scope.find = function () {
            Participants.query({
                activistId: $stateParams.activistId,
                eventId: $stateParams.eventId,
                coordinator: $scope.coordinator,
                appeared: $scope.appeared,
                confirmed: $scope.confirmed
            }, function (participants) {
                $scope.participants = participants;
            });
        };

        // get participant

        $scope.participant = null;

        $scope.findOne = function () {
            Participants.get({
                participantId: $stateParams.participantId
            }, function (participant) {
                $scope.participant = participant;
            });
        };

        $scope.findAuthenticated = function () {
            if ($scope.isAuthenticated()) {
                Participants.query({
                    activistId: $scope.global.activist._id,
                    eventId: $stateParams.eventId
                }, function (participants) {
                    if (!participants.errors) {
                        if (participants.length === 1) {
                            $scope.participant = participants[0];
                        }
                    }
                });
            }
        };

        $scope.join = function () {
            if ($scope.actor && $scope.actor.activist) {
                if ($scope.actor.member) {
                    Modal.confirm({question: 'Ви підете на цю подію?'}).result.then(
                        function () {
                            var participant = new Participants({
                                activist: $scope.actor.activist._id,
                                event: $stateParams.eventId
                            });
                            participant.$save(function () {
                                $rootScope.$broadcast('participants-update');
                                getActor();
                            });
                        }
                    );
                } else if (!$scope.actor.member && $scope.actor.organization) {
                    Modal.confirm({question: 'Вам потрібно вступити в організацію яка проводить подію. Перейти до сторінки організації?'}).result.then(
                        function () {
                            var id = typeof $scope.actor.organization === 'object' ? $scope.actor.organization._id : $scope.actor.organization;
                            $state.go('organizations-view', {organizationId: id});
                        }
                    );
                } else {
                    Modal.notify('Неможливо приєднатися.')
                }
            } else {
                openLoginModalDialog($scope.join);
            }
        };

        $scope.leave = function () {
            if ($scope.actor && $scope.actor.participant) {
                Modal.prompt({question: 'Ви відмовляєтесь від участі в цій події?'}).result.then(
                    function () {
                        $scope.actor.participant.$remove(function() {
                            $rootScope.$broadcast('participants-update');
                            getActor();
                        });
                    }
                );
            } else {
                openLoginModalDialog();
            }
        };

        $scope.appear = function () {
            if ($scope.actor && $scope.actor.participant) {
                Modal.confirm({question: 'Ви вже на цій події?'}).result.then(
                    function () {
                        $scope.actor.participant.appeared = true;
                        $scope.actor.participant.$update(function () {
                            $rootScope.$broadcast('participants-update');
                            getActor();
                        });
                    }
                );
            } else {
                openLoginModalDialog();
            }
        };

        function openLoginModalDialog (callback) {
            Modal.login().result.then(
                function () {
                    getActor().then(callback);
                }
            );
        }

        $scope.load = function (parameters) {
            if (parameters.coordinator === true || parameters.coordinator === false) {
                $scope.coordinator = parameters.coordinator;
            }
            if (parameters.appeared) {
                $scope.appeared = parameters.appeared;
            }
            if (parameters.confirmed) {
                $scope.confirmed = parameters.confirmed;
            }
            $scope.find();
        };

        $scope.$on('participants-update', function () {
            $scope.find();
        });

    }
]);
