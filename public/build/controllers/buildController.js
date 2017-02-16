// TODO: keep copy of main data object out of
// controller scope for access between SPA Angular routes;
// only transformed upon posting to db,
// then reset to default vals
let combatToPG = [
    { skill: "Attack", level: 1 },
    { skill: "Defence", level: 1 },
    { skill: "Strength", level: 1 },
    { skill: "Hitpoints", level: 10 },
    { skill: "Ranged", level: 1 },
    { skill: "Magic", level: 1 },
    { skill: "Prayer", level: 1 }
];

const toObject = (data) => {
    const obj = {};
    data.forEach((el) => {
        obj[el.skill] = el.level;
    });
    return obj;
};

const toDataStructure = (data) => {
    const arrOfObj = [];
    Object.keys(data).forEach((key, i) => {
        arrOfObj[i] = {};
        arrOfObj[i].skill = key;
        arrOfObj[i].level = data[key];
    });
    return arrOfObj;
};

// still in dev:
// use remainingCmb to get how many
// possible lvls left in each skill
const extractRemainingCmb = (pureLvl, pureType) => {
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

const calculatePure = (pureType, adaptedCmb) => {
    let pureLvl;
    if (pureType === "Magic" || pureType === "Ranged") {
        pureLvl = Math.ceil((adaptedCmb - 11) / 1.3);
        pureLvl = Math.ceil(pureLvl / 1.5);
        extractRemainingCmb(pureLvl, pureType);
    } else if (pureType === "Defence") {
        pureLvl = Math.ceil(adaptedCmb - 12);
        extractRemainingCmb(pureLvl, pureType);
    } else if (pureType === "Attack" || pureType === "Strength") {
        pureLvl = Math.ceil(Math.ceil(adaptedCmb - 12.3) / 1.3);
        extractRemainingCmb(pureLvl, pureType);
    }
    return pureLvl;
};

const buildifyTable = (buildType, combatLvl, combatArr) => {
    const combatObj = toObject(combatArr);

    if (buildType === "Spread" && combatLvl > 12) {
        let spreadLvl = Math.ceil(Math.ceil(combatLvl * 4) / 5.1);
        spreadLvl = spreadLvl <= 99 ? spreadLvl : 99;
        Object.keys(combatObj).forEach((keys) => {
            combatObj[keys] = spreadLvl;
        });
        return toDataStructure(combatObj);
    }

    const pureType = buildType;
    const adaptedCmb = Math.ceil(combatLvl * 4);
    const pureLvl = calculatePure(pureType, adaptedCmb);

    combatObj[pureType] = pureLvl <= 99 ? pureLvl : 99;

    return toDataStructure(combatObj);
};

const buyingGf = (gp) => {
    console.log(`Buying gf ${gp}gp`);
};

// src: http://www.runehq.com/calculator/combat-level
const osCombatLevel = (combatObj) => {
    const melee = combatObj.attack + combatObj.strength;
    const range = Math.floor(1.5 * combatObj.ranged);
    const mage = Math.floor(1.5 * combatObj.magic);
    const high = Math.max(melee, range, mage);

    const cmb = Math.floor(1.3 * high) + combatObj.defence +
      combatObj.hitpoints + Math.floor(combatObj.prayer / 2);
    return Math.floor(cmb / 4);
};

// tint row red on being selected as pureType
angular.module("BuildController", ["ngRoute"])
  .controller("BuildController", function BuildController($scope) {
      const bc = this;
      bc.showBuild = false;
      bc.buildType = "Spread";
      bc.combatArr = Object.assign(combatToPG); // shallow clone of object

      bc.submit = (combatLvl) => {
          bc.combatLvl = combatLvl;
          bc.combatArr = Object.assign(combatToPG);
          bc.combatArr = buildifyTable(bc.buildType, combatLvl, bc.combatArr);
          bc.displayCollection = buildifyTable(bc.buildType, combatLvl, bc.combatArr);
          bc.showBuild = true;
      };

      bc.displayTypes = () => {
          bc.buildTypes = ["Spread", "Melee", "Strength", "Attack", "Defence", "Ranged", "Magic"];
      };

      bc.choice = (buildType) => {
          bc.buildType = buildType;
          bc.combatArr = Object.assign(combatToPG);
          bc.combatArr = buildifyTable(bc.buildType, bc.combatLvl, bc.combatArr);
          bc.displayCollection = buildifyTable(bc.buildType, bc.combatLvl, bc.combatArr);
      };

      $scope.$on("$destroy", () => {
          buyingGf(5);
      });
  });
