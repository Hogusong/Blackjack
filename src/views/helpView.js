import { dom } from '../models/base';
import charts from '../images/BJCharts.png';
import help from '../images/GameHelp.png';

export const renderGameHelp = () => {
  dom.gameRule.style.display = 'block';
  dom.blackjackGuide.style.display = 'none';
  dom.options.style.display = 'none';
  document.querySelector('#game-rule img').src = help;
}

export const renderGuide = () => {
  dom.gameRule.style.display = 'none';
  dom.blackjackGuide.style.display = 'block';
  dom.options.style.display = 'none';
  document.querySelector('#bj-guide img').src = charts;
}

export const renderOptions = () => {
  dom.gameRule.style.display = 'none';
  dom.blackjackGuide.style.display = 'none';
  dom.options.style.display = 'block';
  dom.options.innerHTML = `
      <h4>Set the Configuration up</h4>
      <form id="myForm">
        <div class="option">
          <p>How to show the Game Result ?</p>
          <div>
            <input type="radio" name="howToShow">
            <span>Show in a Box</span>
          </div>
          <div>
            <input type="radio" name="howToShow">
            <span>Delay Browser</span>
          </div>
        </div>
        <div class="option">
          <span>Delay Time : </span>
          <input type="number" name="delayTime" value=2 min=1 max=5> seconds
        </div>
        <div class="option">
          <p>Keep last player as In-Play ?</p>
          <div>
            <input type="radio" name="setPlayer">
            <span>Yes, keep as In-Play.</span>
          </div>
          <div>
            <input type="radio" name="setPlayer">
            <span>No, reset all as Stay-Out.</span>
          </div>
        </div>
        <div class="option">
          <p>Keep last bet amount for the Game ?</p>
          <div>
            <input type="radio" name="keepBet">
            <span>Yes, keep it.</span>
          </div>
          <div>
            <input type="radio" name="keepBet">
            <span>No, reset minimum Bet.</span>
          </div>
        </div>
        <div class="option">
          <span>Minimum Betting $ </span>
          <input type="number" name="minBet" value=5 min=1>
        </div>
        <div class="option">
          <div>
            <span>How many Decks :&nbsp;</span>
            <input type="number" name="decks" value=6 min=4 max=10>
          </div>
        </div>
        <div id="config-btns">
          <button class="btns" type="submit">Submit</button>
          <button class="btns" type="button" id="default">Reset Default</button>
          <button class="btns" type="button" id="exitNoSave">Cancel</button>
        </div>
      </form>
  `;
}