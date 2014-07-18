'use strict';

angular.module('mean.system')
    .service('Actor', ['$rootScope', '$stateParams', '$q', 'Activists', 'Events', 'Participants', 'Organizations', 'Members',
        function ($rootScope, $stateParams, $q, Activists, Events, Participants, Organizations, Members) {

            var cache = {};

            this.clearCache = function () {
                cache = {};
            };

            function getActivist () {

                if (!cache.getActivist) {

                    var deferred = $q.defer();

                    Activists.query({
                        userId: $rootScope.global.user._id
                    }, function (activists) {
                        if (activists.length === 1) {
                            deferred.resolve(activists[0]);
                        } else {
                            deferred.resolve(null);
                        }
                    });

                    cache.getActivist = deferred.promise;

                }

                return cache.getActivist;

            }

            function getEvent () {

                if (!cache.getEvent) {

                    var deferred = $q.defer();

                    if ($stateParams.eventId) {
                        Events.get({
                            eventId: $stateParams.eventId
                        }, function (event) {
                            if (event) {
                                deferred.resolve(event);
                            } else {
                                deferred.resolve(null);
                            }
                        });
                    } else {
                        deferred.resolve(null);
                    }

                    cache.getEvent = deferred.promise;

                }

                return cache.getEvent;

            }

            function getParticipant () {

                if (!cache.getParticipant) {

                    var deferred = $q.defer();

                    if ($stateParams.eventId) {
                        $q.all({
                            activist: getActivist(),
                            event: getEvent()
                        }).then(function (result) {
                            if (result && result.activist && result.event) {
                                Participants.query({
                                    activistId: result.activist._id,
                                    eventId: result.event._id
                                }, function (participants) {
                                    if (participants.length === 1) {
                                        deferred.resolve(participants[0]);
                                    } else {
                                        deferred.resolve(null);
                                    }
                                });
                            } else {
                                deferred.resolve(null);
                            }
                        });
                    } else {
                        deferred.resolve(null);
                    }

                    cache.getParticipant = deferred.promise;

                }

                return cache.getParticipant;

            }

            function getOrganization () {

                if (!cache.getOrganization) {

                    var deferred = $q.defer();

                    if ($stateParams.eventId) {
                        getEvent().then(function (event) {
                            if (event) {
                                Organizations.get({
                                    organizationId: event.organization._id
                                }, function (organization) {
                                    if (organization) {
                                        deferred.resolve(organization);
                                    } else {
                                        deferred.resolve(null);
                                    }
                                });
                            } else {
                                deferred.resolve(null);
                            }
                        });
                    } else {
                        deferred.resolve(null);
                    }

                    cache.getOrganization = deferred.promise;

                }

                return cache.getOrganization;

            }

            function getMember () {

                if (!cache.getMember) {

                    var deferred = $q.defer();

                    if ($stateParams.eventId) {
                        $q.all({
                            activist: getActivist(),
                            organization: getOrganization()
                        }).then(function (result) {
                            if (result && result.activist && result.organization) {
                                Members.query({
                                    activistId: result.activist._id,
                                    organizationId: result.organization._id
                                }, function (members) {
                                    if (members.length === 1) {
                                        deferred.resolve(members[0]);
                                    } else {
                                        deferred.resolve(null);
                                    }
                                });
                            } else {
                                deferred.resolve(null);
                            }
                        });
                    } else {
                        deferred.resolve(null);
                    }

                    cache.getMember = deferred.promise;

                }

                return cache.getMember;

            }

            this.getActivist = getActivist;
            this.getEvent = getEvent;
            this.getParticipant = getParticipant;
            this.getOrganization = getOrganization;
            this.getMember = getMember;

            this.isParticipant = function () {

                var deferred = $q.defer();

                getParticipant().then(function (participant) {
                    if (participant) {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;

            };

            this.isCoordinator = function () {

                var deferred = $q.defer();

                getParticipant().then(function (participant) {
                    if (participant) {
                        deferred.resolve(participant.coordinator);
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;

            };

            this.isMember = function () {

                var deferred = $q.defer();

                getMember().then(function (member) {
                    if (member) {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;

            };

            this.isHead = function () {

                var deferred = $q.defer();

                getMember().then(function (member) {
                    if (member) {
                        deferred.resolve(member.isLeader);
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;

            };

            this.canParticipate = function () {

                var deferred = $q.defer();

                getEvent().then(function (event) {
                    if (event) {
                        getMember().then(function (member) {
                            var first = (event && event.organization) ? ((typeof event.organization === 'object') ? event.organization._id : event.organization) : undefined;
                            var second = (member && member.organization) ? ((typeof member.organization === 'object') ? member.organization._id : member.organization) : undefined;
                            if (first !== undefined && second !== undefined && first === second) {
                                deferred.resolve(true);
                            } else {
                                deferred.resolve(false);
                            }
                        });
                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;

            };

            this.getActor = function () {

                this.clearCache();

                var deferred = $q.defer();

                $q.all({
                    activist: this.getActivist(),
                    event: this.getEvent(),
                    participant: this.getParticipant(),
                    organization: this.getOrganization(),
                    member: this.getMember(),
                    isParticipant: this.isParticipant(),
                    isCoordinator: this.isCoordinator(),
                    isMember: this.isMember(),
                    isHead: this.isHead(),
                    canParticipate: this.canParticipate()
                }).then(function (actor) {
                    deferred.resolve(actor);
                });

                return deferred.promise;

            };

        }
    ])
;
