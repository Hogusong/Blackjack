import { dom } from '../models/base';

// Set the initial UI and render it.
export const settingPlayer  = players => {
  dom.secBoard.innerHTML = '';
  dom.secDealer.style.display = 'block';
  dom.dHand.innerHTML = '';
  dom.secInit.style.display = 'block';
  dom.players.innerHTML = '';
  document.querySelector('#init-table h3').innerHTML = `Player's Choice (${players.length} players)`;
  let markup = '';
  players.forEach((p, i) => markup += renderPlayers(p, i));
  dom.players.innerHTML = markup;
}

// Render all players' data.
function renderPlayers(p, i) {
  const status = p.getInPlay() ? 'In Play' : 'Stay Out';
  const s_color = p.getInPlay() ? 'blue' : 'red';
  return `
    <div class="set-betting">
      <p>${p.getName()} -- $${p.getAmount()} in the pocket. -- 
            <span style="color: ${s_color}">${status}<span>
      </p>
      <div class="bet" id="bet-${i}">
        <p>bet amt : $ <input class="bet-amt" type="number" id="bet-amt-${i}" value=${p.getBetting()}>
        <span style="color: black">&nbsp;&nbsp;&nbsp; ${p.getPrevResult()}</span></p>
        <button class="btns stayout">Stay Out</button>
        <button class="btns inplay">In Play</button>
      </div>
    </div>
  `
}
