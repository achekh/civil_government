'use strict';

angular.module('mean.leaders').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('leaders example page', {
            url: '/leaders/example',
            templateUrl: 'leaders/views/index.html'
        });
    }
]);
