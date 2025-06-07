const state = {
  s: { l: { h: [], i: -1, c: '' }, r: { h: [], i: -1, c: '' } },
  e: { l: { e: { value: '' } }, r: { e: { value: '' } } },
  st: {}
};

function sv(p) {
  const c = state.e[p].e.value, h = state.s[p];
  if (c === h.c) return;
  h.c = c;
  if (state.st[p]) return;
  state.st[p] = 1;
  requestAnimationFrame(() => {
    if (h.i < h.h.length - 1) h.h = h.h.slice(0, h.i + 1);
    if (h.h[h.i] !== c) {
      h.h.push(c);
      if (h.h.length > 50) h.h.shift();
      h.i = h.h.length - 1;
    }
    state.st[p] = 0;
  });
}

function reset() {
  state.s.l = { h: [], i: -1, c: '' };
  state.e.l = { e: { value: '' } };
  state.st.l = 0;
}

module.exports = { sv, state, reset };
