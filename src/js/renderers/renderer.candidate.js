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
  name: 'candidate',

  /**
   * @param {TileInfo[][]} board 2D Array of TileInfo
   * @param {HTMLElement} element Element to render the board into
   * @returns {any} customData you want passed through to each renderChanges
   */
  initialRender: (board, element) => {
    console.log('candidateRender.initialRender', board, element);
    return {
      hello: 'world'
    };
  },

  /**
 *
 * @param {any} customData custom data which was returned from initialRender
 * @param {TickChange[]} changes Changes to the board which need to be rendered
 */
  renderChanges: (customData, changes) => {
    console.log('candidateRender.renderChanges', customData, changes);
  }
};

