import { Direction, Tiles, KeyDirectionMap } from './data/data_types.js';

import { createSnake } from './snake.candidate.js';

import { tableRenderer } from './renderers/renderer.table.js';
import { candidateRenderer } from './renderers/renderer.candidate.js';

/**
 * Class to init onto element and run UI for snake
 */
class GameUi {
  /**
   * @param {HTMLElement} element
   * @param {GameRenderer} renderer
   */
  constructor(element, renderer) {
    this._element = element;

    this._config = {
      renderer,
    };

    this._gameSpeedStart = 200;
    this._gameSpeedUpdate = 5;
    this._gameSpeedMin = 32;

    /**
     * @type {number}
     */
    this._lastPressedDirection = null;
    this._gameSpeed = this._gameSpeedStart;

    this._nextUpdateTime = -1;
    this._running = false;

    this._paused = false;

    /**
     * @type {number | null}
     */
    this._timeoutId = null;
    this._boundTimeout = this.timeout.bind(this);

    this._snake = createSnake({
      rows: 21,
      columns: 21,
      nextFruitFn: undefined,
    });

    /**
     * @type {any}
     */
    this._rendererCustomData = null;

    this.setupForRenderer();
    this.init();
    this.startRunning();
  }

  setupForRenderer() {
    const linkElement = document.getElementById('css-link');
    const currentCssHref = linkElement.getAttribute('href');
    const newCssHref = `./css/game.${this._config.renderer.name}.css`;
    if (newCssHref !== currentCssHref) {
      linkElement.setAttribute('href', newCssHref);
    }

    this.bindArrow();
  }

  init() {
    const preRenderedBoard = this._snake.getBoard().map((row, yIndex) => {
      return row.map((tileValue, xIndex) => {
        return {
          position: {
            x: xIndex,
            y: yIndex
          },
          tileValue
        };
      });
    }, []);

    this._rendererCustomData = this._config.renderer.initialRender(
      preRenderedBoard,
      this._element
    );
  }

  togglePaused() {
    if (!this._running) {
      this.startRunning();
    } else {
      this._paused = !this._paused;
      this._element.classList.toggle('paused', this._paused);
    }
  }

  tick() {
    if (this._lastPressedDirection) {
      this._snake.setDirection(this._lastPressedDirection);
      this._lastPressedDirection = null;
    }
    const tickReturn = this._snake.tick();
    if (!tickReturn.gameOver) {
      if (tickReturn.eating) {
        this._gameSpeed -= this._gameSpeedUpdate;
        if (this._gameSpeed < this._gameSpeedMin) {
          this._gameSpeed = this._gameSpeedMin;
        }
      }
      this.handleAndRenderChanges(tickReturn.changes);
    } else {
      this.handleGameOverRender();
    }
    return tickReturn.eating;
  }

  handleAndRenderChanges(changes) {
    this._config.renderer.renderChanges(this._rendererCustomData, changes);
  }

  handleGameOverRender() {
    this._element.classList.add('gameover');
    this.stopRunning();
  }

  move(direction) {
    this._lastPressedDirection = direction;
  }

  /* PART 1 - keyboard controls */

  bindArrow() {
    document.body.addEventListener('keyup', e => KeyDirectionMap[e.key] && this.move(KeyDirectionMap[e.key]));
  }

  /* PART 1 - change setTimeout operation to requestAnimationFrame */
  timeout() {
    this.tick();

    if (this._running) {
      this._timeoutId = window.setTimeout(this._boundTimeout, this._gameSpeed);
    }
  }

  startRunning() {
    this._timeoutId = window.setTimeout(this._boundTimeout, this._gameSpeed);
    this._running = true;
  }

  stopRunning() {
    window.clearTimeout(this._timeoutId);
    this._running = false;
  }

}

document.addEventListener('DOMContentLoaded', () => {
  /** Part 3 - change this to candidateRenderer when you're ready */
  const renderer = tableRenderer;

  const game = new GameUi(document.getElementById('snake-game'), renderer);
});
