app.controller('MainCtrl', ['$scope', 'II', function($scope, II){
    $scope.yourField = [];
    $scope.enemyField = [];
    $scope.yourShips = ["", 4, 3, 2, 1];
    $scope.takedShip = -1;
    $scope.hoveredCells = [];
    $scope.orientation = false;
    $scope.currentShip = [];
    $scope.ready = false;
    for (var x = 0; x < 10; x++){
        $scope.yourField[x] = [];
        $scope.enemyField[x] = [];
        for (var y = 0; y < 10; y++){
            $scope.yourField[x][y] = 0;
            $scope.enemyField[x][y] = 0;
        }
    }
    $scope.takeShip = function(num){
        if ($scope.yourShips[num] > 0)
            $scope.takedShip = num;
    };
    $scope.II = II;
    $scope.II.initialize();
    $scope.yourField = $scope.II.returnField().slice(0);
    $scope.II.initialize();
    function isInField(x, y){
        return (x >= 0 && x <= 9 && y >= 0 && y <= 9)
    }

    function setDisabledRound(){
        var xy =[[-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
        for (var j = 0; j < $scope.currentShip.length; j++)
        {
            for (var i = 0; i < xy.length; i++) {
                if (isInField(xy[i][0] + $scope.currentShip[j].x, xy[i][1] + $scope.currentShip[j].y)){
                    if ($scope.yourField[xy[i][0] + $scope.currentShip[j].x][xy[i][1] + $scope.currentShip[j].y] == 0)
                        $scope.yourField[xy[i][0] + $scope.currentShip[j].x][xy[i][1] + $scope.currentShip[j].y] = -2;
                }
            }

        }
    }

    $scope.setShip = function(){
        for (var i = 0; i < $scope.currentShip.length; i++)
            $scope.yourField[$scope.currentShip[i].x][$scope.currentShip[i].y] = -1;
        setDisabledRound();
        $scope.yourShips[$scope.takedShip]--;
        $scope.takedShip = -1;
        var isReady = true;
        for (var i = 0; i <= 3; i++)
            if ($scope.yourShips[i] != 0)
                isReady = false;
        if (isReady)
            $scope.ready = true;
    };

    $scope.clearShipHover = function () {
        $scope.hoveredCells = [];
        $scope.currentShip = [];
        for (var i = 0; i < 10; i++)
            $scope.hoveredCells[i] = new Array(10);
    };

    $scope.keyPressed = function(d){
        alert(d);
    };

    jQuery(document).on('keydown', function(e){
        if (e.keyCode == 82){
            $scope.orientation = !$scope.orientation;
            $scope.$apply();
        }
    });

    $scope.clearShipHover();

    $scope.takeShipHover = function(x, y){
        if (!$scope.orientation) {
            if (y + $scope.takedShip > 10)
                return;
        } else{
            if (x + $scope.takedShip > 10)
                return;
        }
        var cells = [];
        for (var i = 0; i < 10; i++)
            cells[i] = new Array(10);
        var currentShip = [];
        if ($scope.takedShip == -1)
            return;
        if (!$scope.orientation) {
            for (var i = y; i < y + $scope.takedShip; i++) {
                if ($scope.yourField[x][i] && $scope.yourField[x][i] < 0)
                    return;
                cells[x][i] = 1;
                currentShip.push({x: x, y: i});
            }
        } else{
            for (var i = x; i < x + $scope.takedShip; i++) {
                if ($scope.yourField[i][y] && $scope.yourField[i][y] < 0)
                    return;
                cells[i][y] = 1;
                currentShip.push({x: i, y: y});
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

    $scope.range = function(count){
        return new Array(count);
    };
    $scope.digitsHeader = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.lettersHeader = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    $scope.damage = function($event, x, y){
        if ($scope.enemyField[x][y] != 1){
            $scope.enemyField[x][y] = 1;
//            $scope.enemyField[x][y] = 2;

            $($event.target).removeClass('fieldCell');
        }
    };

    //найти рядом стоящие клетки, текущего коробля
    function findConnectedCells(x, y, field){
        var cells = [];
        cells.push({x: x, y: y});
        var xx = x - 1;
        var yy = y;
        while (isInField(xx, yy) && field[xx][yy] == -1){
            cells.push({x: xx, y: yy});
            xx--;
        }
        xx = x + 1;
        while (isInField(xx, yy) && field[xx][yy] == -1){
            cells.push({x: xx, y: yy});
            xx++;
        }

        xx = x;
        yy = y - 1;
        while ( isInField(xx, yy) && field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            yy--;
        }
        yy = y + 1;
        while (isInField(xx, yy) && field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            yy++;
        }
        return cells;
    }
    $scope.IIfield = $scope.II.returnField();
    $scope.IIfieldEnemy = $scope.II.returnFieldEnemy();
    function attack(){
        var attacked = $scope.II.attack();
        if ($scope.yourField[attacked.x][attacked.y] == -1){
            var array = findConnectedCells(attacked.x, attacked.y, $scope.yourField);
            var dead = true;
            for (var i = 0; i < array.length; i++)
                if ($scope.IIfieldEnemy[array[i].x][array[i].y] >= 2)
                    dead = false;
            $scope.II.attackResult(attacked.x, attacked.y, dead ? -3 : 3, dead ? array : null);
            attack();
            $scope.IIfieldEnemy[attacked.x][attacked.y] = -1;
        } else{
            $scope.II.attackResult(attacked.x, attacked.y, 1, null);
            $scope.IIfieldEnemy[attacked.x][attacked.y] = -2;
            setTimeout(attack, 1000);
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }
    attack();

}]);


app.service('II', function(){
    var yourField = [];
    var enemyField = [];
    var lastAttackX = -1;
    var lastAttackY = -1;
    var currentShip = [];
    function getRandom(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isInField(x, y){
        return (x >= 0 && x <= 9 && y >= 0 && y <= 9)
    }

    function setShip(direction, side, coord, size, first, second){
        var x = 0, y = 0;
        currentShip = [];
        var field = [];
        for (var i = 0; i < 10; i++){
            field[i] = [];
            for (var j = 0; j < 10; j++){
                field[i][j] = yourField[i][j];
            }
        }

        if (direction == 0){
            if (side == 0){
                x = first;
                for (y = coord; y < coord + size; y++ ){
                    if (yourField[x][y] < 0)
                        return false;
                    field[x][y] = -1;
                    currentShip.push({x: x, y: y});
                }
            } else{
                x = second;
                for (y = coord; y < coord + size; y++ ){
                    if (yourField[x][y] < 0)
                        return false;
                    field[x][y] = -1;
                    currentShip.push({x: x, y: y});
                }
            }
        } else{
            if (side == 0){
                y = first;
                for (x = coord; x < coord + size; x++ ){
                    if (yourField[x][y] < 0)
                        return false;
                    field[x][y] = -1;
                    currentShip.push({x: x, y: y});
                }
            } else{
                y = second;
                for (x = coord; x < coord + size; x++ ){
                    if (yourField[x][y] < 0)
                        return false;
                    field[x][y] = -1;
                    currentShip.push({x: x, y: y});
                }
            }
        }
        yourField = field;
        setDisabledRound();
        return true;
    }
    function setDisabledRound (){
        var xy =[[-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
        for (var j = 0; j < currentShip.length; j++)
        {
            for (var i = 0; i < xy.length; i++) {
                if (isInField(xy[i][0] + currentShip[j].x, xy[i][1] + currentShip[j].y)){
                    if (yourField[xy[i][0] + currentShip[j].x][xy[i][1] + currentShip[j].y] == 0)
                        yourField[xy[i][0] + currentShip[j].x][xy[i][1] + currentShip[j].y] = -2;
                }
            }

        }
    }
    function attackField(x, y){
        if (enemyField[x][y] == 0){
            enemyField[x][y] = 1;
            return {x: x, y : y}
        }
        else
            return false
    }
    return {
        initialize: function(){
            for (var x = 0; x < 10; x++){
                yourField[x] = [];
                enemyField[x] = [];
                for (var y = 0; y < 10; y++){
                    yourField[x][y] = 0;
                    enemyField[x][y] = 0;
                }
            }

            setShip(getRandom(0, 1), getRandom(0, 1), getRandom(0, 6), 4, 0, 9);
            while (!setShip(getRandom(0, 1), getRandom(0, 1), getRandom(0, 6), 3, 0, 9)){
            }
            while (!setShip(getRandom(0, 1), getRandom(0, 1), getRandom(0, 6), 3, 0, 9)){
            }
            for (var i = 0; i <= 2; i++){
                while (!setShip(getRandom(0, 1), getRandom(0, 1), getRandom(0, 6), 2, getRandom(0, 9), getRandom(0, 9))){
                }
            }

            for (var i = 0; i <= 3; i++){
                while (!setShip(getRandom(0, 1), getRandom(0, 1), getRandom(0, 6), 1, getRandom(0, 9), getRandom(0, 9))){
                }
            }

        },
        toString: function(){
            for (var i = 0; i < 10; i++){
                var string = "";
                for (var j = 0; j < 10; j++){
                    string += yourField[i][j] + " ";
                }
                console.log(string);
            }
        },
        returnField: function(){
            return yourField;
        },
        returnFieldEnemy: function(){
            return enemyField;
        },
        attack: function(){
            if (lastAttackX == -1 || lastAttackY == -1 || enemyField[lastAttackX][lastAttackY] == 1){
                while (true){
                    var k = attackField(getRandom(0, 9), getRandom(0, 9));
                    if (!k)
                        continue;
                    return k;
                }
            } else{
                var x = lastAttackX;
                var y = lastAttackY;
                var durations = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                var durationX;
                var durationY;
                for (var i = 0; i < durations.length; i++){
                    if (isInField(x + durations[i][0], y + durations[i][1])){
                        if (enemyField[x + durations[i][0]][y + durations[i][1]] == 3){
                            durationX = durations[i][0];
                            durationY = durations[i][1];
                        }
                    }
                }
                if (isInField(x + durationX * 2, y + durationY * 2)
                    && enemyField[x + durationX * 2][y + durationY * 2] == 0){
                    return this.setAttack(x + durationX * 2, y + durationY * 2);
                } else{
                    while(isInField(x + durationX * (-1), y + durationY * (-1))
                        && enemyField[x + durationX * (-1)][y + durationY * (-1)] != 0) {
                        x += durationX * (-1);
                        y += durationY * (-1);
                    }
                    if (isInField(x, y))
                        return this.setAttack(x, y);
                }
            }
        },
        setAttack: function(x, y){
            return {x: x, y: y};
        },
        attackResult: function(x, y, value, array){
            if (value != 1){
                lastAttackX = x;
                lastAttackY = y;
            } else{
                lastAttackX = -1;
                lastAttackY = -1;
            }
            if (array != null){
                for (var i = 0; i < array.length; i++){
                    enemyField[array[i].x][array[i].y] = value;
                }
            } else
                enemyField[x][y] = value;
        }
    }

});

