angular.module("FormatService", ["ngRoute"])
  .factory("FormatService", () => {
      const formatters = {};

      formatters.toTableStructure = (data) => {
          const arrOfObj = [];
          Object.keys(data).forEach((key, i) => {
              arrOfObj[i] = {};
              arrOfObj[i].skill = key.charAt(0).toUpperCase() + key.slice(1);
              arrOfObj[i].level = data[key];
          });
          return arrOfObj;
      };

      formatters.toObject = (data) => {
          const obj = {};
          data.forEach((el) => {
              obj[el.skill] = el.level;
          });
          return obj;
      };

      formatters.epochToDate = (data) => {
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

      formatters.toPlayerObject = (data) => {
          const obj = {};
          data.forEach((el) => {
              obj[el.type] = el.level;
          });
          return obj;
      };

      formatters.toPGDate = () => new Date().toISOString().slice(0, 19).replace("T", " ");

      return formatters;
  });
