'use strict';

var app = angular.module('mean.activists',['ui.bootstrap']);
app.controller('ActivistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$log', '$http', 'Global', 'Activists',
    function($scope, $rootScope, $stateParams, $location, $log, $http, Global, Activists) {
        $scope.global = Global;

        $scope.getTitle = function() {
            if ($location.search().update) {
                return 'O себе';
            }
            return 'Регистрация активиста';
        };

        $scope.init = function() {
            Activists.save({}, function(activist) {
                $scope.activist = activist;
            });
        };

        $scope.update = function() {
            var activist = $scope.activist;
            if (!activist.updated) {
                activist.updated = [];
            }
            activist.updated.push(new Date().getTime());

            activist.$update(function() {
                $location.path('!#');
            });
        };

        $scope.cancel = function() {
            $location.path('!#');
        };
    }
]);

app.controller('ProfileController', ['$scope', '$rootScope', '$stateParams', '$location', '$log', '$http', 'Global', 'Activists',
    function($scope, $rootScope, $stateParams, $location, $log, $http, Global, Activists) {
        $scope.global = Global;

        $scope.getTitle = function() {
            if ($location.search().update) {
                return 'O себе';
            }
            return 'Регистрация активиста';
        };

        $scope.getLeaderImageUrl = function(leader) {
            if (leader)
                return String(leader.img).indexOf('http://') === 0 ? leader.img : 'http://dummyimage.com/100x100/858585/' + leader.img;
            else
                return '';
        };

        $scope.init = function() {
            Activists.get({'activistId':$stateParams.activistId}, function(activist) {
                $scope.activist = activist;
                $scope.canEdit = activist.user._id === window.user._id;
            });
        };

        $scope.update = function() {
            var activist = $scope.activist;
            if (!activist.updated) {
                activist.updated = [];
            }
            activist.updated.push(new Date().getTime());

            activist.$update(function() {
                $location.path('!#');
            });
        };

        $scope.cancel = function() {
            $location.path('!#');
        };
    }
]);
