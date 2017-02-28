// controller instantiated below epochToDate() and
// plotPrice() helper functions

const epochToDate = (data) => {
    let date;
    const eDates = Object.keys(data);
    const dates = [];
    for (let i = 0; i < eDates.length; i += 1) {
        date = new Date(parseInt(eDates[i]));
        date = date.toISOString();
        dates.push(date);
    }
    return dates;
};

let width = window.innerWidth;
let height = window.innerHeight;

const plotPrice = (daily, average, itemName) => {
    const dailyTraceName = "Daily";
    const avgTraceName = "Average";
    const GRAPH = document.getElementById("item-graph");
    width = window.innerWidth;
    height = window.innerHeight;
    const layout = {
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        yaxis: { title: "Price (gp)" },
        xaxis: { title: "Time (days)" },
        autosize: true,
        width: width * 0.5,
        height: height * 0.5,
        font: {
            family: "Fjalla One, sans-serif",
            size: 12,
            color: "black"
        },
        margin: { t: 0, b: 50, r: 0, l: 50 }
    };

    Plotly.newPlot(GRAPH, [
        {
            x: epochToDate(daily),
            y: Object.values(daily),
            name: dailyTraceName,
            mode: "lines",
            line: {
                width: 3
            }
        }
    ],
    layout,
    { displayModeBar: false });

    Plotly.plot(GRAPH, [
        {
            x: epochToDate(average),
            y: Object.values(average),
            name: avgTraceName,
            mode: "lines",
            line: {
                width: 3
            }
        }
    ],
    layout,
    { displayModeBar: false });
};

// registers controller, is ngRoute necessary here?
// used es5 function expression here b/c
// arrow function screwed up context of "this"
angular.module("ItemController", ["ngRoute"])
  .controller("ItemController", function ItemController(ItemFactory) {
      const vm = this;
      let itemData;
      let itemInfo;
      let priceData;
      vm.showButton = false;
      vm.showInfo = false;
      vm.itemArray = [];
      vm.i = 0;

      vm.submit = () => {
          ItemFactory.getItem(vm.itemSearch)
            .then((response) => {
                itemData = response.data;

                itemInfo = JSON.parse(itemData.info.body);
                priceData = JSON.parse(itemData.price.body);

                vm.itemArray.push({ info: itemInfo, price: priceData });
                vm.showInfo = true;
                if (vm.itemArray.length > 1) vm.showButton = true;
                vm.i = vm.itemArray.length - 1;
                plotPrice(priceData.daily, priceData.average, itemInfo.item.name);
            }, (error) => {
                console.log("Error in ItemController");
                console.log(error);
            });
      };

      vm.delete = () => {
          Plotly.deleteTraces("item-graph", [-2, -1]);
          vm.itemArray.splice(vm.i, 1);
          if (vm.itemArray.length === 1) vm.showButton = false;
          if (vm.i === vm.itemArray.length) vm.i = 0;
          plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };

      vm.nextItem = () => {
          if (vm.i === vm.itemArray.length - 1) vm.i = 0;
          else vm.i += 1;
          plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };

      vm.previousItem = () => {
          if (vm.i === 0) vm.i = vm.itemArray.length - 1;
          else vm.i -= 1;
          plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };
  });
