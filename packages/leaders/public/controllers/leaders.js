'use strict';

angular.module('mean.leaders').controller('LeadersController', ['$scope', 'Global', 'Leaders', '$log',
    function($scope, Global, Leaders, $log) {

        $scope.global = Global;
        $scope.package = {
            name: 'leaders'
        };

        $scope.find = function() {
            Leaders.query({sortBy: '-eventsTotal', limitTo: 3}, function(leaders) {
                $scope.leaders = leaders;
            });
        };

        $scope.getLeaderImageUrl = function(leader) {
            return String(leader.img).indexOf('http://') === 0 ? leader.img : 'http://dummyimage.com/90x100/858585/' + leader.img;
        };

        $scope.getLeaderInSystemDurationSeconds = function(leader) {
            return (new Date().getTime() - new Date(leader.created).getTime()) / 1000;
        };

        $scope.nowDate = new Date();
    }
]);

