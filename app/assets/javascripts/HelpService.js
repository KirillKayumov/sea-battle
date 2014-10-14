app.service('HelpService', ['FieldState', function(FieldState){
    return {
        initializeArray: function(n, m){
            var array = [];
            for (var iter = 0; iter < n; iter++){
                array[iter] = new Array(10);
                for (var t = 0; t < n; t++)
                    array[iter][t] = FieldState.EMPTY;
            }
            return array;
        },
        isInField: function(x, y, sizeN, sizeM){
            sizeN = typeof sizeN !== 'undefined' ? sizeN : 10;
            sizeM = typeof sizeM !== 'undefined' ? sizeM : 10;
            return (x >= 0 && x < sizeN && y >= 0 && y < sizeM)
        },
        setDisabledRound: function(currentShip, yourField, canAttackCells){
            var xy =[[-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
            for (var j = 0; j < currentShip.length; j++)
            {
                for (var i = 0; i < xy.length; i++) {
                    if (this.isInField(xy[i][0] + currentShip[j].x, xy[i][1] + currentShip[j].y)){
                        var xx = xy[i][0] + currentShip[j].x;
                        var yy = xy[i][1] + currentShip[j].y;
                        if (yourField[xx][yy] == FieldState.EMPTY) {
                            yourField[xx][yy] = FieldState.SHIP_NEAR;
                            if (typeof canAttackCells !== 'undefined'){
                                yourField[xx][yy] = FieldState.ATTACKED;
                                canAttackCells.splice(this.cellNumber(canAttackCells,xx, yy), 1);
                            }
                        }
                    }
                }

            }
        },
        allZero: function(array){
            var result = true;
            for (var iter = 0; iter < array.length; iter++)
                if (array[iter] != 0)
                    result = false;
            return result;
        },
        getRandom: function(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        findConnectedCells: function(x, y, field){
            var cells = [];
            cells.push({x: x, y: y});
            var xx = x - 1;
            var yy = y;
            while (this.isInField(xx, yy) && field[xx][yy] <= FieldState.SHIP){
                cells.push({x: xx, y: yy});
                xx--;
            }
            xx = x + 1;
            while (this.isInField(xx, yy) && field[xx][yy] <= FieldState.SHIP){
                cells.push({x: xx, y: yy});
                xx++;
            }
            xx = x;
            yy = y - 1;
            while ( this.isInField(xx, yy) && field[xx][yy] <= FieldState.SHIP){
                cells.push({x: xx, y: yy});
                yy--;
            }
            yy = y + 1;
            while (this.isInField(xx, yy) && field[xx][yy] <= FieldState.SHIP){
                cells.push({x: xx, y: yy});
                yy++;
            }
            return cells;
        },
        canAttackCells: function(){
            var cells = [];
            for (var i = 0; i < 10; i++){
                for (var j = 0; j < 10; j++){
                    cells.push({x: i, y: j});
                }
            }
            return cells;
        },
        cellNumber: function(array, x, y){
            for (var iter = 0; iter < array.length; iter++)
                if (array[iter].x == x && array[iter].y == y)
                    return iter;
            return -1;
        }
    }
}]);
