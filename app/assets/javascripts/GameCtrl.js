app.controller('GameCtrl', ['$scope', '$http', '$location', function ($scope,  $http, $location) {
    $scope.online_users = [];

    $scope.tryStartWithUser = function(index){
        console.log(index);
    };

    $scope.$watch('online_users', function(){
        jQuery('.new-game').height( $scope.online_users.length * 30 + 90);
    });

    $scope.playWithComputer = function(){
        $scope.gameType = 'C';
        window.location = '/'
    }
}]);