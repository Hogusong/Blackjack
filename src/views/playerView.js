import { dom } from '../models/base';

// Create a table for the current players to process deleting.
export const renderRemoveTable = players => {
  dom.secDealer.style.display = 'none';
  dom.secInit.style.display = 'none';
  dom.secRemove.style.display = 'block';
  dom.pTable.innerHTML = '';
  let markup = '<tr><th>Name</th><th>in Pocket</th><th>Del</th>';
  players.forEach((p, i) => {
    markup += `
      <tr>
        <td>${p.getName()}</td>
        <td>$${p.getAmount()}</td>
        <td><a class="btn-delete">X</a></td>
      </tr>
    `;
  })
  dom.pTable.innerHTML = markup;
}

// Render players' cards
export const renderCards = players => {
  dom.secInit.style.display = 'none';
  dom.secBoard.innerHTML = '';
  for (let i in players) {
    const p = players[i];
    dom.secBoard.innerHTML += `
      <div class="player">
        <h3 id="score-${i}">${p.getName()} -- Betting $${p.getBetting()} -- score : ${p.getScore()}</h3>
        ${renderOnHand(p, i)}
      </div>
    `;
  }
}

// Render a player's cards and the options. 
function renderOnHand(p, i) {
  const cards = p.getOnHand();
  let markup = `<div id="player-${i}">`;
  cards.forEach(card => markup += renderCard(card));
  markup += `</div>
    <h3 class="player-msg" id="msg-${i}">${p.getPrevResult()}</h3>
    <div class="option">
      <input class="btns split" type="button" value="Split" data-id="${i}">
      <input class="btns double" type="button" value="Double" data-id="${i}">
      <input class="btns hit" type="button" value="Hit" data-id="${i}">
      <input class="btns stay" type="button" value="Stay" data-id="${i}">
    </div>
  `;
  return markup;
}

// Render a card.
function renderCard(card) {
  return `
    <div class="icard ${card.getSuit()}">
      <div class="top-card suit">${card.getKey()}<br></div>
      <div class="content-card suit"></div>
      <div class="bottom-card suit">${card.getKey()}<br></div>
    </div>
  `
}

// To display each player's game situation.
export const playerMSG = (id, msg) => {
  document.getElementById(id).innerText = msg;
}
