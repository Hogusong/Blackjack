import './css/styles.css';
import PLAYER from './models/player';
import * as ctrl from './controller/player';
import * as base from './models/base';
import { dom, message } from './models/base';
import { settingPlayer } from './views/initialView';
import * as dView from './views/dealerView';
import * as pView from './views/playerView';
import * as help from './controller/help';
import { renderGameResult } from './views/resultView';

let playersBase = ctrl.createPlayers();     // Get players' infomation from the LocalStorage.
let players = [], currIndex = -1, timer, delayTime = 2000;
let gameResult = [];
const dealer = new PLAYER('Dealer', 100000000, true);   // Create the dealer.
let inAddOrRemove = false, gameStarted = false;
let config = help.getConfiguration();
let cards = base.shuffleCards(+config.howManyDecks);

init();

function init() {
  // Update player's data in LocalStorage after each game done.
  if (gameStarted) ctrl.storeInStorage(playersBase); 

  document.querySelector('body h2').innerHTML = "Welcome to the Blackjack table!";
  inAddOrRemove = false;          // to control buttons -> Start game, Add, Remove
  gameStarted = false;            // to control the status for in Game or not.
  dom.dScore.innerText = ' -- last score : ' + dealer.getScore();
  settingPlayer(playersBase);         // Show available players in the table

  dom.btnHelp.onclick = help.setEventForHelp;

  dom.btnAdd.onclick = () => {
    if (base.canAcceptClick(gameStarted, inAddOrRemove)) {
      inAddOrRemove = true;
      ctrl.addPlayer(playersBase, init);        // init is a callback function.
    }
  }

  dom.btnRemove.onclick = () => {
    if (base.canAcceptClick(gameStarted, inAddOrRemove)) {
      if (playersBase.length > 0) {
        inAddOrRemove = true;
        ctrl.removePlayer(playersBase, init);    // init is a callback function.
      } else message('There is no player in this table.')
    }
  }

  dom.btnStart.onclick = () => {
    if (base.canAcceptClick(gameStarted, inAddOrRemove)) {
      // Make a list of the in-play players.
      // The reason using the extra list(players) is to accept more hands 
      // when a player has a chance to split cards. - Hands will be flexible.
      players = ctrl.gatherActivePlayers(playersBase);
      if (players.length < 1) {
        message('Nobody join or Someone has not enough money!');
      } else {
        document.querySelector('body h2').innerHTML = "... Enjoy the Game ...";
        // To keep the result of each player's hand including split situation.
        gameResult = players.map(p => 0);   // 0 means pending or tie.
        gameStarted = true;       // Set the status in-game mode.
        initialDraw()             // Draw 2 cards for dealer and all in-play players
        dView.renderInit(dealer.getOnHand());   // Render dealer's 2 cards 
        pView.renderCards(players);       // Render initial 2 cards for all players
        checkBlackjack();         // If dealer has blackjack, game will be over.

        // Dealer has no blackjack but some players may have.
        // Every hands will have four choice buttons: Split, Double, Hit, and Stay.
        // Events were added to the buttons for each player and the game started. 
        // currIndex is needed to notify whose buttons are active currently.
        currIndex = players.findIndex(p => p.getCanDraw());
        if (currIndex < 0) {
          updatePlayers();
          // Show the game result in a report box.
          if (config.showResult) renderGameResult(dealer, players, init);
          // Show the game result by delaying.
          else timer = setTimeout(() => init(), +config.delay);
        } else {
          setButtonsAndPlay();         
        }
      }
    }
  }

  // Add an Event to the in-play button. Let players join the game.
  const inplay = document.querySelectorAll('.inplay');
  inplay.forEach((P, i) => {
    P.addEventListener('click', () => {
      const betAmt = +document.getElementById('bet-amt-'+i).value;
      if (betAmt < config.minBetting) {
        message('Betting amount is too low.')
      } else if (betAmt > playersBase[i].getAmount()) {
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
  if (cards.length < 27) cards = base.shuffleCards(+config.howManyDecks);
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
    dom.dScore.innerText = ' -- score : ' + dealer.getScore();
    dView.openCards(dealer.getOnHand());    // Show dealer's cards.
    players.forEach((p, i) => {
      if (p.hasBlackjack()) p.evenHand();   // Player has a blackjack, so even.
      else {
        gameResult[i] = -1;   // -1 means player lost this hand.
        p.looseHand();        // Player does not have a blackjack, so loose.
      }
    })
    // updatePlayers();          // Update the game result to the playerBase (origin)
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

// Set Events to the playing options (Split, Double, Hit, and Stay).
function setButtonsAndPlay() {
  const split = document.querySelectorAll('.split');
  split.forEach(sp => {
    const i = +sp.dataset.id;
    sp.addEventListener('click', () => {
      if (currIndex == i) {   // Confirm this button is belong to the current hand.
        const onHand = players[i].getOnHand();
        const v_0 = onHand[0].getValue();
        const v_1 = onHand[1].getValue();
        if (onHand.length == 2 && v_0 == v_1) {   // Check the conditions to split.
          if (v_0 == 11 && players[i].getIsSplited()) {
            message('Second split is not allowed for double Aces');
          } else {
            players[i].setIsSplited(true);
            players[i].setOnHand([onHand[0]]);
            // Clone this player for the additional hand for split action.
            const temp = ctrl.clonePlayer(players[i]);
            temp.setIsSplited(true);
            temp.setOnHand([onHand[1]]);
            // Replace current player and add player's clone to the lists.
            players = [...players.slice(0,i), players[i], temp, ...players.slice(i+1)];
            gameResult = [...gameResult.slice(0,i), 0, 0, ...gameResult.slice(i+1)];
            pView.renderCards(players);     // Render UI again with changes.
            setButtonsAndPlay();
          }
        }
      }
    });
  });

  const double = document.querySelectorAll('.double');
  double.forEach(d => {
    const i = d.dataset.id;
    d.addEventListener('click', () => {
      if (currIndex == i) {       // Activate this event when currIndex == player's ID
        if (players[i].getOnHand().length != 2) {
          message('DOUBLE is allowed when only 2 cards are on hand.')
        } else {
          players[i].setBetting(players[i].getBetting() * 2); // Reset betAmt double.
          players[i].setPrevResult('Player made double betting!');
          players[i].setCanDraw(false);
          drawCard(players[i]);         // Draw one card for the current player.
          pView.renderPlayerScore(players[i], i);
          pView.renderLastCard(players[i].lastCard(), i);
          pView.playerMSG('msg-' + i, 'Player made double betting!');
          currIndex = players.findIndex(p => p.getCanDraw());   // Move to the next hand.
          // If this was the last player on table, then open dealer's card.
          if (currIndex < 0) drawDealerCards(); 
        }
      }
    })
  })
  
  const hit = document.querySelectorAll('.hit');
  hit.forEach(h => {
    const i = h.dataset.id;
    h.addEventListener('click', () => {
      if (currIndex == i) {       // Activate this event when currIndex == player's ID
        drawCard(players[i]);
        pView.renderPlayerScore(players[i], i);
        pView.renderLastCard(players[i].lastCard(), i);

        const onHand = players[i].getOnHand();
        if (onHand.length == 2 && onHand[0].getValue == 11) {
          players[i].setCanDraw(false);
          pView.playerMSG('msg-' + i, 'Player stay with current score!')
          currIndex = players.findIndex(p => p.getCanDraw());   // Move to the next hand.
          // If this was the last player on table, then open dealer's card.
          if (currIndex < 0) drawDealerCards(); 
        } 
        if (players[i].getScore() > 21) {   // Aftere hit, player will loose if score is over 21.
          players[i].looseHand();
          gameResult[i] = -1;
          pView.playerMSG('msg-' + i, 'Player lost this hand!');
          console.log(players);
          currIndex = players.findIndex(p => p.getCanDraw());   // Move to the next hand.
          // If this was the last player on table, then open dealer's card.
          if (currIndex < 0) drawDealerCards(); 
        }
      }
    })
  })
  
  const stay = document.querySelectorAll('.stay');
  stay.forEach(s => {
    const i = s.dataset.id;
    s.addEventListener('click', () => {
      if (currIndex == i) {       // Activate this event when currIndex == player's ID
        players[i].setCanDraw(false);
        players[i].setPrevResult('Player stay with current score!')
        pView.playerMSG('msg-' + i, 'Player stay with current score!')
        currIndex = players.findIndex(p => p.getCanDraw());   // Move to the next hand.
        // If this was the last player on table, then open dealer's card.
        if (currIndex < 0) drawDealerCards(); 
      }
    })
  })
}

function drawDealerCards() {
  // Check any player is in-play mode. If yes, then dealer draw cards .
  if (gameResult.indexOf(0) >= 0) { 
    while (dealer.getScore() < 17) {
      drawCard(dealer);           // Dealer draw cards until the score goes over 16.
    }
    const scoreToPay = dealer.getScore() > 21 ? 0 : dealer.getScore()
    payToPlayer(scoreToPay);      // Compare the scores and pay them.
  } else updatePlayers();
  dom.dScore.innerText = ' -- score : ' + dealer.getScore();
  dView.openCards(dealer.getOnHand());    // Show dealer's cards.
  // Show the game result in a report box.
  if (config.showResult) renderGameResult(dealer, players, init);
  // Show the game result by delaying.
  else timer = setTimeout(() => init(), config.delay);
}

// limit = 0 or 16 < limit < 22.
// Compare score wiht all alived players and pay them whoelse has over limit.
function payToPlayer(limit) {
  gameResult.forEach((v, i) => {
    if (v === 0) {
      if (players[i].getScore() > limit) {
        gameResult[i] = 1;
        players[i].winHand();
      } else if (players[i].getScore() < limit) {
        gameResult[i] = -1;
        players[i].looseHand()
      } else players[i].evenHand();
    }
  })
  // players.forEach((p, i) => {
  //   if (p.getInPlay()) {
  //     if (p.getScore() > limit) {
  //       gameResult[i] = 1;
  //       p.winHand();
  //     } else if (p.getScore() < limit) {
  //       gameResult[i] = -1;
  //       p.looseHand()
  //     } else p.evenHand();
  //   }
  // });
  updatePlayers();      // Update the game result to the playerBase (origin)
}
