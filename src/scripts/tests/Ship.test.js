import Ship from "../Ship";

test("hit method", () => {
    const newShip = Ship(3);
    newShip.hit();
    expect(newShip.hitCount).toBe(1);
})

test("isSunk method", () => {
    const newShip = Ship(2);
    expect(newShip.isSunk()).toBe(false);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
})