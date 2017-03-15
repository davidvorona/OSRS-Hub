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

/* WARNING: DEV ONLY */
const buyingGf = (gp) => {
    console.log(`Buying gf ${gp}gp`);
};
/* ***************** */

angular.module("BuildController", ["ngRoute"])
  .controller("BuildController", [
      "$scope",
      "$http",
      "$routeParams",
      "authVals",
      "FormatService",
      "BuildFactory",
      "BuildCalculator",
  function BuildController($scope, $http, $routeParams, authVals, FormatService, BuildFactory, BuildCalculator) { // eslint-disable-line indent, max-len
      const bc = this;
      bc.showBuild = false;
      bc.buildType = "Spread";
      bc.combatArr = Object.assign(baseCombatObj); // shallow clone of object
      bc.savedBuild = false;

      bc.buildSelected = () => {
          if ($routeParams.build) {
              bc.findBuild($routeParams.build);
          }
      };

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
          if (authVals.currentUser !== null) {
              bc.buildName = buildName;
              combatToPG = Object.assign(bc.combatArr);
              combatToPG = FormatService.toObject(combatToPG);
              combatToPG.username = authVals.currentUser;
              BuildFactory.saveBuild(buildName, combatToPG)
                .then((res) => {
                    if (res.err) {
                        console.log(res.err);
                        return;
                    }
                    bc.savedBuild = true;
                });
          } else console.log("You need to be logged in to save a build!");
      };

      bc.findBuild = (buildName) => {
          if (authVals.currentUser !== null) {
              bc.buildName = buildName;
              BuildFactory.getBuild({ buildName: bc.buildName, username: authVals.currentUser })
                .then((res) => {
                    if (res.err) {
                        console.log(res.err);
                        return;
                    }
                    bc.combatLvl = BuildCalculator.osCombatLevel(res.data[0]);
                    bc.combatArr = FormatService.toTableStructure(res.data[0]);
                    bc.displayCollection = FormatService.toTableStructure(res.data[0]);
                    bc.showBuild = true;
                    bc.savedBuild = true;
                });
          } else console.log("You need to be logged in to find a build!");
      };

      $scope.$on("$destroy", () => {
          buyingGf(5);
      });
  }]);
