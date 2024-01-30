import Gameboard from "./Gameboard";
import Player from "./Player";
import {
  renderEnemyBoard,
  renderPlayerBoard,
  markPosition,
  makeComputerMove,
  displayShipPlacementDialog,
} from "./DOMController";

let player;
let enemy;
let moveCount = 0;
let playerBoard;
let enemyBoard;

function initializeGame() {
  handlePlaceShip();

  // playerBoard = Gameboard();
  // enemyBoard = Gameboard();

  // playerBoard.placeShip(1, 1, 3);
  // playerBoard.placeShip(3, 3, 2);
  // playerBoard.placeShip(2, 2, 4);
  // playerBoard.placeShip(3, 6, 2);
  // playerBoard.placeShip(5, 3, 3);

  // enemyBoard.placeShip(1, 3, 4);
  // enemyBoard.placeShip(3, 1, 2);
  // enemyBoard.placeShip(2, 3, 3);
  // enemyBoard.placeShip(5, 2, 3);
  // enemyBoard.placeShip(7, 3, 3);

  // player = Player(playerBoard);
  // enemy = Player(enemyBoard);

  // renderPlayerBoard(playerBoard, player);
  // renderEnemyBoard(enemyBoard, enemy);
}

function startGame(shipDetails) {
  playerBoard = Gameboard();
  if (shipDetails.length == 5) {
    shipDetails.forEach((item) => {
      playerBoard.placeShip(item.x, item.y, item.size, item.isHorizontal);
    });
  }

  enemyBoard = Gameboard();

  enemyBoard.placeShip(0, 0, 5);
  enemyBoard.placeShip(3, 7, 4, false);
  enemyBoard.placeShip(2, 3, 3);
  enemyBoard.placeShip(5, 2, 3);
  enemyBoard.placeShip(7, 3, 2);

  player = Player(playerBoard);
  enemy = Player(enemyBoard);

  renderPlayerBoard(playerBoard, player);
  renderEnemyBoard(enemyBoard, enemy);
}

const ships = [
  {
    name: "Carrier",
    key: "carrier",
    size: 5,
  },
  {
    name: "Battleship",
    key: "battleship",
    size: 4,
  },
  {
    name: "Destroyer",
    key: "destroyer",
    size: 3,
  },
  {
    name: "Submarine",
    key: "submarine",
    size: 3,
  },
  {
    name: "Patrol Boat",
    key: "patrol-boat",
    size: 2,
  },
];

function handlePlaceShip() {
  const board = [];
  for (let i = 0; i < 10; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      board[i].push(null);
    }
  }

  displayShipPlacementDialog(board, ships);
}

let isGameWon = false;

function makeMove(x, y, DOMBoard, isShip) {
  if (moveCount % 2 == 0) {
    enemy.attack(x, y);
    markPosition(x, y, DOMBoard, isShip);
    moveCount++;
    // To check only after a certain number of moves, as the method is time consuming
    if (moveCount > 34) {
      isGameWon = enemyBoard.checkAllSunk();
    }
    console.log("Game won?");
    console.log(isGameWon);
    if (!isGameWon) makeComputerMove(player);
  } else {
    markPosition(x, y, DOMBoard, isShip);
    moveCount++;
  }
}

function restartGame() {
  moveCount = 0;
  player = null;
  enemy = null;
  playerBoard = null;
  enemyBoard = null;
  isGameWon = false;
  initializeGame();
}

export { initializeGame, makeMove, moveCount, restartGame, startGame };
