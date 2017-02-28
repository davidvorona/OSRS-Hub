// TODO: keep copy of main data object out of
// controller scope for access between SPA Angular routes;
// only transformed upon posting to db,
// then reset to default vals
const baseCombatObj = [
    { skill: "Attack", level: 1 },
    { skill: "Defence", level: 1 },
    { skill: "Strength", level: 1 },
    { skill: "Hitpoints", level: 10 },
    { skill: "Ranged", level: 1 },
    { skill: "Magic", level: 1 },
    { skill: "Prayer", level: 1 }
];

let combatToPG = {};

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

/* WARNING: DEV ONLY */
const buyingGf = (gp) => {
    console.log(`Buying gf ${gp}gp`);
};
/* ***************** */

// tint row red on being selected as pureType
angular.module("BuildController", ["ngRoute"])
  .controller("BuildController", function BuildController($scope, $http, BuildFactory, BuildCalculator) {
      const bc = this;
      bc.showBuild = false;
      bc.buildType = "Spread";
      bc.combatArr = Object.assign(baseCombatObj); // shallow clone of object
      bc.savedBuild = false;

      bc.submit = (combatLvl) => {
          bc.combatLvl = combatLvl;
          bc.combatArr = Object.assign(baseCombatObj);
          bc.combatArr = BuildCalculator.buildifyTable(bc.buildType, combatLvl, bc.combatArr);
          bc.displayCollection = BuildCalculator.buildifyTable(bc.buildType, combatLvl, bc.combatArr);
          bc.showBuild = true;
          bc.savedBuild = false;
      };

      bc.displayTypes = () => {
          // TODO: add Melee build
          bc.buildTypes = ["Spread", "Strength", "Attack", "Defence", "Ranged", "Magic"];
      };

      bc.choice = (buildType) => {
          bc.buildType = buildType;
          bc.combatArr = Object.assign(baseCombatObj);
          bc.combatArr = BuildCalculator.buildifyTable(bc.buildType, bc.combatLvl, bc.combatArr);
          bc.displayCollection = BuildCalculator.buildifyTable(bc.buildType, bc.combatLvl, bc.combatArr);
          bc.savedBuild = false;
      };

      bc.saveBuild = (buildName) => {
          bc.buildName = buildName;
          combatToPG = Object.assign(bc.combatArr);
          combatToPG = toObject(combatToPG);
          combatToPG.username = $scope.currentUser;
          BuildFactory.saveBuild(buildName, combatToPG)
            .then(() => {
                console.log("Save successful.");
                bc.savedBuild = true;
            }, (error) => {
                console.log(error);
            });
      };

      bc.findBuild = (buildName) => {
          bc.buildName = buildName;
          BuildFactory.getBuild({ buildName: bc.buildName, username: $scope.currentUser })
            .then((response) => {
                bc.combatLvl = BuildCalculator.osCombatLevel(response.data[0]);
                bc.combatArr = toTableStructure(response.data[0]);
                bc.displayCollection = toTableStructure(response.data[0]);
                bc.showBuild = true;
                bc.savedBuild = true;
            }, (error) => {
                console.log("Error in buildController.");
                console.log(error);
            });
      };

      $scope.$on("$destroy", () => {
          buyingGf(5);
      });
  });
