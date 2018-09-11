import { Tiles, Direction } from "./data/data_types.js";

/**
 * @param {SnakeConfigParams} config
 * @returns {Snake}
 */
export const createSnake = config => {
  return new Snake(config);
};

function getRandomInt(mod = 10) {
  return Math.floor(Math.random() * 1000) % mod;
}

/**
 * @type {Snake}
 */
class Snake {
  /**
   * @param {SnakeConfigParams} config
   */
  constructor(config = {}) {
    const hasOwn = Object.prototype.hasOwnProperty;
    let columns, rows;

    if (hasOwn.call(config, "columns") && !hasOwn.call(config, "rows")) {
      columns = config.columns;
      config.rows = config.columns;
    } else if (hasOwn.call(config, "columns") && !hasOwn.call(config, "rows")) {
      rows = config.rows;
      config.columns = config.rows;
    } else if (!hasOwn.call(config, "columns") && !hasOwn.call(config, "rows")) {
      columns = 20;
      rows = 20;
      config.columns = columns;
      config.rows = rows;
    } else {
      columns = config.columns;
      rows = config.rows;
    }

    this._config = Object.assign({}, config);

    if (!columns && rows && typeof rows === "number") {
      columns = rows;
    } else if (!rows && columns && typeof columns === "number") {
      rows = columns;
    }

    if (
      columns &&
      typeof columns === "number" &&
      columns > 4 &&
      Math.floor(columns) === columns &&
      rows &&
      typeof rows === "number" &&
      rows > 4 &&
      Math.floor(rows) === rows
    ) {
      // currently ignores the config!
      // starts with a copy of defaultBoard (21x21),
      // with a snake in the middle, moving to the right

      this._board = [];
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          this._board[y] = this._board[y] || [];
          if (x === 0 || x === columns - 1 || y === 0 || y === rows - 1) {
            this._board[y][x] = Tiles.Wall;
          } else {
            this._board[y][x] = Tiles.Empty;
          }
        }
      }
      this._snake = [{ y: Math.floor(rows / 2), x: Math.floor(columns / 2) }];
      this._direction = Direction.Right;
      const fruitPosition = this.generateNewFruitPosition();
      this._board[fruitPosition.y][fruitPosition.x] = Tiles.Fruit;
      this._fruitPosition = fruitPosition;
    } else {
      throw Error("Invalid arguments");
    }
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
    if (
      position &&
      typeof position.x === "number" &&
      position.x >= 0 &&
      position.x < this._config.columns &&
      typeof position.y === "number" &&
      position.y >= 0 &&
      position.y < this._config.rows
    ) {
      return this.getBoard()[position.y][position.x];
    } else {
      console.error("Invalid position");
    }
  }

  isValidFruitPosition(position) {
    return (
      position.x > 0 &&
      position.x < this._config.columns - 1 &&
      position.y > 0 &&
      position.y < this._config.rows - 1 &&
      this.getBoard()[position.y][position.x] !== Tiles.Snake
    );
  }

  generateNewFruitPosition() {
    let x = 0,
      y = 0;
    do {
      if (this._config.nextFruitFn) {
        const position = this._config.nextFruitFn();
        x = position.x;
        y = position.y;
      } else {
        x = getRandomInt(this._config.columns);
        y = getRandomInt(this._config.rows);
      }
    } while (!this.isValidFruitPosition({ x, y }));
    return {
      x,
      y
    };
  }

  /**
   * @param {number} direction Direction value for this position
   */
  setDirection(direction) {
    // hopefully direction is one of the values from Direction import.
    if (
      Object.keys(Direction)
        .map(k => Direction[k])
        .includes(direction) &&
      this._direction !== direction &&
      Math.abs(this._direction - direction) !== 2
    ) {
      this._direction = direction;
    }
  }

  /**
   * @returns {TickReturn}
   */
  tick() {
    // very simple movement code which assumes a single length snake
    // no eating or dieing implemented yet.

    let tail = { ...this._snake[this._snake.length - 1] };
    const oldHead = { ...this._snake[0] };
    if (this._direction === Direction.Up) {
      this._snake[0].y -= 1;
    } else if (this._direction === Direction.Down) {
      this._snake[0].y += 1;
    } else if (this._direction === Direction.Left) {
      this._snake[0].x -= 1;
    } else if (this._direction === Direction.Right) {
      this._snake[0].x += 1;
    }

    let justAteFruit = !1;
    let gameOver = !1;
    if (
      this._fruitPosition &&
      this._snake[0].x === this._fruitPosition.x &&
      this._snake[0].y === this._fruitPosition.y
    ) {
      justAteFruit = !0;
    }

    if (
      this._snake[0].x === 0 ||
      this._snake[0].x === this._config.columns - 1 ||
      this._snake[0].y === 0 ||
      this._snake[0].y === this._config.rows - 1
    ) {
      gameOver = !0;
    }

    if (!gameOver && this._snake.length > 4) {
      for (let i = 3; i < this._snake.length && !gameOver; i++) {
        if (
          this._snake[0].x === this._snake[i].x &&
          this._snake[0].y === this._snake[i].y
        ) {
          gameOver = !0;
        }
      }
    }

    let newFruitPosition;
    if (justAteFruit) {
      this._snake = [this._fruitPosition, oldHead, ...this._snake.slice(1)];
      newFruitPosition = this.generateNewFruitPosition();
      this._board[newFruitPosition.y][newFruitPosition.x] = Tiles.Fruit;
    } else if (this._snake.length > 1) {
      for (let i = this._snake.length - 1; i > 1; i--) {
        this._snake[i] = this._snake[i - 1];
      }
      this._snake[1] = oldHead;
    }

    const changes = [
      {
        position: this._snake[0],
        tileValue: Tiles.Snake
      }
    ];

    if (justAteFruit) {
      changes.push({
        position: newFruitPosition,
        tileValue: Tiles.Fruit
      });

      this._fruitPosition = newFruitPosition;
    } else if (!(tail.x === this._snake[0].x && tail.y === this._snake[0].y)) {
      changes.push({
        position: tail,
        tileValue: Tiles.Empty
      });
    }

    return {
      gameOver,
      eating: justAteFruit,
      changes
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
