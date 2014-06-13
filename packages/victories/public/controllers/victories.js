'use strict';

angular
    .module('mean.victories')
    .controller('VictoriesController',
    ['$scope', '$stateParams', 'Global', 'Victories',
    function($scope, $stateParams, Global, Victories) {
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

        $scope.init = function init() {
            if ($stateParams.victoryId) {
                Victories.get({victoryId:$stateParams.victoryId}, function(victory) {
                    $scope.victory = victory;
                });
            } else {
                $scope.victory = new Victories();
            }
        };

        $scope.getCreateEditTitle = function getCreateEditTitle() {
            if ($stateParams.victoryId) {
               return 'Редактирование победы';
            } else {
                return 'Создание победы';
            }
        };

        $scope.cancel = function cancel() {
            window.history.back();
        };

        $scope.save = function save() {
            if ($scope.victory._id) {
                $scope.victory.$update(function(victory) {
                    debugger;
                    window.history.back();
                });
            } else {
                $scope.victory.$save(function(victory) {
                    window.history.back();
                });
            }
        };

    }
]);
