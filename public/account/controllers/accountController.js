angular.module("AccountController", ["ngRoute"])
  .controller("AccountController", function AccountController(
  $scope, $rootScope, AUTH_EVENTS, authVals, AccountFactory) {
      const ac = this;
      ac.errorMessage = null;
      ac.usernameErr = false;
      ac.validated = false;
      ac.user = {
          username: authVals.currentUser,
          rsName: authVals.rsName,
          pLen: Array(authVals.pLen).fill("*").join("")
      };

      ac.changeInfo = {
          username: "",
          password: "",
          password2: "",
          rsName: ""
      };

      ac.modify = (type, changeInfo) => {
          const changeVal = {};
          ac.validated = false;
          changeVal.type = type;
          changeVal.value = changeInfo[type];
          changeVal.currentUser = authVals.currentUser;
          AccountFactory.modify(changeVal)
          .then((res) => {
              if (res.err) {
                  ac.errorMessage = res.err;
                  ac.usernameErr = true;
              } else if (changeVal.type === "password") {
                  authVals.pLen = res.password;
              }
              ac.user.username = authVals.currentUser;
              ac.user.rsName = authVals.rsName;
              ac.user.pLen = Array(authVals.pLen).fill("*").join("");
          });
      };

      ac.logout = () => {
          AccountFactory.logout()
            .then(() => {
                $rootScope.isLoggedIn = true;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
      };

      ac.checkPassword = (password1, password2) => {
          if (password1 !== password2) {
              ac.validated = false;
              ac.happyPassword = { "background-color": "red", "opacity": 1 };
          } else if (password1 === null) {
              ac.validated = false;
              ac.happyPassword = { "background-color": "white", "opacity": 1 }; // needs fix
          } else {
              ac.validated = true;
              ac.happyPassword = { "background-color": "green", "opacity": 1 };
          }
      };

      ac.reset = () => {
          ac.usernameErr = false;
      };
  });
