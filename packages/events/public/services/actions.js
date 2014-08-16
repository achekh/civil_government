'use strict';

angular.module('mean.events')
    .service('EventActions', ['$stateParams', '$q', 'Events', 'EventStatuses',
        function ($stateParams, $q, Events, EventStatuses) {

            var cache = {};

            this.clearCache = function () {
                cache = {};
            };

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

            function canBeApproved () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && event.status === EventStatuses.FOR_APPROVAL);
                });
                return deferred.promise;
            }

            function canBeCanceled () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && (
                        event.status === EventStatuses.FOR_APPROVAL ||
                        event.status === EventStatuses.APPROVED ||
                        event.status === EventStatuses.AGREED ||
                        event.status === EventStatuses.STARTED
                    ));
                });
                return deferred.promise;
            }

            function canBeStarted () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && (
                        event.status === EventStatuses.APPROVED ||
                        event.status === EventStatuses.AGREED
                    ));
                });
                return deferred.promise;
            }

            function canBeFinished () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && event.status === EventStatuses.STARTED);
                });
                return deferred.promise;
            }

            function canBeDefeated () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && event.status === EventStatuses.FINISHED);
                });
                return deferred.promise;
            }

            function canBeWon () {
                var deferred = $q.defer();
                getEvent().then(function (event) {
                    deferred.resolve(event && event.status === EventStatuses.FINISHED);
                });
                return deferred.promise;
            }

            this.getEvent = getEvent;
            this.canBeApproved = canBeApproved;
            this.canBeCanceled = canBeCanceled;
            this.canBeStarted = canBeStarted;
            this.canBeFinished = canBeFinished;
            this.canBeDefeated = canBeDefeated;
            this.canBeWon = canBeWon;

            function checkAndUpdateEvent(check, properties) {
                var deferred = $q.defer();
                check().then(function (can) {
                    if (can) {
                        getEvent().then(function (event) {
                            ('status' in properties) ? event.status = properties.status : undefined;
//                            ('result' in properties) ? event.result = properties.result : undefined;
                            event.$update(function (response) {
                                deferred.resolve(response);
                            });
                        });
                    } else {
                        deferred.resolve(false);
                    }
                });
                return deferred.promise;
            }

            function approve () {
                return checkAndUpdateEvent(canBeApproved, {status: EventStatuses.APPROVED});
            }

            function cancel () {
                return checkAndUpdateEvent(canBeCanceled, {status: EventStatuses.CANCELED});
            }

            function start () {
                return checkAndUpdateEvent(canBeStarted, {status: EventStatuses.STARTED});
            }

            function finish () {
                return checkAndUpdateEvent(canBeFinished, {status: EventStatuses.FINISHED});
            }

            function defeat (result) {
                return checkAndUpdateEvent(canBeDefeated, {status: EventStatuses.DEFEATED, result: result});
            }

            function win (result) {
                return checkAndUpdateEvent(canBeWon, {status: EventStatuses.WON, result: result});
            }

            this.approve = approve;
            this.cancel = cancel;
            this.start = start;
            this.finish = finish;
            this.defeat = defeat;
            this.win = win;

            this.getActions = function () {

                this.clearCache();

                var deferred = $q.defer();

                $q.all({
                    event: this.getEvent(),
                    canBeApproved: this.canBeApproved(),
                    canBeCanceled: this.canBeCanceled(),
                    canBeStarted: this.canBeStarted(),
                    canBeFinished: this.canBeFinished(),
                    canBeDefeated: this.canBeDefeated(),
                    canBeWon: this.canBeWon()
                }).then(function (actions) {
                    actions.approve = approve;
                    actions.cancel = cancel;
                    actions.start = start;
                    actions.finish = finish;
                    actions.defeat = defeat;
                    actions.win = win;
                    deferred.resolve(actions);
                });

                return deferred.promise;

            };

        }
    ])
;
