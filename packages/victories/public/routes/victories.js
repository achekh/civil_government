'use strict';

angular.module('mean.victories').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('victories', {
            url: '/victories',
            templateUrl: 'victories/views/index.html'
        });
        $stateProvider.state('victory-create', {
            url: '/victories/create',
            templateUrl: 'victories/views/edit.html'
        });
        $stateProvider.state('victory-update', {
            url: '/victories/:victoryId',
            templateUrl: 'victories/views/edit.html'
        });
    }
]);
