angular.module("AccountFactory", ["ngRoute"])
  .factory("AccountFactory", ($http, Session) => {
      const authService = {};

      authService.create = credentials =>
          $http.post("/create", credentials)
            .then((res) => {
                return res;
            }, (err) => {
                console.log(`Error: ${err}`);
            });

      // this Session functions as a shared state across routes,
      // will still need an express session
      authService.login = credentials =>
          $http.post("/login", credentials)
            .then((res) => {
                if (res.constraint) return res.constraint;
                Session.create(1, res.username);
            }, (err) => {
                console.log(`Factory error: ${err}`);
            });

      return authService;
  });
