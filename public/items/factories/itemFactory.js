angular.module("ItemFactory", ["ngRoute"])
  .factory("ItemFactory", ($http) => {
      // can I make this dynamic? or will I need to set to eventual domain?
      const urlBase = "http://localhost:3000/item/";
      const dataFactory = {};

      dataFactory.getItem = item => $http.get(urlBase + item);

      return dataFactory;
  });
