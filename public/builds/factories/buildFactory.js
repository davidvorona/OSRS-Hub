angular.module("BuildFactory", ["ngRoute"])
  .factory("BuildFactory", [
      "$http",
      "BuildCalculator",
  function($http, BuildCalculator) {  // eslint-disable-line indent
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

      const addCombatLvl = (data) => {
          data.forEach((el) => {
              el.combatLvl = BuildCalculator.osCombatLevel(el);
          });
          return data;
      };

      const dataFactory = {};

      dataFactory.getBuild = build =>
          $http.get(`/build/${build.buildName}`, { params: { username: build.username } })
            .then((res) => { // eslint-disable-line arrow-body-style
                return res;
            }, err => handleError(err));

      dataFactory.saveBuild = (buildName, combatToPG) =>
          $http.post(`/build/${buildName}`, combatToPG)
            .then((res) => {  // eslint-disable-line arrow-body-style
                return res;
            }, err => handleError(err));

      dataFactory.getBuildsList = currentUser =>
          $http.get("/builds", { params: { username: currentUser } })
            .then(res => addCombatLvl(res.data),
                err => handleError(err));

      return dataFactory;
  }]);
