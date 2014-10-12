var app = angular.module('app', ['ngAnimate-animate.css', 'ngRoute']);

app.service('api', function(){
    return{
        url: function(part){
            return "http://whispering-earth-7711.herokuapp.com/" + part;
        }
    }
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'partials/main.html',
            controller: 'MainPageCtrl',
            name: 'main'
        }).otherwise({
            redirectTo:'/main'
        });

//    $locationProvider.html5Mode(true);
});