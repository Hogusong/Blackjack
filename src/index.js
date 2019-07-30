import './css/styles.css';
import PLAYER from './models/player';
import * as ctrl from './controller/player';
import * as base from './models/base';
import { dom, message } from './models/base';
import { settingPlayer } from './views/initialView';
import * as dView from './views/dealerView';
import * as pView from './views/playerView';

let playersBase = ctrl.createPlayers();     // Get players' infomation from the LocalStorage.
let players = [], currIndex = -1, timer, delayTime = 3000;
let gameResult = [];
const dealer = new PLAYER('Dealer', 100000000, true);   // Create the dealer.
let inAddOrRemove = false, gameStarted = false;
let cards = base.shuffleCards();
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

  dom.btnRemove.onclick = () => {
    if (playersBase.length > 0) {
      inAddOrRemove = true;
      ctrl.removePlayer(playersBase, init);    // init is a callback function.
    } else message('There is no player in this table.')
  }

  dom.btnStart.onclick = () => {
    // Make a list of the in-play players.
    // The reason using the extra list(players) is to accept more hands 
    // when a player has a chance to split cards. - Hands will be flexible.
    players = ctrl.gatherActivePlayers(playersBase);
    if (players.length < 1) {
      message('Wait until players join the game!');
    } else {
      document.querySelector('body h2').innerHTML = "... Enjoy the Game ...";
      // To keep the result of each player's hand including split situation.
      gameResult = players.map(p => 0);   // 0 means pending or tie.
      gameStarted = true;       // Set the status in-game mode.
      initialDraw()             // Draw 2 cards for dealer and all in-play players
      dView.renderInit(dealer.getOnHand());   // Render dealer's 2 cards 
      pView.renderCards(players);       // Render initial 2 cards for all players
      checkBlackjack();         // If dealer has blackjack, game will be over.
    }
  }

  // Add an Event to the in-play button. Let players join the game.
  const inplay = document.querySelectorAll('.inplay');
  inplay.forEach((P, i) => {
    P.addEventListener('click', () => {
      const betAmt = +document.getElementById('bet-amt-'+i).value;
      if (betAmt < 5) {
        message('Betting amount is too low.')
      } if (betAmt > playersBase[i].getAmount()) {
        message('Player need more money in pocket.')
      } else {
        playersBase[i].setBetting(betAmt);  // Reset the betting amount for each game
        playersBase[i].setInPlay(true);     // Reset player.inplay : false -> true
        init();
      }
    })
  });

  // Add an event to the stay-out button. Let players stay out of the game.
  const stayout = document.querySelectorAll('.stayout');
  stayout.forEach((S, i) => {
    S.addEventListener('click', () => {
      if (playersBase[i].getInPlay()) {
        playersBase[i].setInPlay(false);    // Reset player.inplay : true -> false
        init();
      }
    })
  })
}

function initialDraw() {
  // Shuffe cards again when too little cards left as avaiable.
  if (cards.length < 27) cards = base.shuffleCards();
  dealer.emptyOnHand();         // Make empty the dealer's onHand[].
  dom.dScore.innerText = '';

  drawCard(dealer)              // Draw a card for Dealer.
  players.forEach(player => drawCard(player));  // Draw a card for all players.
  drawCard(dealer)
  players.forEach(player => drawCard(player));
}

function drawCard(player) {
  if (!player.getInPlay()) return;
  const card = cards.pop();
  player.addOnHand(card);      // Add the drawn card to the player's hand.
}

function checkBlackjack() {
  if (dealer.hasBlackjack()) {    // Dealer has a blackjack. Game is over. 
    players.forEach((p, i) => {
      if (p.hasBlackjack()) p.evenHand();   // Player has a blackjack, so even.
      else {
        gameResult[i] = -1;   // -1 means player lost this hand.
        p.looseHand();        // Player does not have a blackjack, so loose.
      }
    })
    updatePlayers();          // Update the game result to the playerBase (origin)
    message('Game over. Dealer has Blackjsck.');
  } else {                        // Dealer does not have a blackjack. Continue the game.
    players.forEach((p,i) => {
      if (p.hasBlackjack()) {    // Player has a blackjack, so win.
        p.blackjack();
        gameResult[i] = 1;
        pView.playerMSG('msg-' + i, p.getPrevResult());
      }
    });
  }
}

function updatePlayers() {
  players.forEach((p, index) => {
    const i = playersBase.findIndex(pb => pb.getName() === p.getName());
    if (i >= 0) {
      if (gameResult[index] > 0) {          // Player won this hand.
        playersBase[i].setAmount(p.getBetting());
      } else if (gameResult[index] < 0) {   // Player lost this hand.
        playersBase[i].setAmount(-p.getBetting());
      }
      playersBase[i].setPrevResult(p.getPrevResult());
      playersBase[i].setInitPlayer();
    }
  })
}
