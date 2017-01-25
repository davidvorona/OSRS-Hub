const phantom = require('phantomjs');
const path = require('path');
const chProcess = require('child_process');

const childProcess = {
  runPhantom: (req, res, next) => {
    const spawn = chProcess.spawn;
    const player = req.params.player;

    // add req.player argument here??
    const childArgs = [
      path.join(__dirname, 'playerScraper.js')
    ];
    const child = spawn(phantom.path, childArgs, {
      env: { player }
    });

    child.stdout.on('data', (data) => {
      // console.log(`stdout: ${data}`);
      const buf = Buffer.from(data);
      req.player = buf.toString();
    });

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`Child process exited with code ${code}.`);
      next();
    });
  },

  formatResponse: (req, res, next) => {
    const playerArr = req.player.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/,/g, '').trim().split('');
    const playerObj = {};
    let newLineCount = 0;
    let parsingSkills = false;
    let parsingVals = false;
    let skillType = '';
    let skillVal = '';

    for (let i = 0; i < playerArr.length; i += 1) {
      if (parsingSkills === false) {
        if (playerArr[i] === '\n') newLineCount += 1;
        if (newLineCount === 4) {
          newLineCount = 0;
          parsingSkills = true;
        }
      } else {
        if (playerArr[i] === '\n') newLineCount += 1;
        if (parsingVals === false) {
          if (newLineCount === 0) {
            skillType += playerArr[i];
          } else if (newLineCount === 2) {
            skillType = skillType.trim();
            if (skillType === 'Minigame') break;
            playerObj[skillType] = [];
            parsingVals = true;
            newLineCount = 0;
          }
        } else {
          if (newLineCount === 0) skillVal += playerArr[i];
          else if (newLineCount === 1) {
            playerObj[skillType].push(parseInt(skillVal, 10));
            skillVal = '';
            if (playerObj[skillType].length === 3) {
              newLineCount = -1;
              skillType = '';
              parsingVals = false;
            } else newLineCount = 0;
          }
        }
      }
    }

    req.player = playerObj;
    next();
  }
};

module.exports = childProcess;
