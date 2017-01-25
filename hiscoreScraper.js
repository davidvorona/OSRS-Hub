const request = require('request');

const hiscoreScraper = {
  getData: (req, res, next) => {
    const player = req.params.player;
    const hiscoreUrl = `http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${player}`;
    request(hiscoreUrl, (error, response) => {
      if (error) return console.log(error);
      req.player = response.body;
      next();
    });
  },

  formatResponse: (req, res, next) => {
    let player = req.player;
    player = player.split('\n');

    const playerArr = [];
    let skillObj = {};
    const skillTypes = [
      'Overall', 'Attack', 'Defence', 'Strength', 'Hitpoints',
      'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcutting',
      'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing',
      'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer',
      'Farming', 'Runecraft', 'Hunter', 'Construction'
    ];
    let skillVals;

    for (let i = 0; i < player.length - 4; i += 1) {
      skillVals = player[i].split(',');
      skillObj.type = skillTypes[i];
      skillObj.rank = parseInt(skillVals[0], 10);
      skillObj.level = parseInt(skillVals[1], 10);
      skillObj.exp = parseInt(skillVals[2], 10);
      playerArr.push(skillObj);
      skillObj = {};
    }

    req.player = playerArr;
    next();
  }
};

module.exports = hiscoreScraper;
