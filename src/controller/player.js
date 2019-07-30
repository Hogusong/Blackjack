import PLAYER from '../models/player';

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
