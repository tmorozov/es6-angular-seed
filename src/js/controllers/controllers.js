/* globals angular */

(function() {
    'use strict';

    angular.module("application")

        .controller("HeaderController", ($scope) => {
            $scope.model = {
                message: "World",
                count: 3123
            };
        })
    ;

})();