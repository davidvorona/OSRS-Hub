angular.module("PlayerController", ["ngRoute"])
  .controller("PlayerController", [
      "$routeParams",
      "authVals",
      "FormatService",
      "PlayerFactory",
      "FavoritesFactory",
  function PlayerController($routeParams, authVals, FormatService, PlayerFactory, FavoritesFactory) { // eslint-disable-line indent, max-len
      const pc = this;
      let playerData;
      pc.playerErr = false;
      pc.errorMessage = null;
      pc.showPlayer = false;
      pc.friendAdded = false;
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
              pc.submit($routeParams.player);   // odds are friends will also be recents
              pc.playerSearch = $routeParams.player;
          }
      };

      pc.submit = (player) => {
          const storedPlayer = player.toLowerCase();
          if (localStorage[storedPlayer]) {
              playerData = JSON.parse(localStorage[storedPlayer]).player;

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
          const playerToPG = FormatService.toPlayerObject(playerInfo);
          playerToPG.dateCreated = FormatService.toPGDate();
          playerToPG.player_id = pc.playerSearch.toLowerCase();
          playerToPG.user_id = authVals.currentUser;
          PlayerFactory.addPlayer(playerToPG)
            .then((res) => {
                if (res.err) {
                    console.log(res.err);
                    return;
                }
                pc.friendAdded = true;
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
          pc.friendAdded = false;
          pc.showPlayer = false;
      };
  }]);
