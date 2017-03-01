angular.module("PlayerController", ["ngRoute"])
  .controller("PlayerController", function PlayerController(PlayerFactory, FavoritesFactory) {
      const pc = this;
      let playerData;
      pc.showPlayer = false;
      pc.displayCollection = {};

      pc.favoriteSelected = () => {
          if (localStorage.favoritesChoice) {
              pc.playerSearch = FavoritesFactory.chooseFavorite();
              localStorage.removeItem("favoritesChoice");
              playerData = JSON.parse(localStorage[pc.playerSearch]).player;

              pc.playerInfo = playerData;
              pc.displayCollection = playerData;
              pc.showPlayer = true;
          }
      };

      pc.submit = () => {
          if (localStorage[pc.playerSearch]) {
              playerData = JSON.parse(localStorage[pc.playerSearch]).player;

              pc.playerInfo = playerData;
              pc.displayCollection = playerData;
              pc.showPlayer = true;
          } else {
              PlayerFactory.getPlayer(pc.playerSearch)
                .then((response) => {
                    playerData = response.data;
                    FavoritesFactory.storePlayer(pc.playerSearch, playerData);

                    pc.playerInfo = playerData;
                    pc.displayCollection = playerData;
                    pc.showPlayer = true;
                }, (error) => {
                    console.log("Error in PlayerController.");
                    console.log(error);
                });
          }
      };

      pc.removeFromFavorites = () => {
          if (pc.playerSearch in localStorage) localStorage.removeItem(pc.playerSearch);
          else console.log("You haven't saved this player!");
      };

      pc.defaultSort = {
          type: () => pc.playerInfo.indexOf(pc.playerInfo.type)
      };
  });
