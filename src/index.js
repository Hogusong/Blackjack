import './css/styles.css';
import PLAYER from './models/player';
import * as ctrl from './controller/player';
import * as base from './models/base';

let playersBase = ctrl.createPlayers();     // Get players' infomation from the LocalStorage.
let players = [], currIndex = -1, timer, delayTime = 3000;
let gameResult = [];
const dealer = new PLAYER('Dealer', 100000000, true);   // Create the dealer.
let inAddOrRemove = false, gameStarted = false;
let cards = base.shuffleCards();
console.log(cards);
