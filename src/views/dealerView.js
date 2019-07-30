import { dom } from '../models/base';

// Render dealer's first two cards.
export const renderInit = onHand => {
  let markup = `<div class="icard card-back"></div>`;   // hide first card
  markup += cardView(onHand[1]);    // show second card.
  dom.dHand.innerHTML = markup;
}

// Render one card which is passed.
function cardView(card) {
  return `
    <div class="icard ${card.getSuit()}">
      <div class="top-card suit">${card.getKey()}<br></div>
      <div class="content-card suit"></div>
      <div class="bottom-card suit">${card.getKey()}<br></div>
    </div>
  `
}
