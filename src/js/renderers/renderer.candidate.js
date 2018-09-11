import { Tiles } from "../data/data_types.js";
/*
  Part 3 - Renderer
*/
/**
 * @typedef {Object} Position
 * @property {number} Position.x
 * @property {number} Position.y
 */
/**
 * @typedef {Object} TileInfo
 * @property {Position} TileInfo.position
 * @property {number} TileInfo.tileValue
 */
/**
 * @typedef {Object} TickChange
 * @property {Position} TickChange.position
 * @property {number} TickChange.tileValue
 */

export const candidateRenderer = {
  name: "candidate",

  /**
   * @param {TileInfo[][]} board 2D Array of TileInfo
   * @param {HTMLElement} element Element to render the board into
   * @returns {any} customData you want passed through to each renderChanges
   */
  initialRender: (board, element) => {
    const boardInnerFragment = document.createDocumentFragment();

    const customData = board.map(line => {
      return line.map(tileInfo => {
        const tile = document.createElement("div");
        tile.className = ["empty", "wall", "snake", "fruit"][tileInfo.tileValue];
        tileInfo.tileValue !== Tiles.Wall && boardInnerFragment.appendChild(tile);
        return tile;
      });
    }, []);

    const wall = document.createElement("div");
    wall.className = "wall";
    wall.style.setProperty('--rows', `${board.length - 2}`);
    wall.style.setProperty('--columns', `${board[0].length - 2}`);
    wall.appendChild(boardInnerFragment);
    element.appendChild(wall);
    return customData;
  },

  /**
   *
   * @param {any} customData custom data which was returned from initialRender
   * @param {TickChange[]} changes Changes to the board which need to be rendered
   */
  renderChanges: (customData, changes) => {
    changes.forEach(change => {
      const box = customData[change.position.y][change.position.x];
      box.className = ["empty", "wall", "snake", "fruit"][change.tileValue];
    });
  }
};
