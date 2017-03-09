angular.module("LoginController", ["ngRoute"])
  .controller("LoginController", function LoginController($scope, $rootScope, authVals, AUTH_EVENTS, AccountFactory) {
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
                lc.currentUser = authVals.currentUser;
                $rootScope.isLoggedIn = true;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            });
      };

      lc.logout = () => {
          AccountFactory.logout()
            .then(() => {
                $rootScope.isLoggedIn = false;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
      };

      lc.reset = () => {
          lc.loginErr = false;
      };

      $rootScope.$on("login-success", () => {   // otherwise $scope's currentUser not set on auto-login
          if (!lc.currentUser) {
              lc.currentUser = authVals.currentUser;
          }
      });
  });
