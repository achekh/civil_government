'use strict';

angular.module('mean.system')
    .controller('IndexController', ['$scope', '$state', function ($scope, $state) {
        $scope.goViewProfile = function () {
            $state.go('activists-view-self');
        };
    }])
;