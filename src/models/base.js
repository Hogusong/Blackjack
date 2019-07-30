import CARD from './card';

export const dom = {
  message: document.getElementById('message'),
  
  btnStart: document.getElementById('btn-start'),
  btnAdd: document.getElementById('btn-add'),
  btnRemove: document.getElementById('btn-remove'),
  btnSubmit: document.getElementById('btn-submit'),
  btnCancel: document.getElementById('btn-cancel'),
  btnClose: document.getElementById('btn-close'),

  secAddPlayer: document.getElementById('add-new'),
  secDealer: document.getElementById('dealer'),
  secInit: document.getElementById('init-table'),
  secRemove: document.getElementById('remove-player'),
  secBoard: document.getElementById('game-board'),

  inPlayerName: document.getElementById('player-name'),
  inAmount: document.getElementById('start-amt'),

  players: document.getElementById('players'),
  dScore: document.getElementById('dealer-score'),
  dHand: document.getElementById('dealer-hand'),
  pTable: document.getElementById('player-table'),
}

export const shuffleCards = function() {
  let cards = [];
  const noOfDeck = 6
  for (let i = 0; i < noOfDeck; i++) {
    cards = [...cards, ...buildDeck()]
  }  
  return shuffle(cards, noOfDeck);
}

function buildDeck() {
  const base = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['spades',  'clubs', 'hearts', 'diams'];
  const deck = [];
  for (let s of suits) {
    const keys = base.sort((a, b) => 0.5 - Math.random());
    for (let k of keys) {
      deck.push(new CARD(s, k));
    }
  }
  return deck;
}

function shuffle(cards, noOfDeck) {
  cards = cards.sort((a, b) => 0.5 - Math.random());
  const front = cards.slice(0, cards.length/2);
  const back =  cards.slice(cards.length/2);
  const count = front.length / noOfDeck;
  cards = []
  for (let i = 0; i < noOfDeck; i++) {
    cards = cards.concat(mixCards( front.slice(i*count, (i+1)*count), back.slice(i*count, (i+1)*count) ))
  }
  cards.splice(-26);
  return [...cards];
}

function mixCards(A, B) {
  const result = []
  for (let i = 0; i < A.length; i++) {
    result.push(A[i]);
    result.push(B[i]);
  }
  return [...result];
}

// Handle all messages. Show the message for 2 seconds.
export const message = (msg) => {
  dom.message.innerText = msg;
  dom.message.style.color = 'red'
  setTimeout(() => dom.message.style.color = 'white', 2000);
}
