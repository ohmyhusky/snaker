import { Tiles, Direction } from "../src/js/data/data_types.js";
import { createSnake } from "../src/js/snake.candidate.js";

describe("Test on game status", function() {
  it("Die when hit wall", () => {
    const s = createSnake({
      columns: 5
    });

    s.tick();
    expect(s.tick().gameOver).toBe(!0);
  });

  it("Eating status change and side effect", () => {
    const fruitPositions = [{ x: 3, y: 2 }, { x: 1, y: 1 }];
    let step = 0;
    const nextFruitFn = jest.fn(() => fruitPositions[step++]);
    const s = createSnake({
      columns: 5,
      nextFruitFn
    });
    const result = s.tick();
    expect(result.gameOver).toBe(!1);
    expect(result.eating).toBe(!0);
    expect(result.changes).toEqual([
      {
        position: {
          x: 3,
          y: 2
        },
        tileValue: Tiles.Snake
      },
      {
        position: {
          x: 1,
          y: 1
        },
        tileValue: Tiles.Fruit
      }
    ]);
    expect(s._snake.length).toBe(2);
    expect(
      s.getTile({
        x: 2,
        y: 2
      })
    ).toBe(Tiles.Snake);
    expect(
      s.getTile({
        x: 3,
        y: 2
      })
    ).toBe(Tiles.Snake);
  });

  it('Snake can respond and only respond to "correct" direction change', () => {
    const s = createSnake();
    s.setDirection(Direction.Left);
    expect(s._direction).toBe(Direction.Right);
    s.setDirection(Direction.Up);
    expect(s._direction).toBe(Direction.Up);
    s.setDirection(Direction.Down);
    expect(s._direction).toBe(Direction.Up);
    s.setDirection(Direction.Left);
    expect(s._direction).toBe(Direction.Left);
    s.setDirection(Direction.Down);
    expect(s._direction).toBe(Direction.Down);
    s.setDirection();
    expect(s._direction).toBe(Direction.Down);
  });

  it("Snake can kill itself by touching itself", () => {
    const fruitPositions = [
      { x: 11, y: 10 },
      { x: 12, y: 10 },
      { x: 13, y: 10 },
      { x: 14, y: 10 },
      { x: 15, y: 10 },
      { x: 16, y: 10 }
    ];
    let step = 0;
    const nextFruitFn = jest.fn(() => fruitPositions[step++]);
    const s = createSnake({
      nextFruitFn
    });

    expect(s.tick().gameOver).toBe(!1);
    expect(s.tick().gameOver).toBe(!1);
    expect(s.tick().gameOver).toBe(!1);
    expect(s.tick().gameOver).toBe(!1);
    expect(s._snake.length).toBe(5);
    s.setDirection(Direction.Down);
    expect(s.tick().gameOver).toBe(!1);
    s.setDirection(Direction.Left);
    expect(s.tick().gameOver).toBe(!1);
    s.setDirection(Direction.Up);
    expect(s.tick().gameOver).toBe(!0);
  });
});
