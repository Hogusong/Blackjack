import { dom } from '../models/base';
import charts from '../images/BJCharts.png';
import help from '../images/GameHelp.png';

export const renderGameHelp = () => {
  dom.gameRule.style.display = 'block';
  dom.blackjackGuide.style.display = 'none';
  document.querySelector('#game-rule img').src = help;
}

export const renderGuide = () => {
  dom.gameRule.style.display = 'none';
  dom.blackjackGuide.style.display = 'block';
  document.querySelector('#bj-guide img').src = charts;
}