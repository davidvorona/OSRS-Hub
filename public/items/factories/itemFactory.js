angular.module("ItemFactory", ["ngRoute"])
  .factory("ItemFactory", ["$http", function($http) {
      const handleError = (error) => {
          if (error.status === 500) return { err: "500: There was a problem with our server. Please try again." };
          else if (error.status === 422) return { err: "This item doesn't exist!" };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getItem = item => $http.get(`/item/${item}`)
        .then((res) => { // eslint-disable-line arrow-body-style
            return res;
        }, err => handleError(err));

      dataFactory.graphConfig = () => { // eslint-disable-line arrow-body-style
          return {
              dailyTraceName: "Daily",
              avgTraceName: "Average",
              GRAPH: document.getElementById("item-graph"),
              width: window.innerWidth,
              height: window.innerHeight,
              layout: {
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  yaxis: { title: "Price (gp)" },
                  xaxis: { title: "Time (days)" },
                  autosize: true,
                  width: window.innerWidth * 0.5,
                  height: window.innerHeight * 0.5,
                  font: {
                      family: "Fjalla One, sans-serif",
                      size: 12,
                      color: "black"
                  },
                  margin: { t: 0, b: 50, r: 0, l: 50 }
              }
          };
      };

      return dataFactory;
  }]);
