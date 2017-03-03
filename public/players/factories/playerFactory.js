angular.module("PlayerFactory", ["ngRoute"])
  .factory("PlayerFactory", ($http, FavoritesFactory) => {
      const handleError = (error) => {
          console.log(error);
          if (error.data[0].code) {
              const pgErr = error.data[0].code;
              if (pgErr === "23505") return { err: "You are already friends with this player!" };
              return { err: "Unhandled pgErr." };
          }
          if (error.status === 500) return { err: "500: There was a problem with our server. Please try again." };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.addPlayer = player => $http.post("/player", player)
        .then((res) => {
            return res;
        }, err => handleError(err));

      dataFactory.getPlayer = player => $http.get(`/player/${player}`)
        .then((res) => {
            FavoritesFactory.storePlayer(player, res.data);
            return res;
        }, err => handleError(err));

      return dataFactory;
  });
