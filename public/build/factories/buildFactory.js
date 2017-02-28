angular.module("BuildFactory", ["ngRoute"])
  .factory("BuildFactory", ($http) => {
      const dataFactory = {};

      dataFactory.getBuild = build =>
          $http.get(`/build/${build.buildName}`, { params: { username: build.username } })
              .then((res) => {
                  console.log(res);
                  return res;
              }, (err) => {
                  console.log("Error in BuildFactory.");
                  return err;
              });

      dataFactory.saveBuild = (buildName, combatToPG) =>
          $http.post(`/build/${buildName}`, combatToPG)
            .then((res) => {
                console.log(res);
                return res;
            }, (err) => {
                console.log("Error in BuildFactory.");
                return err;
            });

      return dataFactory;
  });
