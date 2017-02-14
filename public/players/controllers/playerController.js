const toLocalStorage = (username, player) => {
    if (localStorage.length <= 5) {
        const playerWithOrder = { order: localStorage.length, player };
        const storedObj = JSON.stringify(playerWithOrder);
        localStorage.setItem(username, storedObj);
    }
};

angular.module("PlayerController", ["ngRoute"])
  .controller("PlayerController", function PlayerController(PlayerFactory, FavoritesFactory) {
      const pc = this;
      let playerData;
      pc.showPlayer = false;
      pc.displayCollection = {};

      // TODO: 1. this only works when navigating from different tab (not "PLAYERS")
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
                    toLocalStorage(pc.playerSearch, playerData);

                    pc.playerInfo = playerData;
                    pc.displayCollection = playerData;
                    pc.showPlayer = true;
                });
          }
      };

      pc.defaultSort = {
          type: () => pc.playerInfo.indexOf(pc.playerInfo.type)
      };
  });
