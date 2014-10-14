app.service('FieldState', function(){
    return {
        KILLED: -4,
        HURT: -3,
        SHIP: -2,
        SHIP_NEAR: -1,
        EMPTY: 0,
        ATTACKED: 1
    }
});
