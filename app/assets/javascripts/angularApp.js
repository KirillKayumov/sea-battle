var app = angular.module('app', [  'ngAnimate']);

app.service('api', function(){
    return{
        url: function(part){
            return "http://whispering-earth-7711.herokuapp.com/" + part;
        }
    }
});


app.config([
    "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);