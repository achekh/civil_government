'use strict';

angular.module('mean.activists')
    .directive('cgActivistDigest', function () {
        return {
            restrict: 'E',
            scope: {activist: '=data'},
            templateUrl: 'activists/views/digest.html'
        };
    })
;
