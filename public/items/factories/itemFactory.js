angular.module("ItemFactory", ["ngRoute"])
  .factory("ItemFactory", ($http) => {
      const handleError = (errorCode) => {
          if (errorCode) return { err: "There was an error. Please try again." };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getItem = item => $http.get(`/item/${item}`)
        .then((res) => {
            console.log(res);
            return res;
        }, (err) => {
            console.log(err);
            return handleError(500);
        });

      return dataFactory;
  });
