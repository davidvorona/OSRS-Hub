angular.module("LoginController", ["ngRoute"])
  .controller("LoginController", function LoginController(AccountFactory) {
      const lc = this;
      lc.credentials = {
          username: "",
          password: ""
      };

      lc.login = (credentials) => {
          AccountFactory.login(credentials)
            .then((res) => {
                console.log("This user is in db.");
            }, (err) => {
                console.log(`Error: ${err}`);
            });
      };
  });
