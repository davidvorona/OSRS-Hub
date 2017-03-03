angular.module("BuildFactory", ["ngRoute"])
  .factory("BuildFactory", ($http) => {
      const handleError = (error) => {
          console.log(error);
          if (error.data[0].code) {
              const pgErr = error.data[0].code;
              if (pgErr === "23505") return { err: "You have already saved this build!" };    // won't work yet
              else if (pgErr === "invalid") return { err: "422: This build does not exist." };
              return { err: "Unhandled pgErr." };
          }
          if (error.status === 500) return { err: "500: There was a problem with our server. Please try again." };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getBuild = build =>
          $http.get(`/build/${build.buildName}`, { params: { username: build.username } })
              .then((res) => {
                  console.log(res);
                  return res;
              }, err => handleError(err));

      dataFactory.saveBuild = (buildName, combatToPG) =>
          $http.post(`/build/${buildName}`, combatToPG)
            .then((res) => {
                console.log(res);
                return res;
            }, err => handleError(err));

      return dataFactory;
  });
