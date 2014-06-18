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
                options: '='
            },
            controller: ['$scope', function ($scope) {

                function init() {

                    if (!Array.isArray($scope.options)) {
                        throw new Error('Options is not Array');
                    }

                    $scope.internalOptions = [];
                    if ($scope.options.length) {
                        $scope.options.forEach(function (option) {
                            if (option.hasOwnProperty('value') && option.hasOwnProperty('label')) {
                                $scope.internalOptions.push({value: option.value, label: option.label});
                            } else {
                                $scope.internalOptions.push({value: option, label: option.toString()});
                            }
                        });
                    } else {
                        $scope.internalOptions.push({label: 'No options'});
                    }

                    if (!$scope.value) {
                        $scope.value = $scope.internalOptions[0].value;
                    }

                    $scope.selectedOption = $scope.internalOptions.filter(function (option) {
                        return option.value === $scope.value;
                    })[0];

                }

                init();

                $scope.$watch('options', init, true);

                $scope.select = function (option) {
                    $scope.selectedOption = option;
                    $scope.value = $scope.selectedOption.value;
                };

            }],
            link: function (scope, element, attrs, ctrl) {
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