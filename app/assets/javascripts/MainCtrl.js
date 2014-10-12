app.controller('MainCtrl', function($scope){
    $scope.yourField = [];
    $scope.enemyField = [];
    for (var x = 0; x < 10; x++){
        $scope.yourField[x] = [];
        $scope.enemyField[x] = [];
        for (var y = 0; y < 10; y++){
            $scope.yourField[x][y] = 0;
            $scope.enemyField[x][y] = 0;
        }
    }
    $scope.digitsHeader = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.lettersHeader = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    $scope.damage = function($event, x, y){
        if ($scope.enemyField[x][y] != 1){
            $scope.enemyField[x][y] = 1;
            $scope.enemyField[x][y] = 2;

            $($event.target).removeClass('fieldCell');
        }
    };

    //найти рядом стоящие клетки, текущего коробля
    function findConnectedCells(x, y, field){
        var cells = [];
        cells.push({x: x, y: y});
        var xx = x - 1;
        var yy = y;
        while (field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            xx--;
        }
        xx = x + 1;
        while (field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            xx++;
        }

        xx = x;
        yy = y - 1;
        while (field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            yy--;
        }
        yy = y + 1;
        while (field[xx][yy] == 1){
            cells.push({x: xx, y: yy});
            yy++;
        }
        return cells;
    }

});

app.service('II', function(){
    var yourField = [];
    var enemyField = [];
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
        }
    }

});