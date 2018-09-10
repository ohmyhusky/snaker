import { Tiles, Direction } from './data/data_types.js';

const defaultBoard = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

/**
 * @param {SnakeConfigParams} config
 * @returns {Snake}
 */
export const createSnake = config => {
  return new Snake(config);
};

/**
 * @type {Snake}
 */
class Snake {

  /**
   * @param {SnakeConfigParams} config 
   */
  constructor(config) {
    this._config = Object.assign({}, config);

    // currently ignores the config!
    // starts with a copy of defaultBoard (21x21),
    // with a snake in the middle, moving to the right

    this._board = defaultBoard.map(row => row.slice());
    this._snake = [{ y: 10, x: 10 }];
    this._direction = Direction.Right;
  }

  /**
   * @returns {number[][]} 2D Array of Tiles
   */
  getBoard() {
    // copy the board
    const copy = this._board.map(row => row.slice());
    // copy our snake onto board
    this._snake.forEach(s => {
      copy[s.y][s.x] = Tiles.Snake;
    });
    return copy;
  }

  /**
   * @param {Position} position Tiles value for this position
   */
  getTile(position) {
    // no bounds checking :-(
    return this._board[position.y][position.x];
  }

  /**
   * @param {number} direction Direction value for this position
   */
  setDirection(direction) {
    // hopefully direction is one of the values from Direction import.
    this._direction = direction;
  }

  /**
   * @returns {TickReturn}
   */
  tick() {
   
    // very simple movement code which assumes a single length snake
    // no eating or dieing implemented yet.

    let oldPosition = { ...this._snake[0] };
    if (this._direction === Direction.Up) {
      this._snake[0].y -= 1;
    } else if (this._direction === Direction.Down) {
      this._snake[0].y += 1;
    } else if (this._direction === Direction.Left) {
      this._snake[0].x -= 1;
    } else if (this._direction === Direction.Right) {
      this._snake[0].x += 1;
    }
    
    return {
      gameOver: false,
      eating: false,
      changes: [
        {
          position: oldPosition,
          tileValue: Tiles.Empty
        },
        {
          position: this._snake[0],
          tileValue: Tiles.Snake
        }
      ]
    };
  }

}



/**
 * --- JSDoc Part 2 ---
 */
/**
 * @typedef {Object} Position
 * @property {number} Position.x
 * @property {number} Position.y
 */
/**
 * @typedef {Object} SnakeConfigParams
 * @property {number} SnakeConfigParams.rows
 * @property {number} SnakeConfigParams.columns
 * @property {NextFruitFn=} SnakeConfigParams.nextFruitFn
 */
/**
 * @typedef {Object} Snake
 * @property {(number) => void} Snake.setDirection
 * @property {(Position) => number} Snake.getTile
 * @property {() => TickReturn} Snake.tick
 * @property {() => number[][]} Snake.getBoard
 */
/**
 * @typedef {Object} TickChange
 * @property {Position} TickChange.position
 * @property {number} TickChange.tileValue
 */
/**
 * @typedef {Object} TickReturn
 * @property {boolean} TickReturn.gameOver if the game is over, or already was if tick keeps being called.
 * @property {boolean} TickReturn.eating if a fruit was eaten this tick
 * @property {TickChange[]} TickReturn.changes a list of changes which can be used to render changes
 */
/**
 * @typedef {() => Position} NextFruitFn function which will return next fruit Position
 */