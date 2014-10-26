app.controller('AppCtrl', ['$scope',  '$http', function($scope, $http) {
    $scope.App = {};
    $scope.App.gameType = 'C';
    $scope.App.gameId = -1;
    $scope.App.isYourStep = true;
}]);