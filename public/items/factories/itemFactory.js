angular.module("ItemFactory", ["ngRoute"])
  .factory("ItemFactory", ($http) => {
      const dataFactory = {};

      dataFactory.getItem = item => $http.get(`/item/${item}`);

      return dataFactory;
  });
