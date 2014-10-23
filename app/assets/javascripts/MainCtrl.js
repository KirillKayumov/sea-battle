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

    $scope.setStarted = function(){
        $scope.started = true;
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


    $scope.damage = function($event, x, y){
        if (!$scope.started)
            return;
        if ($scope.enemyField[x][y] == FieldState.EMPTY){
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
            if (status == FieldState.ATTACKED)
                attack();
        }
    };

    function attack(){
        var attacked = $scope.II.attack();
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
            $scope.II.attackResult(attacked.x, attacked.y, dead ? FieldState.KILLED : FieldState.HURT);
            $scope.yourField[attacked.x][attacked.y] = dead ? FieldState.KILLED : FieldState.HURT;
            attack();
        } else{
            $scope.II.attackResult(attacked.x, attacked.y, FieldState.ATTACKED);
            $scope.yourField[attacked.x][attacked.y] = FieldState.ATTACKED;
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.II = II;
    $scope.II.initialize();
    $scope.IIfield = $scope.II.returnField();
    $scope.clearShipHover();

    $scope.sendGameStartRequest = function(id){
        $http.post("",{
            params: {

            }
        })
    };

    $scope.render = function(){
        $scope.II.initialize();
        $scope.yourField = $scope.II.returnField().slice(0);
        $scope.yourShips= ["", 0, 0, 0, 0];
        $scope.ready = true;
        $scope.II.initialize();
        $scope.IIfield = $scope.II.returnField();
    };

    $scope.$watch("yourShipCount", function(newValue){
        if (newValue == 0)
            alert("You lose");
    });

    $scope.$watch("enemyShipCount", function(newValue){
        if (newValue == 0)
            alert("You win")
    });

}]);
