import { makeMove, moveCount, startGame, restartGame } from "./gameController";

const content = document.querySelector("#content");

const gameContainer = document.createElement("div");

gameContainer.classList.add("game-container");

const titleContainer = document.createElement("div");
titleContainer.classList.add("title-container");
titleContainer.textContent = "Battleship";

content.append(titleContainer);

content.appendChild(gameContainer);

function renderPlayerBoard(playerBoard) {
  const boardContainer = document.createElement("div");
  boardContainer.setAttribute("id", "player-board");

  playerBoard.board.forEach((rowArray, rowIndex) => {
    const row = document.createElement("div");
    rowArray.forEach((cellItem, columnIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      let isShip = false;

      if (cellItem != null) cell.style.backgroundColor = "orange";

      row.appendChild(cell);

      cell.addEventListener("click", (e) => {
        if (moveCount % 2 == 0) return;
        const boardNodeList = document.querySelectorAll("#player-board > div");

        if (cellItem != null) {
          isShip = true;
          makeMove(rowIndex, columnIndex, boardNodeList, isShip);
          if (cellItem.isSunk()) {
            highlightSunkShip(cellItem, playerBoard.board, false);
            if (playerBoard.checkAllSunk()) {
              displayGameWinner("enemy");
            }
          }
        } else {
          makeMove(rowIndex, columnIndex, boardNodeList, isShip);
        }
      });
    });
    row.style.display = "flex";
    boardContainer.appendChild(row);
  });

  gameContainer.appendChild(boardContainer);
}

function renderEnemyBoard(enemyBoard, enemy) {
  const boardContainer = document.createElement("div");
  boardContainer.setAttribute("id", "enemy-board");

  enemyBoard.board.forEach((rowArray, rowIndex) => {
    const row = document.createElement("div");
    rowArray.forEach((cellItem, columnIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.id = `${rowIndex}-${columnIndex}`;
      row.appendChild(cell);

      cell.addEventListener("click", (e) => {
        if (moveCount % 2 !== 0) return;
        const boardNodeList = document.querySelectorAll("#enemy-board > div");
        let isShip = false;

        if (
          cell.textContent != "" ||
          enemyBoard.board[rowIndex][columnIndex] == "Missed"
        )
          return;

        if (cellItem != null && cell.textContent == "") {
          isShip = true;
          makeMove(rowIndex, columnIndex, boardNodeList, isShip);
          if (cellItem.isSunk()) {
            highlightSunkShip(cellItem, enemyBoard.board);

            if (enemyBoard.checkAllSunk()) {
              displayGameWinner("player");
              console.log("You win");
            }
          }
        } else {
          makeMove(rowIndex, columnIndex, boardNodeList, isShip);
        }
      });
    });

    row.style.display = "flex";
    boardContainer.appendChild(row);
  });

  gameContainer.appendChild(boardContainer);
}

function markPosition(x, y, board, isShip = false) {
  const cell = board[x].childNodes[y];
  if (isShip) cell.textContent = "X";
  else cell.style.backgroundColor = "#ffa99a";
}

function highlightSunkShip(ship, board, isEnemyBoard = true) {
  let boardNodeList;
  if (isEnemyBoard)
    boardNodeList = document.querySelectorAll("#enemy-board > div");
  else boardNodeList = document.querySelectorAll("#player-board > div");
  board.forEach((row, rowIndex) => {
    row.forEach((item, itemIndex) => {
      if (item == ship) {
        boardNodeList[rowIndex].childNodes[itemIndex].style.backgroundColor =
          "blue";
      }
    });
  });
}

function makeComputerMove(player) {
  const playerBoard = document.querySelectorAll("#player-board > div");
  const coord = player.randomAttack();
  const [x, y] = coord;
  console.log(x, typeof x);
  console.log(y, typeof y);
  playerBoard[x].childNodes[y].click();
}

function resetDOM() {
  gameContainer.textContent = "";
  const dialog = document.querySelector(".result-dialog");

  dialog.remove();

  restartGame();
}

function displayGameWinner(winner) {
  const resultDialog = document.createElement("div");
  resultDialog.classList.add("result-dialog");
  const result = document.createElement("div");
  const btnContainer = document.createElement("div");
  const playButton = document.createElement("button");

  if (winner == "player") result.textContent = "You won";
  else result.textContent = "You lost";

  playButton.textContent = "Play Again";

  playButton.addEventListener("click", resetDOM);

  btnContainer.appendChild(playButton);

  resultDialog.append(result, btnContainer);

  content.append(resultDialog);
}

