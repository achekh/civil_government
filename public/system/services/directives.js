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
                ngModel: '=',
                options: '='
            },
            controller: ['$scope', function ($scope) {
                if (!$scope.ngModel) {
                    $scope.ngModel = $scope.options[0].value;
                }
                $scope.selectedOption = $scope.options.filter(function (option) {
                    return option.value === $scope.ngModel;
                })[0];
                $scope.select = function (option) {
                    $scope.selectedOption = option;
                    $scope.ngModel = $scope.selectedOption.value;
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
                ngModel: '=',
                options: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs, ctrl) {
            }
        };
    })
;