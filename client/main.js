//Meteor.startup(function () {
//  Edmunds.key = 'qmdbysd8czupxkec977dpr3w';
//});

angular.module('app').controller("MainController", ["$scope", function($scope) {
    $scope.isAdminRole = function() {
        if(Roles.userIsInRole(Meteor.user(), ['admin'])) {
            return true;
        } else {
            return false;
        }
    };

    $scope.goToList = function() {
        $location.path('/admin/client/list');
    }
}]);
