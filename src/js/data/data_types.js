/*
  Some constants which are imported and used between modules.
*/

/**
 * Enum for Tiles
 * @readonly
 * @enum {number}
 */
export const Tiles = {
  Empty: 0,
  Wall: 1,
  Snake: 2,
  Fruit: 3
};

/**
 * Enum for Directions
 * @readonly
 * @enum {number}
 */
export const Direction = {
  Up: 1,
  Left: 2,
  Down: 3,
  Right: 4
};

export const KeyDirectionMap = {
  'w': Direction.Up,
  'W': Direction.Up,
  'ArrowUp': Direction.Up,
  's': Direction.Down,
  'S': Direction.Down,
  'ArrowDown': Direction.Down,
  'a': Direction.Left,
  'A': Direction.Left,
  'ArrowLeft': Direction.Left,
  'd': Direction.Right,
  'D': Direction.Right,
  'ArrowRight': Direction.Right,
};
