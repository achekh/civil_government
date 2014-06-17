'use strict';

angular.module('mean.organisations')
    .directive('cgOrganisationDigest', function () {
        return {
            restrict: 'E',
            scope: {organisation: '=data'},
            templateUrl: 'organisations/views/digest.html'
        };
    })
//    .directive('cgInlineEdit', function () {
//        return {
//            restrict: 'A',
//            link: function (scope, element, attrs) {
//                scope.$watch('organisation', function (organisation) {
//                    if (scope.canEdit) {
//                        element.attr('editable-text', attrs.cgInlineEdit);
//                        element.addClass('editable editable-click');
//                    }
//                });
//            }
//        };
//    })
;
