angular.module("BuildsListController", ["ngRoute"])
  .controller("BuildsListController", function BuildsListController($http, $rootScope, authVals, BuildFactory) {
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
                    console.log(bc.buildsList);
                });
          }
      };

      $rootScope.$on("login-success", () => {   // solves race condition issue
          if (bc.buildsList === null) {
              bc.displayBuilds();
          }
      });
  });
