'use strict';

angular.module('mean.activists',['ui.bootstrap']).controller('ActivistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$log', '$http', 'Global', 'Activists',
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
