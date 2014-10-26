app.controller('MainCtrl', ['$scope', 'II', 'HelpService', 'FieldState', '$http', function($scope, II, HelpService, FieldState, $http){
    $scope.yourField = HelpService.initializeArray(10, 10);
    $scope.enemyField = HelpService.initializeArray(10, 10);
    $scope.FieldState = FieldState;
    $scope.yourShipCount = 10;
    $scope.enemyShipCount = 10;
    $scope.HelpService = HelpService;
    $scope.digitsHeader = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.lettersHeader = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    $scope.yourShips = ["", 4, 3, 2, 1];
    $scope.takedShip = -1;
    $scope.started = false;
    $scope.hoveredCells = [];
    //false - горизонтальная, true - вертикальная
    $scope.orientation = false;
    $scope.currentShip = [];
    $scope.ready = false;
    $scope.appTimer = null;
    $scope.wait = '';
    $scope.noSteps = false;
    $http.get('/games/user_game.json')
        .success(function(data){
            $scope.App.isYourStep = data.step;
            $scope.App.gameType = 'P';
            $scope.App.gameId = data.game.id;
        });

    $scope.setStarted = function(){
        $scope.wait = "Ожидание соперника";
        if ($scope.App.gameType == 'C')
            $scope.started = true;
        else{
            $http.get('/games/' + $scope.App.gameId + '/ready.json', {})
                .success(function(data){
                    if (data.status != 2)
                        $scope.checkIsEnemyReadyInterval = setInterval($scope.checkIsEnemyReady, 500);
                    else{
                        $scope.started = true;
                        if (!$scope.App.isYourStep)
                            $scope.checkEnemyStepInterval = setInterval($scope.checkEnemyStep, 500);
                    }
                });
        }
    };

    $scope.takeShip = function(num){
        if ($scope.yourShips[num] > 0)
            $scope.takedShip = num;
    };


    $scope.range = function(count){
        return new Array(count);
    };

    $scope.setShip = function(){
        for (var i = 0; i < $scope.currentShip.length; i++)
            $scope.yourField[$scope.currentShip[i].x][$scope.currentShip[i].y] = FieldState.SHIP;
        HelpService.setDisabledRound($scope.currentShip, $scope.yourField);
        $scope.yourShips[$scope.takedShip]--;
        $scope.takedShip = -1;
        $scope.ready = HelpService.allZero($scope.yourShips);
    };

    $scope.clearShipHover = function () {
        $scope.hoveredCells = HelpService.initializeArray(10, 10);
        $scope.currentShip = [];
    };

    jQuery(document).on('keydown', function(e){
        if (e.keyCode == 82){
            $scope.orientation = !$scope.orientation;
            $scope.$apply();
        }
    });

    jQuery(document).ready(function(){
        $('.toolbar').height($('.col-md-8').height());
    });



    $scope.takeShipHover = function(x, y){
        if ($scope.takedShip == -1)
            return;
        if (!$scope.orientation) {
            if (!HelpService.isInField(0, y + $scope.takedShip - 1, 10, 10))
                return;
        } else{
            if (!HelpService.isInField(x + $scope.takedShip - 1, 0, 10, 10))
                return;
        }
        var cells = HelpService.initializeArray(10, 10);
        var currentShip = [];
        if (!$scope.orientation) {
            for (var iter = y; iter < y + $scope.takedShip; iter++) {
                if ($scope.yourField[x][iter] && $scope.yourField[x][iter] < 0)
                    return;
                cells[x][iter] = FieldState.SHIP;
                currentShip.push({x: x, y: iter});
            }
        } else{
            for (var iter = x; iter < x + $scope.takedShip; iter++) {
                if ($scope.yourField[iter][y] && $scope.yourField[iter][y] < 0)
                    return;
                cells[iter][y] = FieldState.SHIP;
                currentShip.push({x: iter, y: y});
            }
        }
        $scope.clearShipHover();
        $scope.currentShip = currentShip;
        $scope.hoveredCells = cells;
    };

    $scope.isHoveredCell = function(x, y){
        for (var i = 0; i < $scope.hoveredCells.length; i++){
            if (x == $scope.hoveredCells[i].x && y == $scope.hoveredCells[i].y)
                return true;
        }
    };

    $scope.checkMyStep = function(){
        $http.get('/games/' + $scope.App.gameId + '/turns/' + $scope.lastAttack.id + '.json',{})
            .success(function(data){
                if (data.status == null)
                    return;
                clearInterval($scope.checkMyStepInterval);
                $scope.enemyField[$scope.lastAttack.x][$scope.lastAttack.y] = data.status;
                if (data.status == FieldState.KILLED){
                    var array = HelpService.findConnectedCells($scope.lastAttack.x, $scope.lastAttack.y, $scope.enemyField);
                    for (var i = 0; i < array.length; i++) {
                        $scope.enemyField[array[i].x][array[i].y] = FieldState.KILLED;
                    }
                    $scope.enemyShipCount--;
                }
                if (data.status > 0){
                    $scope.checkEnemyStepInterval = setInterval($scope.checkEnemyStep, 500);
                    $scope.App.isYourStep = false;
                }
                $scope.noSteps = false;
            });
    };

    $scope.checkEnemyStep = function(){
        $http.get('/games/' + $scope.App.gameId + '/turns/check.json',{})
            .success(function(data){
                if (data == 'null' || data.status != null)
                    return;
                clearInterval($scope.checkEnemyStepInterval);
                $scope.checkAttack(data);
            });
    };

    $scope.attackPlayer = function(x, y){
        $http.post('/games/' + $scope.App.gameId + '/turns.json',{x: x, y: y})
            .success(function(data){
                $scope.lastAttack = data;
                $scope.checkMyStepInterval = setInterval($scope.checkMyStep, 500);
            });
    };

    $scope.damage = function($event, x, y){
        if (!$scope.started || !$scope.App.isYourStep || $scope.noSteps)
            return;
        if ($scope.enemyField[x][y] == FieldState.EMPTY){
            if ($scope.App.gameType == 'P'){
                $scope.noSteps = true;
                $scope.attackPlayer(x, y);
                $scope.lastAttack = {x: x, y:y};
                return;
            }

            $($event.target).removeClass('fieldCell');
            $scope.enemyField[x][y] = FieldState.ATTACKED;
            var status = $scope.II.attacked(x, y);
            $scope.enemyField[x][y] = status;
            if (status == FieldState.KILLED){
                $scope.enemyShipCount--;
                var array = HelpService.findConnectedCells(x, y, $scope.enemyField);
                for (var i = 0; i < array.length; i++){
                    $scope.enemyField[array[i].x][array[i].y] = FieldState.KILLED;
                }
            }
            if (status == FieldState.ATTACKED){
                attack();
            }
        }
    };

    function attack(){
        var attacked = $scope.II.attack();
        $scope.checkAttack(attacked);
    }

    $scope.checkAttack = function(attacked){
        if ($scope.yourField[attacked.x][attacked.y] == FieldState.SHIP){
            $scope.yourField[attacked.x][attacked.y] = FieldState.HURT;
            var array = HelpService.findConnectedCells(attacked.x, attacked.y, $scope.yourField);
            var dead = true;
            for (var i = 0; i < array.length; i++)
                if ($scope.yourField[array[i].x][array[i].y] > FieldState.HURT)
                    dead = false;
            if (dead) {
                $scope.yourShipCount--;
                for (var i = 0; i < array.length; i++) {
                    $scope.yourField[array[i].x][array[i].y] = FieldState.KILLED;
                }
            }
            $scope.yourField[attacked.x][attacked.y] = dead ? FieldState.KILLED : FieldState.HURT;
            if ($scope.App.gameType == 'P'){
                $http.post('/games/' + $scope.App.gameId +'/turns/' + attacked.id + '/confirm.json', {
                    status: $scope.yourField[attacked.x][attacked.y]
                });
                $scope.checkEnemyStepInterval = setInterval($scope.checkEnemyStep, 500);
            } else{
                $scope.II.attackResult(attacked.x, attacked.y, dead ? FieldState.KILLED : FieldState.HURT);
                attack();
            }
        } else{
            $scope.yourField[attacked.x][attacked.y] = FieldState.ATTACKED;
            if ($scope.App.gameType == 'P'){
                $http.post('/games/' + $scope.App.gameId +'/turns/' + attacked.id + '/confirm.json', {
                    status: $scope.yourField[attacked.x][attacked.y]
                });
                $scope.App.isYourStep = true;
            } else {
                $scope.II.attackResult(attacked.x, attacked.y, FieldState.ATTACKED);
            }

        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.II = II;
    $scope.II.initialize();
    $scope.IIfield = $scope.II.returnField();
    $scope.clearShipHover();

    $scope.render = function(){
        $scope.II.initialize();
        $scope.yourField = HelpService.initializeArray();
        $scope.hoveredCells = [];
        $scope.takedShip = -1;
        $scope.yourField = $scope.II.returnField().slice(0);
        $scope.yourShips= ["", 0, 0, 0, 0];
        $scope.ready = true;
        if ($scope.App.gameType != 'P') {
            $scope.II.initialize();
            $scope.IIfield = $scope.II.returnField();
        }
    };

    $scope.checkIsEnemyReady = function(){
        $http.get('/games/' + $scope.App.gameId + '.json', {})
            .success(function(data){
                if (data.status == 2){
                    clearInterval($scope.checkIsEnemyReadyInterval);
                    $scope.started = true;
                    if (!$scope.App.isYourStep)
                        $scope.checkEnemyStepInterval = setInterval($scope.checkEnemyStep, 500);
                }
            })
    };

    $scope.$watch("yourShipCount", function(newValue){
        if (newValue == 0)
            alert("You lose");
        if ($scope.App.gameType == 'P'){
            $http.get('/games/' + $scope.App.gameId + '/finish.json', {});
        }
    });

    $scope.$watch("enemyShipCount", function(newValue){
        if (newValue == 0)
            alert("You win");
        });

}]);
