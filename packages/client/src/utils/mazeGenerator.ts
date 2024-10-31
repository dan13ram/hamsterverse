import { Hex } from "viem";

export class MazeGenerator {
  public size: number;
  public maze: number[][];

  constructor(size: number) {
    // Ensure size is odd to have proper walls
    this.size = size % 2 === 0 ? size + 1 : size;
    this.maze = Array(this.size).fill(1).map(() => Array(this.size).fill(1));
  }

  generate() {
    // Start with all walls
    this.maze = Array(this.size).fill(1).map(() => Array(this.size).fill(1));

    // Carve from the entrance
    this.carve(1, 1);

    // Set entrance and exit
    this.maze[0][1] = 0;
    this.maze[this.size - 1][this.size - 2] = 0;

    return this.maze;
  }

  isValidPosition(x: number, y: number) {
    return x > 0 && x < this.size - 1 && y > 0 && y < this.size - 1;
  }

  getUnvisitedNeighbors(x: number, y: number) {
    const directions = [
      [0, 2],   // right
      [2, 0],   // down
      [0, -2],  // left
      [-2, 0]   // up
    ];

    return directions
      .map(([dx, dy]) => ({
        x: x + dx,
        y: y + dy,
        dx: dx / 2,
        dy: dy / 2
      }))
      .filter(({ x, y }) =>
        this.isValidPosition(x, y) && this.maze[x][y] === 1
      );
  }

  carve(x: number, y: number) {
    this.maze[x][y] = 0;  // Mark current cell as path

    // Get all possible unvisited neighbors
    let neighbors = this.getUnvisitedNeighbors(x, y);

    // Randomize neighbor order
    while (neighbors.length > 0) {
      const index = Math.floor(Math.random() * neighbors.length);
      const { x: newX, y: newY, dx, dy } = neighbors[index];

      // Remove the chosen neighbor from the list
      neighbors.splice(index, 1);

      if (this.maze[newX][newY] === 1) {  // If still unvisited
        // Carve the wall between current cell and chosen neighbor
        this.maze[x + dx][y + dy] = 0;
        // Recursively carve from the new cell
        this.carve(newX, newY);
      }
    }
  }

  // Verify if maze is solvable
  isSolvable() {
    const visited = Array(this.size).fill(true).map(() => Array(this.size).fill(false));
    const stack: Array<{ x: number, y: number }> = [{ x: 0, y: 1 }];  // Start at entrance

    while (stack.length > 0) {
      //const { x, y } = stack.pop();
      const { x, y } = stack[stack.length - 1];
      stack.pop();

      if (x === this.size - 1 && y === this.size - 2) {
        return true;  // Reached the exit
      }

      if (!visited[x][y] && this.maze[x][y] === 0) {
        visited[x][y] = true;

        // Add all unvisited neighbors
        [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;

          if (newX >= 0 && newX < this.size &&
            newY >= 0 && newY < this.size &&
            !visited[newX][newY]) {
            stack.push({ x: newX, y: newY });
          }
        });
      }
    }

    return false;
  }

  bytes(): Hex {
    return `0x${this.maze.map(row => row.map(cell => cell ? "02" : "00").join("")).join("")}`;
  }

}
