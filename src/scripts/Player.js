export default function Player(board) {
  const hitCoordinates = [];
  const shipHitCoordinates = [];

  const attack = (x, y) => {
    console.log("Attack coord");
    console.log(x, y);
    board.receiveAttack(x, y);
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10);
  };

  const checkMoveValidity = (x, y) => {
    if (hitCoordinates.includes(`${x}-${y}`) || x > 9 || y > 9) return false;
    return true;
  };

  let isPrevItemHit = false;
  let lastHitItem;
  // let moveCount = 0;
  let itemHitHistory = [];
  let isAttackVertical = false;

  const randomAttack = () => {
    let x = generateRandomNumber();
    let y = generateRandomNumber();

    if (checkMoveValidity(x, y) == true) {
      const initX = x;
      const initY = y;
      if (!isPrevItemHit) {
        const arrayLength = itemHitHistory.length;
        if (arrayLength - 2 > 0 && itemHitHistory[arrayLength - 2] == true) {
          [x, y] = hitCoordinates[hitCoordinates.length - 2].split("-");
          x = parseInt(x);
          y = parseInt(y);
          x = x + 1;
          const isValid = checkMoveValidity(x, y);
          if (isValid) attack(x, y);
          else {
            x = initX;
            y = initY;
            attack(x, y);
          }
          isAttackVertical = true;
        } else {
          isAttackVertical = false;
          attack(x, y);
        }
      } else {
        if (isAttackVertical) {
          [x, y] = hitCoordinates[hitCoordinates.length - 1].split("-");
          x = parseInt(x);
          y = parseInt(y);
          x = x + 1;
          const isValid = checkMoveValidity(x, y);
          if (isValid) attack(x, y);
          else {
            x = initX;
            y = initY;
            attack(x, y);
          }
        } else {
          [x, y] = hitCoordinates[hitCoordinates.length - 1].split("-");
          x = parseInt(x);
          y = parseInt(y);
          y = y + 1;
          const isValid = checkMoveValidity(x, y);
          if (isValid) attack(x, y);
          else {
            x = initX;
            y = initY;
            attack(x, y);
          }
        }
      }
      console.log("Computer coord value");
      console.log(board.board[x][y]);

      const item = board.board[x][y];

      if (item != "Missed") {
        isPrevItemHit = true;
        lastHitItem = `${x}-${y}`;
        itemHitHistory.push(true);
      } else {
        // if (isAttackVertical) isAttackVertical = false;
        isPrevItemHit = false;
        itemHitHistory.push(false);
      }
      hitCoordinates.push(`${x}-${y}`);
    } else randomAttack();

    // moveCount++;
    return hitCoordinates[hitCoordinates.length - 1].split("-");
  };

  return {
    attack,
    randomAttack,
  };
}
