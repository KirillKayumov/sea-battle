app.controller('GameCtrl', ['$scope', '$http', '$location', function ($scope,  $http, $location) {
    $scope.online_users = [];
    var canStartGame = true;
    $scope.waitGame = -1;
    $scope.invites = [];
    $scope.tryStartWithUser = function(id){
        if (canStartGame){
            if ($scope.isInviteYou(id)){
                $http.post('/confirm.json',{game_id: $scope.isInviteYou(id)})
                    .success(function(data){
                        window.location = '/';
                    });
            } else{
                canStartGame = false;
                $http.post('/games.json', {receiver_id: id}).success(function(data){
                    $scope.waitGame = data.id;
                    $scope.gameInterval = setInterval($scope.getGameStatus, 1000);
                });
            }
        }
    };

    $scope.isInviteYou = function(id){
        for (var i = 0; i < $scope.invites.length; i++)
            if ($scope.invites[i].sender_id == id)
                return $scope.invites[i].id;
        return false;
    };

    $scope.getGameStatus = function(){
        if ($scope.waitGame != -1){
            $http.get('/games/' + $scope.waitGame + '.json')
                .success(function(data, status, headers, config) {
                    if (data.status == 1){
                        clearInterval($scope.gameInterval);
                        window.location = '/';
                    }
                });
        }
    };

    $scope.getInvites = function(){
        $http.get('/invites.json', {}).success(function(data){
            $scope.invites = data;
        })
    };

    $scope.$watch('online_users', function(){
        jQuery('.new-game').height( $scope.online_users.length * 30 + 90);
    });

    $scope.playWithComputer = function(){
        $scope.gameType = 'C';
        window.location = '/'
    }

    setInterval($scope.getInvites, 1000);
}]);