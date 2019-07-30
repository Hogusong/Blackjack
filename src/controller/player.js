import PLAYER from '../models/player';
import { dom, message } from '../models/base';

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
