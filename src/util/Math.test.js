import Math from "./Math";

test('Math round', () => {
    expect(Math.round(2.6)).toBe(3);
    expect(Math.round(-2.6)).toBe(-3);
    expect(Math.round(-1.5)).toBe(-1);
    expect(Math.round(0.2)).toBe(0);
});

test('Math floor', () => {
    expect(Math.floor(2.9999)).toBe(2);
    expect(Math.floor(2.6)).toBe(2);
    expect(Math.floor(-2.6)).toBe(-3);
    expect(Math.floor(-1.5)).toBe(-2);
    expect(Math.floor(0.2)).toBe(0);
});

test('Math ceil', () => {
    expect(Math.ceil(2.9999)).toBe(3);
    expect(Math.ceil(2.6)).toBe(3);
    expect(Math.ceil(-2.6)).toBe(-2);
    expect(Math.ceil(-1.5)).toBe(-1);
    expect(Math.ceil(0.2)).toBe(1);
});