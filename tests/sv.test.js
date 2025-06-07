const {sv, state, reset} = require('../sv');

beforeEach(() => {
  reset();
  global.requestAnimationFrame = (cb) => cb();
});

test('history keeps max 50 entries and index at latest', () => {
  for (let i = 0; i < 60; i++) {
    state.e.l.e.value = 'text'+i;
    sv('l');
  }
  expect(state.s.l.h.length).toBe(50);
  expect(state.s.l.i).toBe(49);
  expect(state.s.l.h[state.s.l.i]).toBe('text59');
});
