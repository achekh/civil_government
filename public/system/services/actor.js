'use strict';

angular.module('mean.system')
    .service('Actor', ['$rootScope', '$stateParams', '$q', 'Activists', 'Events', 'Participants', 'Organizations', 'Members',
        function ($rootScope, $stateParams, $q, Activists, Events, Participants, Organizations, Members) {

            this.isParticipant = function () {

                var deferred = $q.defer();

                if ($stateParams.eventId) {
                    Activists.query({
                        userId: $rootScope.global.user._id
                    }, function (activists) {
                        if (activists.length === 1) {
                            Participants.query({
                                activistId: activists[0]._id,
                                eventId: $stateParams.eventId
                            }, function (participants) {
                                deferred.resolve(participants.length === 1);
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }

                return deferred.promise;

            };

            this.isCoordinator = function () {

                var deferred = $q.defer();

                if ($stateParams.eventId) {
                    Activists.query({
                        userId: $rootScope.global.user._id
                    }, function (activists) {
                        if (activists.length === 1) {
                            Participants.query({
                                activistId: activists[0]._id,
                                eventId: $stateParams.eventId
                            }, function (participants) {
                                if (participants.length === 1) {
                                    deferred.resolve(participants[0].coordinator);
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }

                return deferred.promise;

            };

            this.canParticipate = function () {

                var deferred = $q.defer();

                if ($stateParams.eventId) {
                    Activists.query({
                        userId: $rootScope.global.user._id
                    }, function (activists) {
                        if (activists.length === 1) {
                            Events.query({
                                eventId: $stateParams.eventId
                            }, function (events) {
                                if (events.length === 1) {
                                    Members.query({
                                        activistId: activists[0]._id,
                                        organizationId: events[0].organization._id
                                    }, function (members) {
                                        deferred.resolve(members.length === 1);
                                    });
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }

                return deferred.promise;

            };

            this.isHead = function () {

                var deferred = $q.defer();

                if ($stateParams.eventId) {
                    Activists.query({
                        userId: $rootScope.global.user._id
                    }, function (activists) {
                        if (activists.length === 1) {
                            Events.query({
                                eventId: $stateParams.eventId
                            }, function (events) {
                                if (events.length === 1) {
                                    Members.query({
                                        activistId: activists[0]._id,
                                        organizationId: events[0].organization._id
                                    }, function (members) {
                                        if (members.length === 1) {
                                            deferred.resolve(members[0].isLeader);
                                        } else {
                                            deferred.resolve(false);
                                        }
                                    });
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }

                return deferred.promise;

    };

        }
    ])
;
