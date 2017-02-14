angular.module("PlayerFactory", ["ngRoute"])
  .factory("PlayerFactory", ($http) => {
      // can I make this dynamic? or will I need to set to eventual domain?
      const urlBase = "http://localhost:3000/player/";
      const dataFactory = {};

      dataFactory.getPlayer = player => $http.get(urlBase + player);

      return dataFactory;
  });
