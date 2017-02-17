angular.module("PlayerFactory", ["ngRoute"])
  .factory("PlayerFactory", ($http) => {
      const dataFactory = {};

      dataFactory.getPlayer = player => $http.get(`/player/${player}`);

      return dataFactory;
  });
