'use strict';

(function() {
    describe('MEAN services', function () {
        describe('EventActions', function () {

            beforeEach(function () {
                this.addMatchers({
                    toEqualData: function (expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.system');
                module('mean.events');
            });

            var scope,
                $rootScope,
                $stateParams,
                $httpBackend,
                EventActions,
                EventStatuses;

            beforeEach(inject(function (_$rootScope_, _$stateParams_, _$httpBackend_, _EventActions_, _EventStatuses_) {

                $rootScope = _$rootScope_;
                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;
                EventActions = _EventActions_;
                EventStatuses = _EventStatuses_;

                scope = $rootScope.$new();

                $httpBackend.when('GET', 'public/system/views/index.html').respond(200, '');

            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should be defined', function () {
                $httpBackend.flush();
                expect(EventActions).toBeDefined();
            });

            it('should get event by state event id', function () {
                var resultResolved = null;
                var event = {
                    _id: 'event1'
                };
                $httpBackend.when('GET','events/' + event._id).respond(200, event);
                $stateParams.eventId = event._id;
                EventActions.getEvent().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(event);
            });

            function resolveEventActions (event) {

                var resolved = {};

                $httpBackend.when('GET','events/' + event._id).respond(200, event);

                $stateParams.eventId = event._id;

                EventActions.canBeApproved().then(function (result) {
                    resolved.canBeApproved = result;
                });
                EventActions.canBeCanceled().then(function (result) {
                    resolved.canBeCanceled = result;
                });
                EventActions.canBeStarted().then(function (result) {
                    resolved.canBeStarted = result;
                });
                EventActions.canBeFinished().then(function (result) {
                    resolved.canBeFinished = result;
                });

                $httpBackend.flush();

                return resolved;

            }

            it('should get expected possibilities for event state FOR_APPROVAL', function () {
                var event = {_id:'event1',status:'FOR_APPROVAL'};
                var possibilities = {canBeApproved:true,canBeCanceled:true,canBeStarted:false,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state APPROVED', function () {
                var event = {_id:'event1',status:'APPROVED'};
                var possibilities = {canBeApproved:false,canBeCanceled:true,canBeStarted:true,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state AGREED', function () {
                var event = {_id:'event1',status:'AGREED'};
                var possibilities = {canBeApproved:false,canBeCanceled:true,canBeStarted:true,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state STARTED', function () {
                var event = {_id:'event1',status:'STARTED'};
                var possibilities = {canBeApproved:false,canBeCanceled:true,canBeStarted:false,canBeFinished:true};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state FINISHED', function () {
                var event = {_id:'event1',status:'FINISHED'};
                var possibilities = {canBeApproved:false,canBeCanceled:false,canBeStarted:false,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state CANCELED', function () {
                var event = {_id:'event1',status:'CANCELED'};
                var possibilities = {canBeApproved:false,canBeCanceled:false,canBeStarted:false,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state DEFEATED', function () {
                var event = {_id:'event1',status:'DEFEATED'};
                var possibilities = {canBeApproved:false,canBeCanceled:false,canBeStarted:false,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

            it('should get expected possibilities for event state WON', function () {
                var event = {_id:'event1',status:'WON'};
                var possibilities = {canBeApproved:false,canBeCanceled:false,canBeStarted:false,canBeFinished:false};
                expect(resolveEventActions(event)).toEqualData(possibilities);
            });

        });
    });
})();
