angular.module("AccountController", ["ngRoute"])
  .controller("AccountController", function AccountController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const ac = this;
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
          changeVal.type = type;
          changeVal.value = changeInfo[type];
          changeVal.currentUser = $scope.currentUser;
          AccountFactory.modify(changeVal)
          .then((res) => {
              console.log("The user has been updated: ", res);
              if (changeVal.type === "password") {
                  return $scope.setCurrentUser(res.username, res.rsname, res.password); // in case password changes
              }
              return $scope.setCurrentUser(res.username, res.rsname, $scope.pLen);
          }, (err) => {
              console.log("Error in AccountController.");
              console.log(err);
          });
      };

      ac.logout = () => {
          AccountFactory.logout()
            .then((res) => {
                console.log("User logged out.");
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $scope.setCurrentUser(null);
            }, (err) => {
                console.log("Error in AccountController.");
                console.log(err);
            });
      };

      ac.checkPassword = (password1, password2) => {
          if (password1 !== password2) ac.happyPassword = { "background-color": "red", "opacity": 1 };
          else if (password1 === null) ac.happyPassword = { "background-color": "white", "opacity": 1 }; // needs fix
          else ac.happyPassword = { "background-color": "green", "opacity": 1 };
      };
  });