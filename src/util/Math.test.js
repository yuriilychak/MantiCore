import Math from "./Math";

test('Math.abs', () => {
    expect(Math.abs(2.9999)).toBe(2.9999);
    expect(Math.abs(2.6)).toBe(2.6);
    expect(Math.abs(-2.6)).toBe(2.6);
    expect(Math.abs(-1.5)).toBe(1.5);
    expect(Math.abs(0.2)).toBe(0.2);
});

test('Math.binaryIndexOf', () => {
    expect(Math.binaryIndexOf(3, [3, 4, 5, 8])).toBe(0);
    expect(Math.binaryIndexOf(9, [3, 4, 5, 8])).toBe(-1);
    expect(Math.binaryIndexOf(8, [3, 4, 5, 8])).toBe(3);
});

test('Math.ceil', () => {
    expect(Math.ceil(2.9999)).toBe(3);
    expect(Math.ceil(2.6)).toBe(3);
    expect(Math.ceil(-2.6)).toBe(-2);
    expect(Math.ceil(-1.5)).toBe(-1);
    expect(Math.ceil(0.2)).toBe(1);
});

test('Math.divPowTwo', () => {
    expect(Math.divPowTwo(2.9999)).toBe(1);
    expect(Math.divPowTwo(4, 2)).toBe(1);
    expect(Math.divPowTwo(-4, 1)).toBe(-2);
    expect(Math.divPowTwo(0, 3)).toBe(0);
    expect(Math.divPowTwo(0.2, 2)).toBe(0);
});

test('Math.floor', () => {
    expect(Math.floor(2.9999)).toBe(2);
    expect(Math.floor(2.6)).toBe(2);
    expect(Math.floor(-2.6)).toBe(-3);
    expect(Math.floor(-1.5)).toBe(-2);
    expect(Math.floor(0.2)).toBe(0);
});

test('Math.intPow', () => {
    expect(Math.intPow(0, 3)).toBe(0);
    expect(Math.intPow(2.5, 2)).toBe(6.25);
    expect(Math.intPow(-2, 2)).toBe(4);
    expect(Math.intPow(-3, 3)).toBe(-27);
    expect(Math.intPow(0.2, 2)).toBe(0.04);
});

test('Math.multPowTwo', () => {
    expect(Math.multPowTwo(2.9999)).toBe(4);
    expect(Math.multPowTwo(4, 2)).toBe(16);
    expect(Math.multPowTwo(-4, 1)).toBe(-8);
    expect(Math.multPowTwo(0, 3)).toBe(0);
    expect(Math.multPowTwo(0.2, 2)).toBe(0);
});

test('Math.round', () => {
    expect(Math.round(2.6)).toBe(3);
    expect(Math.round(-2.6)).toBe(-3);
    expect(Math.round(-1.5)).toBe(-1);
    expect(Math.round(0.2)).toBe(0);
});

test('Math.sign', () => {
    expect(Math.sign(2.9999)).toBe(1);
    expect(Math.sign(0)).toBe(1);
    expect(Math.ceil(-1)).toBe(-1);
});

test('Math.toFixed', () => {
    expect(Math.toFixed(2.9999)).toBe(2.99);
    expect(Math.toFixed(-2.9999)).toBe(-2.99);
    expect(Math.toFixed(0)).toBe(0);
    expect(Math.toFixed(-1)).toBe(-1);
});

test('Math.toSeconds', () => {
    expect(Math.toSeconds(8)).toBe(0.008);
    expect(Math.toSeconds(25390)).toBe(25.39);
    expect(Math.toSeconds(0)).toBe(0);
    expect(Math.toSeconds(1000)).toBe(1);
});

test('Math.toMilliseconds', () => {
    expect(Math.toMilliseconds(2.9999)).toBe(3000);
    expect(Math.toMilliseconds(2.999)).toBe(2999);
    expect(Math.toMilliseconds(0)).toBe(0);
    expect(Math.toMilliseconds(1)).toBe(1000);
});

