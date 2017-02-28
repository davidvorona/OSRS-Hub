angular.module("AccountFactory", ["ngRoute", "ngCookies"])
  .factory("AccountFactory", ($http, $cookies, Session) => {
      const authService = {};

      authService.isAuthenticated = () =>
          !!Session.id;

      authService.create = credentials =>
          $http.post("/create", credentials)
            .then((res) => {
                Session.create(res.data.user[0].sessId, res.data.user[0].username,
                  res.data.user[0].rsname);
                return res.data.user[0];
            }, (err) => {
                console.log("Error in AccountFactory.");
                return err;
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
                console.log("Error in AccountFactory.");
                return err;
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
                return err;
            });

      return authService;
  });
