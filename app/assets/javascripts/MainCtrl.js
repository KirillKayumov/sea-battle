app.controller('MainCtrl', ['$scope', function($scope){
    $scope.yourField = [];
    $scope.enemyField = [];
    $scope.yourShips = ["", 4, 3, 2, 1];
    $scope.takedShip = -1;
    $scope.hoveredCells = [];
    $scope.orientation = false;
    $scope.takeShip = function(num){
        $scope.takedShip = num;
    };

    $scope.clearShipHover = function () {
        $scope.hoveredCells = [];
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
        $scope.clearShipHover();
        if ($scope.takedShip == -1)
            return;
        if (!$scope.orientation) {
            for (var i = y; i < y + $scope.takedShip; i++) {
                $scope.hoveredCells[x][i] = 1;
            }
        } else{
            for (var i = x; i < x + $scope.takedShip; i++) {
                $scope.hoveredCells[i][y] = 1;
            }
        }
    };

    $scope.isHoveredCell = function(x, y){
        for (var i = 0; i < $scope.hoveredCells.length; i++){
            if (x == $scope.hoveredCells[i].x && y == $scope.hoveredCells[i].y)
                return true;
        }
    };

    for (var x = 0; x < 10; x++){
        $scope.yourField[x] = [];
        $scope.enemyField[x] = [];
        for (var y = 0; y < 10; y++){
            $scope.yourField[x][y] = 0;
            $scope.enemyField[x][y] = 0;
        }
    }
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

}]);

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