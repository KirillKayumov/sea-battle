app.controller('AppCtrl', ['$scope',  '$http', function($scope, $http) {
    $scope.user = {
        email: "",
        password:"",
        remember_me: ""
    };

    $scope.$watch('user.email', function(newValue){
        console.log($scope.user.email);
    });

    $scope.login_user = {email: null, password: null};
    $scope.login_error = {message: null, errors: {}};

    $scope.login = function() {
        $scope.submit({method: 'POST',
            url: '/users/sign_in.json',
            data: {user: {email: $scope.login_user.email, password: $scope.login_user.password}},
            success_message: "You have been logged in.",
            error_entity: $scope.login_error});
    };

    $scope.logout = function() {
        $scope.submit({method: 'DELETE',
            url: '/users/sign_out.json',
            success_message: "You have been logged out.",
            error_entity: $scope.login_error});
    };

    $scope.submit = function(parameters) {
        $scope.reset_messages();

        $http({method: parameters.method,
            url: parameters.url,
            data: parameters.data})
            .success(function(data, status){
                if (status == 201 || status == 204){
                    parameters.error_entity.message = parameters.success_message;
                    $scope.reset_users();
                } else {
                    if (data.error) {
                        parameters.error_entity.message = data.error;
                    } else {
                        // note that JSON.stringify is not supported in some older browsers, we're ignoring that
                        parameters.error_entity.message = "Success, but with an unexpected success code, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
                    }
                }
            })
            .error(function(data, status){
                if (status == 422) {
                    parameters.error_entity.errors = data.errors;
                } else {
                    if (data.error) {
                        parameters.error_entity.message = data.error;
                    } else {
                        // note that JSON.stringify is not supported in some older browsers, we're ignoring that
                        parameters.error_entity.message = "Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
                    }
                }
            });
    };

    $scope.reset_messages = function() {
        $scope.login_error.message = null;
        $scope.login_error.errors = {};
    };

    $scope.reset_users = function() {
        $scope.login_user.email = null;
        $scope.login_user.password = null;
    };


}]);