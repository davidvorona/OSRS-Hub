angular.module("FriendsController", ["ngRoute"])
  .controller("FriendsController", function FriendsController($http, $rootScope, authVals, FriendsFactory) {
      const fc = this;
      fc.friendsList = null;

      fc.displayFriends = () => {
          if ($rootScope.isLoggedIn) {
              FriendsFactory.getFriends(authVals.currentUser)
                .then((res) => {
                    if (res.err) {
                        console.log(res.err);
                        return;
                    }
                    fc.friendsList = res;
                });
          }
      };

      $rootScope.$on("login-success", () => {   // solves race condition issue
          if (fc.friendsList === null) {
              fc.displayFriends();
          }
      });
  });

  // make a formatter module?
  // format all rsname to Uppercase firstletteronly
  // see if friendlist scrolls

  // STAY BELOW 200MB http://stackoverflow.com/questions/9203306/how-much-memory-before-it-becomes-rude

  // TODO: website breaks on /players/Vijuhas
