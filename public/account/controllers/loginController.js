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
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
                    return;
                }
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(res.username, res.rsname, res.password);
            });
      };

      lc.logout = () => {
          AccountFactory.logout()
            .then((res) => {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $scope.setCurrentUser(null, null, null);
            });
      };

      lc.reset = () => {
          lc.loginErr = false;
      };
  });
