'use strict';

angular.module('mean.system')
    .factory('Modal', ['$rootScope', '$modal',
        function ($rootScope, $modal) {
            return {
                notify: function (message) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/notify.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close('ok');
                            };
                            $scope.message = message;
                        }
                    });
                },
                confirm: function (message) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/confirm.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close('ok');
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.message = message;
                        }
                    });
                },
                login: function () {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/login.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $rootScope.$on('loggedin', function () {
                                $modalInstance.close('loggedin');
                            });
                        }
                    });
                }
            };
        }
    ])
;