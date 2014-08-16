'use strict';

(function() {
    // Login Controller Spec
    describe('MEAN controllers', function() {
        describe('LoginCtrl', function() {
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.auth');
                module('mean.activists');
            });

            var LoginCtrl,
                scope,
                $rootScope,
                $httpBackend,
                $location;

            beforeEach(inject(function($controller, _$rootScope_, _$location_, _$httpBackend_) {

                scope = _$rootScope_.$new();
                $rootScope = _$rootScope_;

                LoginCtrl = $controller('LoginCtrl', {
                    $scope: scope,
                    $rootScope: _$rootScope_
                });

                $httpBackend = _$httpBackend_;

                $location = _$location_;

                $httpBackend.when('GET','public/system/views/index.html').respond(200, '');

            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should login with a correct user and password', function() {

                spyOn($rootScope, '$emit');

                // test expected GET request
                $httpBackend.when('POST','/login').respond(200, {user: 'Fred'});
                $httpBackend.when('GET','activists/views/view.html').respond(200, '');

                scope.doLogin();
                $httpBackend.flush();

                // test scope value
                expect($rootScope.user).toEqual('Fred');
                expect($rootScope.$emit).toHaveBeenCalledWith('loggedin');

            });

            it('should fail to log in ', function() {
                $httpBackend.expectPOST('/login').respond(400, 'Authentication failed');
                scope.doLogin();
                $httpBackend.flush();
                // test scope value
                expect(scope.loginerror).toNotEqual(undefined);
            });
        });

        describe('RegisterCtrl', function() {
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.auth');
                module('mean.activists');
            });

            var RegisterCtrl,
                scope,
                $rootScope,
                $httpBackend,
                $location;

            beforeEach(inject(function($controller, _$rootScope_, _$location_, _$httpBackend_) {

                scope = _$rootScope_.$new();
                $rootScope = _$rootScope_;

                RegisterCtrl = $controller('RegisterCtrl', {
                    $scope: scope,
                    $rootScope: _$rootScope_
                });

                $httpBackend = _$httpBackend_;

                $location = _$location_;

                $httpBackend.when('GET','public/system/views/index.html').respond(200, '');

            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should register with correct data', function() {

                spyOn($rootScope, '$emit');

                // test expected GET request
                scope.user.name = 'Fred';
                $httpBackend.when('POST','/register').respond(200, 'Fred');
                $httpBackend.when('GET','/loggedin').respond(200, {name: 'Fred'});
                $httpBackend.when('GET','activists/views/view.html').respond(200, '');

                scope.register();
                $httpBackend.flush();

                // test scope value
                expect($rootScope.user.name).toBe('Fred');
                expect(scope.registerError).toEqual(0);
                expect($rootScope.$emit).toHaveBeenCalledWith('loggedin');
                expect($location.url()).toBe('/activists/view');

            });

            it('should fail to register with duplicate Username', function() {
                $httpBackend.when('POST','/register').respond(400, 'Username already taken');
                scope.register();
                $httpBackend.flush();
                // test scope value
                expect(scope.usernameError).toBe('Username already taken');
                expect(scope.registerError).toBe(null);
            });

            it('should fail to register with non-matching passwords', function() {
                $httpBackend.when('POST','/register').respond(400, 'Password mismatch');
                scope.register();
                $httpBackend.flush();
                // test scope value
                expect(scope.usernameError).toBe(null);
                expect(scope.registerError).toBe('Password mismatch');
            });
        });
    });


}());
