export default class CARD {
  // parms: suit -> spades, hearts, clubs, diams
  // parms: key  -> A, 1 - 10, J, Q, K
  constructor(suit, key) {
    this.suit = suit;
    this.color = (suit[0] === "s" || suit[0] === "c") ? 'black' : 'red';
    this.key = key;
    this.value = this.valueOf(key)
  }

  getColor()  {  return this.color  }
  getSuit()   {  return this.suit;  }
  getKey()    {  return this.key;   }
  getValue()  {  return this.value; }
  
  valueOf(key) {
    if (key === 'A') return 11;
    if ('JQK'.includes(key)) return 10;
    return +key;
  }
}
