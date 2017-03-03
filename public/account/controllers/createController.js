angular.module("CreateController", ["ngRoute"])
  .controller("CreateController", function CreateController(
    $rootScope, authVals, FormatService, AUTH_EVENTS, AccountFactory) {
      const cc = this;
      cc.createErr = false;
      cc.errorMessage = null;
      cc.validated = false;
      cc.currentUser = authVals.currentUser;
      cc.credentials = {
          username: "",
          password: "",
          rsName: ""
      };

      cc.create = (credentials) => {
          const userObj = credentials;
          cc.validated = false;
          userObj.dateCreated = FormatService.toPGDate();
          AccountFactory.create(userObj)
            .then((res) => {
                if (res.err) {
                    cc.errorMessage = res.err;
                    cc.createErr = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
                    return;
                }
                $rootScope.isLoggedIn = true;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            });
      };

      cc.checkPassword = (password1, password2) => {
          cc.createErr = false;
          if (password1 !== password2) {
              cc.validated = false;
              cc.happyPassword = { "background-color": "red", "opacity": 0.5 };
          } else if (password1 === null) {
              cc.validated = false;
              cc.happyPassword = { "background-color": "white", "opacity": 1 }; // needs fix
          } else {
              cc.validated = true;
              cc.happyPassword = { "background-color": "green", "opacity": 0.5 };
          }
      };

      cc.reset = () => {
          cc.createErr = false;
      };
  });
