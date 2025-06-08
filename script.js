// State & DOM cache
const s = {
    l: { h: [], i: -1, c: '' },
    r: { h: [], i: -1, c: '' }
}, e = {}, st = {};

const icons = {
    layoutH: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>',
    layoutV: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"/></svg>',
    viewMd: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd"/></svg>',
    viewText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z"/><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z"/><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z"/></svg>'
};

const $ = (id, q) => q ? document.querySelector(id) : document.getElementById(id);

// Cache elements
function init() {
    ['left', 'right'].forEach(p => {
        const k = p[0];
        e[k] = {
            e: $(`${p}-editor`),
            p: $(`${p}-preview`),
            c: $(`${p}-content`),
            ch: $(`${p}-chars`),
            w: $(`${p}-words`),
            d: $(`${p}-dropdown`)
        };
        s[k] = { h: [], i: -1, c: '' };
    });
    Object.assign(e, {
        ws: $('.workspace', 1),
        lp: $('left-pane'),
        rp: $('right-pane'),
        sp: $('separator'),
        tb: $('toggle-layout-btn'),
        mt: $('main-title'),
        lt: $('left-title'),
        rt: $('right-title'),
        lb: $('load-btn'),
        li: $('load-input'),
        clb: $('clear-local-btn')
    });
}

// Utils
const db = (f, d) => {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => f(...a), d);
    };
};

const th = f => {
    let r;
    return function(...a) {
        if (r) return;
        r = 1;
        requestAnimationFrame(() => {
            f.apply(this, a);
            r = 0;
        });
    };
};

// Change pane accent color
function setPaneAccent(paneElement, accentName) {
    paneElement.classList.forEach(c => {
        if (c.startsWith('accent-')) paneElement.classList.remove(c);
    });
    paneElement.classList.add(`accent-${accentName}`);
    paneElement.setAttribute('data-accent', accentName);
}

// Save state
function sv(p) {
    const c = e[p].e.value, h = s[p];
    if (c === h.c) return;
    h.c = c;
    if (st[p]) return;
    st[p] = 1;
    requestAnimationFrame(() => {
        if (h.i < h.h.length - 1) h.h = h.h.slice(0, h.i + 1);
        if (h.h[h.i] !== c) {
            h.h.push(c);
            if (++h.i > 50) {
                h.h.shift();
                h.i--;
            }
        }
        st[p] = 0;
        saveToLocalStorage();
    });
}

// Update stats & render
function up(p, c = '') {
    const n = c.length, w = c.trim() ? c.trim().split(/\s+/).length : 0;
    e[p].ch.textContent = n + ' chars';
    e[p].w.textContent = w + ' words';
}

function rn(p) {
    const c = e[p].e.value;
    up(p, c);
    if (e[p].c.classList.contains('mode-preview') && marked)
        e[p].p.innerHTML = marked.parse(c);
}

// Input handler
const hi = {
    l: db(() => { sv('l'); rn('l'); }, 100),
    r: db(() => { sv('r'); rn('r'); }, 100)
};

// History
function hs(p, d) {
    const h = s[p];
    let n = d > 0 ? (h.i < h.h.length - 1 ? h.i + 1 : -1) : (h.i > 0 ? h.i - 1 : -1);
    if (n >= 0) {
        h.i = n;
        e[p].e.value = h.h[n];
        h.c = h.h[n];
        rn(p);
    }
}

// Actions
const ac = {
    clear: p => {
        if (confirm('Clear ALL column text?')) {
            e[p].e.value = '';
            s[p].c = '';
            sv(p);
            rn(p);
        }
    },
    undo: p => hs(p, -1),
    redo: p => hs(p, 1),
    preview: (p, b) => {
        e[p].c.classList.toggle('mode-preview');
        const md = e[p].c.classList.contains('mode-preview');
        if (b) {
            b.classList.toggle('active', md);
            b.innerHTML = md ? icons.viewText : icons.viewMd;
        }
        md && rn(p);
    },
    fullscreen: (p, b) => {
        const pane = p === 'l' ? e.lp : e.rp;
        const other = p === 'l' ? e.rp : e.lp;
        const btn = pane.querySelector('.toolbar [data-action="fullscreen"]');
        const enter = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon size-6"><path fill-rule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>';
        const exit = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon size-6"><path fill-rule="evenodd" d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z" clip-rule="evenodd"/></svg>';
        const isFullscreen = pane.classList.toggle('fullscreen');

        other.style.display = isFullscreen ? 'none' : '';
        e.sp.style.display = isFullscreen ? 'none' : '';
        if (btn) btn.innerHTML = isFullscreen ? exit : enter;
        const isFullscreen = pane.classList.toggle('fullscreen');

        if (isFullscreen) {
            other.style.display = 'none';
            e.sp.style.display = 'none';
            b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon size-6"><path fill-rule="evenodd" d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z" clip-rule="evenodd"/></svg>';
        } else {
            other.style.display = '';
            e.sp.style.display = '';
            b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon size-6"><path fill-rule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>';
        }
    }
};

