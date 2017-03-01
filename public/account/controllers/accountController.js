angular.module("AccountController", ["ngRoute"])
  .controller("AccountController", function AccountController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const ac = this;
      ac.errorMessage = null;
      ac.usernameErr = false;
      ac.validated = false;
      ac.userInfo = {
          username: $scope.currentUser,
          rsName: $scope.rsName,
          password: Array($scope.pLen).fill("*").join("")
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
          changeVal.currentUser = $scope.currentUser;
          AccountFactory.modify(changeVal)
          .then((res) => {
              if (changeVal.type === "password") {
                  $scope.setCurrentUser(res.username, res.rsname, res.password); // in case password changes
              } else {
                  if (res.err) {
                      ac.errorMessage = res.err;
                      ac.usernameErr = true;
                      return;
                  }
                  $scope.setCurrentUser(res.username, res.rsname, $scope.pLen);
              }
          });
      };

      ac.logout = () => {
          AccountFactory.logout()
            .then(() => {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $scope.setCurrentUser(null);
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
