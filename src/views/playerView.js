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
