angular.module("BuildFactory", ["ngRoute"])
  .factory("BuildFactory", ($http) => {
      const handleError = (errorCode) => {
          if (errorCode) return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getBuild = build =>
          $http.get(`/build/${build.buildName}`, { params: { username: build.username } })
              .then((res) => {
                  console.log(res);
                  return res;
              }, (err) => {
                  console.log(err);
                  return handleError(500);
              });

      dataFactory.saveBuild = (buildName, combatToPG) =>
          $http.post(`/build/${buildName}`, combatToPG)
            .then((res) => {
                console.log(res);
                return res;
            }, (err) => {
                console.log(err);
                return handleError(500);
            });

      return dataFactory;
  });
