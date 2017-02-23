angular.module("LoginController", ["ngRoute"])
  .controller("LoginController", function LoginController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const lc = this;
      lc.credentials = {
          username: "",
          password: ""
      };

      lc.login = (credentials) => {
          AccountFactory.login(credentials)
            .then((res) => {
                console.log("This user is in db:", res);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(res.username, res.rsname);
            }, (err) => {
                console.log(`Error: ${err}`);
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
                console.log(`Error: ${err}`);
            });
      };
  });
