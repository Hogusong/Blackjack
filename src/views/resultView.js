import { dom } from '../models/base';

export const renderGameResult = (dealer, players, callback) => {
  dom.modalStart.style.display = 'block';
  dom.gameResult.style.display = 'block';
  dom.gameResult.innerHTML = `
    <h3>Result of the Game</h3>
    <p>Dealer's Score : <span>${dealer.getScore()}</span></p>
    <hr>
    <p>Players Table</p>
    <table>
      <tr>
        <th>Name</th><th>Betting</th><th>Score</th><th>Result</th>
      <tr>
      ${rendPlayersResult(players)}
    </table>
    <button class="btns" id="back-to-main">Back to a New Game</button>
  `;
  document.getElementById('back-to-main').onclick = () => {
    dom.modalStart.style.display = 'none';
    dom.gameResult.style.display = 'none';
    callback();
  }
}

function rendPlayersResult(players) {
  let markup = '';
  players.forEach(p => {
    markup += `
      <tr>
        <td>${p.getName()}</td>
        <td>${p.getBetting()}</td>
        <td>${p.getScore()}</td>
        <td>${p.getPrevResult()}</td>
      </tr>
    `;
  })
  return markup
}
