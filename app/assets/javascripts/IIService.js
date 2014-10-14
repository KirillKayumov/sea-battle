

app.service('II', ['FieldState', 'HelpService', function(FieldState, HelpService){
    var yourField = [];
    var enemyField = [];
    var currentShip = [];
    var currentAttackedShip = [];
    var canAttackCells = HelpService.canAttackCells();

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
                    if (yourField[x][y] != 0)
                        return false;
                    field[x][y] = FieldState.SHIP;
                    currentShip.push({x: x, y: y});
                }
            } else{
                x = second;
                for (y = coord; y < coord + size; y++ ){
                    if (yourField[x][y] != 0)
                        return false;
                    field[x][y] = FieldState.SHIP;
                    currentShip.push({x: x, y: y});
                }
            }
        } else{
            if (side == 0){
                y = first;
                for (x = coord; x < coord + size; x++ ){
                    if (yourField[x][y] != 0)
                        return false;
                    field[x][y] = FieldState.SHIP;
                    currentShip.push({x: x, y: y});
                }
            } else{
                y = second;
                for (x = coord; x < coord + size; x++ ){
                    if (yourField[x][y] != 0)
                        return false;
                    field[x][y] = FieldState.SHIP;
                    currentShip.push({x: x, y: y});
                }
            }
        }
        yourField = field;
        HelpService.setDisabledRound(currentShip, yourField);
        return true;
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

            setShip(HelpService.getRandom(0, 1), HelpService.getRandom(0, 1), HelpService.getRandom(0, 6), 4, 0, 9);
            while (!setShip(HelpService.getRandom(0, 1), HelpService.getRandom(0, 1), HelpService.getRandom(0, 6), 3, 0, 9)){
            }
            while (!setShip(HelpService.getRandom(0, 1), HelpService.getRandom(0, 1), HelpService.getRandom(0, 6), 3, 0, 9)){
            }
            for (var i = 0; i <= 2; i++){
                while (!setShip(HelpService.getRandom(0, 1), HelpService.getRandom(0, 1), HelpService.getRandom(0, 6), 2, HelpService.getRandom(0, 9), HelpService.getRandom(0, 9))){
                }
            }

            for (var i = 0; i <= 3; i++){
                while (!setShip(HelpService.getRandom(0, 1), HelpService.getRandom(0, 1), HelpService.getRandom(0, 6), 1, HelpService.getRandom(0, 9), HelpService.getRandom(0, 9))){
                }
            }

        },
        toString: function(array){
            for (var i = 0; i < 10; i++){
                var string = "";
                for (var j = 0; j < 10; j++){
                    string += array[i][j] + " ";
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
            if (currentAttackedShip.length == 0){
                var index = HelpService.getRandom(0, canAttackCells.length - 1);
                var cell = canAttackCells[index];
                return {x: cell.x, y : cell.y}
            } else{
                if (currentAttackedShip.length != 1){
                    var durationX;
                    var durationY;
                    var x = currentAttackedShip[0].x;
                    var y = currentAttackedShip[0].y;
                    if (currentAttackedShip[0].x == currentAttackedShip[1].x){
                        durationX = 0;
                        durationY = 1;
                    } else {
                        durationX = 1;
                        durationY = 0;
                    }
                    while (HelpService.isInField(x + durationX, y + durationY)
                        && enemyField[x + durationX][y + durationY] <= FieldState.SHIP){
                        x += durationX;
                        y += durationY;
                    }
                    if (HelpService.isInField(x + durationX, y + durationY)
                        && enemyField[x + durationX][y + durationY] == FieldState.EMPTY)
                        return {x: x + durationX, y: y + durationY};
                    var x = currentAttackedShip[0].x;
                    var y = currentAttackedShip[0].y;
                    durationX *= -1;
                    durationY *= -1;
                    while (HelpService.isInField(x + durationX, y + durationY)
                        && enemyField[x + durationX][y + durationY] <= FieldState.SHIP){
                        x += durationX;
                        y += durationY;
                    }
                    if (HelpService.isInField(x + durationX, y + durationY)
                        && enemyField[x + durationX][y + durationY] == FieldState.EMPTY)
                        return {x: x + durationX, y: y + durationY};
                } else{
                    var durations = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                    var x = currentAttackedShip[0].x;
                    var y = currentAttackedShip[0].y;
                    for (var iter = 0; iter < durations.length; iter++){
                        var xx = x + durations[iter][0];
                        var yy = y + durations[iter][1];
                        if (HelpService.isInField(xx, yy) && enemyField[xx][yy] == FieldState.EMPTY)
                            return {x: xx, y: yy}
                    }
                }
            }
        },
        attackResult: function(x, y, value){
            console.log(x, y, value);
            canAttackCells.splice(HelpService.cellNumber(canAttackCells, x, y), 1);
            if (value == FieldState.KILLED){
                currentAttackedShip.push({x: x, y: y});
                HelpService.setDisabledRound(currentAttackedShip, enemyField, canAttackCells);
                for (var iter = 0; iter < currentAttackedShip.length; iter++){
                    enemyField[currentAttackedShip[iter].x][currentAttackedShip[iter].y] = FieldState.KILLED;
                }
                currentAttackedShip = [];
            } else if (value == FieldState.HURT){
                enemyField[x][y] = FieldState.HURT;
                currentAttackedShip.push({x: x, y: y});
            } else{
                enemyField[x][y] = FieldState.ATTACKED;
            }
        },
        attacked: function(x, y){
            if (yourField[x][y] == FieldState.EMPTY || yourField[x][y] == FieldState.SHIP_NEAR)
                return FieldState.ATTACKED;
            else if (yourField[x][y] == FieldState.SHIP){
                yourField[x][y] = FieldState.HURT;
                var array = HelpService.findConnectedCells(x, y, yourField);
                var dead = true;
                for (var i = 0; i < array.length; i++)
                    if (yourField[array[i].x][array[i].y] > FieldState.HURT)
                        dead = false;
                if (dead) {
                    return FieldState.KILLED;
                } else {
                    return FieldState.HURT;
                }
            }
        }
    }

}]);

