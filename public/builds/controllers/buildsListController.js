angular.module("BuildsListController", ["ngRoute"])
  .controller("BuildsListController", [
      "$scope",
      "$rootScope",
      "authVals",
      "BuildFactory",
  function BuildsListController($http, $rootScope, authVals, BuildFactory) {  // eslint-disable-line indent, max-len
      const bc = this;
      bc.buildsList = null;

      bc.displayBuilds = () => {
          if ($rootScope.isLoggedIn) {
              BuildFactory.getBuildsList(authVals.currentUser)
                .then((res) => {
                    if (res.err) {
                        console.log(res.err);
                        return;
                    }
                    bc.buildsList = res;
                });
          }
      };

      bc.deleteBuild = (buildName, i) => {
          BuildFactory.deleteBuild(authVals.currentUser, buildName)
            .then((res) => {
                if (res.err) {
                    console.log(res.err);
                    return;
                }
                bc.buildsList.splice(i, 1);
            });
      };

      $rootScope.$on("login-success", () => {   // solves race condition issue
          if (bc.buildsList === null) {
              bc.displayBuilds();
          }
      });
  }]);
