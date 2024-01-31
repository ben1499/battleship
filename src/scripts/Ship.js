export default function Ship(length) {
    let hitCount = 0;

    const hit = () => {
        hitCount++;
    }

    const isSunk = () => {
        if (hitCount >= length) return true;
        return false;
    }

    return {
        length,
        get hitCount() {
            return hitCount;
        },
        hit,
        isSunk,
    }
}