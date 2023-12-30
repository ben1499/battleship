import Ship from "./Ship";

export default function Gameboard() {
  const board = [];
  const hitItems = [];
  const missedCoordinates = [];

  for (let i = 0; i < 10; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      board[i].push(null);
    }
  }

  const checkMoveValidity = (x, y, size) => {
    for (let i = 0; i < size; i++) {
      if (board[x][y] != null) return false;
      y++;
    }

    return true;
  };

  const placeShip = (x, y, size) => {
    if (checkMoveValidity(x, y, size) == false) return "Space occupied";

    const newShip = Ship(size);
    for (let i = 0; i < size; i++) {
      board[x][y] = newShip;
      y++;
    }
  };

  const receiveAttack = (x, y) => {
    for (let coord of missedCoordinates) {
      let [row, col] = coord.split("-");

      row = parseInt(row);
      col = parseInt(col);

      if (row == x && col == y) return;
    }

    let item = board[x][y];

    if (item && item.isHit == true) return "Already attacked position";
    if (typeof item == "object" && item != null) {
      // Reference to the object in the board
      item.hit();
      hitItems.push(`[${x}][${y}]`);
    } else {
      missedCoordinates.push(`${x}-${y}`);
      board[x][y] = "Missed";
    }
  };

  const checkAllSunk = () => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j] == null) continue;
        else {
          let item = board[i][j];
          if (item.isSunk() == false) return false;
        }
      }
    }
    return true;
  };

  return {
    get board() {
      return board;
    },
    get missedCoordinates() {
      return missedCoordinates;
    },
    placeShip,
    receiveAttack,
    checkAllSunk,
  };
}
