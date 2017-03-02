const toPlayerObject = (data) => {
    const obj = {};
    data.forEach((el) => {
        obj[el.type] = el.level;
    });
    return obj;
};

angular.module("PlayerController", ["ngRoute"])
  .controller("PlayerController", function PlayerController($routeParams, authVals, PlayerFactory, FavoritesFactory) {
      const pc = this;
      let playerData;
      pc.playerErr = false;
      pc.errorMessage = null;
      pc.showPlayer = false;
      pc.displayCollection = {};

      pc.playerSelected = () => {
          if (localStorage.favoritesChoice) {
              pc.playerSearch = FavoritesFactory.chooseFavorite();
              localStorage.removeItem("favoritesChoice");
              playerData = JSON.parse(localStorage[pc.playerSearch]).player;

              pc.playerInfo = playerData;
              pc.displayCollection = playerData;
              pc.showPlayer = true;
          } else if ($routeParams.player) {
              PlayerFactory.getPlayer($routeParams.player)
                .then((res) => {
                    if (res.err) {
                        pc.errorMessage = res.err;
                        pc.playerErr = true;
                        return;
                    }
                    playerData = res.data;
                    pc.playerSearch = $routeParams.player;
                    pc.playerInfo = playerData;
                    pc.displayCollection = playerData;
                    pc.showPlayer = true;
                });
          }
      };

      pc.submit = (player) => {
          if (localStorage[player]) {
              playerData = JSON.parse(localStorage[player]).player;

              pc.playerInfo = playerData;
              pc.displayCollection = playerData;
              pc.showPlayer = true;
          } else {
              PlayerFactory.getPlayer(player)
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

      pc.save = (playerInfo) => {
          const playerToPG = toPlayerObject(playerInfo);
          playerToPG.dateCreated = new Date().toISOString().slice(0, 19).replace("T", " ");
          playerToPG.player_id = pc.playerSearch;
          playerToPG.user_id = authVals.currentUser;
          PlayerFactory.addPlayer(playerToPG)
            .then((res) => {
                if (res.err) {
                    console.log(res.err);
                    return;
                }
                console.log(res);
            });
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
