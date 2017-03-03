angular.module("ItemFactory", ["ngRoute"])
  .factory("ItemFactory", ($http) => {
      const handleError = (error) => {
          console.log(error);
          if (error.data[0].code) {
              // just in case: no table set up yet
              const pgErr = error.data[0].code;
              return { err: "Unhandled pgErr." };
          }
          if (error.status === 500) return { err: "500: There was a problem with our server. Please try again." };
          return { err: "There was an error. Please try again." };
      };

      const dataFactory = {};

      dataFactory.getItem = item => $http.get(`/item/${item}`)
        .then((res) => {
            return res;
        }, err => handleError(err));

      dataFactory.graphConfig = () => {
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
                  width: this.width * 0.5,
                  height: this.height * 0.5,
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
  });
