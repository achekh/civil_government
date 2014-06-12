'use strict';

var app = angular.module('mean.activists',['ui.bootstrap']);
app.controller('ActivistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$log', '$http', 'Global', 'Activists',
    function($scope, $rootScope, $stateParams, $location, $log, $http, Global, Activists) {
        $scope.global = Global;

        $scope.getTitle = function() {
            if ($location.search().register) {
                return 'Регистрация активиста';
            }
            return 'O себе';
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
                doneClose('close');
            });
        };

        $scope.cancel = function() {
            doneClose('dismiss');
        };

        function doneClose(op) {
            try {
                $scope.$parent.$parent.$parent.modelInstanceFromProfile[op]();
            } catch (e) {
                $location.path('!#');
            }
        }
    }
]);

app.controller('ProfileController',
    ['$scope', '$modal', '$rootScope', '$stateParams', '$location', '$log', '$http', 'Global', 'Activists', 'Events',
    function($scope, $modal, $rootScope, $stateParams, $location, $log, $http, Global, Activists, Events) {
        $scope.global = Global;

        $scope.open = function() {
            $scope.fromProfile = true;
            $scope.modelInstanceFromProfile = $modal.open({
                templateUrl: 'activists/views/index.html'
                ,size:'lg'
                ,scope:$scope
                ,backdrop:'static'
            });
            $scope.modelInstanceFromProfile.result.then(function(){
                $scope.init();
            });
        };

        $scope.getLeaderImageUrl = function(leader) {
            if (leader)
                return String(leader.img).indexOf('http://') === 0 ? leader.img : 'http://dummyimage.com/100x100/858585/' + leader.img;
            else
                return '';
        };

        $scope.init = function() {
            if($stateParams.activistId) {
                Activists.get({'activistId':$stateParams.activistId}, function(activist) {
                    $scope.activist = activist;
                    $scope.canEdit = activist.user._id === (window.user._id || $scope.user._id);
                    $scope.findMyEvents();
                });
            } else {
                var userId = window.user._id || $scope.user._id;
                return Activists.query({userId:userId}, function(activists) {
                    $scope.activist = activists[0];
                    $scope.canEdit = activists[0].user._id === (window.user._id || $scope.user._id);
                    $scope.findMyEvents();
                });
            }
        };


        $scope.findMyEvents = function findMyEvents() {
            Events.query({userId:$scope.activist.user._id}, function(events) {
                $scope.events = events;
            });
        };


    }
]);

