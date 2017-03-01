angular.module("FavoritesFactory", ["ngRoute"])
  .factory("FavoritesFactory", () => {
      const dataFactory = {};

      dataFactory.storePlayer = (username, player) => {
          if (localStorage.length >= 5) {
              let tempObj;
              const toLocalStorage = {};
              Object.keys(localStorage).forEach((el) => {
                  tempObj = JSON.parse(localStorage[el]);
                  localStorage.removeItem(el);
                  if (tempObj.order !== 0) {
                      tempObj.order -= 1;
                      toLocalStorage[el] = tempObj;
                  }
              });
              Object.keys(toLocalStorage).forEach((el) => {
                  localStorage.setItem(el, JSON.stringify(toLocalStorage[el]));
              });
          }
          const playerWithOrder = { order: localStorage.length, player };
          const storedObj = JSON.stringify(playerWithOrder);
          localStorage.setItem(username, storedObj);
      };

      dataFactory.getFavorites = () => Object.keys(localStorage);

      dataFactory.chooseFavorite = () => {
          if (localStorage.favoritesChoice) return localStorage.favoritesChoice;
      };

      return dataFactory;
  });
