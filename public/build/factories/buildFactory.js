angular.module("BuildFactory", ["ngRoute"])
  .factory("BuildFactory", ($http) => {
      const dataFactory = {};

      dataFactory.getBuild = build => $http.get(`/build/${build}`);

      return dataFactory;
  });
