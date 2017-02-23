angular.module("CreateController", ["ngRoute"])
  .controller("CreateController", function CreateController($scope, $rootScope, AUTH_EVENTS, AccountFactory) {
      const cc = this;
      cc.credentials = {
          username: "",
          password: "",
          rsName: ""
      };

      cc.create = (credentials) => {
          const userObj = credentials;
          userObj.dateCreated = new Date().toISOString().slice(0, 19).replace("T", " ");
          AccountFactory.create(userObj)
          .then((res) => {
              console.log("This user is in db: ", res);
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(res.username, res.rsname);
          }, (err) => {
              console.log(`Error: ${err}`);
              $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
          });
      };

      cc.checkPassword = (password1, password2) => {
          if (password1 !== password2) cc.happyPassword = { "background-color": "red", "opacity": 0.5 };
          else if (password1 === null) cc.happyPassword = { "background-color": "white", "opacity": 1 }; // needs fix
          else cc.happyPassword = { "background-color": "green", "opacity": 0.5 };
      };
  });
