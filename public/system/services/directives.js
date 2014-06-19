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
;