angular.module("FavoritesController", ["ngRoute"])
  .controller("FavoritesController", [
      "$route",
      "FavoritesFactory",
  function FavoritesController($route, FavoritesFactory) { // eslint-disable-line indent, max-len
      const fc = this;

      fc.displayFaves = () => {
          const tempFaves = FavoritesFactory.getFavorites();
          if (localStorage.favoritesChoice) {
              const i = tempFaves.indexOf("favoritesChoice");
              tempFaves.splice(i, 1);
          }
          if (tempFaves.length === 0) fc.favorites = ["No saved players."];
          else fc.favorites = tempFaves;
      };

      fc.choice = (player) => {
          $route.reload(); // added so 'Players' route reloads
          localStorage.setItem("favoritesChoice", player);
      };
  }]);
