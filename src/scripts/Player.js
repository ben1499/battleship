export default function Player(board) {
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

    if (checkMoveValidity(x, y) == true) {
      attack(x, y);
      // console.log("Computer coord value");
      // console.log(board.board[x][y])

      // if (board.board[x][y] != "Missed") {

      // }
      hitCoordinates.push(`${x}-${y}`);
    } else randomAttack();

    return hitCoordinates[hitCoordinates.length - 1].split("-")
     
  };

  return {
    attack,
    randomAttack,
  };
}
