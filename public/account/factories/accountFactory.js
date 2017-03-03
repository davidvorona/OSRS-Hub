angular.module("AccountFactory", ["ngRoute"])
  .factory("AccountFactory", ($http, $rootScope, UserService, authVals, AUTH_EVENTS) => {
      const handleError = (error) => {
          console.log(error);
          if (error.data[0].code) {
              const pgErr = error.data[0].code;
              if (pgErr === "23505") return { err: "This username already exists." };
              else if (pgErr === "invalid") return { err: "Your username / password is incorrect." };
              return { err: "Unhandled pgErr." };
          }
          if (error.status === 500) return { err: "500: this player does not exist." };
          return { err: "There was an error. Please try again." };
      };

      const authService = {};

      authService.create = credentials =>
          $http.post("/create", credentials)
            .then((res) => {
                UserService.create(
                  res.data.user[0].sessId,
                  res.data.user[0].username,
                  res.data.user[0].rsname,
                  res.data.user[0].password
                );
                return res.data.user[0];
            }, err => handleError(err));

      authService.login = credentials =>
          $http.post("/login", credentials)
            .then((res) => {
                if (res.constraint) return res.constraint; // this needs to be fixed
                UserService.create(
                  res.data.user[0].sessId,
                  res.data.user[0].username,
                  res.data.user[0].rsname,
                  res.data.user[0].password
                );
                return res.data.user[0];
            }, err => handleError(err));

      authService.autoLogin = () => {
          $http.get("/cookies")
            .then((res) => {
                if (res.data.user) {
                    UserService.create(
                      res.data.user[0].sessId,
                      res.data.user[0].username,
                      res.data.user[0].rsname,
                      res.data.user[0].password
                    );
                    $rootScope.isLoggedIn = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    return res;
                }
            }, err => handleError(err));
      };

      authService.logout = username =>
          $http.get("/logout", username)
            .then((res) => {
                UserService.destroy();
                return res;
            }, err => handleError(err));

      authService.modify = changeVal =>
          $http.put("/modify", changeVal)
            .then((res) => {
                authVals.currentUser = res.data.user[0].username;
                authVals.rsName = res.data.user[0].rsname;
                return res.data.user[0];
            }, err => handleError(err));

      return authService;
  });
