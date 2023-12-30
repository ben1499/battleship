// import Gameboard from "./Gameboard";

export default function Player(board) {
//   const board = Gameboard();
  const hitCoordinates = [];

  const attack = (x, y) => {
    board.receiveAttack(x, y);
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10);
  };

  const checkMoveValidity = (x, y) => {
    if (hitCoordinates.includes(`${x}-${y}`)) return false;
    return true;
  };

  const randomAttack = () => {
    const x = generateRandomNumber();
    const y = generateRandomNumber();

    if (checkMoveValidity(x, y) == true) board.receiveAttack(x, y);
    else randomAttack();

    hitCoordinates.push(`${x}-${y}`);
  };

  return {
    attack,
    randomAttack,
  }
}
