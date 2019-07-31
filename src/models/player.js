export default class PLAYER {
  constructor(name, amount, inPlay=false) {
    this.name = name;
    this.amount = amount;
    this.onHand = [];               // store player's cards on hand.
    this.countAces = 0;             // store how many Aces on hand.
    this.betting = 5;
    this.isSplited = false;         // help tracking player did split of not.
    this.canDrawCard = inPlay;      // help taacking player is active or not.
    this.inPlay = inPlay;           // help tracking player joined the game or not.
    this.prevResult = 'New player'; // to say the last hand's result.
  }

  getName() {  return this.name;  }
  getAmount() {  return this.amount;  }
  getBetting() {  return this.betting;  }
  getOnHand() {  return this.onHand;  }
  getCountAce() {  return this.countAces;  }
  getInPlay() {  return  this.inPlay;  }
  getCanDraw() { return this.canDrawCard; }
  getIsSplited() { return this.isSplited; }
  getPrevResult() {  return this.prevResult;  }
  getScore() {
    let score = 0;
    this.onHand.forEach(card => score += card.getValue());
    let count = this.countAces;
    while (score > 21 && count-- > 0) score -= 10;
    return score;
  }
  lastCard() {  return this.onHand[this.onHand.length-1];  }

  setInPlay(status) { 
    this.inPlay = status;
    this.canDrawCard = status;
  }
  setCanDraw(status) { this.canDrawCard = status; }
  setAmount(amt) { this.amount += amt; }
  setBetting(amt) {  this.betting = amt;  }
  setPrevResult(status) { this.prevResult = status; }
  setIsSplited(status) { this.isSplited = status; }
  setOnHand(hand) { this.onHand = hand; }
  emptyOnHand() { 
    this.onHand = []; 
    this.countAces = 0;
  }
  addOnHand(card) {
    if (card.getKey() === 'A') this.countAces++;
    this.onHand.push(card);
  }
  looseHand() {
    this.amount -= this.betting;
    this.setInitPlayer();
    this.prevResult = 'You lost hand!';
  }
  blackjack() {
    this.betting = this.betting * 1.5;
    this.setInitPlayer();
    this.prevResult = 'Blackjack! Wow!';
  }
  winHand() {
    this.amount += this.betting;
    this.setInitPlayer();
    this.prevResult = 'You won hand!';
  }
  evenHand() {
    this.setInitPlayer();
    this.prevResult = 'You had even!';
  }
  setInitPlayer() {
    this.inPlay = false;
    this.canDrawCard = false;
    this.countAces = 0;
  }
  hasBlackjack() {
    if (this.onHand.length > 2) return false;
    let index = this.onHand.findIndex(card => card.getKey() === 'A');
    if (index < 0) return false;
    index = index < 1 ? 1 : 0;
    return this.onHand[index].getValue() === 10;
  }
}
