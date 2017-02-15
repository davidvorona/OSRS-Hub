const findCombatObj = (combatLvl, buildType) => {
    const combatObj = {
        attack: 1,
        defence: 1,
        strength: 1,
        hitpoints: 1,
        ranged: 1,
        magic: 1,
        prayer: 1
    };
    if (buildType === "Spread") {
        const spreadLvl = Math.round((combatLvl * 4) / 5.1);
        return ({
            attack: spreadLvl,
            defence: spreadLvl,
            strength: spreadLvl,
            hitpoints: spreadLvl,
            ranged: spreadLvl,
            magic: spreadLvl,
            prayer: spreadLvl
        });
    } else {
        const pureType = buildType.toLowerCase();
        let adaptedCmb;
        let pureLvl;
        if (pureType === "magic" || "ranged") {
            adaptedCmb = combatLvl - 2.5;
            pureLvl = Math.ceil((adaptedCmb * 4) / 1.3);
        } else if (pureType === "defence") {
            adaptedCmb = combatLvl - 2.8;
            pureLvl = Math.ceil(adaptedCmb * 4);
        } else if (pureType === "attack" || "strength") {
            adaptedCmb = combatLvl - 3.8;
            pureLvl = Math.ceil((adaptedCmb * 4) / 1.3);
        }
        combatObj[pureType] = pureLvl <= 99 ? pureLvl : 99;
        return combatObj;
    }
};

angular.module("BuildController", ["ngRoute"])
  .controller("BuildController", function BuildController() {
      const bc = this;
      bc.showBuild = false;
      bc.buildType = "Spread";

      bc.submit = (combatLvl) => {
          bc.showBuild = true;
          console.log(findCombatObj(combatLvl, bc.buildType));
          // TODO: test if this actually works, then
          // write algorithm to determine remaining points and
          // update table in real-time based on points added
      };

      bc.displayTypes = () => {
          bc.buildTypes = ["Spread", "Melee", "Strength", "Attack", "Defence", "Ranged", "Magic"];
      };

      bc.choice = (buildType) => {
          bc.buildType = buildType;
      };
  });
