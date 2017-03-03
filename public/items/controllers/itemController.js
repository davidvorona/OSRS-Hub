angular.module("ItemController", ["ngRoute"])
  .controller("ItemController", function ItemController(FormatService, ItemFactory) {
      const vm = this;
      let itemData;
      let itemInfo;
      let priceData;
      const config = ItemFactory.graphConfig();
      vm.showButton = false;
      vm.showInfo = false;
      vm.itemArray = [];
      vm.i = 0;

      // i'd like a better place for this
      vm.plotPrice = (daily, average) => {
          Plotly.newPlot(config.GRAPH, [
              {
                  x: FormatService.epochToDate(daily),
                  y: Object.values(daily),
                  name: config.dailyTraceName,
                  mode: "lines",
                  line: {
                      width: 3
                  }
              }
          ],
          config.layout,
          { displayModeBar: false });

          Plotly.plot(config.GRAPH, [
              {
                  x: FormatService.epochToDate(average),
                  y: Object.values(average),
                  name: config.avgTraceName,
                  mode: "lines",
                  line: {
                      width: 3
                  }
              }
          ],
          config.layout,
          { displayModeBar: false });
      };

      vm.submit = () => {
          ItemFactory.getItem(vm.itemSearch)
            .then((res) => {
                if (res.err) {
                    console.log(res.err);
                    return;
                }
                itemData = res.data;

                itemInfo = JSON.parse(itemData.info.body);
                priceData = JSON.parse(itemData.price.body);

                vm.itemArray.push({ info: itemInfo, price: priceData });
                vm.showInfo = true;
                if (vm.itemArray.length > 1) vm.showButton = true;
                vm.i = vm.itemArray.length - 1;
                vm.plotPrice(priceData.daily, priceData.average, itemInfo.item.name);
            });
      };

      vm.delete = () => {
          Plotly.deleteTraces("item-graph", [-2, -1]);
          vm.itemArray.splice(vm.i, 1);
          if (vm.itemArray.length === 1) vm.showButton = false;
          if (vm.i === vm.itemArray.length) vm.i = 0;
          vm.plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };

      vm.nextItem = () => {
          if (vm.i === vm.itemArray.length - 1) vm.i = 0;
          else vm.i += 1;
          vm.plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };

      vm.previousItem = () => {
          if (vm.i === 0) vm.i = vm.itemArray.length - 1;
          else vm.i -= 1;
          vm.plotPrice(vm.itemArray[vm.i].price.daily, vm.itemArray[vm.i].price.average,
            vm.itemArray[vm.i].info.item.name);
      };
  });
