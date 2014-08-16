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
                            $scope.title = options.title || 'Повідомлення';
                            $scope.okButtonLabel = options.okButtonLabel || 'Так';
                        }
                    });
                },
                confirm: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/confirm.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.yes = function () {
                                $modalInstance.close({result: 'yes'});
                            };
                            $scope.no = function () {
                                $modalInstance.close({result: 'no'});
                            };
                            $scope.message = options.message;
                            $scope.title = options.title || 'Підтвердження';
                            $scope.yesButtonLabel = options.yesButtonLabel || 'Так';
                            $scope.noButtonLabel = options.noButtonLabel || 'Ні';
                        }
                    });
                },
                prompt: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/prompt.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close({result: 'ok', input: $scope.data.inputText});
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss({result: 'cancel'});
                            };
                            $scope.message = options.message || '';
                            $scope.title = options.title || 'Запит';
                            $scope.inputTextPlaceholder = options.inputTextPlaceholder || 'Вкажіть причину';
                            $scope.okButtonLabel = options.okButtonLabel || 'Так';
                            $scope.cancelButtonLabel = options.cancelButtonLabel || 'Відмінити';
                            $scope.data = {};
                            $scope.data.inputText = '';

                        }
                    });
                },
                login: function (options) {
                    return $modal.open({
                        templateUrl: 'public/system/views/modal/login.html',
                        backdrop: 'static',
                        controller: function ($scope, $modalInstance) {
                            $rootScope.$on('loggedin', function () {
                                $modalInstance.close({result: 'loggedin'});
                            });
                            $scope.cancel = function () {
                                $modalInstance.dismiss({result: 'cancel'});
                            };
                            $scope.title = options.title || 'Вхід';
                            $scope.cancelButtonLabel = options.cancelButtonLabel || 'Відмінити';
                        }
                    });
                },
                custom: function (options) {
                    return $modal.open(options);
                }
            };
        }
    ])
;