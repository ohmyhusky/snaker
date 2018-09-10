import { Tiles } from '../src/js/data/data_types.js';

export const mapCharToTile = {
  ' ': 0,
  'W': 1,
  'S': 2,
  'F': 3
};
/**
 *
 * @param {string} char
 * @returns {number}
 */
export const fnMapCharToTile = char => mapCharToTile[char];


/**
 * @param {string} string
 * @returns {number[][]}
 */
export const getBoardFromString = string => {
  return string
    .trim()
    .split('\n')
    .map(line => {
      return line.trim().split('').map(fnMapCharToTile);
    });
};

export const getListIterator = list => {
  return (function*() {
    for (let i = 0; i < list.length; i++) {
      yield list[i];
    }
  })();
}

export const nextFruitFromList = positionsList => {
  const iterator = getListIterator(positionsList);
  // will start getting undefined when list is consumed
  return () => {
    return iterator.next().value;
  };
};

/**
 * Checks that two boards are the same in regard to size,
 * and each value is the same (===)
 * @param {number[][]} a
 * @param {number[][]} b
 * @param {boolean} ignoreFruit Ignore fruit not being in same position
 */
export function checkBoards(a, b, ignoreFruit) {
  if (a.length !== b.length) {
    return false;
  }
  for (let rowIndex = 0; rowIndex < a.length; rowIndex++) {
    if (a[rowIndex].length !== b[rowIndex].length) {
      return false;
    }
    for (let colIndex = 0; colIndex < b.length; colIndex++) {
      if (a[rowIndex][colIndex] !== b[rowIndex][colIndex]) {
        if (!ignoreFruit) {
          return false;
        } else if (
          a[rowIndex][colIndex] !== Tiles.Fruit &&
          b[rowIndex][colIndex] !== Tiles.Fruit
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
