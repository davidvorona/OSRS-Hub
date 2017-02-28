angular.module("BuildCalculator", ["ngRoute"])
  .factory("BuildCalculator", () => {
      const toObject = (data) => {
          const obj = {};
          data.forEach((el) => {
              obj[el.skill] = el.level;
          });
          return obj;
      };

      const toTableStructure = (data) => {
          const arrOfObj = [];
          Object.keys(data).forEach((key, i) => {
              arrOfObj[i] = {};
              arrOfObj[i].skill = key.charAt(0).toUpperCase() + key.slice(1);
              arrOfObj[i].level = data[key];
          });
          return arrOfObj;
      };

      const calculateBuild = {};

      // TODO:
      // use remainingCmb to get how many
      // possible lvls left in each skill
      calculateBuild.extractRemainingCmb = (pureLvl, pureType) => {
          if (pureLvl <= 99) return;
          let adaptedCmb;
          let maxCmb;
          let remainingCmb = {};
          if (pureType === "Magic" || pureType === "Ranged") {
              maxCmb = 99 * 1.5;
              maxCmb = (maxCmb * 1.3) + 11;
              adaptedCmb = pureLvl * 1.5;
              adaptedCmb = (adaptedCmb * 1.3) + 11;
              remainingCmb = adaptedCmb - maxCmb;
          } else if (pureType === "Defence") {
              maxCmb = 99 + 12;
              adaptedCmb = pureLvl + 12;
              remainingCmb = adaptedCmb - maxCmb;
          } else if (pureType === "Attack" || pureType === "Strength") {
              maxCmb = (99 * 1.3) + 12.3;
              adaptedCmb = (pureLvl * 1.3) + 12.3;
              remainingCmb = adaptedCmb - maxCmb;
          }
          console.log("remainingCmb", remainingCmb);
      };

      calculateBuild.calculatePure = (pureType, adaptedCmb) => {
          let pureLvl;
          if (pureType === "Magic" || pureType === "Ranged") {
              pureLvl = Math.ceil((adaptedCmb - 11) / 1.3);
              pureLvl = Math.ceil(pureLvl / 1.5);
              calculateBuild.extractRemainingCmb(pureLvl, pureType);
          } else if (pureType === "Defence") {
              pureLvl = Math.ceil(adaptedCmb - 12);
              calculateBuild.extractRemainingCmb(pureLvl, pureType);
          } else if (pureType === "Attack" || pureType === "Strength") {
              pureLvl = Math.ceil(Math.ceil(adaptedCmb - 12.3) / 1.3);
              calculateBuild.extractRemainingCmb(pureLvl, pureType);
          }
          return pureLvl;
      };

      calculateBuild.buildifyTable = (buildType, combatLvl, combatArr) => {
          const combatObj = toObject(combatArr);

          if (buildType === "Spread" && combatLvl > 12) {
              let spreadLvl = Math.ceil(Math.ceil(combatLvl * 4) / 5.1);
              spreadLvl = spreadLvl <= 99 ? spreadLvl : 99;
              Object.keys(combatObj).forEach((keys) => {
                  combatObj[keys] = spreadLvl;
              });
              return toTableStructure(combatObj);
          }

          const pureType = buildType;
          const adaptedCmb = Math.ceil(combatLvl * 4);
          const pureLvl = calculateBuild.calculatePure(pureType, adaptedCmb);

          combatObj[pureType] = pureLvl <= 99 ? pureLvl : 99;

          return toTableStructure(combatObj);
      };

      // src: http://www.runehq.com/calculator/combat-level
      calculateBuild.osCombatLevel = (combatObj) => {
          const melee = combatObj.attack + combatObj.strength;
          const range = Math.floor(1.5 * combatObj.ranged);
          const mage = Math.floor(1.5 * combatObj.magic);
          const high = Math.max(melee, range, mage);

          const cmb = Math.floor(1.3 * high) + combatObj.defence +
            combatObj.hitpoints + Math.floor(combatObj.prayer / 2);
          return Math.floor(cmb / 4);
      };

      return calculateBuild;
  });
