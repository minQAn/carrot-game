'use strict';

import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

// fixed. To prevent string type
export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export default class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this; // return the class itself. (chaining)
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    console.log(this); // class itself
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuraction, carrotCount, bugCount) {
    this.gameDuraction = gameDuraction;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListner(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined; // not number.. it will be used as a setInterval function
  }

  setGameStopListener(onGameStop) {
    console.log(onGameStop);
    this.onGameStop = onGameStop;
    // same as
    /*
    this.onGameStop = (reason) => {
      let message;
      switch~~~ blah..
    }
    */
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackGround();

    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win); // win
      }
    } else if (item === ItemType.bug) {
      // Found Bug!
      this.stop(Reason.lose); //lose
    }
  };

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }

  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuraction;
    this.updateTimerText(remainingTimeSec);

    // setInterval by 1 sec.
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer); // this timer is setInterval function
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60); // floor: round down ex)5.95 => 5
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  // Init Game
  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
