import Gameboard from "../Gameboard";

// test("board structure", () => {
//     let newBoard = Gameboard();
//     expect(newBoard.board).toEqual([]);
// })

test("Ship placed", () => {
    const newBoard = Gameboard();
    newBoard.placeShip(1, 1, 3);

    expect(newBoard.board[1][3]).not.toBeNull();
})

test("Ship placed in occupied position", () => {
    const newBoard = Gameboard();
    newBoard.placeShip(1, 1, 3);

    expect(newBoard.placeShip(1, 1, 3)).toBe("Space occupied");
})

test("Receive Attack", () => {
    const newBoard = Gameboard();
    newBoard.placeShip(1, 1, 3);
    newBoard.receiveAttack(1, 2);
    
    // expect(newBoard.board[1][2].isHit).toBeTruthy(); 
    // expect(newBoard.board[1][3].isHit).toBeFalsy();
    
    expect(newBoard.board[1][3].hitCount).toBe(1);
    
    newBoard.receiveAttack(2, 1);
    
    expect(newBoard.board[2][1]).toBe("Missed");

    newBoard.receiveAttack(1, 3);

    console.log(newBoard.board[1][1].hitCount);
    console.log(newBoard.board[1][2].hitCount);
    console.log(newBoard.board[1][3].hitCount);
    console.log(newBoard.board);

    newBoard.receiveAttack(5, 1);
    
    expect(newBoard.missedCoordinates[1]).toBe("5-1")
})

test("All sunk", () => {
    const newBoard = Gameboard();
    newBoard.placeShip(1, 1, 3);
    newBoard.placeShip(3, 3, 2);

    newBoard.receiveAttack(1, 1)
    newBoard.receiveAttack(1, 2)
    newBoard.receiveAttack(1, 3)

    newBoard.receiveAttack(3, 3)
    newBoard.receiveAttack(3, 4)

    expect(newBoard.checkAllSunk()).toBeTruthy();
    
    newBoard.placeShip(5, 2, 2);

    expect(newBoard.checkAllSunk()).toBeFalsy();
})