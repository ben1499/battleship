import Gameboard from "./Gameboard";
import Player from "./Player";

const playerBoard = Gameboard();
const enemyBoard = Gameboard();

playerBoard.placeShip(1, 1, 3);
playerBoard.placeShip(3, 3, 2);
playerBoard.placeShip(2, 2, 4);
playerBoard.placeShip(3, 6, 2);
playerBoard.placeShip(5, 3, 3);

enemyBoard.placeShip(1, 3, 4);
enemyBoard.placeShip(3, 1, 2);
enemyBoard.placeShip(2, 3, 3);
enemyBoard.placeShip(4, 3, 1);
enemyBoard.placeShip(5, 2, 3);

const player = Player(playerBoard);
const enemy = Player(enemyBoard);

