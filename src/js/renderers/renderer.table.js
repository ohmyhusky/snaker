

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
/**
 * @typedef {(board: TileInfo[][], element: HTMLElement) => any} InitialRenderFunction
 * @typedef {(customData: any, changes: TickChange[]) => void} ChangesRenderFunction
 */
/**
 * @global
 * @typedef {Object} GameRenderer
 * @property {string} name also used for loading CSS files from ./css/game.[name].css
 * @property {InitialRenderFunction} initialRender
 * Initial render function for setting up DOM
 * @property {ChangesRenderFunction} renderChanges
 * Will be passed the changes from a snake.tick() which need to be re-rendered
 */

/**
 * Not guaranteed to be good code! :(
 * @type {GameRenderer}
 */
export const tableRenderer = {
  name: 'table',

  /**
   * @type {InitialRenderFunction}
   */
  initialRender: (board, element) => {
    const boardInnerFragment = document.createDocumentFragment();
    // setup table stuff first!
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    boardInnerFragment.appendChild(table);

    // ammend the tileInfo.renderData with anything you need to keep rendering
    const customData = board.map(line => {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
      return line.map(tileInfo => {
        const text = [' ','W','S','F'][tileInfo.tileValue];        
        const td = document.createElement('td');
        tr.appendChild(td);
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        fieldset.appendChild(legend);
        legend.innerText = text;
        td.appendChild(fieldset);        
        return legend;
      });
    }, []);

    element.appendChild(boardInnerFragment);
    return customData;
  },

  /**
   * @type {ChangesRenderFunction}
   */
  renderChanges: (customData, changes) => {
    changes.forEach(change => {
      const tileElem = customData[change.position.y][change.position.x];      
      tileElem.innerText = [' ','W','S','F'][change.tileValue];
    });
  }
};
