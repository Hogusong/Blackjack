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

const defaultConfig = {
  showResult: true,
  delay: '2000',
  keepInPlay: true,
  keepLastBet: true,
  minBetting: '5',
  howManyDecks: '6'
}

export const getConfiguration = () => {
  let config = JSON.parse(localStorage.getItem('bj-config'));
  if (config === null) config = defaultConfig;
  return config;
}

function configuration() {
  help.renderOptions();
  const config = getConfiguration();

  const myForm = document.forms.myForm;
  myForm.howToShow[0].checked = config.showResult;
  myForm.howToShow[1].checked = !config.showResult;
  myForm.delayTime.value = +config.delay / 1000;
  myForm.setPlayer[0].checked = config.keepInPlay;
  myForm.setPlayer[1].checked = !config.keepInPlay;
  myForm.keepBet[0].checked = config.keepLastBet;
  myForm.keepBet[1].checked = !config.keepLastBet;
  myForm.minBet.value = +config.minBetting;
  myForm.decks.value = +config.howManyDecks;

  myForm.onchange = () => {
    if (valueIsValid()) {
      config.showResult = myForm.howToShow[0].checked;
      config.delay = myForm.delayTime.value * 1000;
      config.keepInPlay = myForm.setPlayer[0].checked;
      config.keepLastBet = myForm.keepBet[0].checked;
      config.minBetting = myForm.minBet.value;
      config.howManyDecks = myForm.decks.value;
      localStorage.setItem('bj-config', JSON.stringify(config))
    }
  }  

  function valueIsValid() {
    if (myForm.minBet.value < 1) return false;
    if (myForm.decks.value < 4 || myForm.decks.value > 10) return false;
    if (myForm.delayTime.value < 1 || myForm.delayTime.value > 5) return false;
    return true
  }

  document.getElementById('default').onclick = () => {
    localStorage.setItem('bj-config', JSON.stringify(defaultConfig));
    configuration();
  }
}
