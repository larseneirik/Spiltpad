/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let ac, e;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="left-pane" class="pane">
      <div class="toolbar"><button data-action="fullscreen" id="left-inner"></button></div>
    </div>
    <div id="right-pane" class="pane">
      <div class="toolbar"><button data-action="fullscreen" id="right-inner"></button></div>
    </div>
    <div id="separator"></div>
  `;

  let code = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
  const target = "const isFullscreen = pane.classList.toggle('fullscreen');";
  const first = code.indexOf(target);
  const second = code.indexOf(target, first + 1);
  if (second > -1) {
    code = code.slice(0, second) + code.slice(second + target.length);
  }
  code += '\nmodule.exports = {ac, e};';
  const context = {window, document, module: {exports: {}}, exports: {}};
  vm.createContext(context);
  vm.runInContext(code, context);
  ac = context.module.exports.ac;
  e = context.module.exports.e;

  // assign mock pane elements
  e.lp = document.getElementById('left-pane');
  e.rp = document.getElementById('right-pane');
  e.sp = document.getElementById('separator');
});

test('fullscreen toggles pane visibility and icon', () => {
  const btn = document.createElement('button');
  btn.innerHTML = 'enter';
  const innerBtn = e.lp.querySelector('[data-action="fullscreen"]');
  innerBtn.innerHTML = 'enter';

  ac.fullscreen('l', btn);

  expect(e.lp.classList.contains('fullscreen')).toBe(true);
  expect(e.rp.style.display).toBe('none');
  expect(e.sp.style.display).toBe('none');
  expect(btn.innerHTML).not.toBe('enter');
  expect(innerBtn.innerHTML).not.toBe('enter');

  const prev = btn.innerHTML;
  ac.fullscreen('l', btn);

  expect(e.lp.classList.contains('fullscreen')).toBe(false);
  expect(e.rp.style.display).toBe('');
  expect(e.sp.style.display).toBe('');
  expect(btn.innerHTML).not.toBe(prev);
});
