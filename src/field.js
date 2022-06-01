'use strict';

import * as sound from './sound.js';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});
export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    // this.field.addEventListener('click', (event) => this.onClick(event)); //binding
    this.field.addEventListener('click', this.onClick);
  }

  init() {
    this.field.innerHTML = ''; // to prevent it from continuing to be created
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.bugCount, 'img/bug.png');
  }

  setClickListner(onItemClick) {
    this.onItemClick = onItemClick;
  }

  //_ means private in this case
  _addItem(className, count, imgPath) {
    const x1 = 0; // min
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE; // max
    const y2 = this.fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  //binding
  onClick = (event) => {
    // this condition is to prevent clicking carrot or bug after game finished
    if (!document.querySelector('.pop-up--hide')) {
      return;
    }

    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  };
}

// static
function randomNumber(min, max) {
  // min included, max not included
  return Math.random() * (max - min) + min;
}
