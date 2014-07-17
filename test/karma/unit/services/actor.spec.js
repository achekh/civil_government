'use strict';

(function() {
    // Actor Service Spec
    describe('MEAN services', function () {
        describe('Actor', function () {

            beforeEach(function () {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.system');
                module('mean.activists');
                module('mean.events');
                module('mean.participants');
                module('mean.organizations');
            });

            var Actor,
                scope,
                $rootScope,
                $stateParams,
                $httpBackend;

            // user
            var user = {_id: 'userId'};
            var activist = {_id: 'activistId', user: user};
            var organization = {_id: 'organizationId', user: user};
            var member = {_id: 'memberId', user: user, activist: activist, organization: organization};
            var event = {_id: 'eventId', user: user, organization: organization};
            var participant = {_id: 'participantId', activist: activist, event: event};

            // organization head
            var headUser = {_id: 'headUserId'};
            var headActivist = {_id: 'headActivistId', user: headUser};
            var headOrganization = {_id: 'headOrganizationId', user: headUser};
            var headMember = {_id: 'headMemberId', user: headUser, activist: headActivist, organization: headOrganization, isLeader: true};
            var headEvent = {_id: 'headEventId', user: headUser, organization: headOrganization};
            var headParticipant = {_id: 'headParticipantId', activist: headActivist, event: headEvent, coordinator: true};

            // organization member
            var memberUser = {_id: 'memberUserId'};
            var memberActivist = {_id: 'memberActivistId', user: memberUser};
            var memberMember = {_id: 'memberMemberId', user: memberUser, activist: memberActivist, organization: headOrganization, isLeader: false};

            // organization event participant
            var participantUser = {_id: 'participantUserId'};
            var participantActivist = {_id: 'participantActivistId', user: participantUser};
            var participantMember = {_id: 'participantMemberId', user: participantUser, activist: participantActivist, organization: headOrganization, isLeader: false};
            var participantParticipant = {_id: 'participantParticipantId', activist: participantActivist, event: headEvent, coordinator: false};

            // organization event participant coordinator
            var coordinatorUser = {_id: 'coordinatorUserId'};
            var coordinatorActivist = {_id: 'coordinatorActivistId', user: coordinatorUser};
            var coordinatorMember = {_id: 'coordinatorMemberId', user: coordinatorUser, activist: coordinatorActivist, organization: headOrganization, isLeader: false};
            var coordinatorParticipant = {_id: 'coordinatorParticipantId', activist: coordinatorActivist, event: headEvent, coordinator: true};

            beforeEach(inject(function (_Actor_, _$rootScope_, _$stateParams_, _$httpBackend_) {

                Actor = _Actor_;
                $rootScope = _$rootScope_;
                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;

                scope = $rootScope.$new();

                $httpBackend.when('GET','public/system/views/index.html').respond(200, '');

                // user requests
                $httpBackend.when('GET','activists?userId=' + user._id).respond(200, [activist]);
                $httpBackend.when('GET','events/' + event._id).respond(200, event);
                $httpBackend.when('GET','participants?activistId=' + activist._id + '&eventId=' + event._id).respond(200, [participant]);
                $httpBackend.when('GET','organizations/' + organization._id).respond(200, organization);
                $httpBackend.when('GET','members?activistId=' + activist._id + '&organizationId=' + organization._id).respond(200, [member]);

                // organization head requests
                $httpBackend.when('GET','activists?userId=' + headUser._id).respond(200, [headActivist]);
                $httpBackend.when('GET','events/' + headEvent._id).respond(200, headEvent);
                $httpBackend.when('GET','participants?activistId=' + headActivist._id + '&eventId=' + headEvent._id).respond(200, [headParticipant]);
                $httpBackend.when('GET','organizations/' + headOrganization._id).respond(200, headOrganization);
                $httpBackend.when('GET','members?activistId=' + headActivist._id + '&organizationId=' + headOrganization._id).respond(200, [headMember]);

                // organization member requests
                $httpBackend.when('GET','activists?userId=' + memberUser._id).respond(200, [memberActivist]);
                $httpBackend.when('GET','participants?activistId=' + memberActivist._id + '&eventId=' + headEvent._id).respond(200, []);
                $httpBackend.when('GET','members?activistId=' + memberActivist._id + '&organizationId=' + headOrganization._id).respond(200, [memberMember]);

                // organization non member requests
//                $httpBackend.when('GET','activists?userId=' + user._id).respond(200, [activist]);
                $httpBackend.when('GET','participants?activistId=' + activist._id + '&eventId=' + headEvent._id).respond(200, []);
                $httpBackend.when('GET','members?activistId=' + activist._id + '&organizationId=' + headOrganization._id).respond(200, []);

                // organization event participant requests
                $httpBackend.when('GET','activists?userId=' + participantUser._id).respond(200, [participantActivist]);
                $httpBackend.when('GET','participants?activistId=' + participantActivist._id + '&eventId=' + headEvent._id).respond(200, [participantParticipant]);
                $httpBackend.when('GET','members?activistId=' + participantActivist._id + '&organizationId=' + headOrganization._id).respond(200, [participantMember]);

                // organization event participant coordinator requests
                $httpBackend.when('GET','activists?userId=' + coordinatorUser._id).respond(200, [coordinatorActivist]);
                $httpBackend.when('GET','participants?activistId=' + coordinatorActivist._id + '&eventId=' + headEvent._id).respond(200, [coordinatorParticipant]);
                $httpBackend.when('GET','members?activistId=' + coordinatorActivist._id + '&organizationId=' + headOrganization._id).respond(200, [coordinatorMember]);

            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should be defined', function () {
                $httpBackend.flush();
                expect(Actor).toBeDefined();
            });

            it('should get activist by global user id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                Actor.getActivist().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(activist);
            });

            it('should get event by state event id', function () {
                var resultResolved;
                $stateParams.eventId = event._id;
                Actor.getEvent().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(event);
            });

            it('should get participant by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                $stateParams.eventId = event._id;
                Actor.getParticipant().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(participant);
            });

            it('should get organization by state event id', function () {
                var resultResolved;
                $stateParams.eventId = event._id;
                Actor.getOrganization().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(organization);
            });

            it('should get member by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                $stateParams.eventId = event._id;
                Actor.getMember().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved).toEqualData(member);
            });

            it('should get actor by global user id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(activist);
                expect(resultResolved.event).toBeNull();
                expect(resultResolved.participant).toBeNull();
                expect(resultResolved.organization).toBeNull();
                expect(resultResolved.member).toBeNull();
            });

            it('should get actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                $stateParams.eventId = event._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(activist);
                expect(resultResolved.event).toEqualData(event);
                expect(resultResolved.participant).toEqualData(participant);
                expect(resultResolved.organization).toEqualData(organization);
                expect(resultResolved.member).toEqualData(member);
            });

            it('should get organization head actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: headUser};
                $stateParams.eventId = headEvent._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(headActivist);
                expect(resultResolved.event).toEqualData(headEvent);
                expect(resultResolved.participant).toEqualData(headParticipant);
                expect(resultResolved.organization).toEqualData(headOrganization);
                expect(resultResolved.isParticipant).toEqual(true);
                expect(resultResolved.isCoordinator).toEqual(true);
                expect(resultResolved.isMember).toEqual(true);
                expect(resultResolved.isHead).toEqual(true);
                expect(resultResolved.canParticipate).toEqual(true);
            });

            it('should get organization member actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: memberUser};
                $stateParams.eventId = headEvent._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(memberActivist);
                expect(resultResolved.event).toEqualData(headEvent);
                expect(resultResolved.participant).toEqual(null);
                expect(resultResolved.organization).toEqualData(headOrganization);
                expect(resultResolved.isParticipant).toEqual(false);
                expect(resultResolved.isCoordinator).toEqual(false);
                expect(resultResolved.isMember).toEqual(true);
                expect(resultResolved.isHead).toEqual(false);
                expect(resultResolved.canParticipate).toEqual(true);
            });

            it('should get non organization member actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: user};
                $stateParams.eventId = headEvent._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(activist);
                expect(resultResolved.event).toEqualData(headEvent);
                expect(resultResolved.participant).toEqual(null);
                expect(resultResolved.organization).toEqualData(headOrganization);
                expect(resultResolved.isParticipant).toEqual(false);
                expect(resultResolved.isCoordinator).toEqual(false);
                expect(resultResolved.isMember).toEqual(false);
                expect(resultResolved.isHead).toEqual(false);
                expect(resultResolved.canParticipate).toEqual(false);
            });

            it('should get organization event participant actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: participantUser};
                $stateParams.eventId = headEvent._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(participantActivist);
                expect(resultResolved.event).toEqualData(headEvent);
                expect(resultResolved.participant).toEqualData(participantParticipant);
                expect(resultResolved.organization).toEqualData(headOrganization);
                expect(resultResolved.isParticipant).toEqual(true);
                expect(resultResolved.isCoordinator).toEqual(false);
                expect(resultResolved.isMember).toEqual(true);
                expect(resultResolved.isHead).toEqual(false);
                expect(resultResolved.canParticipate).toEqual(true);
            });

            it('should get organization event participant coordinator actor by global user id and state event id', function () {
                var resultResolved;
                $rootScope.global = {user: coordinatorUser};
                $stateParams.eventId = headEvent._id;
                Actor.getActor().then(function (result) {
                    resultResolved = result;
                });
                $httpBackend.flush();
                expect(resultResolved.activist).toEqualData(coordinatorActivist);
                expect(resultResolved.event).toEqualData(headEvent);
                expect(resultResolved.participant).toEqualData(coordinatorParticipant);
                expect(resultResolved.organization).toEqualData(headOrganization);
                expect(resultResolved.isParticipant).toEqual(true);
                expect(resultResolved.isCoordinator).toEqual(true);
                expect(resultResolved.isMember).toEqual(true);
                expect(resultResolved.isHead).toEqual(false);
                expect(resultResolved.canParticipate).toEqual(true);
            });

        });
    });
}());
