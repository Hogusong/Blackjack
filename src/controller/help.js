import * as help from '../views/helpView';
import { dom } from '../models/base';

export const setEventForHelp = () => {
  dom.modalStart.style.display = 'block';
  help.renderGuide();
  setEvent();

  function setEvent() {
    dom.btnGuide.onclick = () => {
      help.renderGuide();
      setEvent();
    }
    dom.btnGameHelp.onclick = () => {
      help.renderGameHelp();
      setEvent();
    }
    dom.btnOption.onclick = () => {
      help.renderOptions();
    }
    dom.btnExit.onclick = () => {
      dom.modalStart.style.display = 'none';
    }
  }
}
