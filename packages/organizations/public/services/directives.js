'use strict';

angular.module('mean.organizations')
    .directive('cgOrganizationDigest', function () {
        return {
            restrict: 'E',
            scope: {organization: '=data'},
            templateUrl: 'organizations/views/digest.html'
        };
    })
//    .directive('cgInlineEdit', function () {
//        return {
//            restrict: 'A',
//            link: function (scope, element, attrs) {
//                scope.$watch('organization', function (organization) {
//                    if (scope.canEdit) {
//                        element.attr('editable-text', attrs.cgInlineEdit);
//                        element.addClass('editable editable-click');
//                    }
//                });
//            }
//        };
//    })
;