// Build current document state
function getState(d = new Date()) {
    const v = e.ws.classList.contains('vertical');
    return {
        meta: {
            title: e.mt.value || 'document',
            created: d.toISOString(),
            exported: d.toISOString(),
            layout: v ? 'vertical' : 'horizontal'
        },
        columns: [
            {
                name: 'left',
                title: e.lt.value || 'Left Column',
                content: e.l.e.value,
                size: v ? e.lp.style.height || '50%' : e.lp.style.width || '50%'
            },
            {
                name: 'right',
                title: e.rt.value || 'Right Column',
                content: e.r.e.value,
                size: v ? e.rp.style.height || '50%' : e.rp.style.width || '50%'
            }
        ]
    };
}

function validateState(d) {
    return d && d.meta && d.meta.title && d.meta.layout &&
        Array.isArray(d.columns) && d.columns[0] && d.columns[1] &&
        d.columns[0].name === 'left' && d.columns[1].name === 'right';
}

function applyState(d) {
    if (!validateState(d)) return;
    e.mt.value = d.meta.title || '';
    e.lt.value = d.columns[0].title || '';
    e.rt.value = d.columns[1].title || '';
    e.l.e.value = d.columns[0].content || '';
    e.r.e.value = d.columns[1].content || '';

    const v = d.meta.layout === 'vertical';
    e.ws.classList.toggle('vertical', v);
    e.tb.innerHTML = v ? icons.layoutV : icons.layoutH;
    if (v) {
        e.lp.style.height = d.columns[0].size || '50%';
        e.rp.style.height = d.columns[1].size || '50%';
        e.lp.style.width = e.rp.style.width = '100%';
    } else {
        e.lp.style.width = d.columns[0].size || '50%';
        e.rp.style.width = d.columns[1].size || '50%';
        e.lp.style.height = e.rp.style.height = '100%';
    }

    ['l','r'].forEach(p => {
        const val = e[p].e.value;
        s[p] = { h: [val], i: 0, c: val };
    });

    rn('l');
    rn('r');
    mm();
    ['left','right'].forEach(p => {
        const btn = document.querySelector(`#${p}-toolbar [data-action="preview"]`);
        if (btn) {
            btn.innerHTML = icons.viewMd;
            btn.classList.remove('active');
        }
    });
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('splitpad-doc', JSON.stringify(getState()));
    } catch {}
}

function loadFromLocalStorage() {
    const j = localStorage.getItem('splitpad-doc');
    if (!j) return;
    try {
        const d = JSON.parse(j);
        applyState(d);
    } catch {}
}

function clearLocalSave() {
    localStorage.removeItem('splitpad-doc');
}

function handleLoadFile(ev) {
    const f = ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
        try {
            const d = JSON.parse(r.result);
            applyState(d);
            saveToLocalStorage();
        } catch {
            alert('Invalid file');
        }
        ev.target.value = '';
    };
    r.readAsText(f);
}

