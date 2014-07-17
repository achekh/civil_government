'use strict';

var app = angular.module('mean.organizations', ['ui.bootstrap', 'xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.controller('OrganizationsController',
    ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Organizations', 'Actor', 'Activists', 'Members', 'Events', 'Supports',
    function ($scope, $rootScope, $stateParams, $location, $state, Organizations, Actor, Activists, Members, Events, Supports) {

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

        $scope.findAuthenticated = function () {
            if ($scope.global.authenticated) {
                Actor.getActivist().then(function (activist) {
                    if (activist) {
                        Members.query({
                            activistId: activist._id,
                            organizationId: $stateParams.organizationId
                        }, function (members) {
                            $scope.member = members[0];
                        });
                    }
                });
            }
        };

        $scope.join = function () {
            Actor.getActivist().then(function (activist) {
                if (activist) {
                    var member = new Members({
                        activist: activist._id,
                        organization: $stateParams.organizationId
                    });
                    member.$save(function () {
                        $state.go('organizations-view', {}, {reload: true});
                    });
                }
            });
        };

        $scope.leave = function () {
            $scope.member.$remove(function() {
                $state.go('organizations-view', {}, {reload: true});
            });
        };

        $scope.findMembers = function () {
            Members.query({
                organizationId: $stateParams.organizationId
            }, function (members) {
                $scope.members = members;
            });
        };

        $scope.findEvents = function () {
            Events.query({
                organizationId: $stateParams.organizationId
            }, function (events) {
                $scope.events = events;
            });
        };

        $scope.findEventsSupported = function () {
            Supports.query({
                organizationId: $stateParams.organizationId
            }, function (supports) {
                $scope.supports = supports;
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
                    $state.goBack();
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
                    $state.goBack();
                }
            });
        };

        $scope.cancel = function cancel() {
            $state.goBack();
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
                    $state.goBack();
                });
            }
        };

    }
]);

