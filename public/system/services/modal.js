'use strict';

angular.module('mean.system')
    .factory('Modal', ['$rootScope', '$modal',
        function ($rootScope, $modal) {
            return {
                notify: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/notify.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close({result: 'ok'});
                            };
                            $scope.message = options.message;
                        }
                    });
                },
                confirm: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/confirm.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close({result: 'ok'});
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss({result: 'cancel'});
                            };
                            $scope.question = options.question;
                        }
                    });
                },
                prompt: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/prompt.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close({result: 'ok', reason: $scope.reason});
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss({result: 'cancel'});
                            };
                            $scope.question = options.question;
                            $scope.reason = '';
                        }
                    });
                },
                login: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/login.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.cancel = function () {
                                $modalInstance.dismiss({result: 'cancel'});
                            };
                            $rootScope.$on('loggedin', function () {
                                $modalInstance.close({result: 'loggedin'});
                            });
                        }
                    });
                }
            };
        }
    ])
;