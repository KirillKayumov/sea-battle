app.controller('AppCtrl', ['$scope',  '$http', function($scope, $http) {
    $scope.user = {
        email: ""
    };

    $scope.$watch('user.email', function(newValue){
        console.log($scope.user.email);
    })
}]);