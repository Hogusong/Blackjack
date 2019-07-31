import { dom } from '../models/base';
import charts from '../images/BJCharts.png';

export const renderGameHelp = () => {
  dom.gameRule.style.display = 'block';
  dom.blackjackGuide.style.display = 'none';
}

export const renderGuide = () => {
  dom.gameRule.style.display = 'none';
  dom.blackjackGuide.style.display = 'block';
  document.querySelector('#bj-guide img').src = charts;
}