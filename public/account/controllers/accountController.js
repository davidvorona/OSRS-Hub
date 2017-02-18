angular.module("AccountController", ["ngRoute"])
  .controller("AccountController", function AccountController(AccountFactory) {
      const ac = this;
      ac.credentials = {
          username: "",
          password: ""
      };

      ac.create = (credentials) => {
          const userObj = credentials;
          userObj.dateCreated = new Date().toISOString().slice(0, 19).replace("T", " ");
          console.log(userObj.dateCreated);
          AccountFactory.create(userObj)
          .then((res) => {
              console.log("This user is in db: ", res);
              // it worked! front-end code now
          }, (err) => {
              console.log(`Error: ${err}`);
          });
      };

      ac.checkPassword = (password1, password2) => {
          if (password1 !== password2 ) ac.happyPassword = { "background-color": "red", "opacity": 0.5 };
          // doesn't work
          else if (password1 === null) ac.happyPassword = { "background-color": "white", "opacity": 1 };
          else ac.happyPassword = { "background-color": "green", "opacity": 0.5 };
      };
  });
