'use strict';

angular
    .module('mean.victories')
    .controller('VictoriesController',
    ['$scope', 'Global', 'Victories',
    function($scope, Global, Victories) {
        $scope.global = Global;
        $scope.package = {
            name: 'victories'
        };

        $scope.find = function find(){
            Victories.query({}, function(victories) {
                $scope.victories = victories;
            });
        };

        $scope.getVictoryImageUrl = function getVictoryImageUrl(victory) {
            if (victory)
                return String(victory.img).indexOf('http://') === 0 ?
                    victory.img :
                    'http://dummyimage.com/100x100/858585/' + victory.img;
            else
                return '';
        };
    }
]);
