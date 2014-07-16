'use strict';

angular.module('mean.victories')
    .controller('VictoriesController', ['$scope', '$stateParams', '$http', 'Victories',
        function($scope, $stateParams, $http, Victories) {

            $scope.package = {
                name: 'victories'
            };


            (function initRegions(){
                $scope.regions = [
                    {'value': '0.Вся Україна', 'label': 'Вся Україна'}
                ];
                $scope.region = $scope.regions[0];
                $http({method: 'GET', url: '/regions'}).
                    success(function(data, status, headers, config) {
                        $scope.regions = data;
                        $scope.region = $scope.regions.filter(function (region) {
                            return '' + region.value === '' + $stateParams.region;
                        })[0] || $scope.regions[0];
                    });
            })();

            $scope.setRegion = function (region) {
                $scope.region = region;
                $scope.find();
            };

            $scope.find = function find(){
                Victories.query({region: $scope.region.value.indexOf('0.') === 0 ? undefined : $scope.region._id}, function(victories) {
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
    ])
;
