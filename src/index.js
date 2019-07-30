import './css/styles.css';
import PLAYER from './models/player';
import * as ctrl from './controller/player';
import * as base from './models/base';
import { dom, message } from './models/base';
import { settingPlayer } from './views/initialView';

let playersBase = ctrl.createPlayers();     // Get players' infomation from the LocalStorage.
let players = [], currIndex = -1, timer, delayTime = 3000;
let gameResult = [];
const dealer = new PLAYER('Dealer', 100000000, true);   // Create the dealer.
let inAddOrRemove = false, gameStarted = false;
let cards = base.shuffleCards();
console.log(cards);
init();

function init() {
  // Update player's data in LocalStorage after each game done.
  if (gameStarted) ctrl.storeInStorage(playersBase); 

  document.querySelector('body h2').innerHTML = "Welcome to the Blackjack table!";
  inAddOrRemove = false;          // to control buttons -> Start game, Add, Remove
  gameStarted = false;            // to control the status for in Game or not.
  dom.dScore.innerText = ' -- last score : ' + dealer.getScore();
  settingPlayer(playersBase);         // Show available players in the table

  dom.btnAdd.onclick = () => {
    inAddOrRemove = true;
    ctrl.addPlayer(playersBase, init);        // init is a callback function.
  }

}