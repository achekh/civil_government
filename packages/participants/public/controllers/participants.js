'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', 'Global', 'Participants',
    function($scope, Global, Participants) {

        $scope.global = Global;

        $scope.package = {
            name: 'participants'
        };



    }
]);
