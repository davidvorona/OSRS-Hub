angular.module("AccountFactory", ["ngRoute"])
  .factory("AccountFactory", ($http, Session) => {
      const handleError = (errorCode) => {
          if (errorCode === "23505") return { err: "This username already exists." };
          else if (errorCode === "invalid") return { err: "Your username / password is incorrect." };
          return { err: "There was an error. Please try again." };
      };

      const authService = {};

      authService.isAuthenticated = () =>
          !!Session.id;

      authService.create = credentials =>
          $http.post("/create", credentials)
            .then((res) => {
                console.log(res.status);
                Session.create(res.data.user[0].sessId, res.data.user[0].username,
                  res.data.user[0].rsname);
                return res.data.user[0];
            }, (err) => {
                console.log("Error in AccountFactory.");
                return handleError(err.data[0].code);
            });

      authService.login = credentials =>
          $http.post("/login", credentials)
            .then((res) => {
                // error handling here
                if (res.constraint) return res.constraint;
                Session.create(res.data.user[0].sessId, res.data.user[0].username,
                  res.data.user[0].rsname);
                return res.data.user[0];
            }, (err) => {
                console.log("Error in AccountFactory", err.data[0]);
                return handleError(err.data[0].code);
            });

      authService.logout = username =>
          $http.get("/logout", username)
            .then((res) => {
                Session.destroy();
                return res;
            }, (err) => {
                console.log("Error in AccountFactory.");
                return err;
            });

      authService.modify = changeVal =>
          $http.put("/modify", changeVal)
            .then((res) => {
                Session.destroy();
                Session.create(res.data.user[0].sessId, res.data.user[0].username,
                  res.data.user[0].rsname);
                return res.data.user[0];
            }, (err) => {
                console.log("Error in AccountFactory.");
                return handleError(err.data[0].code);
            });

      return authService;
  });
