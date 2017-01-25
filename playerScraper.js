/* eslint-disable */
// phantomjs(v2.1) does not have es6 support yet, and I hate the red/orange

// playerScraper.js is just a phantomjs script to get around
// osrs.com's inherent challenges in scraping player info
const phantom = require('phantomjs');
var system = require('system');
var env = system.env;
var page = require('webpage').create();

var testindex = 0;
var loadInProgress = false;

page.onConsoleMessage = function (msg) {
  console.log(msg);
};

page.onLoadStarted = function () {
  loadInProgress = true;
};

page.onLoadFinished = function () {
  loadInProgress = false;
};

var steps = [
  function () {
    page.open('http://services.runescape.com/m=hiscore_oldschool/overall.ws');
  },

  function (player) {
    var playerToInput = player;
    page.evaluate(function (playerToInput) {
      var arr = document.getElementsByTagName('form');
      if (arr[0].getAttribute('method') === 'post') {
        arr[0].getElementsByTagName('input')[0].value = playerToInput;
      }
    }, playerToInput);
  },

  function () {
    //Login
    page.evaluate(function () {
      var arr = document.getElementsByTagName('form');
      if (arr[0].getAttribute('method') === 'post') {
        arr[0].getElementsByTagName('input')[1].name = 'not-submit';
        arr[0].submit();
      }
    });
  },

  function () {
    page.evaluate(function () {
      console.log(document.getElementsByTagName('table')[0].textContent);
    });
  }
];

setInterval(function () {
  if (!loadInProgress && typeof steps[testindex] === 'function') {
    var player = env.player;
    console.log('Processing...');
    if (testindex === 1) steps[testindex](player);
    else steps[testindex]();
    testindex += 1;
  }
  if (typeof steps[testindex] !== 'function') {
    phantom.exit();
  }
}, 1);
