angular.module("PlayerController", ["ngRoute"])
  .controller("PlayerController", function PlayerController(PlayerFactory, FavoritesFactory) {
      const pc = this;
      let playerData;
      pc.playerErr = false;
      pc.errorMessage = null;
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
                .then((res) => {
                    if (res.err) {
                        pc.errorMessage = res.err;
                        pc.playerErr = true;
                        return;
                    }
                    playerData = res.data;
                    pc.playerInfo = playerData;
                    pc.displayCollection = playerData;
                    pc.showPlayer = true;
                });
          }
      };

      pc.removeFromFavorites = () => {
          FavoritesFactory.removePlayer(pc.playerSearch);
      };

      pc.defaultSort = {
          type: () => pc.playerInfo.indexOf(pc.playerInfo.type)
      };

      pc.reset = () => {
          pc.playerErr = false;
      };
  });
