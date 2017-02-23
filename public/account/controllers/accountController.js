angular.module("AccountController", ["ngRoute"])
  .controller("AccountController", function AccountController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const ac = this;
      ac.credentials = {
          username: "",
          password: "",
          rsName: ""
      };

      ac.create = (credentials) => {
          const userObj = credentials;
          userObj.dateCreated = new Date().toISOString().slice(0, 19).replace("T", " ");
          AccountFactory.create(userObj)
          .then((res) => {
              console.log("This user is in db: ", res);
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(res.username);
          }, (err) => {
              console.log(`Error: ${err}`);
              $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
          });
      };

      ac.checkPassword = (password1, password2) => {
          if (password1 !== password2) ac.happyPassword = { "background-color": "red", "opacity": 0.5 };
          else if (password1 === null) ac.happyPassword = { "background-color": "white", "opacity": 1 }; // needs fix
          else ac.happyPassword = { "background-color": "green", "opacity": 0.5 };
      };
  });
