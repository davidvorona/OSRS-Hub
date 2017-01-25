// will put code for combat sidebar,
// will also need a partial for it,
// should use same factory as playerController

const combatSkills = {};
combatSkills.attack = 50;
combatSkills.defence = 46;
combatSkills.strength = 40;
combatSkills.hitpoints = 45;
combatSkills.ranged = 46;
combatSkills.prayer = 31;
combatSkills.magic = 47;

const osCombatLevel = (combatObj) => {
  const melee = combatObj.attack + combatObj.strength;
  const range = Math.floor(1.5 * combatObj.ranged);
  const mage = Math.floor(1.5 * combatObj.magic);
  const high = Math.max(melee, range, mage);

  const cmb = Math.floor(1.3 * high) + combatObj.defence +
    combatObj.hitpoints + Math.floor(combatObj.prayer / 2);
  return Math.floor(cmb / 4);
};

osCombatLevel(combatSkills);
