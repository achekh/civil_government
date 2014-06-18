'use strict';

var app = angular.module('mean.organizations', ['ui.bootstrap', 'xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.controller('OrganizationsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Organizations', 'Activists',
    function ($scope, $rootScope, $stateParams, $location, $state, Organizations, Activists) {

        $scope.isNew = $state.is('organizations-create');

        $scope.init = function () {
            if (!$scope.isNew) {
                $scope.findOne();
            } else {
                $scope.organization = new Organizations();
            }
        };

        $scope.find = function () {
            Organizations.query(function (organizations) {
                $scope.organizations = organizations;
            });
        };

        $scope.findOne = function () {
            Organizations.get({
                organizationId: $stateParams.organizationId
            }, function (organization) {
                $scope.organization = organization;
                $scope.canEdit = $scope.isOwner(organization);
            });
        };

        $scope.inlineEdit = function inlineEdit(form) {
            if ($scope.canEdit) {
                form.$show();
            }
        };

        $scope.create = function () {
            $scope.organization.$save(function (response) {
                if (response.errors) {
                    $scope.errors = response.errors;
                } else {
                    $state.go($state.current.previous);
                }
            });
        };

        $scope.update = function(data) {
            var organization = $scope.organization;
            if (data) {
                organization[data.path] = data.data;
            }
            if (!organization.updated) {
                organization.updated = [];
            }
            organization.updated.push(new Date().getTime());
            organization.$update(function() {
                if (!data) {
                    $state.go($state.current.previous);
                }
            });
        };

        $scope.cancel = function cancel() {
            $state.go($state.current.previous);
        };

        $scope.remove = function (organization) {
            if (organization) {
                organization.$remove(function (response) {
                    if (!response.errors) {
                        for (var i in $scope.organizations) {
                            if ($scope.organizations[i] === organization) {
                                $scope.organizations.splice(i, 1);
                            }
                        }
                    }
                });
            } else {
                $scope.organization.$remove(function (response) {
                    $state.go($state.current.previous);
                });
            }
        };

    }
]);

//'use strict';
//
//angular.module('mean.organizations').controller('OrganizationsController', ['$scope', 'Global', 'Organizations',
//    function($scope, Global, Organizations) {
//        $scope.global = Global;
//        $scope.package = {
//            name: 'organizations'
//        };
//    }
//]);
