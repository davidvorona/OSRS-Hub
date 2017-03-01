angular.module("PlayerFactory", ["ngRoute"])
  .factory("PlayerFactory", ($http, FavoritesFactory) => {
      const handleError = (errorCode) => {
          if (errorCode === 500) return { err: "This player does not exist." };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getPlayer = player => $http.get(`/player/${player}`)
        .then((res) => {
            FavoritesFactory.storePlayer(player, res.data);
            return res;
        }, (err) => {
            console.log("Error in PlayerFactory.");
            return handleError(err.status);
        });

      return dataFactory;
  });
