app.controller('GameCtrl', ['$scope', '$http', '$location', function ($scope,  $http, $location) {
    $scope.online_users = [];
    var canStartGame = true;
    $scope.waitGame = -1;
    $scope.invites = [];
    $scope.gameStartTimer = 30;
    $scope.tryStartWithUser = function(id){
        if (canStartGame){
            if ($scope.isInviteYou(id)){
                $http.post('/games/' + $scope.isInviteYou(id) + '/confirm.json',{})
                    .success(function(data){
                        $scope.App.isYourStep = true;
                        $scope.gameId = data.id;
                        window.location = '/';
                    });
            } else{
                canStartGame = false;
                $scope.gameStartTimer = 30;
                $http.post('/games.json', {receiver_id: id}).success(function(data){
                    $scope.waitGame = data.id;
                    $scope.gameInterval = setInterval($scope.getGameStatus, 1000);
                    jQuery('#myModal').modal('show');
                    jQuery('.timer').html('Wait ' + $scope.gameStartTimer + ' sec');
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
            $scope.gameStartTimer--;
            jQuery('.timer').html('Wait ' + $scope.gameStartTimer + ' sec');
            $http.get('/games/' + $scope.waitGame + '.json')
                .success(function(data, status, headers, config) {
                    if (data.status == 1){
                        clearInterval($scope.gameInterval);
                        $scope.App.gameType = 'P';
                        $scope.App.gameId = $scope.waitGame;
                        $scope.App.isYourStep = false;
                        window.location = '/';
                    }
                })
                .error(function(data, status, headers, config) {
                    jQuery('#myModal').modal('hide');
                });
            if ($scope.gameStartTimer == 0){
                jQuery('#myModal').modal('hide');
            }
        }
    };

    $scope.getInvites = function(){
        $http.get('/games/invites.json', {}).success(function(data){
            $scope.invites = data;
        })
    };

    $scope.$watch('online_users', function(){
        jQuery('.new-game').height( $scope.online_users.length * 30 + 90);
    });

    $scope.playWithComputer = function(){
        $scope.App.gameType = 'C';
        window.location = '/';
    };

    setInterval($scope.getInvites, 1000);


    jQuery('#myModal').on('hidden.bs.modal', function (e) {
        canStartGame = true;
        clearInterval($scope.gameInterval);
        $http.delete('/games/' +$scope.waitGame + '.json');
        $scope.waitGame = -1;
        $scope.$apply();
    });

    $scope.declain = function(id){
        for (var i = 0; i < $scope.invites.length; i++)
            if ($scope.invites[i].sender_id == id){
                $http.delete('/games/' +$scope.invites[i].id + '.json');
                return;
            }

    }
}]);