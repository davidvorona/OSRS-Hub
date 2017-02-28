angular.module("LoginController", ["ngRoute"])
  .controller("LoginController", function LoginController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const lc = this;
      lc.loginErr = false;
      lc.errorMessage = null;
      lc.credentials = {
          username: "",
          password: ""
      };

      lc.login = (credentials) => {
          AccountFactory.login(credentials)
            .then((res) => {
                if (res.err) {
                    lc.errorMessage = res.err;
                    lc.loginErr = true;
                    return;
                }
                console.log("This user is in db:", res);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(res.username, res.rsname, res.password);
            }, (err) => {
                console.log("Error in LoginController.");
                console.log(err);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
            });
      };

      lc.logout = () => {
          AccountFactory.logout()
            .then((res) => {
                console.log("User logged out.");
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $scope.setCurrentUser(null);
            }, (err) => {
                console.log("Error in LoginController.");
                console.log(err);
            });
      };

      lc.reset = () => {
          lc.loginErr = false;
      };
  });
