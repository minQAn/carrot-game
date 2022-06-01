'use strict';

import PopUp from './popup.js';
import * as sound from './sound.js';
import GameBuilder, { Reason } from './game.js';

const gameFinishBanner = new PopUp();

// The Builder Pattern, you can see exactly what value you set at a glance
// more readable
const game = new GameBuilder()
  .withGameDuration(5)
  .withCarrotCount(3)
  .withBugCount(3)
  .build();

game.setGameStopListener((reason) => {
  console.log(reason);

  let message;
  switch (reason) {
    case Reason.cancel:
      message = 'Replay?';
      sound.playAlert();
      break;
    case Reason.win:
      message = 'YOU WON! 🎉';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'YOU LOST! 💩';
      sound.playBug();
      break;
    default:
      throw new Error('not valid reason');
  }

  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
