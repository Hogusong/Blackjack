import PLAYER from '../models/player';
import { dom, message } from '../models/base';
import { renderRemoveTable } from '../views/playerView';

// Gathering player's data from the LocalStorage.
export const createPlayers = () => {
  let data = JSON.parse(localStorage.getItem('players'));
  if (data && data.length > 0) {
    return data.map(d => new PLAYER(d.name, d.amount));
  }
  return [];
}

// Save player's data into the LocalStorage.
export function storeInStorage(P) {
  const data = [];
  P.forEach(p => data.push({ name: p.getName(), amount: p.getAmount()}));
  localStorage.setItem('players', JSON.stringify(data));
}

// init() of index.js is the callback(). 
// To re-render initial UI after this job done.
export const addPlayer = (players, callback) => {
  dom.secDealer.style.display = 'none';
  dom.secAddPlayer.style.display = 'block'

  dom.btnSubmit.onclick = () => {
    const name = dom.inPlayerName.value.trim();
    const amount = +dom.inAmount.value;
    if (name.length > 1 && amount >= 10) {
      if (!players.find(p => p.getName() === name)) {
        players.push(new PLAYER(name, amount));
        storeInStorage(players);
        dom.inPlayerName.value = '';
        dom.inAmount.value = 100;
        dom.secAddPlayer.style.display = 'none';
        message(name + ' is added. Enjoy the game.')
        callback();  
      } else message('Please use another name!');
    } else message('Wrong input! Try again.');
  }

  dom.btnCancel.onclick = () => {
    dom.secAddPlayer.style.display = 'none';
    callback();
  }
}

// init() of index.js is the callback(). 
// To re-render initial UI after this job done.
export const removePlayer = (players, callback) => {
  renderRemoveTable(players);     // Render the player's list and give the option to delete.
  const btnDelete = document.querySelectorAll('.btn-delete');
  btnDelete.forEach((x, i) => {
    x.addEventListener('click', () => {
      message(players[i].getName() + ' is leaving the table. Bye now.')
      players.splice(i, 1);
      storeInStorage(players);    // Update the LocalStorage after the player is removed.
      if (players.length > 0) removePlayer(players, callback);  // Stay if any player is available.
      else {                      // Return to main UI if no player is available.
        dom.secRemove.style.display = 'none';
        callback();
      }
    })
  });
  dom.btnClose.addEventListener('click', () => {
    dom.secRemove.style.display = 'none';
    callback();
  });
}