// Export
function ex() {
    const t = e.mt.value || 'document',
          ct = t.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim() || 'document',
          d = new Date(),
          ts = `${d.getFullYear()}-${(d.getMonth()+1+'').padStart(2,'0')}-${(d.getDate()+'').padStart(2,'0')}_${(d.getHours()+'').padStart(2,'0')}${(d.getMinutes()+'').padStart(2,'0')}`;

    const data = getState(d);
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
    a.download = `${ts} - ${ct.toLowerCase().replace(/\s+/g,'_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
}

// Toggle layout
function tg() {
    e.ws.classList.toggle('vertical');
    const v = e.ws.classList.contains('vertical');
    e.tb.innerHTML = v ? icons.layoutV : icons.layoutH;
    e.lp.style.width = e.rp.style.width = v ? '100%' : '50%';
    e.lp.style.height = e.rp.style.height = v ? '50%' : '100%';
    mm();
}

// Manage menu visibility based on pane width
function mm() {
    const th = 420;
    [e.lp, e.rp].forEach(pane => {
        const t = pane.querySelector('.toolbar');
        const h = pane.querySelector('.column-header');
        if (!t || !h) return;
        if (pane.clientWidth < th) {
            t.classList.add('compact');
            h.classList.add('compact');
        } else {
            t.classList.remove('compact');
            h.classList.remove('compact');
        }
    });
}

// Setup pane
function sp(p) {
    const ed = e[p].e;
    ed.addEventListener('input', () => {
        up(p, ed.value);
        hi[p]();
    });
    ed.addEventListener('keydown', ev => {
        const k = ev.key, c = ev.ctrlKey || ev.metaKey;
        if (c) {
            if (k === 'z') {
                ev.preventDefault();
                hs(p, ev.shiftKey ? 1 : -1);
            } else if (k === 'y') {
                ev.preventDefault();
                hs(p, 1);
            }
        }
        if (k === 'Tab') {
            ev.preventDefault();
            const s = ed.selectionStart;
            ed.value = ed.value.substring(0, s) + '  ' + ed.value.substring(ed.selectionEnd);
            ed.selectionStart = ed.selectionEnd = s + 2;
        }
    });
    if (!s[p].h.length) {
        s[p].c = ed.value;
        sv(p);
    }
    rn(p);
}

// Resize
function sr() {
    let p, z, v, t, w, h;
    const r = th(function(ev) {
        const c = t ? ev.touches[0] : ev,
              d = (v ? c.clientY : c.clientX) - p,
              n = Math.max(10, Math.min(90, (z + d) / (v ? h : w) * 100)),
              k = v ? 'height' : 'width';
        e.lp.style[k] = n + '%';
        e.rp.style[k] = (100 - n) + '%';
        mm();
    });
    
    function i(ev) {
        ev.preventDefault();
        t = ev.type[0] === 't';
        v = e.ws.classList.contains('vertical');
        const c = t ? ev.touches[0] : ev;
        p = v ? c.clientY : c.clientX;
        z = v ? e.lp.offsetHeight : e.lp.offsetWidth;
        w = e.ws.clientWidth;
        h = e.ws.clientHeight;
        e.ws.classList.add('resizing');
        const m = t ? 'touchmove' : 'mousemove',
              n = t ? 'touchend' : 'mouseup';
        document.addEventListener(m, r, t ? {passive:false} : {});
        document.addEventListener(n, o);
        !t && (document.body.style.cursor = v ? 'row-resize' : 'col-resize');
    }
    
    function o() {
        document.removeEventListener(t ? 'touchmove' : 'mousemove', r);
        document.removeEventListener(t ? 'touchend' : 'mouseup', o);
        e.ws.classList.remove('resizing');
        !t && (document.body.style.cursor = '');
    }
    
    e.sp.addEventListener('mousedown', i);
    e.sp.addEventListener('touchstart', i, {passive:false});
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init();
    sp('l');
    sp('r');
    sr();
    mm();
    loadFromLocalStorage();
    window.innerWidth < window.innerHeight && tg();
    e.tb.addEventListener('click', tg);
    window.addEventListener('resize', th(mm));
    $('export-btn').addEventListener('click', ex);
    e.lb.addEventListener('click', () => e.li.click());
    e.li.addEventListener('change', handleLoadFile);
    e.clb.addEventListener('click', clearLocalSave);
    document.addEventListener('click', ev => {
        const b = ev.target;
        
        // Handle action buttons (in toolbar or dropdown)
        if (b.matches('.toolbar button[data-action]') || b.matches('.dropdown-menu button[data-action]')) {
            const a = b.dataset.action, p = b.dataset.pane[0];
            ac[a] && ac[a](p, b);
            // Close dropdown if action was from dropdown
            const dd = b.closest('.dropdown-menu');
            if (dd) {
                dd.classList.remove('show');
                // Update aria-expanded
                const toggle = dd.closest('.pane').querySelector('.menu-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        } 
        // Handle menu toggle button
        else if (b.matches('.menu-toggle')) {
            ev.stopPropagation();
            const p = b.dataset.pane;
            const dd = e[p[0]].d || $(`${p}-dropdown`);
            const isOpen = dd.classList.contains('show');
            
            // Close all dropdowns first
            document.querySelectorAll('.dropdown-menu.show').forEach(d => {
                d.classList.remove('show');
                const t = d.closest('.pane').querySelector('.menu-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current dropdown
            if (!isOpen) {
                dd.classList.add('show');
                b.setAttribute('aria-expanded', 'true');
            }
        }
        // Close dropdowns when clicking outside
        else if (!b.closest('.dropdown-menu') && !b.closest('.menu-toggle')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(d => {
                d.classList.remove('show');
                const t = d.closest('.pane').querySelector('.menu-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }
    });
});
