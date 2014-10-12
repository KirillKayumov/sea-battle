var app = angular.module('app', [  'ngAnimate']);

app.service('api', function(){
    return{
        url: function(part){
            return "http://whispering-earth-7711.herokuapp.com/" + part;
        }
    }
});
