'use strict';

var app = angular.module('mean.organisations', ['ui.bootstrap', 'xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.controller('OrganisationsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Organisations', 'Activists',
    function ($scope, $rootScope, $stateParams, $location, $state, Organisations, Activists) {

        $scope.isNew = $state.is('organisations-create');

        $scope.init = function () {
            if (!$scope.isNew) {
                $scope.findOne();
            } else {
                $scope.organisation = new Organisations();
            }
        };

        $scope.find = function () {
            Organisations.query(function (organisations) {
                $scope.organisations = organisations;
            });
        };

        $scope.findOne = function () {
            Organisations.get({
                organisationId: $stateParams.organisationId
            }, function (organisation) {
                $scope.organisation = organisation;
                $scope.canEdit = $scope.isOwner(organisation);
            });
        };

        $scope.inlineEdit = function inlineEdit(form) {
            if ($scope.canEdit) {
                form.$show();
            }
        };

        $scope.create = function () {
            $scope.organisation.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.go($state.current.previous);
                }
            });
        };

        $scope.update = function(data) {
            var organisation = $scope.organisation;
            if (data) {
                organisation[data.path] = data.data;
            }
            if (!organisation.updated) {
                organisation.updated = [];
            }
            organisation.updated.push(new Date().getTime());
            organisation.$update(function() {
                if (!data) {
                    $state.go($state.current.previous);
                }
            });
        };

        $scope.cancel = function cancel() {
            $state.go($state.current.previous);
        };

        $scope.remove = function (organisation) {
            if (organisation) {
                organisation.$remove(function (response) {
                    if (!response.errors) {
                        for (var i in $scope.organisations) {
                            if ($scope.organisations[i] === organisation) {
                                $scope.organisations.splice(i, 1);
                            }
                        }
                    }
                });
            } else {
                $scope.organisation.$remove(function (response) {
                    $state.go($state.current.previous);
                });
            }
        };

    }
]);

//'use strict';
//
//angular.module('mean.organisations').controller('OrganisationsController', ['$scope', 'Global', 'Organisations',
//    function($scope, Global, Organisations) {
//        $scope.global = Global;
//        $scope.package = {
//            name: 'organisations'
//        };
//    }
//]);
