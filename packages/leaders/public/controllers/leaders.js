'use strict';

angular.module('mean.leaders').controller('LeadersController', ['$scope', 'Global', 'Leaders', '$log',
    function($scope, Global, Leaders, $log) {

        $log.debug('entering LeadersController definition');

        $scope.global = Global;
        $scope.package = {
            name: 'leaders'
        };

        $scope.find = function() {
            $log.debug('entering LeadersController.find');
            Leaders.query({sortBy: '-eventsTotal', limitTo: 3}, function(leaders) {
                $scope.leaders = leaders;
            });
        };

        $scope.getLeaderImageUrl = function(leader) {
            return 'http://dummyimage.com/90x100/858585/' + leader.img;
        };

        $scope.getLeaderLastNameInitial = function(leader) {
            return String(leader.lastName).length ? String(leader.lastName).substr(0, 1) : '';
        };

        $scope.getLeaderInSystemDuration = function(leader) {
            return '1г 3м 12д'; //todo getLeaderInSystemDuration
        };
    }
]);
