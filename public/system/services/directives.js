'use strict';

angular.module('mean.system')
    .directive('cgDropdownAutoclose', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attributes) {
                element.on('click', function (event) {
                    if (event.srcElement && event.srcElement.nodeName === 'A') {
                        element.find('button').eq(0).triggerHandler('click');
                    }
                });
            }
        };
    })
    .directive('cgDropdown', function () {
        return {
            restrict: 'E',
            templateUrl: 'public/system/views/dropdown.html',
            scope: {
                value: '=ngModel',
                options: '=',
                placeholder: '=',
                required: '=',
                preselect: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.setOptions = function setOptions(options) {
                    if (!Array.isArray(options)) {
                        throw new Error('Options is not Array');
                    }
                    $scope.internalOptions = [];
                    options.forEach(function (option) {
                        if (option.hasOwnProperty('value') && option.hasOwnProperty('label')) {
                            $scope.internalOptions.push({value: option.value, label: option.label});
                        } else {
                            $scope.internalOptions.push({value: option, label: option.toString()});
                        }
                    });
                    if ($scope.preselect !== undefined) {
                        if (typeof $scope.preselect === 'number') {
                            if ($scope.internalOptions.length) {
                                $scope.select($scope.internalOptions[$scope.preselect < $scope.internalOptions.length ? $scope.preselect : ($scope.internalOptions.length - 1)]);
                            }
                        } else {
                            $scope.internalOptions.every(function (option) {
                                if (option.value === $scope.preselect) {
                                    $scope.select(option);
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                };
                $scope.select = function (option) {
                    $scope.selectedOption = option;
                    $scope.value = $scope.selectedOption.value;
                };
                $scope.setOptions($scope.options);
            }],
            link: function (scope, element, attrs, ctrl) {
                if (scope.required) {
                    element.find('input').attr('required', 'true');
                }
                scope.$watchCollection('options', function(current, previous) {
                    scope.setOptions(current);
                });
            }
        };
    })
    .directive('cgDatepicker', function () {
        return {
            restrict: 'E',
            templateUrl: 'public/system/views/datepicker.html',
            scope: {
                value: '=ngModel',
                disabled: '=ngDisabled'
            },
            controller: ['$scope', function ($scope) {
                $scope.collapsed = true;
                $scope.toggle = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    if (!$scope.disabled) {
                        $scope.collapsed = !$scope.collapsed;
                    }
                };
            }],
            link: function (scope, element, attrs, ctrl) {
            }
        };
    })
    .directive('cgTimepicker', function () {
        return {
            restrict: 'E',
            templateUrl: 'public/system/views/timepicker.html',
            scope: {
                value: '=ngModel'
            },
            controller: ['$scope', function ($scope) {
                $scope.collapsed = true;
                $scope.toggle = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.collapsed = !$scope.collapsed;
                };
            }],
            link: function (scope, element, attrs, ctrl) {
            }
        };
    })
    .directive('cgImgUpdate', function () {
        return {
            restrict: 'E',
            templateUrl: 'public/system/views/imageupdate.html',
            scope: {
                model: '=',
                property: '@',
                showSaveButton: '@',
                modelName: '@',
                before: '=',
                after: '='
            },
            controller: ['$scope', '$rootScope', '$upload', '$http', function ($scope, $rootScope, $upload, $http) {

                var property = $scope.property = $scope.property || 'img';
                $scope.isShowSaveButton = $scope.showSaveButton;
                if ($scope.showSaveButton === undefined) {
                    $scope.isShowSaveButton = true;
                }

                $scope.initImgUpdate = function initImgUpdate() {
                    if ($scope.before && typeof $scope.before === 'function') {
                        $scope.before();
                    }
                    $scope.prevImgUrl = $scope.model[property];
                    $scope.newImgUrl = $scope.uploadedImgUrl = '';
                    $scope.showUpdateImgForm = true;
                };

                $scope.checkImg = function checkImg() {
                    $scope.model[property] = $scope.newImgUrl;
                };

                $scope.onFileSelect = function ($files) {
                    var file = $files[0];
                    $scope.upload = $upload.upload({
                        url: $rootScope.fileServerUrl,
                        file: file
                    }).progress(function(evt) {
                        //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        //console.log(data);
                        if ($scope.uploadedImgUrl) {
                            $http({method: 'DELETE', url: $scope.uploadedImgUrl});
                        }
                        $scope.model[property] = $scope.uploadedImgUrl = data.files[0].url;
                        $scope.newImgUrl = '';
                    });
                    //.error(...)
                };

                $scope.saveImg = function saveImg() {
                    if ($scope.newImgUrl) {
                        $scope.model[property] = $scope.newImgUrl;
                    }
                    $scope.showUpdateImgForm = false;
                    if ($scope.after && typeof $scope.after === 'function') {
                        $scope.after();
                    }
                    $scope.model.$update(function(response) {
                        if (!response.errors) {
                            if ($scope.prevImgUrl && $scope.prevImgUrl.indexOf($rootScope.fileServerUrl) === 0) {
                                $http({method: 'DELETE', url: $scope.prevImgUrl});
                            }
                        }
                    });
                };

                $scope.cancelImgUpdate = function cancelImgUpdate() {
                    if ($scope.uploadedImgUrl) {
                        $http({method: 'DELETE', url: $scope.uploadedImgUrl});
                    }
                    $scope.model[property] = $scope.prevImgUrl;
                    $scope.showUpdateImgForm = false;
                    if ($scope.after && typeof $scope.after === 'function') {
                        $scope.after();
                    }
                };

                if ($scope.modelName) {
                    $rootScope.$on($scope.modelName + '-updated', function(event, response) {
                        if (!response.errors) {
                            if ($scope.prevImgUrl && $scope.prevImgUrl.indexOf($rootScope.fileServerUrl) === 0) {
                                $http({method: 'DELETE', url: $scope.prevImgUrl});
                            }
                        }
                    });
                    $rootScope.$on($scope.modelName + '-canceled', function(event, response) {
                        if ($scope.uploadedImgUrl) {
                            $http({method: 'DELETE', url: $scope.uploadedImgUrl});
                        }
                    });
                }
            }]
        };
    })
;