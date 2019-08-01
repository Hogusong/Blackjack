import * as help from '../views/helpView';
import { dom } from '../models/base';

export const setEventForHelp = () => {
  dom.modalStart.style.display = 'block';
  help.renderGuide();
  setEvent();
}

function setEvent() {
  dom.btnGuide.onclick = () => {
    help.renderGuide();
    setEvent();
  }
  dom.btnGameHelp.onclick = () => {
    help.renderGameHelp();
    setEvent();
  }
  dom.btnExit.onclick = () => {
    dom.modalStart.style.display = 'none';
  }

  dom.btnOption.onclick = configuration;
}

function configuration() {
  let config = JSON.stringify(localStorage.getItem('bj-config'));
  if (!config) {
    config = {
      showResult: true,
      delay: '2000',
      keepInPlay: true,
      keepLastBet: true,
      minBetting: '5',
      howManyDecks: '6'
    }
  }
  help.renderOptions();

}
