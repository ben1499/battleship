import Gameboard from "../Gameboard";
import Player from "../Player";

test("Player attack", () => {
    const newBoard = Gameboard();

    const newPlayer = Player(newBoard);

    newPlayer.attack(2, 3);

    expect(newBoard.board[2][3]).toBe("Missed");
})