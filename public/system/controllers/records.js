'use strict';

angular.module('mean.system').controller('RecordsController', ['$scope','$http',
    function ($scope, $http) {
        $scope.records = {};
        $http({method: 'GET', url: '/records'}).
            success(function(data, status, headers, config) {
                $scope.records = data;
            });
        $http({method: 'GET', url: '/favicon.ico', headers: {'Cache-Control': 'no-cache'}});
    }
]);