function displayShipPlacementDialog(board, ships) {
  let shipIndex = 0;
  // let isShipHorizontal = true;
  let isPositionValid = true;
  let placedShips = [];

  const body = document.querySelector("body");

  const dialog = document.createElement("div");
  dialog.classList.add("setup-dialog");

  const heading = document.createElement("div");
  heading.textContent = "Battleship Game";

  const selectedShipText = document.createElement("div");
  selectedShipText.textContent = "";

  // const rotateBtn = document.createElement("button");
  // rotateBtn.textContent = "Rotate";

  const selectionContainer = document.createElement("div");
  selectionContainer.setAttribute("id", "selection-container");
  const boardContainer = document.createElement("div");
  boardContainer.setAttribute("id", "selection-board");

  const shipsContainer = document.createElement("div");
  shipsContainer.setAttribute("id", "ships-container");

  const actionsContainer = document.createElement("div");
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  const startBtn = document.createElement("button");
  startBtn.textContent = "Start";

  actionsContainer.append(resetBtn, startBtn);

  let draggedShip;
  let draggedShipSize;
  let draggedItem;

  const checkPositionFree = (x, y, size, isShipHorizontal = true) => {
    const boardNodeList = document.querySelectorAll("#selection-board > div");

    // [2][3] size = 5
    if (isShipHorizontal) {
      for (let i = y; i < y + draggedShipSize; i++) {
        const cell = boardNodeList[x].childNodes[i];
        if (cell.classList.contains("placed-ship")) return false;
        else return true;
      }
    }
  };

  const checkPositionValidity = (x, y, size, isShipHorizontal = true) => {
    const boardNodeList = document.querySelectorAll("#selection-board > div");

    let incrementedCoord;

    // [2][3] size = 5
    if (isShipHorizontal) {
      incrementedCoord = y + size;

      if (incrementedCoord <= 10) {
        for (let i = y; i < incrementedCoord; i++) {
          const cell = boardNodeList[x].childNodes[i];
          if (cell.classList.contains("placed-ship")) return false;
          // else break;
        }

        let upperRow;

        if (x != 0) {
          upperRow = x - 1;
          for (let i = y; i < y + size; i++) {
            const cell = boardNodeList[upperRow].childNodes[i];
            if (cell.classList.contains("placed-ship")) return false;
            // else return true;
          }
        }

        let lowerRow;
        if (x != 9) {
          lowerRow = x + 1;
          for (let i = y; i < y + size; i++) {
            const cell = boardNodeList[lowerRow].childNodes[i];
            if (cell.classList.contains("placed-ship")) return false;
            // else return true;
          }
        }

        // Check if adjacent coordinates have a ship
        if (
          y - 1 > 0 &&
          boardNodeList[x].childNodes[y - 1].classList.contains("placed-ship")
        )
          return false;
        if (
          incrementedCoord < 9 &&
          boardNodeList[x].childNodes[incrementedCoord].classList.contains(
            "placed-ship"
          )
        )
          return false;

        // Check if diagonal coordinates have a ship
        if (
          x - 1 > 0 &&
          y - 1 > 0 &&
          boardNodeList[x - 1].childNodes[y - 1].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          x + 1 < 10 &&
          y - 1 > 0 &&
          boardNodeList[x + 1].childNodes[y - 1].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          x - 1 > 0 &&
          incrementedCoord < 9 &&
          boardNodeList[x - 1].childNodes[incrementedCoord].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          x + 1 < 10 &&
          incrementedCoord < 9 &&
          boardNodeList[x + 1].childNodes[incrementedCoord].classList.contains(
            "placed-ship"
          )
        )
          return false;

        return true;
      } else {
        return false;
      } // If ship vertical
    } else {
      incrementedCoord = x + size;

      if (incrementedCoord <= 10) {
        for (let i = x; i < incrementedCoord; i++) {
          const cell = boardNodeList[i].childNodes[y];
          if (cell.classList.contains("placed-ship")) return false;
        }

        let leftColumn;

        if (y != 0) {
          leftColumn = y - 1;
          for (let i = x; i < x + size; i++) {
            const cell = boardNodeList[i].childNodes[leftColumn];
            if (cell.classList.contains("placed-ship")) return false;
          }
        }

        let rightColumn;
        if (y != 9) {
          rightColumn = y + 1;
          for (let i = x; i < x + size; i++) {
            const cell = boardNodeList[i].childNodes[rightColumn];
            if (cell.classList.contains("placed-ship")) return false;
          }
        }

        // Check if adjacent coordinates have a ship
        if (
          x - 1 > 0 &&
          boardNodeList[x - 1].childNodes[y].classList.contains("placed-ship")
        )
          return false;
        if (
          incrementedCoord < 9 &&
          boardNodeList[incrementedCoord].childNodes[y].classList.contains(
            "placed-ship"
          )
        )
          return false;

        // Check if diagonal coordinates have a ship
        if (
          x - 1 > 0 &&
          y - 1 > 0 &&
          boardNodeList[x - 1].childNodes[y - 1].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          y + 1 < 10 &&
          x - 1 > 0 &&
          boardNodeList[x - 1].childNodes[y + 1].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          y - 1 > 0 &&
          incrementedCoord < 9 &&
          boardNodeList[incrementedCoord].childNodes[y - 1].classList.contains(
            "placed-ship"
          )
        )
          return false;
        if (
          y + 1 < 10 &&
          incrementedCoord < 9 &&
          boardNodeList[incrementedCoord].childNodes[y + 1].classList.contains(
            "placed-ship"
          )
        )
          return false;

        return true;
      }
    }
  };

  const changePlacedShipOrientation = (shipType, isHorizontal) => {
    console.log(isHorizontal);
    placedShips = placedShips.map((item) =>
      item.name == shipType ? { ...item, isHorizontal } : item
    );
  };

  const handleShipClick = (e) => {
    const boardNodeList = document.querySelectorAll("#selection-board > div");

    let [startX, startY] = e.target.dataset.start.split("-");
    startX = parseInt(startX);
    startY = parseInt(startY);

    const size = parseInt(e.target.dataset.size);
    const isHorizontal = Boolean(parseInt(e.target.dataset.isH));
    console.log(isHorizontal);

    if (isHorizontal) {
      let firstCell = boardNodeList[startX].childNodes[startY];
      let secondCell = boardNodeList[startX].childNodes[startY + 1];
      firstCell.classList.remove("placed-ship");
      secondCell.classList.remove("placed-ship");
      const isValid = checkPositionValidity(startX, startY, size, false);
      let shipType;

      if (isValid) {
        for (let i = startY; i < startY + size; i++) {
          const cell = boardNodeList[startX].childNodes[i];
          cell.classList.remove("placed-ship");
          delete cell.dataset.size;
          delete cell.dataset.start;
          delete cell.dataset.isH;
          shipType = cell.dataset.shipType;
          delete cell.dataset.shipType;
          cell.style.backgroundColor = "limegreen";
        }

        for (let i = startX; i < startX + size; i++) {
          const cell = boardNodeList[i].childNodes[startY];
          cell.classList.add("placed-ship");
          cell.dataset.size = size;
          cell.dataset.start = `${startX}-${startY}`;
          cell.dataset.isH = "0"; // false
          cell.dataset.shipType = shipType;
          cell.style.backgroundColor = "red";
        }

        changePlacedShipOrientation(shipType, false);
        console.log(placedShips);
      } else {
        firstCell.classList.add("placed-ship");
        secondCell.classList.add("placed-ship");
      }
    } else {
      let firstCell = boardNodeList[startX].childNodes[startY];
      let secondCell = boardNodeList[startX + 1].childNodes[startY];
      firstCell.classList.remove("placed-ship");
      secondCell.classList.remove("placed-ship");
      const isValid = checkPositionValidity(startX, startY, size);
      let shipType;

      if (isValid) {
        for (let i = startX; i < startX + size; i++) {
          const cell = boardNodeList[i].childNodes[startY];
          cell.classList.remove("placed-ship");
          delete cell.dataset.size;
          delete cell.dataset.start;
          delete cell.dataset.isH;
          shipType = cell.dataset.shipType;
          delete cell.dataset.shipType;
          cell.style.backgroundColor = "limegreen";
        }

        for (let i = startY; i < startY + size; i++) {
          const cell = boardNodeList[startX].childNodes[i];
          cell.classList.add("placed-ship");
          cell.dataset.size = size;
          cell.dataset.start = `${startX}-${startY}`;
          cell.dataset.isH = "1"; // true
          cell.dataset.shipType = shipType;
          cell.style.backgroundColor = "red";
        }

        changePlacedShipOrientation(shipType, true);
        console.log(placedShips);
      } else {
        firstCell.classList.add("placed-ship");
        secondCell.classList.add("placed-ship");
      }
    }

    // e.target.removeEventListener("click", handleShipClick);
  };

  ships.forEach((item) => {
    const shipRow = document.createElement("div");

    shipRow.classList.add(`${item.key}`);

    for (let i = 0; i < item.size; i++) {
      const cell = document.createElement("div");
      cell.classList.add("draggable-ship-cell");

      shipRow.appendChild(cell);
      shipRow.setAttribute("draggable", "true");
      shipRow.dataset.size = item.size;
    }

    shipRow.addEventListener("dragstart", (e) => {
      draggedItem = e.target;
      draggedShip = e.target.classList[0];
      draggedShipSize = parseInt(e.target.dataset.size);
    });
    shipsContainer.append(shipRow);
  });

  board.forEach((rowArray, rowIndex) => {
    const row = document.createElement("div");

    rowArray.forEach((cellItem, columnIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.id = `${rowIndex}-${columnIndex}`;
      row.appendChild(cell);

      cell.addEventListener("dragover", (e) => {
        e.preventDefault();

        let [x, y] = cell.dataset.id.split("-");
        x = parseInt(x);
        y = parseInt(y);

        const isPositionValid = checkPositionFree(x, y, draggedShipSize);
        if (isPositionValid) cell.style.backgroundColor = "blue";
      });

      cell.addEventListener("dragleave", (e) => {
        let [x, y] = cell.dataset.id.split("-");
        x = parseInt(x);
        y = parseInt(y);

        const isPositionValid = checkPositionFree(x, y, draggedShipSize);

        if (isPositionValid) cell.style.backgroundColor = "limegreen";
        else cell.style.backgroundColor = "red";
      });

      cell.addEventListener("drop", (e) => {
        e.preventDefault();

        const boardNodeList = document.querySelectorAll(
          "#selection-board > div"
        );

        // console.log("Dropped");
        // console.log(cell.dataset.id);

        let [x, y] = cell.dataset.id.split("-");

        x = parseInt(x);
        y = parseInt(y);

        const isPositionValid = checkPositionValidity(x, y, draggedShipSize);

        console.log(isPositionValid);

        if (isPositionValid) {
          for (let i = y; i < y + draggedShipSize; i++) {
            console.log(i);
            const cell = boardNodeList[x].childNodes[i];
            cell.dataset.start = `${x}-${y}`;
            cell.dataset.size = draggedShipSize;
            cell.dataset.shipType = draggedShip;
            // Is horizontal - 1 for true
            cell.dataset.isH = "1";

            cell.style.backgroundColor = "red";
            cell.classList.add("placed-ship");
            cell.addEventListener("click", handleShipClick);
          }
          placedShips.push({
            name: draggedShip,
            x,
            y,
            size: draggedShipSize,
            isHorizontal: true,
          });
          draggedItem.parentNode.removeChild(draggedItem);
          console.log(placedShips);
        } else {
          cell.style.backgroundColor = "limegreen";
        }
      });
    });

    row.style.display = "flex";
    boardContainer.appendChild(row);
  });

  resetBtn.addEventListener("click", () => {
    dialog.remove();
    displayShipPlacementDialog(board, ships);
  });

  startBtn.addEventListener("click", () => {
    if (placedShips.length == 5) {
      console.log("Start");
      dialog.classList.add("hidden");
      startGame(placedShips);
    }
  });

  selectionContainer.append(boardContainer, shipsContainer);

  dialog.append(
    heading,
    selectedShipText,
    // rotateBtn,
    selectionContainer,
    actionsContainer
  );

  body.append(dialog);
}

export {
  displayShipPlacementDialog,
  renderPlayerBoard,
  renderEnemyBoard,
  markPosition,
  makeComputerMove,
};
