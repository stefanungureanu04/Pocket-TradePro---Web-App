const { useState, useEffect, useRef } = React;

function lsGet(key, def) {
    try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}

function fmt(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function pnlCls(n) { return n >= 0 ? 'positive' : 'negative'; }
function fmtCompact(n) {
    const abs = Math.abs(n), sign = n < 0 ? '-' : '';
    if (abs >= 1e9) return sign + (abs / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return sign + fmt(abs, 0);
}

const ADMIN_DIAL_CODES = [
    { code: 'RO', name: 'Romania',        dial: '+40'  },
    { code: 'US', name: 'United States',  dial: '+1'   },
    { code: 'GB', name: 'United Kingdom', dial: '+44'  },
    { code: 'DE', name: 'Germany',        dial: '+49'  },
    { code: 'FR', name: 'France',         dial: '+33'  },
    { code: 'IT', name: 'Italy',          dial: '+39'  },
    { code: 'ES', name: 'Spain',          dial: '+34'  },
    { code: 'NL', name: 'Netherlands',    dial: '+31'  },
    { code: 'BE', name: 'Belgium',        dial: '+32'  },
    { code: 'AT', name: 'Austria',        dial: '+43'  },
    { code: 'CH', name: 'Switzerland',    dial: '+41'  },
    { code: 'PL', name: 'Poland',         dial: '+48'  },
    { code: 'HU', name: 'Hungary',        dial: '+36'  },
    { code: 'CZ', name: 'Czech Republic', dial: '+420' },
    { code: 'SK', name: 'Slovakia',       dial: '+421' },
    { code: 'BG', name: 'Bulgaria',       dial: '+359' },
    { code: 'GR', name: 'Greece',         dial: '+30'  },
    { code: 'PT', name: 'Portugal',       dial: '+351' },
    { code: 'SE', name: 'Sweden',         dial: '+46'  },
    { code: 'NO', name: 'Norway',         dial: '+47'  },
    { code: 'DK', name: 'Denmark',        dial: '+45'  },
    { code: 'FI', name: 'Finland',        dial: '+358' },
    { code: 'IE', name: 'Ireland',        dial: '+353' },
    { code: 'TR', name: 'Turkey',         dial: '+90'  },
    { code: 'UA', name: 'Ukraine',        dial: '+380' },
    { code: 'MD', name: 'Moldova',        dial: '+373' },
    { code: 'CA', name: 'Canada',         dial: '+1'   },
    { code: 'AU', name: 'Australia',      dial: '+61'  },
    { code: 'JP', name: 'Japan',          dial: '+81'  },
    { code: 'CN', name: 'China',          dial: '+86'  },
    { code: 'IN', name: 'India',          dial: '+91'  },
    { code: 'BR', name: 'Brazil',         dial: '+55'  },
    { code: 'AE', name: 'UAE',            dial: '+971' },
    { code: 'SA', name: 'Saudi Arabia',   dial: '+966' },
    { code: 'ZA', name: 'South Africa',   dial: '+27'  },
].sort((a, b) => a.name.localeCompare(b.name));

function FlagImg({ code }) {
    return <img src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`} alt={code} className="flag-img" />;
}

function AdminSelect({ value, onChange, options }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!open) return;
        function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const selected = options.find(o => o.value === value) || options[0];

    return (
        <div className={`admin-custom-select${open ? ' open' : ''}`} ref={ref}>
            <button type="button" className="admin-custom-select-trigger" onClick={() => setOpen(o => !o)}>
                <span>{selected.label}</span>
                <i className={`bi bi-chevron-${open ? 'up' : 'down'}`}></i>
            </button>
            {open && (
                <div className="admin-custom-select-dropdown">
                    {options.map(o => (
                        <div key={o.value} className={`admin-custom-select-option${o.value === value ? ' selected' : ''}`}
                            onMouseDown={() => { onChange(o.value); setOpen(false); }}>
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const DRUM_MINS = [0, 15, 30, 45];

function TimeDrumPicker({ value, onChange }) {
    const [h24, m] = value.split(':').map(Number);
    const isPM     = h24 >= 12;
    const h12      = h24 % 12 === 0 ? 12 : h24 % 12;
    const minIdx   = DRUM_MINS.indexOf(m) < 0 ? 0 : DRUM_MINS.indexOf(m);

    function adjHour(delta) {
        const newH12 = ((h12 - 1 + delta + 12) % 12) + 1;
        const newH24 = isPM ? (newH12 === 12 ? 12 : newH12 + 12) : (newH12 === 12 ? 0 : newH12);
        onChange(String(newH24).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
    }

    function adjMin(delta) {
        const newM = DRUM_MINS[(minIdx + delta + DRUM_MINS.length) % DRUM_MINS.length];
        onChange(String(h24).padStart(2, '0') + ':' + String(newM).padStart(2, '0'));
    }

    function toggleAMPM() {
        const newH24 = Math.max(0, Math.min(23, isPM ? h24 - 12 : h24 + 12));
        onChange(String(newH24).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
    }

    const cols = [
        { up: () => adjHour(1),  down: () => adjHour(-1), val: String(h12).padStart(2, '0') },
        { up: () => adjMin(1),   down: () => adjMin(-1),  val: String(m).padStart(2, '0')  },
        { up: toggleAMPM,        down: toggleAMPM,        val: isPM ? 'PM' : 'AM'          },
    ];

    return (
        <div className="drum-picker">
            <div className="drum-row drum-top">
                {cols.map((c, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <span className="drum-colon-spacer"></span>}
                        <button type="button" className="drum-btn" onClick={c.up}><i className="bi bi-chevron-up"></i></button>
                    </React.Fragment>
                ))}
            </div>
            <div className="drum-row drum-display">
                {cols.map((c, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <span className="drum-colon">:</span>}
                        <span className="drum-val">{c.val}</span>
                    </React.Fragment>
                ))}
            </div>
            <div className="drum-row drum-bottom">
                {cols.map((c, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <span className="drum-colon-spacer"></span>}
                        <button type="button" className="drum-btn" onClick={c.down}><i className="bi bi-chevron-down"></i></button>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

function AdminDialCodeSelect({ value, onChange }) {
    const [open,   setOpen]   = useState(false);
    const [search, setSearch] = useState('');
    const wrapRef             = useRef(null);

    const selected = ADMIN_DIAL_CODES.find(d => d.code === value);
    const filtered = ADMIN_DIAL_CODES.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) || d.dial.includes(search)
    );

    useEffect(() => {
        function onOut(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false); setSearch('');
            }
        }
        document.addEventListener('mousedown', onOut);
        return () => document.removeEventListener('mousedown', onOut);
    }, []);

    return (
        <div className="dial-code-wrapper" ref={wrapRef}>
            <button type="button" className={`dial-code-trigger ${open ? 'open' : ''}`}
                onClick={() => open ? setOpen(false) : setTimeout(() => setOpen(true), 120)}>
                {selected ? (<><FlagImg code={selected.code} /><span className="ds-dial">{selected.dial}</span></>) : <span className="cs-placeholder">+?</span>}
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} cs-chevron`}></i>
            </button>
            {open && (
                <div className="custom-select-dropdown ds-dropdown admin-dial-dropdown">
                    <div className="cs-search-wrapper">
                        <i className="bi bi-search cs-search-icon"></i>
                        <input type="text" className="cs-search-input" placeholder="Country or +code..." value={search}
                            onChange={e => setSearch(e.target.value)} autoFocus />
                    </div>
                    <ul className="cs-list">
                        {filtered.map(d => (
                            <li key={d.code} className={`cs-item ${d.code === value ? 'active' : ''}`}
                                onMouseDown={() => { onChange(d.code); setOpen(false); setSearch(''); }}>
                                <FlagImg code={d.code} />
                                <span className="cs-name">{d.name}</span>
                                <span className="ds-dial-badge">{d.dial}</span>
                            </li>
                        ))}
                        {filtered.length === 0 && <li className="cs-empty">No results</li>}
                    </ul>
                </div>
            )}
        </div>
    );
}

const ADMIN_NAV_ITEMS = [
    { key: 'users',    icon: 'bi-people',           label: 'Users'       },
    { key: 'support',  icon: 'bi-chat-dots',         label: 'Support'     },
    { key: 'market',   icon: 'bi-graph-up-arrow',    label: 'Market Data' },
    { key: 'stats',    icon: 'bi-bar-chart-line',    label: 'Stats'       },
    { key: 'news',     icon: 'bi-newspaper',         label: 'News'        },
    { key: 'events',   icon: 'bi-calendar-event',    label: 'Events'      },
    { key: 'exchange', icon: 'bi-currency-exchange', label: 'Exchange'    },
    { key: 'about',    icon: 'bi-sliders',            label: 'Settings'    },
];

const MOCK_USERS = [
    { id: 1,  firstName: 'Stefan',    lastName: 'Popescu',    email: 'stefan.popescu@ex.com',  role: 'user',  status: 'active',   verified: 'verified', joined: '2026-01-15', cash: 12450.30 },
    { id: 2,  firstName: 'Maria',     lastName: 'Ionescu',    email: 'maria.ionescu@ex.com',   role: 'user',  status: 'active',   verified: 'pending',  joined: '2026-01-22', cash:  8200.00 },
    { id: 3,  firstName: 'Andrei',    lastName: 'Popa',       email: 'andrei.popa@ex.com',     role: 'user',  status: 'inactive', verified: null,       joined: '2026-01-28', cash:  3100.00 },
    { id: 4,  firstName: 'Elena',     lastName: 'Dragomir',   email: 'elena.dragomir@ex.com',  role: 'user',  status: 'active',   verified: 'verified', joined: '2026-02-05', cash: 25800.00 },
    { id: 5,  firstName: 'Mihai',     lastName: 'Stanescu',   email: 'mihai.stanescu@ex.com',  role: 'user',  status: 'active',   verified: 'failed',   joined: '2026-02-11', cash:     0.00 },
    { id: 6,  firstName: 'Alexandra', lastName: 'Marin',      email: 'alex.marin@ex.com',      role: 'user',  status: 'active',   verified: 'verified', joined: '2026-02-18', cash:  5600.50 },
    { id: 7,  firstName: 'Cristian',  lastName: 'Barbu',      email: 'cristian.barbu@ex.com',  role: 'user',  status: 'inactive', verified: 'pending',  joined: '2026-02-25', cash:  9300.00 },
    { id: 8,  firstName: 'Ioana',     lastName: 'Niculae',    email: 'ioana.niculae@ex.com',   role: 'user',  status: 'active',   verified: 'verified', joined: '2026-03-03', cash: 18750.00 },
    { id: 9,  firstName: 'Victor',    lastName: 'Ilie',       email: 'victor.ilie@ex.com',     role: 'user',  status: 'active',   verified: null,       joined: '2026-03-10', cash:   450.00 },
    { id: 10, firstName: 'Raluca',    lastName: 'Dumitrescu', email: 'raluca.d@ex.com',        role: 'user',  status: 'active',   verified: 'verified', joined: '2026-03-17', cash:  7820.00 },
    { id: 11, firstName: 'Bogdan',    lastName: 'Gheorghe',   email: 'bogdan.gh@ex.com',       role: 'user',  status: 'inactive', verified: null,       joined: '2026-03-24', cash:  1200.00 },
    { id: 12, firstName: 'Camelia',   lastName: 'Tudor',      email: 'camelia.tudor@ex.com',   role: 'user',  status: 'active',   verified: 'pending',  joined: '2026-03-31', cash:  3400.00 },
];

const USER_TRANSACTIONS = {
    1:  [
        { id: 1, type: 'BUY',      symbol: 'AAPL',  qty: 2,    price: 182.30, total: 364.60,   date: '2026-03-22 14:32' },
        { id: 2, type: 'DEPOSIT',  symbol: null,    qty: null, price: null,   total: 5000.00,  date: '2026-03-20 09:15' },
        { id: 3, type: 'SELL',     symbol: 'MSFT',  qty: 1,    price: 420.80, total: 420.80,   date: '2026-03-18 16:45' },
        { id: 4, type: 'WITHDRAW', symbol: null,    qty: null, price: null,   total: 2000.00,  date: '2026-03-05 15:30' },
        { id: 5, type: 'DEPOSIT',  symbol: null,    qty: null, price: null,   total: 10000.00, date: '2026-03-01 08:00' },
    ],
    2:  [{ id: 1, type: 'DEPOSIT',  symbol: null,    qty: null, price: null,  total: 8200.00,  date: '2026-01-22 10:00' }],
    4:  [
        { id: 1, type: 'BUY',      symbol: 'NVDA',  qty: 5,    price: 950.40, total: 4752.00,  date: '2026-03-18 11:20' },
        { id: 2, type: 'BUY',      symbol: 'AAPL',  qty: 20,   price: 182.30, total: 3646.00,  date: '2026-02-15 09:30' },
        { id: 3, type: 'SELL',     symbol: 'NVDA',  qty: 2,    price: 950.40, total: 1900.80,  date: '2026-03-28 14:00' },
        { id: 4, type: 'SELL',     symbol: 'AAPL',  qty: 5,    price: 182.30, total:  911.50,  date: '2026-04-01 10:20' },
        { id: 5, type: 'DEPOSIT',  symbol: null,    qty: null, price: null,   total: 30000.00, date: '2026-02-05 09:00' },
    ],
    5:  [
        { id: 1, type: 'DEPOSIT',  symbol: null,  qty: null, price: null,   total: 2000.00, date: '2026-02-11 09:00' },
        { id: 2, type: 'BUY',      symbol: 'V',   qty: 2,    price: 280.50, total:  561.00, date: '2026-02-14 11:30' },
        { id: 3, type: 'SELL',     symbol: 'V',   qty: 2,    price: 280.50, total:  561.00, date: '2026-02-28 15:00' },
        { id: 4, type: 'WITHDRAW', symbol: null,  qty: null, price: null,   total: 2000.00, date: '2026-03-01 09:00' },
    ],
    6:  [
        { id: 1, type: 'BUY',      symbol: 'MSFT', qty: 8,    price: 415.20, total: 3321.60, date: '2026-03-01 13:00' },
        { id: 2, type: 'BUY',      symbol: 'AAPL', qty: 3,    price: 182.30, total:  546.90, date: '2026-03-10 09:00' },
        { id: 3, type: 'SELL',     symbol: 'AAPL', qty: 3,    price: 186.40, total:  559.20, date: '2026-03-25 16:30' },
        { id: 4, type: 'DEPOSIT',  symbol: null,   qty: null, price: null,   total: 6000.00, date: '2026-02-18 11:00' },
    ],
    8:  [
        { id: 1, type: 'BUY',      symbol: 'TSLA', qty: 10,   price: 248.50, total: 2485.00,  date: '2026-03-15 14:00' },
        { id: 2, type: 'BUY',      symbol: 'AMZN', qty: 2,    price: 198.70, total:  397.40,  date: '2026-03-20 10:00' },
        { id: 3, type: 'SELL',     symbol: 'TSLA', qty: 4,    price: 251.20, total: 1004.80,  date: '2026-04-02 11:00' },
        { id: 4, type: 'DEPOSIT',  symbol: null,   qty: null, price: null,   total: 20000.00, date: '2026-03-03 10:00' },
        { id: 5, type: 'WITHDRAW', symbol: null,   qty: null, price: null,   total:  1250.00, date: '2026-03-10 15:20' },
    ],
    10: [
        { id: 1, type: 'BUY',     symbol: 'GOOGL', qty: 3,    price: 175.30, total:  525.90, date: '2026-03-20 11:00' },
        { id: 2, type: 'BUY',     symbol: 'MSFT',  qty: 1,    price: 420.80, total:  420.80, date: '2026-03-22 09:30' },
        { id: 3, type: 'SELL',    symbol: 'GOOGL', qty: 1,    price: 178.90, total:  178.90, date: '2026-04-03 14:00' },
        { id: 4, type: 'DEPOSIT', symbol: null,    qty: null, price: null,   total: 8000.00, date: '2026-03-17 09:00' },
    ],
    3:  [
        { id: 1, type: 'DEPOSIT',  symbol: null,   qty: null, price: null,   total: 3500.00, date: '2026-01-28 09:00' },
        { id: 2, type: 'BUY',      symbol: 'AMZN', qty: 5,    price: 198.70, total: 993.50,  date: '2026-02-10 11:15' },
        { id: 3, type: 'WITHDRAW', symbol: null,   qty: null, price: null,   total: 400.00,  date: '2026-02-20 14:00' },
    ],
    7:  [
        { id: 1, type: 'DEPOSIT', symbol: null,   qty: null, price: null,   total: 10000.00, date: '2026-02-25 10:00' },
        { id: 2, type: 'BUY',     symbol: 'NFLX', qty: 3,    price: 720.40, total:  2161.20, date: '2026-03-05 13:30' },
        { id: 3, type: 'BUY',     symbol: 'AMD',  qty: 10,   price: 162.80, total:  1628.00, date: '2026-03-12 10:00' },
        { id: 4, type: 'SELL',    symbol: 'AMD',  qty: 5,    price: 165.20, total:   826.00, date: '2026-03-30 11:00' },
        { id: 5, type: 'SELL',    symbol: 'NFLX', qty: 1,    price: 724.10, total:   724.10, date: '2026-04-04 09:30' },
    ],
    9:  [
        { id: 1, type: 'DEPOSIT', symbol: null,  qty: null, price: null,  total: 500.00,  date: '2026-03-10 11:00' },
        { id: 2, type: 'BUY',     symbol: 'WMT', qty: 2,    price: 68.90, total: 137.80,  date: '2026-03-14 09:45' },
    ],
    11: [
        { id: 1, type: 'DEPOSIT',  symbol: null, qty: null, price: null, total: 1500.00, date: '2026-03-24 09:00' },
        { id: 2, type: 'WITHDRAW', symbol: null, qty: null, price: null, total: 300.00,  date: '2026-03-28 16:00' },
    ],
    12: [
        { id: 1, type: 'DEPOSIT', symbol: null,   qty: null, price: null,   total: 4000.00, date: '2026-03-31 10:00' },
        { id: 2, type: 'BUY',     symbol: 'AAPL', qty: 1,    price: 182.30, total:  182.30, date: '2026-04-01 14:20' },
        { id: 3, type: 'BUY',     symbol: 'DIS',  qty: 3,    price: 112.40, total:  337.20, date: '2026-04-02 10:30' },
        { id: 4, type: 'BUY',     symbol: 'META', qty: 1,    price: 512.30, total:  512.30, date: '2026-04-03 11:00' },
        { id: 5, type: 'SELL',    symbol: 'DIS',  qty: 2,    price: 113.10, total:  226.20, date: '2026-04-04 15:00' },
    ],
};

const MOCK_SUPPORT_TICKETS = [
    { id: 1, userId: 1,  userName: 'Stefan Popescu',    email: 'stefan.popescu@ex.com', subject: 'Cannot withdraw funds',                status: 'open',    date: '2026-04-04 10:23',
      message: "I've been trying to withdraw $500 for the past two days but every time I submit the request it shows an error. Can you help?",
      replies: [{ from: 'support', text: 'Thank you for reaching out! Could you share the exact error message you see when attempting the withdrawal?', date: '2026-04-04 11:05' }] },
    { id: 2, userId: 2,  userName: 'Maria Ionescu',      email: 'maria.ionescu@ex.com',  subject: 'Verification stuck on pending',         status: 'pending', date: '2026-04-03 14:15',
      message: 'I uploaded my ID documents 5 days ago but verification is still pending. When will it be reviewed?',
      replies: [] },
    { id: 3, userId: 5,  userName: 'Mihai Stanescu',     email: 'mihai.stanescu@ex.com', subject: 'Verification failed — what to do?',    status: 'open',    date: '2026-04-03 09:48',
      message: "My account verification says 'failed' but I don't know what went wrong. Which document was rejected?",
      replies: [{ from: 'support', text: 'Hi Mihai, your selfie was not clearly visible. Please re-upload with better lighting and ensure your face is fully visible.', date: '2026-04-03 10:30' }] },
    { id: 4, userId: 6,  userName: 'Alexandra Marin',    email: 'alex.marin@ex.com',     subject: 'How to change preferred currency?',    status: 'closed',  date: '2026-04-02 16:20',
      message: 'I want to change my account currency from RON to EUR. Can I do this from the profile page?',
      replies: [
          { from: 'support', text: 'Hi Alexandra! Go to Profile → Preferences → Preferred Currency, select EUR and click Save.', date: '2026-04-02 16:45' },
          { from: 'user',    text: 'Thank you, found it!', date: '2026-04-02 17:00' },
      ] },
    { id: 5, userId: 8,  userName: 'Ioana Niculae',      email: 'ioana.niculae@ex.com',  subject: 'Portfolio value shows incorrect data', status: 'pending', date: '2026-04-01 12:00',
      message: 'The portfolio value in my overview does not match the sum of my individual holdings. Is this a bug?',
      replies: [] },
    { id: 6, userId: 9,  userName: 'Victor Ilie',        email: 'victor.ilie@ex.com',    subject: 'New account — how to start trading?',  status: 'closed',  date: '2026-03-30 11:30',
      message: 'I just created an account and added $500. What are the steps to buy my first stock?',
      replies: [{ from: 'support', text: 'Welcome Victor! Go to Terminal → Stocks, click Trade on any row, select Buy, enter quantity and confirm. Start small!', date: '2026-03-30 12:00' }] },
    { id: 7, userId: 12, userName: 'Camelia Tudor',      email: 'camelia.tudor@ex.com',  subject: 'Dividend not credited to account',     status: 'open',    date: '2026-03-29 09:15',
      message: 'I hold AAPL shares and I can see a dividend event for March 28, but the amount was never credited to my account.',
      replies: [] },
    { id: 8, userId: 10, userName: 'Raluca Dumitrescu',  email: 'raluca.d@ex.com',       subject: 'Maestro card not accepted',            status: 'closed',  date: '2026-03-28 14:42',
      message: 'The card payment form does not accept my Maestro card number. Is Maestro supported by your platform?',
      replies: [{ from: 'support', text: 'Hi Raluca, we currently support Visa, Mastercard and American Express. Maestro support is planned for a future release.', date: '2026-03-28 15:10' }] },
];

const MOCK_STOCKS = [
    { symbol: 'AAPL',  name: 'Apple Inc.',            sector: 'Technology',  price: 182.30, changePct:  0.69, volume: '58.2M',  cap: '2.81T' },
    { symbol: 'MSFT',  name: 'Microsoft Corp.',        sector: 'Technology',  price: 420.80, changePct:  0.51, volume: '21.4M',  cap: '3.12T' },
    { symbol: 'NVDA',  name: 'NVIDIA Corp.',           sector: 'Technology',  price: 950.40, changePct:  1.96, volume: '44.8M',  cap: '2.34T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.',          sector: 'Technology',  price: 178.90, changePct: -0.25, volume: '24.1M',  cap: '2.21T' },
    { symbol: 'TSLA',  name: 'Tesla Inc.',             sector: 'Automotive',  price: 248.50, changePct:  2.32, volume: '102.3M', cap: '791B'  },
    { symbol: 'AMZN',  name: 'Amazon.com Inc.',        sector: 'Consumer',    price: 198.70, changePct: -0.80, volume: '35.7M',  cap: '2.08T' },
    { symbol: 'META',  name: 'Meta Platforms',         sector: 'Technology',  price: 512.30, changePct:  1.20, volume: '18.9M',  cap: '1.30T' },
    { symbol: 'NFLX',  name: 'Netflix Inc.',           sector: 'Media',       price: 720.40, changePct:  0.50, volume: '5.2M',   cap: '309B'  },
    { symbol: 'AMD',   name: 'Advanced Micro Devices', sector: 'Technology',  price: 162.80, changePct: -1.40, volume: '62.5M',  cap: '263B'  },
    { symbol: 'DIS',   name: 'The Walt Disney Co.',    sector: 'Media',       price: 112.40, changePct:  0.76, volume: '11.3M',  cap: '205B'  },
    { symbol: 'JPM',   name: 'JPMorgan Chase',         sector: 'Finance',     price: 210.30, changePct:  0.57, volume: '9.8M',   cap: '604B'  },
    { symbol: 'V',     name: 'Visa Inc.',              sector: 'Finance',     price: 280.50, changePct:  0.75, volume: '7.2M',   cap: '576B'  },
    { symbol: 'JNJ',   name: 'Johnson & Johnson',      sector: 'Healthcare',  price: 156.80, changePct: -0.19, volume: '6.4M',   cap: '377B'  },
    { symbol: 'WMT',   name: 'Walmart Inc.',           sector: 'Consumer',    price: 68.90,  changePct:  0.61, volume: '15.8M',  cap: '555B'  },
    { symbol: 'XOM',   name: 'Exxon Mobil Corp.',      sector: 'Energy',      price: 115.20, changePct: -0.95, volume: '18.2M',  cap: '461B'  },
    { symbol: 'BAC',   name: 'Bank of America',        sector: 'Finance',     price: 40.15,  changePct:  0.96, volume: '42.1M',  cap: '318B'  },
    { symbol: 'INTC',  name: 'Intel Corp.',            sector: 'Technology',  price: 31.20,  changePct: -1.83, volume: '38.6M',  cap: '132B'  },
    { symbol: 'PYPL',  name: 'PayPal Holdings',        sector: 'Finance',     price: 68.40,  changePct:  1.85, volume: '12.4M',  cap: '72B'   },
    { symbol: 'UBER',  name: 'Uber Technologies',      sector: 'Technology',  price: 82.60,  changePct:  1.15, volume: '22.8M',  cap: '174B'  },
    { symbol: 'SPOT',  name: 'Spotify Technology',     sector: 'Media',       price: 362.10, changePct:  1.51, volume: '3.1M',   cap: '69B'   },
    { symbol: 'LMT',   name: 'Lockheed Martin Corp.',  sector: 'Other',       price: 468.20, changePct:  0.68, volume: '1.6M',   cap: '111B'  },
    { symbol: 'WM',    name: 'Waste Management Inc.',  sector: 'Other',       price: 214.90, changePct: -0.47, volume: '1.1M',   cap: '82B'   },
];

const MOCK_CRYPTO = [
    { symbol: 'BTC',   name: 'Bitcoin',    category: 'Layer 1',  price: 68420.50,  changePct:  1.85, volume: '28.4B', cap: '1.34T' },
    { symbol: 'ETH',   name: 'Ethereum',   category: 'Layer 1',  price:  3820.40,  changePct:  1.28, volume:  '9.2B', cap: '459B'  },
    { symbol: 'BNB',   name: 'BNB',        category: 'Exchange', price:   612.80,  changePct: -1.35, volume:  '1.8B', cap: '90B'   },
    { symbol: 'SOL',   name: 'Solana',     category: 'Layer 1',  price:   178.30,  changePct:  2.82, volume:  '3.4B', cap: '82B'   },
    { symbol: 'XRP',   name: 'XRP',        category: 'Layer 1',  price:     0.62,  changePct:  1.64, volume:  '2.1B', cap: '34B'   },
    { symbol: 'ADA',   name: 'Cardano',    category: 'Layer 1',  price:     0.48,  changePct: -4.00, volume:  '0.6B', cap: '17B'   },
    { symbol: 'AVAX',  name: 'Avalanche',  category: 'Layer 1',  price:    38.90,  changePct:  2.23, volume:  '0.9B', cap: '16B'   },
    { symbol: 'DOGE',  name: 'Dogecoin',   category: 'Meme',     price:     0.18,  changePct:  5.88, volume:  '1.4B', cap: '25B'   },
    { symbol: 'LINK',  name: 'Chainlink',  category: 'DeFi',     price:    18.40,  changePct:  3.49, volume:  '0.5B', cap: '11B'   },
    { symbol: 'MATIC', name: 'Polygon',    category: 'Layer 2',  price:     0.92,  changePct: -3.16, volume:  '0.4B', cap: '8B'    },
    { symbol: 'UNI',   name: 'Uniswap',    category: 'DeFi',     price:    11.20,  changePct:  3.51, volume:  '0.3B', cap: '6B'    },
    { symbol: 'SHIB',  name: 'Shiba Inu',  category: 'Meme',     price:  0.000028, changePct:  3.70, volume:  '0.7B', cap: '16B'   },
];

const MOCK_BONDS = [
    { symbol: 'US10Y',  issuer: 'U.S. Treasury',  type: 'Government', maturity: '2034-03-15', yield: 4.28, price: 96.42, rating: 'AAA' },
    { symbol: 'US2Y',   issuer: 'U.S. Treasury',  type: 'Government', maturity: '2026-03-15', yield: 4.72, price: 98.85, rating: 'AAA' },
    { symbol: 'US30Y',  issuer: 'U.S. Treasury',  type: 'Government', maturity: '2054-02-15', yield: 4.44, price: 91.20, rating: 'AAA' },
    { symbol: 'DE5Y',   issuer: 'German Bund',     type: 'Government', maturity: '2029-02-15', yield: 2.05, price: 99.10, rating: 'AAA' },
    { symbol: 'GB10Y',  issuer: 'UK Gilt',         type: 'Government', maturity: '2034-03-07', yield: 4.10, price: 95.60, rating: 'AA'  },
    { symbol: 'CA10Y',  issuer: 'Canada Gov. Bond',  type: 'Government', maturity: '2034-06-01', yield: 3.15, price: 96.85, rating: 'AAA' },
    { symbol: 'AAPL26', issuer: 'Apple Inc.',      type: 'Corporate',  maturity: '2026-05-11', yield: 4.91, price: 99.20, rating: 'AA+' },
    { symbol: 'MSFT28', issuer: 'Microsoft Corp.', type: 'Corporate',  maturity: '2028-08-08', yield: 4.62, price: 97.85, rating: 'AAA' },
    { symbol: 'AMZN31', issuer: 'Amazon.com Inc.', type: 'Corporate',  maturity: '2031-06-03', yield: 5.10, price: 96.40, rating: 'AA'  },
    { symbol: 'JPM27',  issuer: 'JPMorgan Chase',  type: 'Corporate',  maturity: '2027-09-23', yield: 5.22, price: 98.30, rating: 'A+'  },
    { symbol: 'GS30',   issuer: 'Goldman Sachs',   type: 'Corporate',  maturity: '2030-11-15', yield: 5.48, price: 95.10, rating: 'A'   },
];

const MOCK_COMMODITIES = [
    { symbol: 'XAU', name: 'Gold',          category: 'Metals', price:  2318.40, changePct:  0.56, unit: 'oz',    exchange: 'COMEX' },
    { symbol: 'XAG', name: 'Silver',        category: 'Metals', price:    27.34, changePct:  1.56, unit: 'oz',    exchange: 'COMEX' },
    { symbol: 'XPT', name: 'Platinum',      category: 'Metals', price:   982.50, changePct: -0.62, unit: 'oz',    exchange: 'NYMEX' },
    { symbol: 'XPD', name: 'Palladium',     category: 'Metals', price:  1024.00, changePct:  1.82, unit: 'oz',    exchange: 'NYMEX' },
    { symbol: 'HG',  name: 'Copper',        category: 'Metals', price:     4.52, changePct:  1.80, unit: 'lb',    exchange: 'COMEX' },
    { symbol: 'CL',  name: 'Crude Oil WTI', category: 'Petrol', price:    82.14, changePct: -1.49, unit: 'bbl',   exchange: 'NYMEX' },
    { symbol: 'BRN', name: 'Brent Oil',     category: 'Petrol', price:    86.40, changePct: -1.12, unit: 'bbl',   exchange: 'ICE'   },
    { symbol: 'NG',  name: 'Natural Gas',   category: 'Energy', price:     1.78, changePct:  2.30, unit: 'MMBtu', exchange: 'NYMEX' },
    { symbol: 'HO',  name: 'Heating Oil',   category: 'Energy', price:     2.61, changePct: -1.14, unit: 'gal',   exchange: 'NYMEX' },
];

const MOCK_ETFS = [
    { symbol: 'SPY',  name: 'SPDR S&P 500 ETF Trust',            category: 'Broad Market', price:  524.58, changePct:  1.22, volume: '62.4M', aum: '507B' },
    { symbol: 'QQQ',  name: 'Invesco QQQ Trust',                 category: 'Sector',       price:  442.30, changePct:  1.89, volume: '38.1M', aum: '254B' },
    { symbol: 'VTI',  name: 'Vanguard Total Stock Market ETF',   category: 'Broad Market', price:  248.10, changePct:  0.93, volume: '24.6M', aum: '418B' },
    { symbol: 'IWM',  name: 'iShares Russell 2000 ETF',          category: 'Small Cap',    price:  206.40, changePct: -0.48, volume: '28.2M', aum: '58B'  },
    { symbol: 'GLD',  name: 'SPDR Gold Shares',                  category: 'Thematic',     price:  232.10, changePct:  0.56, volume:  '8.5M', aum: '61B'  },
    { symbol: 'TLT',  name: 'iShares 20+ Year Treasury Bond ETF',category: 'Bond ETF',     price:   96.20, changePct: -0.32, volume: '14.8M', aum: '54B'  },
    { symbol: 'VNQ',  name: 'Vanguard Real Estate ETF',          category: 'Sector',       price:   88.40, changePct:  1.14, volume:  '6.2M', aum: '35B'  },
    { symbol: 'ARKK', name: 'ARK Innovation ETF',                category: 'Thematic',     price:   48.90, changePct:  3.22, volume: '18.3M', aum: '8B'   },
    { symbol: 'EEM',  name: 'iShares MSCI Emerging Markets ETF', category: 'International',price:   42.10, changePct: -0.85, volume: '22.4M', aum: '22B'  },
    { symbol: 'XLK',  name: 'Technology Select Sector SPDR',     category: 'Sector',       price:  224.80, changePct:  1.62, volume: '12.1M', aum: '65B'  },
];

const _now = Date.now();
const MOCK_NEWS = [
    { id: 1,  ts: _now - 7200000,    symbol: 'NVDA',  impact: 'positive', impactPct:  4.20, headline: 'NVIDIA beats Q1 estimates with record data center revenue of $22.6B',              time: '2h ago'  },
    { id: 2,  ts: _now - 14400000,   symbol: 'AAPL',  impact: 'negative', impactPct: -1.80, headline: 'Apple faces new EU antitrust probe over App Store payment rules',                  time: '4h ago'  },
    { id: 3,  ts: _now - 18000000,   symbol: 'TSLA',  impact: 'negative', impactPct: -3.50, headline: 'Tesla Q1 deliveries fall short of expectations amid weak demand in Europe',        time: '5h ago'  },
    { id: 4,  ts: _now - 21600000,   symbol: 'MSFT',  impact: 'positive', impactPct:  2.10, headline: 'Microsoft Azure revenue surges 31% YoY driven by AI workloads',                   time: '6h ago'  },
    { id: 5,  ts: _now - 28800000,   symbol: 'AMZN',  impact: 'positive', impactPct:  1.60, headline: 'Amazon AWS announces $15B expansion of data centers in Southeast Asia',           time: '8h ago'  },
    { id: 6,  ts: _now - 36000000,   symbol: 'META',  impact: 'positive', impactPct:  3.80, headline: 'Meta AI assistant reaches 500M monthly active users globally',                    time: '10h ago' },
    { id: 7,  ts: _now - 43200000,   symbol: 'GOOGL', impact: 'neutral',  impactPct: -0.30, headline: 'Alphabet antitrust ruling expected next month in DOJ search case',               time: '12h ago' },
    { id: 8,  ts: _now - 50400000,   symbol: 'JPM',   impact: 'positive', impactPct:  1.20, headline: 'JPMorgan raises full-year NII guidance on higher-for-longer rates',               time: '14h ago' },
    { id: 9,  ts: _now - 86400000,   symbol: 'INTC',  impact: 'negative', impactPct: -5.60, headline: 'Intel delays next-gen Panther Lake chip by one quarter amid yield issues',        time: '1d ago'  },
    { id: 10, ts: _now - 90000000,   symbol: 'XOM',   impact: 'neutral',  impactPct:  0.10, headline: 'Exxon Mobil acquires Pioneer Natural Resources integration on track',             time: '1d ago'  },
    { id: 11, ts: _now - 93600000,   symbol: 'NVDA',  impact: 'positive', impactPct:  2.80, headline: 'NVIDIA Blackwell GPU demand forces hyperscalers to extend supply contracts',       time: '1d ago'  },
    { id: 12, ts: _now - 172800000,  symbol: 'AAPL',  impact: 'positive', impactPct:  1.40, headline: 'Apple iPhone 17 Pro leak confirms periscope camera and A19 chip upgrade',         time: '2d ago'  },
    { id: 13, ts: _now - 176400000,  symbol: 'TSLA',  impact: 'positive', impactPct:  5.10, headline: 'Tesla Full Self-Driving v13 achieves 99.2% intervention-free mile rate in fleet', time: '2d ago'  },
    { id: 14, ts: _now - 180000000,  symbol: 'MSFT',  impact: 'negative', impactPct: -0.90, headline: 'Microsoft faces US FTC scrutiny over OpenAI exclusive licensing terms',           time: '2d ago'  },
    { id: 15, ts: _now - 259200000,  symbol: 'NVDA',  impact: 'positive', impactPct:  1.50, headline: 'NVIDIA unveils GeForce RTX 5090 with 2× the performance of RTX 4090',            time: '3d ago'  },
    { id: 16, ts: _now - 262800000,  symbol: 'AAPL',  impact: 'negative', impactPct: -2.40, headline: 'Apple Vision Pro sales reportedly slow sharply after initial launch surge',       time: '3d ago'  },
    { id: 17, ts: _now - 266400000,  symbol: 'MSFT',  impact: 'positive', impactPct:  3.20, headline: 'Microsoft GitHub Copilot Enterprise crosses 1M paid seats milestone',            time: '3d ago'  },
    { id: 18, ts: _now - 345600000,  symbol: 'TSLA',  impact: 'negative', impactPct: -1.70, headline: 'Tesla recalls 125,000 vehicles over seatbelt warning chime software bug',        time: '4d ago'  },
    { id: 19, ts: _now - 349200000,  symbol: 'AMZN',  impact: 'positive', impactPct:  2.30, headline: 'Amazon advertising revenue overtakes Comcast as third-largest US ad platform',   time: '4d ago'  },
    { id: 20, ts: _now - 432000000,  symbol: 'NVDA',  impact: 'neutral',  impactPct: -0.60, headline: 'NVIDIA China revenue cut anticipated as US tightens H20 chip export controls',   time: '5d ago'  },
];

const MOCK_EVENTS = [
    { id: 1,  type: 'earnings', symbol: 'AAPL',  title: 'Q4 2025 Earnings Call',          date: '2026-02-12', detail: 'EPS $2.40 · Revenue $124.3B'           },
    { id: 2,  type: 'dividend', symbol: 'MSFT',  title: 'Dividend Detachment',             date: '2026-02-19', detail: '$0.83/share · Ex-dividend date'         },
    { id: 3,  type: 'split',    symbol: 'AMZN',  title: 'Stock Split 3:1',                 date: '2026-02-26', detail: 'Record date: Feb 21'                   },
    { id: 4,  type: 'earnings', symbol: 'NVDA',  title: 'Q4 2025 Earnings Call',          date: '2026-03-05', detail: 'EPS $0.89 · Revenue $39.3B'            },
    { id: 5,  type: 'dividend', symbol: 'JPM',   title: 'Dividend Detachment',             date: '2026-03-05', detail: '$1.25/share · Ex-dividend date'         },
    { id: 6,  type: 'meeting',  symbol: 'GOOGL', title: 'Annual Shareholder Meeting',      date: '2026-03-12', detail: 'Topics: AI overview, cloud growth'     },
    { id: 7,  type: 'earnings', symbol: 'TSLA',  title: 'Q4 2025 Earnings Call',          date: '2026-03-18', detail: 'EPS $0.73 · Revenue $25.7B'            },
    { id: 8,  type: 'dividend', symbol: 'XOM',   title: 'Dividend Detachment',             date: '2026-03-18', detail: '$0.99/share · Ex-dividend date'         },
    { id: 9,  type: 'split',    symbol: 'META',  title: 'Stock Split 2:1',                 date: '2026-03-24', detail: 'Record date: Mar 19'                   },
    { id: 10, type: 'meeting',  symbol: 'MSFT',  title: 'Annual Shareholder Meeting',      date: '2026-03-24', detail: 'Topics: Copilot rollout, Azure expansion' },
    { id: 11, type: 'earnings', symbol: 'JPM',   title: 'Q1 2026 Earnings Call',          date: '2026-03-28', detail: 'EPS $4.61 · Revenue $41.9B'            },
    { id: 12, type: 'dividend', symbol: 'AAPL',  title: 'Dividend Detachment',             date: '2026-03-28', detail: '$0.25/share · Ex-dividend date'         },
    { id: 13, type: 'split',    symbol: 'WM',    title: 'Stock Split 2:1',                 date: '2026-03-28', detail: 'Record date: Mar 23'                   },
    { id: 14, type: 'dividend', symbol: 'JPM',   title: 'Dividend Detachment',             date: '2026-04-05', detail: '$1.25/share · Ex-dividend date'         },
    { id: 15, type: 'dividend', symbol: 'MSFT',  title: 'Dividend Detachment',             date: '2026-04-10', detail: '$0.83/share · Ex-dividend date'         },
    { id: 16, type: 'dividend', symbol: 'XOM',   title: 'Dividend Detachment',             date: '2026-04-14', detail: '$0.99/share · Ex-dividend date'         },
    { id: 17, type: 'earnings', symbol: 'TSLA',  title: 'Q1 2026 Earnings Call',          date: '2026-04-22', detail: 'EPS est. $0.51 · Revenue est. $22.8B'  },
    { id: 18, type: 'meeting',  symbol: 'AMZN',  title: 'Annual Shareholder Meeting',      date: '2026-04-22', detail: 'Topics: AI strategy, AWS expansion'    },
    { id: 19, type: 'earnings', symbol: 'GOOGL', title: 'Q1 2026 Earnings Call',          date: '2026-04-23', detail: 'EPS est. $2.01 · Revenue est. $90.1B'  },
    { id: 20, type: 'earnings', symbol: 'META',  title: 'Q1 2026 Earnings Call',          date: '2026-04-29', detail: 'EPS est. $5.28 · Revenue est. $41.7B'  },
    { id: 21, type: 'earnings', symbol: 'AAPL',  title: 'Q2 2026 Earnings Call',          date: '2026-04-30', detail: 'EPS est. $1.62 · Revenue est. $94.2B'  },
    { id: 22, type: 'dividend', symbol: 'NVDA',  title: 'Dividend Detachment',             date: '2026-04-30', detail: '$0.01/share · Ex-dividend date'         },
    { id: 23, type: 'earnings', symbol: 'AMZN',  title: 'Q1 2026 Earnings Call',          date: '2026-05-01', detail: 'EPS est. $1.36 · Revenue est. $142.6B' },
    { id: 24, type: 'split',    symbol: 'NVDA',  title: 'Stock Split 10:1',                date: '2026-05-15', detail: 'Record date: May 10'                   },
    { id: 25, type: 'meeting',  symbol: 'AMZN',  title: 'Strategy & Outlook Meeting',      date: '2026-05-27', detail: 'Topics: logistics robotics, Prime growth' },
    { id: 26, type: 'earnings', symbol: 'MSFT',  title: 'Q3 2026 Earnings Call',           date: '2026-05-07', detail: 'EPS est. $3.21 · Revenue est. $72.4B'   },
    { id: 27, type: 'earnings', symbol: 'NFLX',  title: 'Q1 2026 Earnings Call',           date: '2026-05-08', detail: 'EPS est. $6.14 · Revenue est. $10.9B'   },
    { id: 28, type: 'earnings', symbol: 'AMD',   title: 'Q1 2026 Earnings Call',           date: '2026-05-13', detail: 'EPS est. $1.58 · Revenue est. $7.6B'    },
    { id: 29, type: 'dividend', symbol: 'JPM',   title: 'Dividend Detachment',             date: '2026-05-14', detail: '$1.25/share · Ex-dividend date'         },
    { id: 30, type: 'meeting',  symbol: 'WMT',   title: 'Annual Shareholder Meeting',      date: '2026-05-19', detail: 'Topics: e-commerce growth, supply chain' },
    { id: 31, type: 'dividend', symbol: 'MSFT',  title: 'Dividend Detachment',             date: '2026-05-21', detail: '$0.83/share · Ex-dividend date'         },
    { id: 32, type: 'earnings', symbol: 'NVDA',  title: 'Q1 2026 Earnings Call',           date: '2026-06-04', detail: 'EPS est. $0.97 · Revenue est. $43.1B'   },
    { id: 33, type: 'dividend', symbol: 'AAPL',  title: 'Dividend Detachment',             date: '2026-06-05', detail: '$0.25/share · Ex-dividend date'         },
    { id: 34, type: 'split',    symbol: 'WMT',   title: 'Stock Split 3:1',                 date: '2026-06-12', detail: 'Record date: Jun 7'                    },
    { id: 35, type: 'meeting',  symbol: 'TSLA',  title: 'Annual Shareholder Meeting',      date: '2026-06-18', detail: 'Topics: FSD update, Optimus robot timeline' },
    { id: 36, type: 'earnings', symbol: 'V',     title: 'Q3 2026 Earnings Call',           date: '2026-06-23', detail: 'EPS est. $2.74 · Revenue est. $9.8B'    },
    { id: 37, type: 'dividend', symbol: 'XOM',   title: 'Dividend Detachment',             date: '2026-07-02', detail: '$0.99/share · Ex-dividend date'         },
    { id: 38, type: 'earnings', symbol: 'INTC',  title: 'Q1 2026 Earnings Call',           date: '2026-04-22', detail: 'EPS est. $0.14 · Revenue est. $12.7B'   },
    { id: 39, type: 'earnings', symbol: 'DIS',   title: 'Q2 FY2026 Earnings Call',         date: '2026-04-23', detail: 'EPS est. $1.33 · Revenue est. $23.4B'   },
    { id: 40, type: 'earnings', symbol: 'JNJ',   title: 'Q1 2026 Earnings Call',           date: '2026-04-29', detail: 'EPS est. $2.58 · Revenue est. $22.6B'   },
    { id: 41, type: 'split',    symbol: 'DIS',   title: 'Stock Split 2:1',                 date: '2026-04-30', detail: 'Record date: Apr 25'                    },
    { id: 42, type: 'dividend', symbol: 'V',     title: 'Dividend Detachment',             date: '2026-05-01', detail: '$0.59/share · Ex-dividend date'         },
    { id: 43, type: 'meeting',  symbol: 'AAPL',  title: 'Annual Shareholder Meeting',      date: '2026-05-07', detail: 'Topics: Apple Intelligence, services growth' },
    { id: 44, type: 'earnings', symbol: 'WMT',   title: 'Q1 FY2027 Earnings Call',         date: '2026-05-13', detail: 'EPS est. $0.68 · Revenue est. $175.8B'  },
    { id: 45, type: 'split',    symbol: 'LMT',   title: 'Stock Split 2:1',                 date: '2026-05-14', detail: 'Record date: May 9'                    },
    { id: 46, type: 'meeting',  symbol: 'INTC',  title: 'Investor Day',                    date: '2026-06-04', detail: 'Topics: AI PC strategy, foundry roadmap' },
    { id: 47, type: 'meeting',  symbol: 'NVDA',  title: 'GTC AI Conference',               date: '2026-06-23', detail: 'Topics: Blackwell Ultra launch, enterprise AI' },
    { id: 48, type: 'earnings', symbol: 'JPM',   title: 'Q2 2026 Earnings Call',           date: '2026-07-02', detail: 'EPS est. $4.82 · Revenue est. $43.1B'   },
    { id: 49, type: 'earnings', symbol: 'BAC',   title: 'Q1 2026 Earnings Call',           date: '2026-04-29', detail: 'EPS est. $0.83 · Revenue est. $25.1B'   },
];

const EVENT_TYPE_CONFIG = {
    earnings: { icon: 'bi-mic-fill',    color: '#00c896', label: 'Earnings' },
    dividend: { icon: 'bi-cash-coin',   color: '#f0b429', label: 'Dividend' },
    split:    { icon: 'bi-scissors',    color: '#f472b6', label: 'Split'    },
    meeting:  { icon: 'bi-people-fill', color: '#3b82f6', label: 'Meeting'  },
};

const EXCHANGE_RATES = [
    { from: 'USD', to: 'EUR', rate: 0.9182, flag: 'eu', name: 'Euro'               },
    { from: 'USD', to: 'RON', rate: 4.5830, flag: 'ro', name: 'Romanian Leu'       },
    { from: 'USD', to: 'GBP', rate: 0.7894, flag: 'gb', name: 'British Pound'      },
    { from: 'USD', to: 'CHF', rate: 0.8971, flag: 'ch', name: 'Swiss Franc'        },
    { from: 'USD', to: 'JPY', rate: 149.62, flag: 'jp', name: 'Japanese Yen'       },
    { from: 'USD', to: 'CAD', rate: 1.3641, flag: 'ca', name: 'Canadian Dollar'    },
    { from: 'USD', to: 'AUD', rate: 1.5283, flag: 'au', name: 'Australian Dollar'  },
    { from: 'USD', to: 'SEK', rate: 10.412, flag: 'se', name: 'Swedish Krona'      },
    { from: 'USD', to: 'NOK', rate: 10.581, flag: 'no', name: 'Norwegian Krone'    },
    { from: 'USD', to: 'DKK', rate: 6.8540, flag: 'dk', name: 'Danish Krone'       },
    { from: 'USD', to: 'HUF', rate: 357.40, flag: 'hu', name: 'Hungarian Forint'   },
    { from: 'USD', to: 'PLN', rate: 3.9620, flag: 'pl', name: 'Polish Zloty'       },
    { from: 'USD', to: 'NZD', rate: 1.6320, flag: 'nz', name: 'New Zealand Dollar' },
    { from: 'USD', to: 'SGD', rate: 1.3412, flag: 'sg', name: 'Singapore Dollar'   },
    { from: 'USD', to: 'HKD', rate: 7.8231, flag: 'hk', name: 'Hong Kong Dollar'   },
    { from: 'USD', to: 'CNY', rate: 7.2415, flag: 'cn', name: 'Chinese Yuan'       },
    { from: 'USD', to: 'INR', rate: 83.412, flag: 'in', name: 'Indian Rupee'       },
    { from: 'USD', to: 'BRL', rate: 4.9720, flag: 'br', name: 'Brazilian Real'     },
    { from: 'USD', to: 'MXN', rate: 17.052, flag: 'mx', name: 'Mexican Peso'       },
    { from: 'USD', to: 'ZAR', rate: 18.614, flag: 'za', name: 'South African Rand' },
    { from: 'USD', to: 'TRY', rate: 32.180, flag: 'tr', name: 'Turkish Lira'       },
    { from: 'USD', to: 'KRW', rate: 1325.4, flag: 'kr', name: 'South Korean Won'   },
    { from: 'USD', to: 'THB', rate: 35.420, flag: 'th', name: 'Thai Baht'          },
    { from: 'USD', to: 'MYR', rate: 4.7120, flag: 'my', name: 'Malaysian Ringgit'  },
    { from: 'USD', to: 'IDR', rate: 15842,  flag: 'id', name: 'Indonesian Rupiah'  },
    { from: 'USD', to: 'PHP', rate: 56.340, flag: 'ph', name: 'Philippine Peso'    },
    { from: 'USD', to: 'CZK', rate: 23.180, flag: 'cz', name: 'Czech Koruna'       },
    { from: 'USD', to: 'ILS', rate: 3.7420, flag: 'il', name: 'Israeli Shekel'     },
    { from: 'USD', to: 'AED', rate: 3.6725, flag: 'ae', name: 'UAE Dirham'         },
    { from: 'USD', to: 'SAR', rate: 3.7500, flag: 'sa', name: 'Saudi Riyal'        },
    { from: 'USD', to: 'QAR', rate: 3.6410, flag: 'qa', name: 'Qatari Riyal'       },
    { from: 'USD', to: 'KWD', rate: 0.3072, flag: 'kw', name: 'Kuwaiti Dinar'      },
];

const ALL_CURRENCIES = [
    'USD', 'EUR', 'RON', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'NOK', 'DKK', 'HUF', 'PLN',
    'NZD', 'SGD', 'HKD', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'TRY', 'KRW', 'THB', 'MYR', 'IDR',
    'PHP', 'CZK', 'ILS', 'AED', 'SAR', 'QAR', 'KWD',
];

const CCY_FLAG = {
    USD: 'us', EUR: 'eu', RON: 'ro', GBP: 'gb', CHF: 'ch', JPY: 'jp', CAD: 'ca', AUD: 'au',
    SEK: 'se', NOK: 'no', DKK: 'dk', HUF: 'hu', PLN: 'pl', NZD: 'nz', SGD: 'sg', HKD: 'hk',
    CNY: 'cn', INR: 'in', BRL: 'br', MXN: 'mx', ZAR: 'za', TRY: 'tr', KRW: 'kr', THB: 'th',
    MYR: 'my', IDR: 'id', PHP: 'ph', CZK: 'cz', ILS: 'il', AED: 'ae', SAR: 'sa', QAR: 'qa', KWD: 'kw',
};

const CCY_NAMES = { USD: 'US Dollar' };
EXCHANGE_RATES.forEach(r => { CCY_NAMES[r.to] = r.name; });

const INITIAL_CATEGORIES = {
    stocks:      ['Technology', 'Finance', 'Consumer', 'Healthcare', 'Media', 'Energy', 'Automotive', 'Other'],
    crypto:      ['Layer 1', 'Layer 2', 'DeFi', 'Exchange', 'Meme'],
    bonds:       ['Government', 'Corporate'],
    commodities: ['Metals', 'Petrol', 'Energy'],
    etfs:        ['Broad Market', 'Sector', 'Small Cap', 'International', 'Thematic', 'Bond ETF'],
};

const CATEGORY_IMG_MAP = {
    stocks: {
        Technology: '../images/stocks-subcategory-technology.jpg',
        Finance:    '../images/stocks-subcategory-finance.jpg',
        Consumer:   '../images/stocks-subcategory-consumer.jpg',
        Healthcare: '../images/stocks-subcategory-healthcare.jpg',
        Media:      '../images/stocks-subcategory-media.jpg',
        Energy:     '../images/stocks-subcategory-energy.jpg',
        Automotive: '../images/stocks-subcategory-automotive.jpg',
        Other:      '../images/stocks-subcategory-other.jpg',
    },
    crypto: {
        'Layer 1':  '../images/crypto-subcategory-layer1.jpg',
        'Layer 2':  '../images/crypto-subcategory-layer2.jpg',
        'DeFi':     '../images/crypto-subcategory-defi.jpg',
        'Exchange': '../images/crypto-subcategory-exchange.jpg',
        'Meme':     '../images/crypto-subcategory-meme.jpg',
    },
    bonds: {
        Government: '../images/bonds-category-government.jpg',
        Corporate:  '../images/bonds-category-corporate.jpg',
    },
    commodities: {
        Metals: '../images/commodities-subcategory-metals.jpg',
        Petrol: '../images/commodities-subcategory-petrol.jpg',
        Energy: '../images/commodities-subcategory-energy.jpg',
    },
    etfs: {},
};

const PAGE_SIZE = 10;

const PASSWORD_CRITERIA = [
    { key: 'length',  label: 'At least 8 characters', test: p => p.length >= 8          },
    { key: 'digit',   label: 'Contains a number',     test: p => /\d/.test(p)            },
    { key: 'upper',   label: 'Contains uppercase',    test: p => /[A-Z]/.test(p)         },
    { key: 'special', label: 'Contains special char', test: p => /[^A-Za-z0-9]/.test(p) },
];

const PASSWORD_STRENGTH_LEVELS = [
    { label: 'Weak',   cls: 'pw-weak',   minMet: 1 },
    { label: 'Medium', cls: 'pw-medium', minMet: 3 },
    { label: 'Strong', cls: 'pw-strong', minMet: 4 },
];

function getPasswordStrength(password) {
    const met = PASSWORD_CRITERIA.filter(c => c.test(password)).length;
    if (!met) return null;
    return [...PASSWORD_STRENGTH_LEVELS].reverse().find(l => met >= l.minMet) || PASSWORD_STRENGTH_LEVELS[0];
}

function Pagination({ page, total, onChange, pageSize = PAGE_SIZE }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    function buildPages() {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [1];
        if (page > 3) pages.push('…');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push('…');
        pages.push(totalPages);
        return pages;
    }

    return (
        <div className="table-pagination">
            <button className="pagination-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
            {buildPages().map((p, i) =>
                p === '…'
                    ? <span key={`e${i}`} className="pagination-ellipsis">…</span>
                    : <button key={p} className={`pagination-btn ${page === p ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
            )}
            <button className="pagination-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages}>›</button>
        </div>
    );
}

function SecurityModal({ onClose }) {
    const [currentPw,   setCurrentPw]   = useState('');
    const [newPw,       setNewPw]       = useState('');
    const [confirmPw,   setConfirmPw]   = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error,       setError]       = useState('');
    const [done,        setDone]        = useState(false);

    const strength  = getPasswordStrength(newPw);
    const metCount  = PASSWORD_CRITERIA.filter(c => c.test(newPw)).length;
    const allMet    = metCount === 4;
    const matches   = newPw === confirmPw && newPw.length > 0;
    const canSubmit = currentPw.length > 0 && allMet && matches;

    function handleSubmit(e) {
        e.preventDefault();
        if (currentPw !== 'administrator') { setError('Current password is incorrect.'); return; }
        setError('');
        setDone(true);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal admin-security-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">Change Password</span>
                        <span className="trade-company">Admin account security</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {done ? (
                    <div className="trade-success">
                        <i className="bi bi-check-circle-fill trade-success-icon"></i>
                        <p>Password updated successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="admin-form-error">{error}</div>}
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">Current password</label>
                            <div className="password-field-wrap">
                                <input type={showCurrent ? 'text' : 'password'} className="admin-input" value={currentPw}
                                    onChange={e => { setCurrentPw(e.target.value); setError(''); }} placeholder="••••••••" />
                                <button type="button" className="pw-toggle-btn" onClick={() => setShowCurrent(v => !v)}>
                                    <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">New password</label>
                            <div className="password-field-wrap">
                                <input type={showNew ? 'text' : 'password'} className="admin-input" value={newPw}
                                    onChange={e => setNewPw(e.target.value)} placeholder="••••••••" />
                                <button type="button" className="pw-toggle-btn" onClick={() => setShowNew(v => !v)}>
                                    <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {newPw.length > 0 && (
                                <div className="pw-strength-wrap">
                                    <div className="pw-bar-row">
                                        <div className="pw-strength-bar">
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} className={`pw-segment ${i < metCount ? (strength?.cls || '') : ''}`}></div>
                                            ))}
                                        </div>
                                        {strength && <span className={`pw-strength-label ${strength.cls}`}>{strength.label}</span>}
                                    </div>
                                    <div className="pw-criteria">
                                        {PASSWORD_CRITERIA.map(c => (
                                            <div key={c.key} className={`pw-criterion ${c.test(newPw) ? 'met' : ''}`}>
                                                <i className={`bi ${c.test(newPw) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                                                {c.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">Confirm new password</label>
                            <div className="password-field-wrap">
                                <input type={showConfirm ? 'text' : 'password'} className="admin-input" value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
                                <button type="button" className="pw-toggle-btn" onClick={() => setShowConfirm(v => !v)}>
                                    <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {confirmPw.length > 0 && newPw !== confirmPw && (
                                <p className="trade-error">Passwords do not match.</p>
                            )}
                        </div>
                        <div className="trade-modal-actions" style={{ marginTop: '1.25rem' }}>
                            <button type="button" className="trade-btn-cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="trade-btn-confirm" disabled={!canSubmit}>Update password</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

const ADMIN_NOTIFICATIONS = [
    { id: 1, icon: 'bi-chat-dots',    color: 'danger',  title: 'New Support Ticket',    body: 'Stefan Popescu — Cannot withdraw funds',           time: '2h ago',  section: 'support', read: false },
    { id: 2, icon: 'bi-chat-dots',    color: 'danger',  title: 'New Support Ticket',    body: 'Mihai Stanescu — Verification failed, what to do?', time: '3h ago',  section: 'support', read: false },
    { id: 3, icon: 'bi-person-check', color: 'warning', title: 'Verification Pending',  body: 'Maria Ionescu is awaiting ID review',               time: '5h ago',  section: 'users',   read: false },
    { id: 4, icon: 'bi-chat-dots',    color: 'danger',  title: 'New Support Ticket',    body: 'Camelia Tudor — Dividend not credited to account',  time: '8h ago',  section: 'support', read: true  },
    { id: 5, icon: 'bi-person-plus',  color: 'brand',   title: 'New User Registration', body: 'Camelia Tudor joined the platform',                 time: '1d ago',  section: 'users',   read: true  },
    { id: 6, icon: 'bi-person-check', color: 'warning', title: 'Verification Pending',  body: 'Cristian Barbu awaiting document review',           time: '1d ago',  section: 'users',   read: true  },
    { id: 7, icon: 'bi-person-plus',  color: 'brand',   title: 'New User Registration', body: 'Bogdan Gheorghe joined the platform',               time: '2d ago',  section: 'users',   read: true  },
];

function AdminNavbar({ onToggleSidebar, onSecurity, onNavigate }) {
    const [open,       setOpen]       = useState(false);
    const [isDark,     setIsDark]     = useState(() => (localStorage.getItem('theme') || 'dark') !== 'light');
    const [notifs,     setNotifs]     = useState(ADMIN_NOTIFICATIONS);
    const [notifOpen,  setNotifOpen]  = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const ref                         = useRef(null);
    const notifRef                    = useRef(null);

    const unreadCount = notifs.filter(n => !n.read).length;

    function toggleTheme() {
        const next = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-bs-theme', next);
        setIsDark(!isDark);
    }

    function closeNotifPanel() {
        setNotifs(prev => prev.filter(n => !n.read));
        setNotifOpen(false);
    }

    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) closeNotifPanel();
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="top-navbar">
            <div className="navbar-left">
                <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
                    <i className="bi bi-list"></i>
                </button>
                <a href="admin.html" className="nav-brand-link">
                    <img src="../images/app-icon.jpg" alt="logo" className="nav-logo-img" />
                    <span className="nav-brand-name">Pocket TradePro</span>
                </a>
            </div>
            <div className="navbar-right">
                <div className="notif-wrapper" ref={notifRef}>
                    <button className="icon-btn notif-btn" title="Notifications" onClick={() => notifOpen ? closeNotifPanel() : setNotifOpen(true)}>
                        <i className={`bi ${unreadCount > 0 ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>
                    {notifOpen && (
                        <div className="notif-panel">
                            <div className="notif-panel-header">
                                <span className="notif-panel-title">Notifications</span>
                                {notifs.some(n => !n.read) && (
                                    <button className="notif-mark-all" onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}>Mark all as read</button>
                                )}
                            </div>
                            <div className="notif-list">
                                {notifs.length === 0 ? (
                                    <div className="notif-empty">
                                        <i className="bi bi-bell-slash"></i>
                                        <span>No notifications</span>
                                    </div>
                                ) : (
                                    <>
                                        {notifs.map(n => (
                                            <div key={n.id}
                                                className={`notif-item ${n.read ? 'read' : 'unread'} ${expandedId === n.id ? 'expanded' : ''}`}
                                                onClick={() => {
                                                    setExpandedId(expandedId === n.id ? null : n.id);
                                                    setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x));
                                                    if (n.section && onNavigate) { onNavigate(n.section); setNotifOpen(false); }
                                                }}
                                            >
                                                <div className={`notif-icon-wrap notif-color-${n.color}`}>
                                                    <i className={`bi ${n.icon}`}></i>
                                                </div>
                                                <div className="notif-content">
                                                    <div className="notif-title">{n.title}</div>
                                                    <div className="notif-body">{n.body}</div>
                                                    <div className="notif-time">{n.time}</div>
                                                </div>
                                                {!n.read && <div className="notif-dot"></div>}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="user-menu" ref={ref}>
                    <button className="user-avatar-btn" onClick={() => setOpen(o => !o)}>
                        <div className="avatar-circle admin-avatar-circle"><i className="bi bi-shield-fill"></i></div>
                        <span className="user-name-nav">Admin TradePro</span>
                        <i className={`bi bi-chevron-${open ? 'up' : 'down'} chevron-icon`}></i>
                    </button>
                    {open && (
                        <div className="user-dropdown">
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => { onSecurity(); setOpen(false); }}>
                                <i className="bi bi-shield-lock"></i> Security
                            </button>
                            <button className="dropdown-item theme-toggle-row" onClick={toggleTheme}>
                                <span><i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'}`}></i> Dark mode</span>
                                <div className={`toggle-switch ${isDark ? 'on' : ''}`}><div className="toggle-knob"></div></div>
                            </button>
                            <div className="dropdown-divider"></div>
                            <a href="login.html" className="dropdown-item danger" onClick={() => ['profilePersonal','profileCards','profileAvatar','profileNotifications','sessionUser','preferredCurrency','chartType','watchlist'].forEach(k => localStorage.removeItem(k))}>
                                <i className="bi bi-box-arrow-right"></i> Log out
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function FilterDropdown({ options, value, onChange, colors }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open) return;
        const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);
    const activeColor = colors?.[value];
    return (
        <div className="filter-dd-wrap" ref={ref}>
            <button className="pf-dd-trigger" onClick={() => setOpen(o => !o)}>
                {activeColor && <span className="pf-dd-dot" style={{ background: activeColor }} />}
                <span className="pf-dd-label">{value}</span>
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} pf-dd-chevron`} />
            </button>
            {open && (
                <div className="pf-dd-menu">
                    {options.map(opt => (
                        <button key={opt} className={`pf-dd-option ${value === opt ? 'active' : ''}`}
                            onClick={() => { onChange(opt); setOpen(false); }}>
                            {colors?.[opt] && <span className="pf-dd-dot" style={{ background: colors[opt] }} />}
                            {opt}
                            {value === opt && <i className="bi bi-check2 pf-dd-check" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function AdminSidebar({ activeSection, onSelect, collapsed, ticketCount, mobileOpen }) {
    return (
        <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            <nav className="sidebar-nav">
                {ADMIN_NAV_ITEMS.map(item => (
                    <button
                        key={item.key}
                        className={`sidebar-nav-item ${activeSection === item.key ? 'active' : ''}`}
                        onClick={() => onSelect(item.key)}
                        title={collapsed ? item.label : ''}
                    >
                        <i className={`bi ${item.icon} sidebar-icon`}></i>
                        {!collapsed && <span className="sidebar-label">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

function verifiedBadge(v) {
    if (v === 'verified') return <span className="admin-badge badge-verified"><i className="bi bi-patch-check-fill"></i> Verified</span>;
    if (v === 'pending')  return <span className="admin-badge badge-pending"><i className="bi bi-clock-fill"></i> Pending</span>;
    if (v === 'failed')   return <span className="admin-badge badge-failed"><i className="bi bi-x-circle-fill"></i> Failed</span>;
    return <span className="admin-badge badge-none">—</span>;
}

function UserActionsModal({ user, onClose, onToggleStatus, onChangeRole, onVerifyID, onTransactions, onDelete }) {
    const txCount = (USER_TRANSACTIONS[user.id] || []).length;
    const verifyDesc = {
        verified: 'Account is verified',
        pending:  'Documents awaiting review',
        failed:   'Verification was rejected',
        null:     'No documents submitted',
    }[user.verified] || 'No documents submitted';

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal uam-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn uam-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>

                <div className="uam-header">
                    <div className="uam-avatar">{user.firstName[0]}{user.lastName[0]}</div>
                    <div className="uam-info">
                        <div className="uam-name">{user.firstName} {user.lastName}</div>
                        <div className="uam-email">{user.email}</div>
                        <div className="uam-badges">
                            <span className={`admin-badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user.role}</span>
                            <span className={`admin-badge ${user.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{user.status}</span>
                            {verifiedBadge(user.verified)}
                        </div>
                    </div>
                </div>

                <div className="uam-meta-row">
                    <span className="uam-meta-item"><i className="bi bi-calendar3"></i> Joined {user.joined}</span>
                    <span className="uam-meta-sep"></span>
                    <span className="uam-meta-item"><i className="bi bi-wallet2"></i> ${fmt(user.cash)}</span>
                </div>

                <div className="uam-divider"></div>

                <div className="uam-actions">
                    <button className="uam-action-row" onClick={onToggleStatus}>
                        <div className={`uam-action-icon ${user.status === 'active' ? 'icon-warn' : 'icon-brand'}`}>
                            <i className={`bi ${user.status === 'active' ? 'bi-person-x' : 'bi-person-check'}`}></i>
                        </div>
                        <div className="uam-action-text">
                            <span className="uam-action-label">{user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}</span>
                            <span className="uam-action-desc">{user.status === 'active' ? 'Restrict user from logging in' : 'Restore full platform access'}</span>
                        </div>
                        <i className="bi bi-chevron-right uam-chevron"></i>
                    </button>

                    <button className="uam-action-row" onClick={onChangeRole}>
                        <div className={`uam-action-icon ${user.role === 'admin' ? 'icon-violet' : 'icon-info'}`}>
                            <i className={`bi ${user.role === 'admin' ? 'bi-shield-check' : 'bi-person'}`}></i>
                        </div>
                        <div className="uam-action-text">
                            <span className="uam-action-label">Change Role</span>
                            <span className="uam-action-desc">Currently: {user.role}</span>
                        </div>
                        <i className="bi bi-chevron-right uam-chevron"></i>
                    </button>

                    <button className="uam-action-row" onClick={onVerifyID}>
                        <div className={`uam-action-icon ${user.verified === 'pending' ? 'icon-warn' : user.verified === 'verified' ? 'icon-brand' : 'icon-muted'}`}>
                            <i className="bi bi-patch-check"></i>
                        </div>
                        <div className="uam-action-text">
                            <span className="uam-action-label">Identity Verification</span>
                            <span className="uam-action-desc">{verifyDesc}</span>
                        </div>
                        {user.verified === 'pending' && <span className="uam-action-badge">Review</span>}
                        <i className="bi bi-chevron-right uam-chevron"></i>
                    </button>

                    <button className="uam-action-row" onClick={onTransactions}>
                        <div className="uam-action-icon icon-muted">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div className="uam-action-text">
                            <span className="uam-action-label">Transaction History</span>
                            <span className="uam-action-desc">{txCount} {txCount === 1 ? 'transaction' : 'transactions'}</span>
                        </div>
                        <i className="bi bi-chevron-right uam-chevron"></i>
                    </button>
                </div>

                <div className="uam-divider"></div>

                <div className="uam-danger-zone">
                    <button className="uam-delete-btn" onClick={onDelete}>
                        <i className="bi bi-trash3"></i> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

function UsersSection() {
    const [users,      setUsers]      = useState(() => lsGet('admin_users', MOCK_USERS));
    useEffect(() => { sessionStorage.setItem('admin_users', JSON.stringify(users)); }, [users]);
    const [search,     setSearch]     = useState('');
    const [filter,     setFilter]     = useState('All');
    const [page,       setPage]       = useState(1);
    const [actionUser, setActionUser] = useState(null);
    const [txUser,     setTxUser]     = useState(null);
    const [roleUser,   setRoleUser]   = useState(null);
    const [verifyUser, setVerifyUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [nameSort,   setNameSort]   = useState(null);

    useEffect(() => { setPage(1); }, [search, filter]);

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchQ = !q || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        if (!matchQ) return false;
        if (filter === 'Users')    return u.role   === 'user';
        if (filter === 'Admin')    return u.role   === 'admin';
        if (filter === 'Active')   return u.status === 'active';
        if (filter === 'Inactive') return u.status === 'inactive';
        return true;
    });
    const sorted = nameSort
        ? [...filtered].sort((a, b) => {
            const la = (a.lastName + a.firstName).toLowerCase();
            const lb = (b.lastName + b.firstName).toLowerCase();
            return nameSort === 'asc' ? la.localeCompare(lb) : lb.localeCompare(la);
          })
        : filtered;
    const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function toggleStatus(id) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    }
    function changeRole(id, role) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
        setRoleUser(null);
    }
    function setVerification(id, v) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: v } : u));
        setVerifyUser(null);
    }
    function deleteAccount(id) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setDeleteUser(null);
    }

    const TX_CLS  = { BUY: 'tx-buy', SELL: 'tx-sell', DEPOSIT: 'tx-deposit', WITHDRAW: 'tx-withdraw' };
    const TX_SIGN = { BUY: '-', SELL: '+', DEPOSIT: '+', WITHDRAW: '-' };

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-people"></i> Users</h2>
                <span className="admin-section-count">{users.length} registered</span>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search-wrap">
                    <i className="bi bi-search"></i>
                    <input className="admin-search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="admin-filter-group">
                    {['All', 'Users', 'Admin', 'Active', 'Inactive'].map(f => (
                        <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                </div>
                <FilterDropdown options={['All', 'Users', 'Admin', 'Active', 'Inactive']} value={filter} onChange={setFilter} />
            </div>

            <div className="card-panel" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="data-table admin-users-table">
                    <thead>
                        <tr>
                            <th className="sortable-col" onClick={() => setNameSort(s => s === 'asc' ? 'desc' : 'asc')}>
                                User <i className={`bi ${nameSort === 'asc' ? 'bi-sort-up' : nameSort === 'desc' ? 'bi-sort-down' : 'bi-sort-up'} ms-1`} style={{ opacity: nameSort ? 1 : 0.3 }}></i>
                            </th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Verified</th>
                            <th>Balance</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-sm">{u.firstName[0]}{u.lastName[0]}</div>
                                        <span>{u.firstName} {u.lastName}</span>
                                    </div>
                                </td>
                                <td className="text-muted-cell">{u.email}</td>
                                <td><span className={`admin-badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                                <td><span className={`admin-badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{u.status}</span></td>
                                <td>{verifiedBadge(u.verified)}</td>
                                <td className="numeric-cell">${fmt(u.cash)}</td>
                                <td className="text-muted-cell">{u.joined}</td>
                                <td>
                                    <button className="admin-action-btn" onClick={() => setActionUser(u)}>
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paged.length === 0 && (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users match the current filters.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>

            {actionUser && (
                <UserActionsModal
                    user={actionUser}
                    onClose={() => setActionUser(null)}
                    onToggleStatus={() => { toggleStatus(actionUser.id); setActionUser(null); }}
                    onChangeRole={() => { setRoleUser(actionUser); setActionUser(null); }}
                    onVerifyID={() => { setVerifyUser(actionUser); setActionUser(null); }}
                    onTransactions={() => { setTxUser(actionUser); setActionUser(null); }}
                    onDelete={() => { setDeleteUser(actionUser); setActionUser(null); }}
                />
            )}

            {txUser && (
                <div className="modal-backdrop" onClick={() => { setActionUser(txUser); setTxUser(null); }}>
                    <div className="trade-modal admin-wide-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <div>
                                <span className="trade-symbol">{txUser.firstName} {txUser.lastName}</span>
                                <span className="trade-company">Transaction history</span>
                            </div>
                            <button className="modal-close-btn" onClick={() => { setActionUser(txUser); setTxUser(null); }}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-tx-modal-body">
                            {(USER_TRANSACTIONS[txUser.id] || []).length === 0 ? (
                                <div className="admin-empty-state"><i className="bi bi-inbox"></i><p>No transactions yet</p></div>
                            ) : (
                                <div className="admin-tx-list">
                                    {(USER_TRANSACTIONS[txUser.id] || []).map(tx => (
                                        <div key={tx.id} className="admin-tx-row">
                                            <span className={`tx-badge ${TX_CLS[tx.type] || ''}`}>{tx.type}</span>
                                            <span className="admin-tx-sym">{tx.symbol || '—'}</span>
                                            <span className="admin-tx-detail">
                                                {tx.qty != null ? `${tx.qty} × $${fmt(tx.price)}` : ''}
                                            </span>
                                            <span className="admin-tx-date">{tx.date}</span>
                                            <span className={`admin-tx-amount ${TX_CLS[tx.type]}`}>{TX_SIGN[tx.type]}${fmt(tx.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {roleUser && (
                <div className="modal-backdrop" onClick={() => { setActionUser(roleUser); setRoleUser(null); }}>
                    <div className="trade-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <div>
                                <span className="trade-symbol">Change Role</span>
                                <span className="trade-company">{roleUser.firstName} {roleUser.lastName}</span>
                            </div>
                            <button className="modal-close-btn" onClick={() => { setActionUser(roleUser); setRoleUser(null); }}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-role-options">
                            {['user', 'admin'].map(r => (
                                <button key={r} className={`admin-role-option ${roleUser.role === r ? 'active' : ''}`} onClick={() => changeRole(roleUser.id, r)}>
                                    <i className={`bi ${r === 'admin' ? 'bi-shield-check' : 'bi-person'}`}></i>
                                    <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                                    {roleUser.role === r && <i className="bi bi-check-lg check-icon"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {verifyUser && (
                <div className="modal-backdrop" onClick={() => { setActionUser(verifyUser); setVerifyUser(null); }}>
                    <div className="trade-modal admin-wide-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <div>
                                <span className="trade-symbol">Identity Verification</span>
                                <span className="trade-company">{verifyUser.firstName} {verifyUser.lastName} · {verifyUser.email}</span>
                            </div>
                            <button className="modal-close-btn" onClick={() => { setActionUser(verifyUser); setVerifyUser(null); }}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-verify-body">
                            {(verifyUser.verified === 'pending' || verifyUser.verified === 'failed') ? (<>
                                {verifyUser.verified === 'failed' && (
                                    <div className="uam-verify-banner banner-failed">
                                        <i className="bi bi-x-circle-fill"></i> Previous verification was rejected. Reviewing re-submitted documents.
                                    </div>
                                )}
                                <div className="admin-doc-placeholders">
                                    <div className="admin-doc-card">
                                        <i className="bi bi-card-image"></i>
                                        <span>Front side ID</span>
                                        <p className="text-muted" style={{ fontSize: '0.72rem', margin: 0 }}>Uploaded 2026-04-03</p>
                                    </div>
                                    <div className="admin-doc-card">
                                        <i className="bi bi-card-image"></i>
                                        <span>Back side ID</span>
                                        <p className="text-muted" style={{ fontSize: '0.72rem', margin: 0 }}>Uploaded 2026-04-03</p>
                                    </div>
                                </div>
                                <div className="trade-modal-actions admin-verify-actions">
                                    <button className="trade-btn-cancel" onClick={() => setVerification(verifyUser.id, 'failed')}>Reject</button>
                                    <button className="trade-btn-confirm" onClick={() => setVerification(verifyUser.id, 'verified')}>Approve</button>
                                </div>
                            </>) : verifyUser.verified === 'verified' ? (
                                <div className="uam-verify-state">
                                    <div className="uam-verify-icon verified"><i className="bi bi-patch-check-fill"></i></div>
                                    <div className="uam-verify-title">Account Verified</div>
                                    <div className="uam-verify-sub">This account has been verified and all documents have been approved.</div>
                                    <button className="trade-btn-cancel" style={{ marginTop: '1.25rem' }} onClick={() => setVerification(verifyUser.id, null)}>Revoke Verification</button>
                                </div>
                            ) : (
                                <div className="uam-verify-state">
                                    <div className="uam-verify-icon empty"><i className="bi bi-file-earmark-x"></i></div>
                                    <div className="uam-verify-title">No Documents Submitted</div>
                                    <div className="uam-verify-sub">This user has not uploaded any identity documents yet.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deleteUser && (
                <div className="modal-backdrop" onClick={() => { setActionUser(deleteUser); setDeleteUser(null); }}>
                    <div className="trade-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <div>
                                <span className="trade-symbol">Delete Account</span>
                                <span className="trade-company">{deleteUser.firstName} {deleteUser.lastName}</span>
                            </div>
                            <button className="modal-close-btn" onClick={() => { setActionUser(deleteUser); setDeleteUser(null); }}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-confirm-body">
                            <div className="admin-danger-icon"><i className="bi bi-exclamation-triangle-fill"></i></div>
                            <p>This action is <strong>irreversible</strong>. All data for <strong>{deleteUser.firstName} {deleteUser.lastName}</strong> will be permanently deleted.</p>
                        </div>
                        <div className="trade-modal-actions">
                            <button className="trade-btn-cancel" onClick={() => setDeleteUser(null)}>Cancel</button>
                            <button className="trade-btn-confirm danger-btn" onClick={() => deleteAccount(deleteUser.id)}>Delete permanently</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const TICKET_STATUS_CFG = {
    open:    { label: 'Open',    color: '#00c896', icon: 'bi-circle-fill'  },
    pending: { label: 'Pending', color: '#f0b429', icon: 'bi-clock-fill'   },
    closed:  { label: 'Closed',  color: '#8b949e', icon: 'bi-check-circle-fill' },
};

function TicketStatusDropdown({ status, onChange }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef(null);

    useEffect(() => {
        if (!open) return;
        function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const cur = TICKET_STATUS_CFG[status];

    return (
        <div className="ticket-status-dd-wrap" ref={ref}>
            <button className="ticket-status-dd-trigger" onClick={() => setOpen(o => !o)}>
                <span className="ticket-status-dd-dot" style={{ background: cur.color }}></span>
                <span className="ticket-status-dd-label">{cur.label}</span>
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} ticket-status-dd-chevron`}></i>
            </button>
            {open && (
                <div className="ticket-status-dd-menu">
                    {Object.entries(TICKET_STATUS_CFG).map(([key, cfg]) => (
                        <button key={key} className={`ticket-status-dd-option${status === key ? ' active' : ''}`}
                            onClick={() => { onChange(key); setOpen(false); }}>
                            <span className="ticket-status-dd-dot" style={{ background: cfg.color }}></span>
                            <span>{cfg.label}</span>
                            {status === key && <i className="bi bi-check-lg ticket-status-dd-check"></i>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SupportSection({ tickets, setTickets }) {
    const [filter,     setFilter]    = useState('All');
    const [openId,     setOpenId]    = useState(null);
    const [replyText,  setReply]     = useState('');
    const [viewedIds,  setViewedIds] = useState(new Set());
    const [mobileView, setMobileView] = useState('list');
    const chatEndRef                 = useRef(null);

    const filtered   = filter === 'All' ? tickets : tickets.filter(t => t.status === filter.toLowerCase());
    const openTicket = tickets.find(t => t.id === openId) || null;

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [openTicket?.replies?.length]);

    function openTicketById(id) {
        setOpenId(id);
        setViewedIds(prev => new Set([...prev, id]));
        setMobileView('chat');
    }

    function goBackToList() {
        setMobileView('list');
        setOpenId(null);
    }

    function setStatus(id, status) {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    }

    function sendReply(id) {
        if (!replyText.trim()) return;
        const _d = new Date(), _pad = n => String(n).padStart(2,'0');
        const nowStr = `${_d.getFullYear()}-${_pad(_d.getMonth()+1)}-${_pad(_d.getDate())} ${_pad(_d.getHours())}:${_pad(_d.getMinutes())}`;
        setTickets(prev => prev.map(t => t.id === id ? {
            ...t,
            status: t.status === 'open' ? 'pending' : t.status,
            replies: [...t.replies, { from: 'support', text: replyText.trim(), date: nowStr }],
        } : t));
        setReply('');
    }

    function deleteTicket(id) {
        if (openId === id) { setOpenId(null); setMobileView('list'); }
        setTickets(prev => prev.filter(t => t.id !== id));
    }

    function statusColor(s) {
        if (s === 'open')    return '#00c896';
        if (s === 'pending') return '#f0b429';
        return '#8b949e';
    }

    const openCount = tickets.filter(t => t.status === 'open').length;

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-chat-dots"></i> Support</h2>
                <span className="admin-section-count">{openCount} open</span>
            </div>

            <div className={`support-layout support-mobile-${mobileView}`}>
                <div className="support-ticket-list">
                        <div className="admin-filter-group support-filter-row">
                        {['All', 'Open', 'Pending', 'Closed'].map(s => (
                            <button key={s} className={`admin-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
                        ))}
                        <FilterDropdown options={['All', 'Open', 'Pending', 'Closed']} value={filter} onChange={setFilter} />
                    </div>
                    <div className="support-tickets-body">
                        {filtered.length === 0 && (
                            <div className="admin-empty-state"><i className="bi bi-inbox"></i><p>No tickets</p></div>
                        )}
                        {filtered.map(t => (
                            <div key={t.id} className={`support-ticket-card ${openId === t.id ? 'active' : ''}`} onClick={() => openTicketById(t.id)}>
                                <div className="ticket-avatar-col">
                                    <span className="ticket-user-avatar">{t.userName.split(' ').map(w => w[0]).join('')}</span>
                                    {t.status === 'open' && <span className="ticket-status-dot dot-open"></span>}
                                    {t.status === 'pending' && <span className="ticket-status-dot dot-pending"></span>}
                                </div>
                                <div className="ticket-info-col">
                                    <div className="ticket-name-row">
                                        <span className="ticket-user-name">{t.userName}</span>
                                        <span className="ticket-item-date">{t.date.split(' ')[0]}</span>
                                    </div>
                                    <div className={`ticket-preview${t.status !== 'closed' ? ' ticket-preview-unread' : ''}`}>{t.subject}</div>
                                    <div className="ticket-item-tag" style={{ color: statusColor(t.status) }}>{t.status}</div>
                                </div>
                                <div className="ticket-right-col">
                                    <span className="ticket-unread-badge" style={{ visibility: t.replies.length > 0 && !viewedIds.has(t.id) ? 'visible' : 'hidden' }}>{t.replies.length || ''}</span>
                                    <button className="ticket-delete-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); deleteTicket(t.id); }}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="support-chat-panel">
                    {!openTicket ? (
                        <div className="admin-empty-state" style={{ height: '100%' }}>
                            <i className="bi bi-chat-square-dots"></i>
                            <p>Select a ticket to view conversation</p>
                        </div>
                    ) : (
                        <>
                            <div className="support-chat-header">
                                <button className="support-back-btn" onClick={goBackToList}>
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                                <div className="support-chat-info">
                                    <div className="support-chat-subject">{openTicket.subject}</div>
                                    <div className="support-chat-from">{openTicket.userName} · {openTicket.email}</div>
                                </div>
                                <TicketStatusDropdown status={openTicket.status} onChange={s => setStatus(openTicket.id, s)} />
                            </div>
                            <div className="support-chat-messages">
                                <div className="chat-msg chat-user">
                                    <div className="chat-bubble">{openTicket.message}</div>
                                    <div className="chat-msg-meta">{openTicket.userName} · {openTicket.date}</div>
                                </div>
                                {openTicket.replies.map((r, i) => (
                                    <div key={i} className={`chat-msg ${r.from === 'support' ? 'chat-support' : 'chat-user'}`}>
                                        <div className="chat-bubble">{r.text}</div>
                                        <div className="chat-msg-meta">{r.from === 'support' ? 'Support Team' : openTicket.userName} · {r.date}</div>
                                    </div>
                                ))}
                                <div ref={chatEndRef}></div>
                            </div>
                            <div className="support-reply-wrap">
                                <textarea className="support-reply-input" rows={2} placeholder="Type a reply… (Enter to send)"
                                    value={replyText} onChange={e => setReply(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(openTicket.id); } }} />
                                <button className="support-send-btn" onClick={() => sendReply(openTicket.id)} disabled={!replyText.trim()}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function AddAssetModal({ assetType, categories, onClose, onAdd }) {
    const [form,  setForm]  = useState({ symbol: '', name: '', category: categories[0] || '', sector: categories[0] || '', issuer: '', type: categories[0] || '', maturity: '', yield: '', unit: 'oz', exchange: 'COMEX', price: '', changePct: '', volume: '', cap: '', aum: '', rating: 'AAA' });
    const [error, setError] = useState('');

    function set(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.symbol.trim() || !form.price) { setError('Symbol and price are required.'); return; }
        const price = parseFloat(form.price);
        const changePct = parseFloat(form.changePct) || 0;
        const change = price * changePct / 100;
        let asset;
        if (assetType === 'stocks')       asset = { symbol: form.symbol.toUpperCase(), name: form.name, sector: form.sector,    price, changePct, change, volume: form.volume || '0', cap: form.cap || '0' };
        else if (assetType === 'crypto')  asset = { symbol: form.symbol.toUpperCase(), name: form.name, category: form.category, price, changePct, change, volume: form.volume || '0', cap: form.cap || '0' };
        else if (assetType === 'bonds')   asset = { symbol: form.symbol.toUpperCase(), issuer: form.issuer, type: form.type, maturity: form.maturity, yield: parseFloat(form.yield) || 0, price, rating: form.rating };
        else if (assetType === 'commodities') asset = { symbol: form.symbol.toUpperCase(), name: form.name, category: form.category, price, changePct, change, unit: form.unit, exchange: form.exchange };
        else                              asset = { symbol: form.symbol.toUpperCase(), name: form.name, category: form.category, price, changePct, change, volume: form.volume || '0', aum: form.aum || '0' };
        onAdd(asset);
    }

    const catField = assetType === 'bonds' ? 'type' : assetType === 'stocks' ? 'sector' : 'category';

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal admin-wide-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">Add New Asset</span>
                        <span className="trade-company">{assetType.charAt(0).toUpperCase() + assetType.slice(1)}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {error && <div className="admin-form-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label className="admin-field-label">Symbol *</label>
                            <input className="admin-input" value={form.symbol} onChange={e => { set('symbol', e.target.value); setError(''); }} />
                        </div>
                        {assetType !== 'bonds' ? (
                            <div className="admin-form-field">
                                <label className="admin-field-label">Name *</label>
                                <input className="admin-input" placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} />
                            </div>
                        ) : (
                            <div className="admin-form-field">
                                <label className="admin-field-label">Issuer *</label>
                                <input className="admin-input" value={form.issuer} onChange={e => set('issuer', e.target.value)} />
                            </div>
                        )}
                        <div className="admin-form-field">
                            <label className="admin-field-label">{assetType === 'bonds' ? 'Type' : assetType === 'stocks' ? 'Sector' : 'Category'}</label>
                            <AdminSelect value={form[catField]} onChange={v => set(catField, v)} options={categories.map(c => ({ value: c, label: c }))} />
                        </div>
                        <div className="admin-form-field">
                            <label className="admin-field-label">Price *</label>
                            <input className="admin-input" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} />
                        </div>
                        {assetType !== 'bonds' && (
                            <div className="admin-form-field">
                                <label className="admin-field-label">Return %</label>
                                <input className="admin-input" type="number" step="0.01" placeholder="0.00" value={form.changePct} onChange={e => set('changePct', e.target.value)} />
                            </div>
                        )}
                        {assetType === 'bonds' && (
                            <>
                                <div className="admin-form-field">
                                    <label className="admin-field-label">Yield %</label>
                                    <input className="admin-input" type="number" step="0.01" value={form.yield} onChange={e => set('yield', e.target.value)} />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-field-label">Maturity</label>
                                    <input className="admin-input" type="date" value={form.maturity} onChange={e => set('maturity', e.target.value)} />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-field-label">Rating</label>
                                    <AdminSelect value={form.rating} onChange={v => set('rating', v)} options={['AAA','AA+','AA','AA-','A+','A','A-','BBB+','BBB','BB'].map(r => ({ value: r, label: r }))} />
                                </div>
                            </>
                        )}
                        {(assetType === 'stocks' || assetType === 'crypto' || assetType === 'etfs') && (
                            <div className="admin-form-field">
                                <label className="admin-field-label">Volume</label>
                                <input className="admin-input" placeholder="e.g. 10.5M" value={form.volume} onChange={e => set('volume', e.target.value)} />
                            </div>
                        )}
                        {(assetType === 'stocks' || assetType === 'crypto') && (
                            <div className="admin-form-field">
                                <label className="admin-field-label">Market Cap</label>
                                <input className="admin-input" placeholder="e.g. 2.81T" value={form.cap} onChange={e => set('cap', e.target.value)} />
                            </div>
                        )}
                        {assetType === 'etfs' && (
                            <div className="admin-form-field">
                                <label className="admin-field-label">AUM</label>
                                <input className="admin-input" placeholder="e.g. 507B" value={form.aum} onChange={e => set('aum', e.target.value)} />
                            </div>
                        )}
                        {assetType === 'commodities' && (
                            <>
                                <div className="admin-form-field">
                                    <label className="admin-field-label">Unit</label>
                                    <input className="admin-input" placeholder="oz / bbl / lb…" value={form.unit} onChange={e => set('unit', e.target.value)} />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-field-label">Exchange</label>
                                    <input className="admin-input" placeholder="COMEX / NYMEX…" value={form.exchange} onChange={e => set('exchange', e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="trade-modal-actions" style={{ marginTop: '1.25rem' }}>
                        <button type="button" className="trade-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="trade-btn-confirm">Add asset</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CategoryManagerModal({ assetType, categories, setCategories, catImgs, setCatImgs, onClose }) {
    const [type,    setType]    = useState(assetType);
    const [newCat,  setNewCat]  = useState('');
    const [newImg,  setNewImg]  = useState('');
    const [imgName, setImgName] = useState('');

    const current = categories[type] || [];
    const KEYS = ['stocks', 'crypto', 'bonds', 'commodities', 'etfs'];

    function addCategory() {
        const name = newCat.trim();
        if (!name || current.includes(name)) return;
        setCategories(prev => ({ ...prev, [type]: [...(prev[type] || []), name] }));
        setCatImgs(prev => ({ ...prev, [type]: { ...(prev[type] || {}), [name]: newImg } }));
        setNewCat(''); setNewImg(''); setImgName('');
    }

    function removeCategory(cat) {
        setCategories(prev => ({ ...prev, [type]: (prev[type] || []).filter(c => c !== cat) }));
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal admin-wide-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">Manage Categories</span>
                        <span className="trade-company">Add or remove asset categories</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="admin-asset-tabs" style={{ marginBottom: '1rem' }}>
                    {KEYS.map(k => (
                        <button key={k} className={`admin-asset-tab ${type === k ? 'active' : ''}`} onClick={() => setType(k)}>
                            {k.charAt(0).toUpperCase() + k.slice(1)}
                        </button>
                    ))}
                </div>
                <FilterDropdown
                    options={KEYS.map(k => k.charAt(0).toUpperCase() + k.slice(1))}
                    value={type.charAt(0).toUpperCase() + type.slice(1)}
                    onChange={label => setType(label.toLowerCase())}
                />
                <div className="cat-list">
                    {current.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>No categories yet.</div>}
                    {current.map(c => (
                        <div key={c} className="cat-row">
                            <div className="cat-row-left">
                                {(catImgs[type] || {})[c] && <img src={(catImgs[type] || {})[c]} alt={c} className="cat-img-preview" />}
                                <span className="cat-name">{c}</span>
                            </div>
                            <button className="admin-delete-btn" onClick={() => removeCategory(c)}>
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cat-add-row">
                    <input className="admin-input" placeholder="Category name" value={newCat} onChange={e => setNewCat(e.target.value)} style={{ flex: 1 }} />
                    <label className="cat-upload-btn" title={newImg ? 'Change image' : 'Upload category image'}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                            const f = e.target.files[0];
                            if (!f) return;
                            setImgName(f.name);
                            const reader = new FileReader();
                            reader.onload = ev => setNewImg(ev.target.result);
                            reader.readAsDataURL(f);
                        }} />
                        {newImg
                            ? <><img src={newImg} className="cat-img-preview" alt="" /><span>{imgName}</span></>
                            : <><i className="bi bi-image"></i><span>Upload image</span></>
                        }
                    </label>
                    <button className="admin-add-btn primary" onClick={addCategory} disabled={!newCat.trim()}>
                        <i className="bi bi-plus-lg"></i> Add
                    </button>
                </div>
            </div>
        </div>
    );
}

function MarketDataSection() {
    const [assetType,   setAssetType]   = useState('stocks');
    const [stocks,      setStocks]      = useState(() => lsGet('admin_stocks',      MOCK_STOCKS));
    const [cryptos,     setCryptos]     = useState(() => lsGet('admin_cryptos',     MOCK_CRYPTO));
    const [bonds,       setBonds]       = useState(() => lsGet('admin_bonds',       MOCK_BONDS));
    const [commodities, setCommodities] = useState(() => lsGet('admin_commodities', MOCK_COMMODITIES));
    const [etfs,        setEtfs]        = useState(() => lsGet('admin_etfs',        MOCK_ETFS));
    const [categories,  setCategories]  = useState(() => lsGet('admin_categories',  INITIAL_CATEGORIES));
    const [catImgs,     setCatImgs]     = useState(() => lsGet('admin_cat_imgs',    CATEGORY_IMG_MAP));
    useEffect(() => { sessionStorage.setItem('admin_stocks',      JSON.stringify(stocks));      }, [stocks]);
    useEffect(() => { sessionStorage.setItem('admin_cryptos',     JSON.stringify(cryptos));     }, [cryptos]);
    useEffect(() => { sessionStorage.setItem('admin_bonds',       JSON.stringify(bonds));       }, [bonds]);
    useEffect(() => { sessionStorage.setItem('admin_commodities', JSON.stringify(commodities)); }, [commodities]);
    useEffect(() => { sessionStorage.setItem('admin_etfs',        JSON.stringify(etfs));        }, [etfs]);
    useEffect(() => { sessionStorage.setItem('admin_categories',  JSON.stringify(categories));  }, [categories]);
    useEffect(() => { sessionStorage.setItem('admin_cat_imgs',    JSON.stringify(catImgs));     }, [catImgs]);
    const [showAdd,     setShowAdd]     = useState(false);
    const [showCatMgr,  setShowCatMgr]  = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search,      setSearch]      = useState('');
    const [page,        setPage]        = useState(1);

    useEffect(() => { setPage(1); setSearch(''); }, [assetType]);
    useEffect(() => { setPage(1); }, [search]);

    const ASSET_TABS = [
        { key: 'stocks',      label: 'Stocks',      icon: 'bi-graph-up-arrow'    },
        { key: 'crypto',      label: 'Crypto',      icon: 'bi-currency-bitcoin'  },
        { key: 'bonds',       label: 'Bonds',       icon: 'bi-bank'              },
        { key: 'commodities', label: 'Commodities', icon: 'bi-box-seam'          },
        { key: 'etfs',        label: 'ETFs',        icon: 'bi-layers'            },
    ];

    const assetsMap    = { stocks, crypto: cryptos, bonds, commodities, etfs };
    const setAssetsMap = { stocks: setStocks, crypto: setCryptos, bonds: setBonds, commodities: setCommodities, etfs: setEtfs };

    const currentAssets   = assetsMap[assetType] || [];
    const filteredAssets  = search ? currentAssets.filter(a => (a.symbol + ' ' + (a.name || a.issuer || '')).toLowerCase().includes(search.toLowerCase())) : currentAssets;
    const pagedAssets     = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleDelete(symbol) {
        setAssetsMap[assetType](prev => prev.filter(a => a.symbol !== symbol));
        setDeleteTarget(null);
    }

    function handleAdd(asset) {
        setAssetsMap[assetType](prev => [...prev, asset]);
        setShowAdd(false);
    }

    function renderRow(a) {
        const pct = a.changePct;
        const pctCell = <td className={pct >= 0 ? 'positive' : 'negative'}>{pct >= 0 ? '+' : ''}{typeof pct === 'number' ? pct.toFixed(2) : pct}%</td>;
        if (assetType === 'stocks')       return <><td><span className="symbol-badge">{a.symbol}</span></td><td>{a.name}</td><td className="text-muted-cell">{a.sector}</td><td className="numeric-cell">${fmt(a.price)}</td>{pctCell}</>;
        if (assetType === 'crypto')       return <><td><span className="symbol-badge">{a.symbol}</span></td><td>{a.name}</td><td className="text-muted-cell">{a.category}</td><td className="numeric-cell">${fmt(a.price)}</td>{pctCell}</>;
        if (assetType === 'bonds')        return <><td><span className="symbol-badge">{a.symbol}</span></td><td>{a.issuer}</td><td className="text-muted-cell">{a.type}</td><td className="numeric-cell">${fmt(a.price)}</td><td className="positive">{fmt(a.yield)}%</td></>;
        if (assetType === 'commodities')  return <><td><span className="symbol-badge">{a.symbol}</span></td><td>{a.name}</td><td className="text-muted-cell">{a.category}</td><td className="numeric-cell">${fmt(a.price)}</td>{pctCell}</>;
        if (assetType === 'etfs')         return <><td><span className="symbol-badge">{a.symbol}</span></td><td>{a.name}</td><td className="text-muted-cell">{a.category}</td><td className="numeric-cell">${fmt(a.price)}</td>{pctCell}</>;
        return null;
    }

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-graph-up-arrow"></i> Market Data</h2>
            </div>

            <div className="market-tabs-row">
                <div className="admin-asset-tabs">
                    {ASSET_TABS.map(t => (
                        <button key={t.key} className={`admin-asset-tab ${assetType === t.key ? 'active' : ''}`} onClick={() => setAssetType(t.key)}>
                            <i className={`bi ${t.icon}`}></i> {t.label}
                        </button>
                    ))}
                </div>
                <div className="market-tabs-actions">
                    <FilterDropdown
                        options={ASSET_TABS.map(t => t.label)}
                        value={ASSET_TABS.find(t => t.key === assetType)?.label || ''}
                        onChange={label => setAssetType(ASSET_TABS.find(t => t.label === label)?.key)}
                    />
                    <button className="admin-add-btn" onClick={() => setShowCatMgr(true)}>
                        <i className="bi bi-grid"></i> Categories
                    </button>
                    <button className="admin-add-btn primary" onClick={() => setShowAdd(true)}>
                        <i className="bi bi-plus-lg"></i> Add Asset
                    </button>
                </div>
            </div>

            <div className="admin-toolbar" style={{ marginTop: 0 }}>
                <div className="admin-search-wrap">
                    <i className="bi bi-search"></i>
                    <input className="admin-search" placeholder="Search symbol or name…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <span className="admin-section-count">{filteredAssets.length} assets</span>
            </div>

            <div className="card-panel" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>{assetType === 'bonds' ? 'Issuer' : 'Name'}</th>
                            <th>{assetType === 'bonds' ? 'Type' : assetType === 'stocks' ? 'Sector' : 'Category'}</th>
                            <th>Price</th>
                            <th>{assetType === 'bonds' ? 'Yield' : 'Return'}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedAssets.map(a => (
                            <tr key={a.symbol}>
                                {renderRow(a)}
                                <td>
                                    <button className="admin-delete-btn" onClick={() => setDeleteTarget({ symbol: a.symbol, name: a.name || a.issuer })}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pagedAssets.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No assets found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filteredAssets.length} onChange={setPage} />
            </div>

            {deleteTarget && (
                <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
                    <div className="trade-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <span className="trade-symbol">Remove Asset</span>
                            <button className="modal-close-btn" onClick={() => setDeleteTarget(null)}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-confirm-body">
                            <div className="admin-danger-icon"><i className="bi bi-exclamation-triangle-fill"></i></div>
                            <p>Remove <strong>{deleteTarget.symbol}</strong> — {deleteTarget.name}?</p>
                        </div>
                        <div className="trade-modal-actions">
                            <button className="trade-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="trade-btn-confirm danger-btn" onClick={() => handleDelete(deleteTarget.symbol)}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {showAdd && (
                <AddAssetModal assetType={assetType} categories={categories[assetType] || []} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
            )}

            {showCatMgr && (
                <CategoryManagerModal assetType={assetType} categories={categories} setCategories={setCategories} catImgs={catImgs} setCatImgs={setCatImgs} onClose={() => setShowCatMgr(false)} />
            )}
        </div>
    );
}

function StatsSection({ onNavigate }) {
    const [period, setPeriod] = useState('1M');

    const allTx         = Object.values(USER_TRANSACTIONS).flat();
    const totalUsers    = MOCK_USERS.length;
    const activeUsers   = MOCK_USERS.filter(u => u.status === 'active').length;
    const totalBalance  = MOCK_USERS.reduce((s, u) => s + u.cash, 0);
    const avgBalance    = totalBalance / totalUsers;
    const verifiedUsers = MOCK_USERS.filter(u => u.verified === 'verified').length;
    const pendingVerify = MOCK_USERS.filter(u => u.verified === 'pending').length;
    const totalTx       = allTx.length;
    const buyTx         = allTx.filter(t => t.type === 'BUY');
    const sellTx        = allTx.filter(t => t.type === 'SELL');
    const depositTx     = allTx.filter(t => t.type === 'DEPOSIT');
    const withdrawTx    = allTx.filter(t => t.type === 'WITHDRAW');
    const totalDeposited  = depositTx.reduce((s, t) => s + t.total, 0);
    const totalWithdrawn  = withdrawTx.reduce((s, t) => s + t.total, 0);
    const totalBuyVolume  = buyTx.reduce((s, t) => s + t.total, 0);
    const totalSellVolume = sellTx.reduce((s, t) => s + t.total, 0);
    const netFlow         = totalDeposited - totalWithdrawn;

    const WEEK_AGO  = '2026-03-30';
    const MONTH_AGO = '2026-03-06';
    const weekTx  = allTx.filter(t => t.date >= WEEK_AGO);
    const monthTx = allTx.filter(t => t.date >= MONTH_AGO);

    const PERIOD_DATA = {
        '1W': {
            newUsers: MOCK_USERS.filter(u => u.joined >= WEEK_AGO).length,
            trades: weekTx.filter(t => t.type === 'BUY' || t.type === 'SELL').length,
            netFlow: weekTx.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.total, 0)
                   - weekTx.filter(t => t.type === 'WITHDRAW').reduce((s, t) => s + t.total, 0),
        },
        '1M': {
            newUsers: MOCK_USERS.filter(u => u.joined >= MONTH_AGO).length,
            trades: monthTx.filter(t => t.type === 'BUY' || t.type === 'SELL').length,
            netFlow: monthTx.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.total, 0)
                   - monthTx.filter(t => t.type === 'WITHDRAW').reduce((s, t) => s + t.total, 0),
        },
        'ALL': {
            newUsers: totalUsers,
            trades: buyTx.length + sellTx.length,
            netFlow: netFlow,
        },
    };
    const ps = PERIOD_DATA[period];

    const txByUser = MOCK_USERS
        .map(u => {
            const utx = (USER_TRANSACTIONS[u.id] || []).filter(t => t.type === 'BUY' || t.type === 'SELL');
            return { name: u.firstName + ' ' + u.lastName, vol: utx.reduce((s, t) => s + t.total, 0) };
        })
        .filter(x => x.vol > 0)
        .sort((a, b) => b.vol - a.vol)
        .slice(0, 5);

    const symbolBuyCounts = {};
    buyTx.forEach(t => { if (t.symbol) symbolBuyCounts[t.symbol] = (symbolBuyCounts[t.symbol] || 0) + 1; });
    const topBought = Object.entries(symbolBuyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const symbolSellCounts = {};
    sellTx.forEach(t => { if (t.symbol) symbolSellCounts[t.symbol] = (symbolSellCounts[t.symbol] || 0) + 1; });
    const topSold = Object.entries(symbolSellCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const txTypeRows = [
        { label: 'BUY',      count: buyTx.length,      vol: totalBuyVolume,  color: '#3b82f6' },
        { label: 'SELL',     count: sellTx.length,     vol: totalSellVolume, color: '#f0b429' },
        { label: 'DEPOSIT',  count: depositTx.length,  vol: totalDeposited,  color: '#00c896' },
        { label: 'WITHDRAW', count: withdrawTx.length, vol: totalWithdrawn,  color: '#e05252' },
    ];
    const maxTxCount = Math.max(...txTypeRows.map(r => r.count), 1);

    const txDonut = [
        { label: 'Buy',      val: buyTx.length,      color: '#3b82f6' },
        { label: 'Sell',     val: sellTx.length,     color: '#f0b429' },
        { label: 'Deposit',  val: depositTx.length,  color: '#00c896' },
        { label: 'Withdraw', val: withdrawTx.length, color: '#e05252' },
    ];
    const donutTotal = txDonut.reduce((s, d) => s + d.val, 0) || 1;
    const DONUT_R = 48, DONUT_CX = 60, DONUT_CY = 60, DONUT_SW = 11;
    const circumference = 2 * Math.PI * DONUT_R;
    let cumPct = 0;
    const donutSegments = txDonut.map(d => {
        const pct = d.val / donutTotal;
        const offset = cumPct;
        cumPct += pct;
        return { ...d, pct, offset };
    });

    const recentActivity = [
        { icon: 'bi-person-plus-fill',    text: 'New registration',      sub: 'camelia.tudor@ex.com',   time: '4 min ago',  color: '#00c896' },
        { icon: 'bi-arrow-up-circle-fill', text: 'BUY order · AAPL',      sub: '4 shares · $729.20',    time: '11 min ago', color: '#3b82f6' },
        { icon: 'bi-wallet-fill',          text: 'Deposit received',       sub: '+$5,000.00 · Visa',     time: '18 min ago', color: '#00c896' },
        { icon: 'bi-arrow-down-circle-fill', text: 'SELL order · NVDA',   sub: '2 shares · $1,900.80',  time: '26 min ago', color: '#f0b429' },
        { icon: 'bi-shield-fill-check',    text: 'ID approved',            sub: 'elena.dragomir@ex.com', time: '41 min ago', color: '#3b82f6' },
        { icon: 'bi-cash-stack',           text: 'Withdrawal processed',   sub: '-$2,000.00 · Mastercard', time: '55 min ago', color: '#e05252' },
        { icon: 'bi-person-plus-fill',     text: 'New registration',       sub: 'bogdan.gh@ex.com',      time: '1 hr ago',   color: '#00c896' },
        { icon: 'bi-arrow-up-circle-fill', text: 'BUY order · TSLA',       sub: '3 shares · $741.00',    time: '1 hr ago',   color: '#3b82f6' },
    ];

    const quickLinks = [
        { key: 'users',    icon: 'bi-people-fill',       label: 'Users',       sub: `${totalUsers} registered`,                                  color: '#00c896' },
        { key: 'market',   icon: 'bi-graph-up-arrow',    label: 'Market Data', sub: `${MOCK_STOCKS.length + MOCK_CRYPTO.length + MOCK_ETFS.length} assets`, color: '#3b82f6' },
        { key: 'news',     icon: 'bi-newspaper',         label: 'News Feed',   sub: `${MOCK_NEWS.length} articles`,                              color: '#f0b429' },
        { key: 'exchange', icon: 'bi-currency-exchange', label: 'Exchange',    sub: `${ALL_CURRENCIES.length} currencies`,                       color: '#8b5cf6' },
    ];

    return (
        <div className="section-content stats-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-bar-chart-line"></i> Platform Stats</h2>
            </div>

            <div className="stats-grid stats-kpi-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-sub positive">{activeUsers} active · {totalUsers - activeUsers} inactive</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Platform Balance</div>
                    <div className="stat-value">${fmt(totalBalance)}</div>
                    <div className="stat-sub neutral">avg ${fmt(avgBalance)} / user</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Verified Accounts</div>
                    <div className="stat-value">{verifiedUsers}</div>
                    <div className="stat-sub neutral">{pendingVerify} pending · {MOCK_USERS.filter(u => u.verified === 'failed').length} failed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Transactions</div>
                    <div className="stat-value">{totalTx}</div>
                    <div className="stat-sub neutral">{buyTx.length} buys · {sellTx.length} sells · {depositTx.length} deposits</div>
                </div>
            </div>

            <div className="stats-dashboard-layout">
                <div className="card-panel stats-main-card">
                    <div className="stats-card-header">
                        <h3 className="section-title panel-title" style={{ marginBottom: 0 }}>Platform Statistics</h3>
                        <div className="stats-period-tabs">
                            {['1W', '1M', 'ALL'].map(p => (
                                <button key={p} className={`stats-period-tab${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
                            ))}
                        </div>
                    </div>

                    <div className="stats-metric-row">
                        <div className="stats-metric-bubble">
                            <div className="stats-metric-num">{ps.newUsers}</div>
                            <div className="stats-metric-label">New Users</div>
                            <div className="stats-metric-dot" style={{ background: '#00c896' }}></div>
                        </div>
                        <div className="stats-metric-bubble">
                            <div className="stats-metric-num">{ps.trades}</div>
                            <div className="stats-metric-label">Trades</div>
                            <div className="stats-metric-dot" style={{ background: '#3b82f6' }}></div>
                        </div>
                        <div className="stats-metric-bubble">
                            <div className="stats-metric-num">{ps.netFlow >= 0 ? '+' : ''}${fmtCompact(ps.netFlow)}</div>
                            <div className="stats-metric-label">Net Flow</div>
                            <div className="stats-metric-dot" style={{ background: ps.netFlow >= 0 ? '#00c896' : '#e05252' }}></div>
                        </div>
                    </div>

                    <div className="stats-inner-sep"></div>

                    <div className="stats-donut-row">
                        <div className="stats-donut-wrap">
                            <div className="stats-donut-title">Transaction Mix</div>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                {donutSegments.map((seg, i) => (
                                    <circle key={i}
                                        cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth={DONUT_SW}
                                        strokeDasharray={`${seg.pct * circumference} ${circumference}`}
                                        transform={`rotate(${seg.offset * 360 - 90} ${DONUT_CX} ${DONUT_CY})`}
                                    />
                                ))}
                                <text x={DONUT_CX} y={DONUT_CY - 5} textAnchor="middle" className="donut-center-num">{totalTx}</text>
                                <text x={DONUT_CX} y={DONUT_CY + 12} textAnchor="middle" className="donut-center-sub">total tx</text>
                            </svg>
                            <div className="stats-donut-legend">
                                {txDonut.map(d => (
                                    <div key={d.label} className="stats-donut-leg-item">
                                        <span className="stats-donut-dot" style={{ background: d.color }}></span>
                                        <span className="stats-donut-leg-label">{d.label}</span>
                                        <span className="stats-donut-leg-val">{d.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="stats-donut-right">
                            <div className="stats-donut-right-title">Top Users by Trade Volume</div>
                            <div className="stats-rank-list">
                                {txByUser.map((u, i) => {
                                    const maxVol = txByUser[0]?.vol || 1;
                                    return (
                                        <div key={u.name} className="stats-rank-row">
                                            <span className={`stats-rank-num rank-${i + 1}`}>#{i + 1}</span>
                                            <span className="stats-rank-name">{u.name}</span>
                                            <div className="stats-rank-bar-wrap">
                                                <div className="stats-rank-bar stats-rank-bar-neutral" style={{ width: `${(u.vol / maxVol) * 100}%` }}></div>
                                            </div>
                                            <span className="stats-rank-count">${fmtCompact(u.vol)}</span>
                                        </div>
                                    );
                                })}
                                {txByUser.length === 0 && <div className="admin-empty-state" style={{ padding: '1rem 0' }}><i className="bi bi-inbox"></i><p>No data</p></div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-panel stats-activity-card">
                    <h3 className="section-title panel-title">Recent Activity</h3>
                    <div className="stats-activity-list">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="stats-activity-item">
                                <div className="stats-activity-icon" style={{ background: item.color + '22', color: item.color }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <div className="stats-activity-info">
                                    <div className="stats-activity-text">{item.text}</div>
                                    <div className="stats-activity-sub">{item.sub}</div>
                                </div>
                                <div className="stats-activity-time">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="stats-quicklinks-grid">
                {quickLinks.map(q => (
                    <button key={q.key} className="stats-quicklink-card" onClick={() => onNavigate && onNavigate(q.key)}>
                        <div className="stats-quicklink-icon" style={{ background: q.color + '22', color: q.color }}>
                            <i className={`bi ${q.icon}`}></i>
                        </div>
                        <div className="stats-quicklink-info">
                            <div className="stats-quicklink-label">{q.label}</div>
                            <div className="stats-quicklink-sub">{q.sub}</div>
                        </div>
                        <i className="bi bi-chevron-right stats-quicklink-chevron"></i>
                    </button>
                ))}
            </div>

            {(() => {
                const ASSET_CLASSES = [
                    { key: 'stocks',      label: 'Stocks',      icon: 'bi-graph-up-arrow',    color: '#00c896', items: MOCK_STOCKS,      getVal: x => x.changePct, metricLabel: 'Avg Return',  isBond: false },
                    { key: 'crypto',      label: 'Crypto',      icon: 'bi-currency-bitcoin',  color: '#f59e0b', items: MOCK_CRYPTO,      getVal: x => x.changePct, metricLabel: 'Avg Return',  isBond: false },
                    { key: 'bonds',       label: 'Bonds',       icon: 'bi-bank',              color: '#3b82f6', items: MOCK_BONDS,       getVal: x => x.yield,     metricLabel: 'Avg Yield',   isBond: true  },
                    { key: 'etfs',        label: 'ETFs',        icon: 'bi-layers',            color: '#a78bfa', items: MOCK_ETFS,        getVal: x => x.changePct, metricLabel: 'Avg Return',  isBond: false },
                    { key: 'commodities', label: 'Commodities', icon: 'bi-box-seam',          color: '#f472b6', items: MOCK_COMMODITIES, getVal: x => x.changePct, metricLabel: 'Avg Return',  isBond: false },
                ];
                return (
                    <div className="stats-asset-perf-grid">
                        {ASSET_CLASSES.map(cls => {
                            const vals   = cls.items.map(cls.getVal);
                            const avg    = vals.reduce((s, v) => s + v, 0) / vals.length;
                            const best   = cls.items.reduce((a, b) => cls.getVal(a) > cls.getVal(b) ? a : b);
                            const worst  = cls.items.reduce((a, b) => cls.getVal(a) < cls.getVal(b) ? a : b);
                            const posCount = vals.filter(v => v >= 0).length;
                            const negCount = vals.length - posCount;
                            const posPct   = (posCount / vals.length) * 100;
                            const avgColor = cls.isBond ? '#3b82f6' : avg >= 0 ? '#00c896' : '#e05252';
                            const bestSym  = best.symbol;
                            const worstSym = worst.symbol;
                            const bestVal  = cls.getVal(best);
                            const worstVal = cls.getVal(worst);
                            return (
                                <div key={cls.key} className="stats-ap-card">
                                    <div className="stats-ap-top-bar" style={{ background: cls.color }}></div>
                                    <div className="stats-ap-header">
                                        <div className="stats-ap-icon" style={{ background: cls.color + '22', color: cls.color }}>
                                            <i className={`bi ${cls.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className="stats-ap-label">{cls.label}</div>
                                            <div className="stats-ap-count">{cls.items.length} assets</div>
                                        </div>
                                    </div>
                                    <div className="stats-ap-metric" style={{ color: avgColor }}>
                                        {cls.isBond ? '' : avg >= 0 ? '+' : ''}{avg.toFixed(2)}{cls.isBond ? '%' : '%'}
                                    </div>
                                    <div className="stats-ap-metric-label">{cls.metricLabel}</div>
                                    <div className="stats-ap-pos-bar-wrap">
                                        <div className="stats-ap-pos-bar" style={{ width: `${posPct}%`, background: cls.isBond ? '#3b82f6' : '#00c896' }}></div>
                                    </div>
                                    <div className="stats-ap-pos-counts">
                                        <span style={{ color: cls.isBond ? '#3b82f6' : '#00c896' }}>{posCount} ▲</span>
                                        {!cls.isBond && <span style={{ color: '#e05252' }}>{negCount} ▼</span>}
                                    </div>
                                    <div className="stats-ap-sep"></div>
                                    <div className="stats-ap-extremes">
                                        <div className="stats-ap-extreme-row">
                                            <span className="stats-ap-ext-label">Best</span>
                                            <span className="symbol-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{bestSym}</span>
                                            <span className="positive" style={{ fontSize: '0.78rem', fontWeight: 700, marginLeft: 'auto' }}>+{bestVal.toFixed(2)}%</span>
                                        </div>
                                        <div className="stats-ap-extreme-row">
                                            <span className="stats-ap-ext-label">Worst</span>
                                            <span className="symbol-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{worstSym}</span>
                                            <span className={worstVal >= 0 ? 'positive' : 'negative'} style={{ fontSize: '0.78rem', fontWeight: 700, marginLeft: 'auto' }}>{worstVal >= 0 ? '+' : ''}{worstVal.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })()}

            <div className="stats-assets-grid">
                <div className="card-panel">
                    <div className="stats-assets-header">
                        <h3 className="section-title panel-title" style={{ marginBottom: 0 }}>Asset Trading</h3>
                        <span className="stats-assets-sub">top 5 per direction</span>
                    </div>
                    <div className="stats-assets-inner">
                        <div className="stats-assets-half">
                            <div className="stats-assets-col-header">
                                <i className="bi bi-arrow-up-circle-fill" style={{ color: '#3b82f6' }}></i> Most Bought
                            </div>
                            {topBought.length === 0
                                ? <div className="admin-empty-state" style={{ padding: '1rem 0' }}><i className="bi bi-inbox"></i><p>No data</p></div>
                                : topBought.map(([sym, cnt], i) => {
                                    const maxB = topBought[0]?.[1] || 1;
                                    return (
                                        <div key={sym} className="stats-rank-row">
                                            <span className={`stats-rank-num rank-${i + 1}`}>#{i + 1}</span>
                                            <span className="symbol-badge">{sym}</span>
                                            <div className="stats-rank-bar-wrap">
                                                <div className="stats-rank-bar stats-rank-bar-buy" style={{ width: `${(cnt / maxB) * 100}%` }}></div>
                                            </div>
                                            <span className="stats-rank-count positive">{cnt}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="stats-assets-sep"></div>
                        <div className="stats-assets-half">
                            <div className="stats-assets-col-header">
                                <i className="bi bi-arrow-down-circle-fill" style={{ color: '#f0b429' }}></i> Most Sold
                            </div>
                            {topSold.length === 0
                                ? <div className="admin-empty-state" style={{ padding: '1rem 0' }}><i className="bi bi-inbox"></i><p>No data</p></div>
                                : topSold.map(([sym, cnt], i) => {
                                    const maxS = topSold[0]?.[1] || 1;
                                    return (
                                        <div key={sym} className="stats-rank-row">
                                            <span className={`stats-rank-num rank-${i + 1}`}>#{i + 1}</span>
                                            <span className="symbol-badge">{sym}</span>
                                            <div className="stats-rank-bar-wrap">
                                                <div className="stats-rank-bar stats-rank-bar-sell" style={{ width: `${(cnt / maxS) * 100}%` }}></div>
                                            </div>
                                            <span className="stats-rank-count negative">{cnt}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="card-panel">
                    <h3 className="section-title panel-title">Transaction Breakdown</h3>
                    <div className="stats-bar-chart" style={{ height: '120px', marginBottom: '1rem' }}>
                        {txTypeRows.map(r => (
                            <div key={r.label} className="stats-bar-col">
                                <div className="stats-bar-value" style={{ color: r.color }}>{r.count}</div>
                                <div className="stats-bar" style={{ height: `${(r.count / maxTxCount) * 100}%`, background: r.color }}></div>
                                <div className="stats-bar-label">{r.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="stats-dist-list">
                        {txTypeRows.map(r => (
                            <div key={r.label} className="stats-dist-row">
                                <div className="stats-dist-label">
                                    <span className="stats-dist-dot" style={{ background: r.color }}></span>
                                    {r.label}
                                </div>
                                <div className="stats-dist-bar-wrap">
                                    <div className="stats-dist-bar" style={{ width: `${(r.count / (totalTx || 1)) * 100}%`, background: r.color }}></div>
                                </div>
                                <span className="stats-dist-val">${fmt(r.vol)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddNewsModal({ onClose, onAdd }) {
    const [symbol,    setSymbol]    = useState('');
    const [impact,    setImpact]    = useState('positive');
    const [impactPct, setImpactPct] = useState('');
    const [headline,  setHeadline]  = useState('');
    const [body,      setBody]      = useState('');
    const [error,     setError]     = useState('');

    const canSubmit = symbol.trim() && headline.trim() && impactPct !== '';

    function handleImpactPct(e) {
        let raw = e.target.value;
        const negative = raw.startsWith('-');
        let digits = raw.replace(/[^0-9.]/g, '');
        const parts = digits.split('.');
        if (parts.length > 2) digits = parts[0] + '.' + parts.slice(1).join('');
        if (/^0[0-9]/.test(digits)) digits = digits.replace(/^0+/, '') || '0';
        const [intPart, decPart] = digits.split('.');
        if (intPart.length > 6) return;
        if (decPart !== undefined) digits = intPart + '.' + decPart.slice(0, 2);
        setImpactPct((negative ? '-' : '') + digits);
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) { setError('Symbol, headline and impact % are required.'); return; }
        const parsed = parseFloat(impactPct);
        if (isNaN(parsed)) { setError('Impact % must be a valid number.'); return; }
        const paragraphs = body.trim().split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
        onAdd({ symbol: symbol.toUpperCase(), impact, impactPct: parsed, headline: headline.trim(), body: paragraphs.length > 0 ? paragraphs : [headline.trim()] });
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal admin-news-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <span className="trade-symbol">Add News Article</span>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {error && <div className="admin-form-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label className="admin-field-label">Symbol *</label>
                            <input className="admin-input" placeholder="Ticker symbol" value={symbol} onChange={e => { setSymbol(e.target.value); setError(''); }} required />
                        </div>
                        <div className="admin-form-field">
                            <label className="admin-field-label">Impact</label>
                            <AdminSelect value={impact} onChange={setImpact} options={[
                                { value: 'positive', label: 'Positive' },
                                { value: 'neutral',  label: 'Neutral'  },
                                { value: 'negative', label: 'Negative' },
                            ]} />
                        </div>
                        <div className="admin-form-field">
                            <label className="admin-field-label">Impact %</label>
                            <input className="admin-input" placeholder="e.g. 0.00" value={impactPct} onChange={handleImpactPct} required />
                        </div>
                        <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-field-label">Headline *</label>
                            <input className="admin-input" placeholder="News headline…" value={headline} onChange={e => { setHeadline(e.target.value); setError(''); }} required />
                        </div>
                        <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-field-label">Article body <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text-muted)' }}></span></label>
                            <textarea className="admin-input admin-textarea" rows={6} placeholder="Write the full article content here…&#10;&#10;Start a new paragraph by leaving a blank line between them." value={body} onChange={e => setBody(e.target.value)} />
                        </div>
                    </div>
                    <div className="trade-modal-actions" style={{ marginTop: '1.25rem' }}>
                        <button type="button" className="trade-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="trade-btn-confirm" disabled={!canSubmit}>Add article</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NewsSection() {
    const [news,     setNews]     = useState(() => lsGet('admin_news', MOCK_NEWS));
    useEffect(() => { sessionStorage.setItem('admin_news', JSON.stringify(news)); }, [news]);
    const [showAdd,  setShowAdd]  = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search,   setSearch]   = useState('');
    const [filter,   setFilter]   = useState('All');
    const [page,     setPage]     = useState(1);
    const NEWS_PS = 10;
    const [sortDir, setSortDir] = useState('desc');

    useEffect(() => setPage(1), [search, filter, sortDir]);

    const filtered = news.filter(n => {
        const q = search.toLowerCase();
        const matchQ = !q || n.symbol.toLowerCase().includes(q) || n.headline.toLowerCase().includes(q);
        const matchF = filter === 'All' || n.impact === filter.toLowerCase();
        return matchQ && matchF;
    }).sort((a, b) => sortDir === 'desc' ? b.ts - a.ts : a.ts - b.ts);
    const paged = filtered.slice((page - 1) * NEWS_PS, page * NEWS_PS);

    function addNews(item) {
        setNews(prev => [{ ...item, id: Date.now(), ts: Date.now(), time: 'just now' }, ...prev]);
        setShowAdd(false);
    }

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-newspaper"></i> News</h2>
            </div>

            <div className="admin-toolbar news-toolbar">
                <div className="admin-search-wrap">
                    <i className="bi bi-search"></i>
                    <input className="admin-search" placeholder="Search symbol or headline…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="admin-filter-group">
                    {['All', 'Positive', 'Neutral', 'Negative'].map(f => (
                        <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                </div>
                <div className="news-toolbar-right">
                    <FilterDropdown
                        options={['All', 'Positive', 'Neutral', 'Negative']}
                        value={filter}
                        onChange={setFilter}
                        colors={{ All: 'var(--brand-primary)', Positive: '#00c896', Neutral: '#8b949e', Negative: '#e05252' }}
                    />
                </div>
                <button className="admin-add-btn primary" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(true)}>
                    <i className="bi bi-plus-lg"></i> Add News
                </button>
            </div>

            <div className="card-panel" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="data-table admin-news-table">
                    <thead>
                        <tr>
                            <th style={{ width: '240px' }}>Effect</th>
                            <th style={{ paddingLeft: '2rem' }}>Headline</th>
                            <th className="sortable-col" style={{ width: '90px' }} onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                                Time <i className={`bi ${sortDir === 'desc' ? 'bi-sort-down' : 'bi-sort-up'}`}></i>
                            </th>
                            <th style={{ width: '60px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(n => {
                            const IMPACT_CFG = {
                                positive: { color: '#00c896', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
                                negative: { color: '#e05252', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
                                neutral:  { color: '#8b949e', icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
                            };
                            const cfg = IMPACT_CFG[n.impact];
                            return (
                            <tr key={n.id}>
                                <td>
                                    <div className="admin-news-symbol-cell">
                                        <span className="symbol-badge">{n.symbol}</span>
                                        <i className={`bi ${cfg.icon}`} style={{ color: cfg.color, fontSize: '0.85rem' }}></i>
                                        <span className="admin-news-impact-label" style={{ color: cfg.color }}>{cfg.label}</span>
                                        <span className="admin-news-impact-pct" style={{ color: cfg.color }}>{n.impactPct >= 0 ? '+' : ''}{fmt(Math.abs(n.impactPct))}%</span>
                                    </div>
                                </td>
                                <td className="news-headline-cell" style={{ paddingLeft: '2rem' }}>{n.headline}</td>
                                <td className="text-muted-cell">{n.time}</td>
                                <td>
                                    <button className="admin-delete-btn" onClick={() => setDeleteId(n.id)}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} pageSize={NEWS_PS} />
            </div>

            {showAdd && <AddNewsModal onClose={() => setShowAdd(false)} onAdd={addNews} />}

            {deleteId !== null && (
                <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
                    <div className="trade-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <span className="trade-symbol">Remove News</span>
                            <button className="modal-close-btn" onClick={() => setDeleteId(null)}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-confirm-body">
                            <div className="admin-danger-icon"><i className="bi bi-exclamation-triangle-fill"></i></div>
                            <p>Are you sure you want to remove this news article?</p>
                        </div>
                        <div className="trade-modal-actions">
                            <button className="trade-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="trade-btn-confirm danger-btn" onClick={() => { setNews(prev => prev.filter(n => n.id !== deleteId)); setDeleteId(null); }}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const EVENT_PLACEHOLDERS = {
    earnings: { symbol: 'Ticker symbol', title: 'Company Name – Earnings Call',     detail: 'EPS estimate · Revenue forecast · BMO / AMC' },
    dividend: { symbol: 'Ticker symbol', title: 'Company Name – Quarterly Dividend',        detail: 'Amount per share · Ex-dividend date'          },
    split:    { symbol: 'Ticker symbol', title: 'Company Name – Stock Split',               detail: 'Split ratio (e.g. 4:1) · Effective date'      },
    meeting:  { symbol: 'Ticker symbol', title: 'Company Name – Shareholder Meeting',  detail: 'Format (virtual / in-person) · Time & venue'  },
};

function AddEventModal({ onClose, onAdd }) {
    const todayStr = (() => { const d = new Date(); const pad = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; })();
    const [type,   setType]   = useState('earnings');
    const [symbol, setSymbol] = useState('');
    const [title,  setTitle]  = useState('');
    const [date,   setDate]   = useState('');
    const [detail, setDetail] = useState('');
    const [error,  setError]  = useState('');

    const ph = EVENT_PLACEHOLDERS[type];

    const canSubmit = symbol.trim() && title.trim() && date && detail.trim();

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) { setError('All fields are required.'); return; }
        if (date < todayStr) { setError('Only future dates are allowed.'); return; }
        onAdd({ type, symbol: symbol.toUpperCase(), title: title.trim(), date, detail: detail.trim() });
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal admin-wide-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <span className="trade-symbol">Add Event</span>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {error && <div className="admin-form-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label className="admin-field-label">Type</label>
                            <AdminSelect value={type} onChange={v => { setType(v); setError(''); }} options={[
                                { value: 'earnings', label: 'Earnings' },
                                { value: 'dividend', label: 'Dividend' },
                                { value: 'split',    label: 'Split'    },
                                { value: 'meeting',  label: 'Meeting'  },
                            ]} />
                        </div>
                        <div className="admin-form-field">
                            <label className="admin-field-label">Symbol *</label>
                            <input className="admin-input" placeholder={ph.symbol} value={symbol} onChange={e => { setSymbol(e.target.value); setError(''); }} required />
                        </div>
                        <div className="admin-form-field">
                            <label className="admin-field-label">Date *</label>
                            <input className="admin-input" type="date" min={todayStr} value={date} onChange={e => { setDate(e.target.value); setError(''); }} required />
                        </div>
                        <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-field-label">Title *</label>
                            <input className="admin-input" placeholder={ph.title} value={title} onChange={e => { setTitle(e.target.value); setError(''); }} required />
                        </div>
                        <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-field-label">Detail *</label>
                            <input className="admin-input" placeholder={ph.detail} value={detail} onChange={e => { setDetail(e.target.value); setError(''); }} required />
                        </div>
                    </div>
                    <div className="trade-modal-actions" style={{ marginTop: '1.25rem' }}>
                        <button type="button" className="trade-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="trade-btn-confirm" disabled={!canSubmit}>Add event</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EventsSection() {
    const [events,   setEvents]   = useState(() => lsGet('admin_events', MOCK_EVENTS));
    useEffect(() => { sessionStorage.setItem('admin_events', JSON.stringify(events)); }, [events]);
    const [showAdd,  setShowAdd]  = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [filter,   setFilter]   = useState('All');
    const [search,   setSearch]   = useState('');
    const [sortDir,  setSortDir]  = useState('asc');
    const [page,     setPage]     = useState(1);

    useEffect(() => setPage(1), [filter, search, sortDir]);

    let filtered = events.filter(e => {
        const q = search.toLowerCase();
        const matchQ = !q || e.symbol.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
        const matchF = filter === 'All' || e.type === filter.toLowerCase();
        return matchQ && matchF;
    });
    filtered = [...filtered].sort((a, b) => sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function addEvent(ev) {
        setEvents(prev => [...prev, { ...ev, id: Date.now() }].sort((a, b) => a.date.localeCompare(b.date)));
        setShowAdd(false);
    }

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-calendar-event"></i> Events</h2>
            </div>

            <div className="admin-toolbar events-toolbar">
                <div className="admin-search-wrap">
                    <i className="bi bi-search"></i>
                    <input className="admin-search" placeholder="Search symbol or title…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="admin-filter-group">
                    {['All', 'Earnings', 'Dividend', 'Split', 'Meeting'].map(f => (
                        <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                </div>
                <div className="events-toolbar-right">
                    <FilterDropdown
                        options={['All', 'Earnings', 'Dividend', 'Split', 'Meeting']}
                        value={filter}
                        onChange={setFilter}
                        colors={{ All: 'var(--brand-primary)', Earnings: '#00c896', Dividend: '#f0b429', Split: '#f472b6', Meeting: '#3b82f6' }}
                    />
                </div>
                <button className="admin-add-btn primary" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(true)}>
                    <i className="bi bi-plus-lg"></i> Add Event
                </button>
            </div>

            <div className="card-panel" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="data-table admin-events-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Symbol</th>
                            <th style={{ paddingLeft: '2.5rem' }}>Title</th>
                            <th className="sortable-col" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
                                Date <i className={`bi ${sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'}`}></i>
                            </th>
                            <th style={{ paddingLeft: '3rem' }}>Detail</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(e => {
                            const cfg = EVENT_TYPE_CONFIG[e.type];
                            return (
                                <tr key={e.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <i className={`bi ${cfg.icon}`} style={{ color: cfg.color, fontSize: '1rem' }}></i>
                                            <span className="event-type-badge" style={{ color: cfg.color, borderColor: cfg.color }}>{cfg.label}</span>
                                        </div>
                                    </td>
                                    <td><span className="symbol-badge">{e.symbol}</span></td>
                                    <td style={{ paddingLeft: '2.5rem' }}>{e.title}</td>
                                    <td className="text-muted-cell">{e.date}</td>
                                    <td className="text-muted-cell" style={{ paddingLeft: '3rem' }}>{e.detail}</td>
                                    <td style={{ paddingLeft: '1.5rem' }}>
                                        <button className="admin-delete-btn" onClick={() => setDeleteId(e.id)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>

            {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onAdd={addEvent} />}

            {deleteId !== null && (
                <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
                    <div className="trade-modal" onClick={e => e.stopPropagation()}>
                        <div className="trade-modal-header">
                            <span className="trade-symbol">Remove Event</span>
                            <button className="modal-close-btn" onClick={() => setDeleteId(null)}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="admin-confirm-body">
                            <div className="admin-danger-icon"><i className="bi bi-exclamation-triangle-fill"></i></div>
                            <p>Are you sure you want to remove this event?</p>
                        </div>
                        <div className="trade-modal-actions">
                            <button className="trade-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="trade-btn-confirm danger-btn" onClick={() => { setEvents(prev => prev.filter(e => e.id !== deleteId)); setDeleteId(null); }}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AddCurrencyModal({ onClose, onAdd, existing }) {
    const [code, setCode]         = useState('');
    const [name, setName]         = useState('');
    const [flagCode, setFlagCode] = useState('');
    const [error, setError]       = useState('');

    function handleAdd() {
        const uc = code.trim().toUpperCase();
        if (!uc || !name.trim() || !flagCode.trim()) { setError('All fields are required.'); return; }
        if (uc.length < 2 || uc.length > 4)          { setError('Currency code must be 2–4 characters.'); return; }
        if (existing.includes(uc))                    { setError(`${uc} is already in the list.`); return; }
        if (flagCode.trim().length !== 2)             { setError('Flag code must be exactly 2 letters (ISO country code).'); return; }
        onAdd(uc, name.trim(), flagCode.trim().toLowerCase());
    }

    return (
        <div className="modal-backdrop">
            <div className="trade-modal" style={{maxWidth: 420}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem'}}>
                    <div style={{fontWeight:700, fontSize:'1.05rem'}}>Add Currency</div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="admin-form-grid" style={{gridTemplateColumns:'1fr'}}>
                    <div className="admin-form-field">
                        <label className="admin-field-label">Currency code *</label>
                        <input className="admin-input" placeholder="e.g. USD" maxLength={4} value={code} onChange={e => setCode(e.target.value.toUpperCase())} />
                    </div>
                    <div className="admin-form-field">
                        <label className="admin-field-label">Full name *</label>
                        <input className="admin-input" placeholder="e.g. United States Dollar" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="admin-form-field">
                        <label className="admin-field-label">Flag country code *</label>
                        <input className="admin-input" placeholder="e.g. ch" maxLength={2} value={flagCode} onChange={e => setFlagCode(e.target.value)} />
                        <div className="admin-field-hint">2-letter ISO country code for the flag (e.g. <strong>us</strong>, <strong>gb</strong>, <strong>de</strong>)</div>
                    </div>
                    {error && <div className="admin-form-error">{error}</div>}
                </div>
                <div className="trade-modal-actions" style={{marginTop:'1.25rem'}}>
                    <button className="trade-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="trade-btn-confirm" onClick={handleAdd}>Add Currency</button>
                </div>
            </div>
        </div>
    );
}

function ExchangeSection() {
    const [currencies, setCurrencies] = useState(() => lsGet('admin_ex_currencies', [...ALL_CURRENCIES]));
    const [names, setNames]           = useState(() => lsGet('admin_ex_names',      { ...CCY_NAMES }));
    const [flags, setFlags]           = useState(() => lsGet('admin_ex_flags',      { ...CCY_FLAG }));
    const [enabled, setEnabled]       = useState(() => {
        const saved = lsGet('admin_ex_enabled', null);
        if (saved) return saved;
        const map = {};
        ALL_CURRENCIES.forEach(c => { map[c] = true; });
        return map;
    });
    useEffect(() => { sessionStorage.setItem('admin_ex_currencies', JSON.stringify(currencies)); }, [currencies]);
    useEffect(() => { sessionStorage.setItem('admin_ex_names',      JSON.stringify(names));      }, [names]);
    useEffect(() => { sessionStorage.setItem('admin_ex_flags',      JSON.stringify(flags));      }, [flags]);
    useEffect(() => { sessionStorage.setItem('admin_ex_enabled',    JSON.stringify(enabled));    }, [enabled]);
    const [search, setSearch]         = useState('');
    const [addOpen, setAddOpen]       = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    function toggle(code) {
        if (code === 'USD') return;
        setEnabled(prev => ({ ...prev, [code]: !prev[code] }));
    }

    function addCurrency(code, name, flagCode) {
        setCurrencies(prev => [...prev, code]);
        setNames(prev => ({ ...prev, [code]: name }));
        setFlags(prev => ({ ...prev, [code]: flagCode }));
        setEnabled(prev => ({ ...prev, [code]: true }));
        setAddOpen(false);
    }

    function deleteCurrency(code) {
        setCurrencies(prev => prev.filter(c => c !== code));
        setEnabled(prev => { const m = { ...prev }; delete m[code]; return m; });
        setDeleteTarget(null);
    }

    const enableAll  = () => { const m = {}; currencies.forEach(c => { m[c] = true; }); setEnabled(m); };
    const disableAll = () => { const m = {}; currencies.forEach(c => { m[c] = c === 'USD'; }); setEnabled(m); };

    const filtered = currencies.filter(c =>
        !search || c.toLowerCase().includes(search.toLowerCase()) || (names[c] || '').toLowerCase().includes(search.toLowerCase())
    );

    const enabledCount = currencies.filter(c => enabled[c]).length;

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-currency-exchange"></i> Exchange Currencies</h2>
                <span className="admin-section-count">{enabledCount} / {currencies.length} enabled</span>
            </div>

            <div className="admin-toolbar exchange-toolbar">
                <div className="admin-search-wrap">
                    <i className="bi bi-search"></i>
                    <input className="admin-search" placeholder="Search currency…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className="admin-filter-btn" onClick={enableAll}>Enable all</button>
                <button className="admin-filter-btn" onClick={disableAll}>Disable all</button>
                <button className="admin-add-btn primary" onClick={() => setAddOpen(true)}>
                    <i className="bi bi-plus-lg"></i> Add Currency
                </button>
            </div>

            <div className="exchange-toggle-grid">
                {filtered.map(code => (
                    <div key={code} className={`exchange-toggle-card ${!enabled[code] ? 'disabled' : ''}`}>
                        {code !== 'USD' && (
                            <button className="exch-delete-btn" onClick={e => { e.stopPropagation(); setDeleteTarget(code); }}>
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                        <div className="exchange-card-left">
                            <img src={`https://flagcdn.com/${flags[code]}.svg`} alt={code} className="exchange-flag" />
                            <div>
                                <div className="exchange-code">{code}</div>
                                <div className="exchange-name">{names[code] || ''}</div>
                            </div>
                        </div>
                        <div className={`toggle-switch ${enabled[code] ? 'on' : ''} ${code === 'USD' ? 'locked' : ''}`} onClick={() => toggle(code)}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                ))}
            </div>

            {addOpen && (
                <AddCurrencyModal
                    onClose={() => setAddOpen(false)}
                    onAdd={addCurrency}
                    existing={currencies}
                />
            )}

            {deleteTarget && (
                <div className="modal-backdrop">
                    <div className="trade-modal" style={{maxWidth: 380}}>
                        <div className="admin-confirm-body">
                            <div className="admin-danger-icon"><i className="bi bi-trash3"></i></div>
                            <div style={{fontWeight:700, fontSize:'1rem', marginBottom:'0.4rem'}}>Remove {deleteTarget}?</div>
                            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'1.25rem'}}>
                                {names[deleteTarget] || deleteTarget} will be removed from the platform.
                            </div>
                            <div className="trade-modal-actions">
                                <button className="trade-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                <button className="trade-btn-confirm danger-btn" onClick={() => deleteCurrency(deleteTarget)}>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const SCHEDULE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SCHEDULE_DEFAULT = [
    { enabled: true,  open: '09:00', close: '17:30' },
    { enabled: true,  open: '09:00', close: '17:30' },
    { enabled: true,  open: '09:00', close: '17:30' },
    { enabled: true,  open: '09:00', close: '17:30' },
    { enabled: true,  open: '09:00', close: '17:30' },
    { enabled: false, open: '09:00', close: '17:30' },
    { enabled: false, open: '09:00', close: '17:30' },
];

function formatTime12(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const isPM = h >= 12;
    const h12  = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
}

function TimeBox({ label, value, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef         = useRef(null);

    useEffect(() => {
        function onOut(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onOut);
        return () => document.removeEventListener('mousedown', onOut);
    }, []);

    return (
        <div className="timebox-wrap" ref={wrapRef}>
            <button type="button" className={`timebox-btn ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
                <span className="timebox-label">{label}</span>
                <span className="timebox-time">{formatTime12(value)}</span>
            </button>
            {open && (
                <div className="timebox-popover">
                    <TimeDrumPicker value={value} onChange={v => { onChange(v); }} />
                </div>
            )}
        </div>
    );
}

function AboutSection() {
    const [contact,     setContact]     = useState({ email: 'support@tradepro.com', address: 'Piața Charles de Gaulle 15, București, Romania' });
    const [emailError,  setEmailError]  = useState('');
    const [dialCountry, setDialCountry] = useState('RO');
    const [localNumber, setLocalNumber] = useState('21 000 0000');
    const [phoneError,  setPhoneError]  = useState('');
    const [schedule, setSchedule] = useState(SCHEDULE_DEFAULT);
    const [saved,       setSaved]       = useState(false);
    const [platform, setPlatform] = useState({ maintenance: false, registration: true, trading: true, withdrawals: true, demoMode: false });
    const [notifs,   setNotifs]   = useState({ regAlerts: true, securityAlerts: true, weeklyDigest: true, lowBalanceAlert: true });
    const [resetDone, setResetDone] = useState(null);
    const [channels, setChannels] = useState({ liveChat: true, email: true, tickets: true, phone: false });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function handleLocalNumber(v) {
        const clean = v.replace(/[^\d\s]/g, '');
        setLocalNumber(clean);
        if (clean.replace(/\s/g, '').length > 0 && (clean.replace(/\s/g, '').length < 4 || clean.replace(/\s/g, '').length > 15)) {
            setPhoneError('Phone number must be between 4 and 15 digits.');
        } else {
            setPhoneError('');
        }
    }

    function saveContact(e) {
        e.preventDefault();
        if (!emailRegex.test(contact.email)) { setEmailError('Please enter a valid email address.'); return; }
        const digits = localNumber.replace(/\s/g, '');
        if (digits.length < 4 || digits.length > 15) { setPhoneError('Phone number must be between 4 and 15 digits.'); return; }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    function togglePlatform(key) { setPlatform(prev => ({ ...prev, [key]: !prev[key] })); }
    function toggleNotif(key)    { setNotifs(prev => ({ ...prev, [key]: !prev[key] })); }

    function handleReset(label) {
        setResetDone(label);
        setTimeout(() => setResetDone(null), 2500);
    }

    const platformToggles = [
        { key: 'maintenance',  label: 'Maintenance mode',        desc: 'Block all user access while performing updates' },
        { key: 'registration', label: 'New registrations',       desc: 'Allow new users to create accounts' },
        { key: 'trading',      label: 'Trading enabled',         desc: 'Allow users to buy and sell assets' },
        { key: 'withdrawals',  label: 'Withdrawals enabled',     desc: 'Allow users to withdraw funds to their cards' },
        { key: 'demoMode',     label: 'Demo / paper trading',    desc: 'All trades are simulated — no real funds moved' },
    ];

    const notifToggles = [
        { key: 'regAlerts',      label: 'New registration alerts',   desc: 'Email admin when a new user signs up' },
        { key: 'securityAlerts', label: 'Security alerts',           desc: 'Notify on suspicious login attempts' },
        { key: 'weeklyDigest',   label: 'Weekly digest',             desc: 'Weekly platform stats sent every Monday' },
        { key: 'lowBalanceAlert',label: 'Low balance alerts',        desc: 'Notify admin when user balance drops to $0' },
    ];

    const dataActions = [
        { label: 'Clear news feed',       icon: 'bi-newspaper',     desc: 'Remove all manually added news articles' },
        { label: 'Reset market data',     icon: 'bi-graph-up-arrow',desc: 'Restore stocks, crypto and bonds to default values' },
        { label: 'Reset support tickets', icon: 'bi-chat-dots',     desc: 'Archive all closed tickets and clear the queue' },
    ];

    return (
        <div className="section-content">
            <div className="admin-section-header">
                <h2 className="admin-section-title"><i className="bi bi-sliders"></i> Platform Settings</h2>
            </div>

            <div className="about-grid">
                <div className="card-panel about-left-card">
                    <h3 className="section-title panel-title"><i className="bi bi-telephone"></i> Contact Information</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Shown on the Contact &amp; Support page visible to all users.
                    </p>
                    {saved && <div className="feedback-banner success"><i className="bi bi-check-circle-fill"></i> Contact information saved successfully.</div>}
                    <form id="contact-form" onSubmit={saveContact}>
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">Support email</label>
                            <input
                                className={`admin-input ${emailError ? 'admin-input-error' : ''}`}
                                type="email"
                                value={contact.email}
                                onChange={e => { setContact(p => ({ ...p, email: e.target.value })); setEmailError(''); }}
                                onBlur={e => { if (e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) setEmailError('Please enter a valid email address.'); }}
                            />
                            {emailError && <span className="admin-field-error">{emailError}</span>}
                        </div>
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">Phone</label>
                            <div className="phone-wrapper">
                                <AdminDialCodeSelect value={dialCountry} onChange={setDialCountry} />
                                <input
                                    className={`admin-input phone-input ${phoneError ? 'admin-input-error' : ''}`}
                                    type="tel"
                                    placeholder="000 000 0000"
                                    value={localNumber}
                                    onChange={e => handleLocalNumber(e.target.value)}
                                />
                            </div>
                            {phoneError && <span className="admin-field-error">{phoneError}</span>}
                        </div>
                        <div className="trade-info-row-col">
                            <label className="admin-field-label">Address</label>
                            <input className="admin-input" value={contact.address} onChange={e => setContact(p => ({ ...p, address: e.target.value }))} />
                        </div>
                    </form>
                    <div className="about-card-sep"></div>
                    <p className="about-subsection-title"><i className="bi bi-clock"></i> Working Hours</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                        Set your support availability for each day of the week.
                    </p>
                    <div className="schedule-list">
                        {SCHEDULE_DAYS.map((day, i) => (
                            <div key={day} className="schedule-row">
                                <div className="schedule-day-toggle">
                                    <div className={`toggle-switch ${schedule[i].enabled ? 'on' : ''}`}
                                        onClick={() => setSchedule(prev => prev.map((d, j) => j === i ? { ...d, enabled: !d.enabled } : d))}>
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span className="schedule-day-name">{day}</span>
                                </div>
                                {schedule[i].enabled ? (
                                    <div className="schedule-times">
                                        <TimeBox label="From" value={schedule[i].open}
                                            onChange={v => setSchedule(prev => prev.map((d, j) => j === i ? { ...d, open: v } : d))} />
                                        <TimeBox label="To" value={schedule[i].close}
                                            onChange={v => setSchedule(prev => prev.map((d, j) => j === i ? { ...d, close: v } : d))} />
                                    </div>
                                ) : (
                                    <div className="schedule-closed">
                                        <i className="bi bi-moon-fill"></i> Closed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="about-card-sep"></div>
                    <p className="about-subsection-title"><i className="bi bi-headset"></i> Support Channels</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Enable or disable active support channels for users.
                    </p>
                    <div className="about-toggle-list">
                        {[
                            { key: 'liveChat', label: 'Live chat',     desc: 'Real-time chat on the Contact page' },
                            { key: 'email',    label: 'Email support', desc: 'Users can submit requests via email' },
                            { key: 'phone',    label: 'Phone support', desc: 'Display phone number on Contact page' },
                        ].map(ch => (
                            <div key={ch.key} className="about-toggle-row">
                                <div className="about-toggle-info">
                                    <span className="about-flag-label">{ch.label}</span>
                                    <span className="about-toggle-desc">{ch.desc}</span>
                                </div>
                                <div className={`toggle-switch ${channels[ch.key] ? 'on' : ''}`} onClick={() => setChannels(p => ({ ...p, [ch.key]: !p[ch.key] }))}>
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" form="contact-form" className="admin-add-btn primary"><i className="bi bi-check-lg"></i> Save changes</button>
                    </div>
                </div>

                <div className="card-panel about-right-card">
                    <h3 className="section-title panel-title"><i className="bi bi-toggles"></i> Platform Management</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Enable or disable key platform features in real time.
                    </p>
                    <div className="about-toggle-list">
                        {platformToggles.map(t => (
                            <div key={t.key} className="about-toggle-row">
                                <div className="about-toggle-info">
                                    <span className="about-flag-label">{t.label}</span>
                                    <span className="about-toggle-desc">{t.desc}</span>
                                </div>
                                <div className={`toggle-switch ${platform[t.key] ? 'on' : ''} ${t.key === 'maintenance' && platform[t.key] ? 'toggle-danger' : ''}`}
                                    onClick={() => togglePlatform(t.key)}>
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="about-right-sep"></div>
                    <p className="about-subsection-title"><i className="bi bi-bell"></i> Notification Preferences</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Configure which events trigger admin email notifications.
                    </p>
                    <div className="about-toggle-list">
                        {notifToggles.map(t => (
                            <div key={t.key} className="about-toggle-row">
                                <div className="about-toggle-info">
                                    <span className="about-flag-label">{t.label}</span>
                                    <span className="about-toggle-desc">{t.desc}</span>
                                </div>
                                <div className={`toggle-switch ${notifs[t.key] ? 'on' : ''}`} onClick={() => toggleNotif(t.key)}>
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="about-right-sep"></div>
                    <p className="about-subsection-title"><i className="bi bi-database"></i> Data Management</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Reset or restore sections of the platform to their default demo state.
                    </p>
                    <div className="about-data-list">
                        {dataActions.map(a => (
                            <div key={a.label} className="about-data-row">
                                <div className="about-data-info">
                                    <span className="about-data-icon"><i className={`bi ${a.icon}`}></i></span>
                                    <div className="about-toggle-info">
                                        <span className="about-flag-label">{a.label}</span>
                                        <span className="about-toggle-desc">{a.desc}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                                    {resetDone === a.label
                                        ? <span style={{ color: 'var(--brand-primary)', fontSize: '0.8rem' }}><i className="bi bi-check-circle-fill"></i> Done</span>
                                        : <button className="about-reset-btn" onClick={() => handleReset(a.label)}>
                                            <i className="bi bi-arrow-counterclockwise"></i> Reset
                                          </button>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminApp() {
    const [activeSection, setSection]   = useState(sessionStorage.getItem('adminSection') || 'users');
    const [collapsed,     setCollapsed] = useState(false);
    const [mobileOpen,    setMobileOpen] = useState(false);
    const [showSecurity,  setSecurity]  = useState(false);
    const [tickets,       setTickets]   = useState(() => lsGet('admin_tickets', MOCK_SUPPORT_TICKETS.map(t => ({ ...t, replies: [...t.replies] }))));
    useEffect(() => { sessionStorage.setItem('admin_tickets', JSON.stringify(tickets)); }, [tickets]);

    const openTicketCount = tickets.filter(t => t.status !== 'closed').length;

    function handleSelect(s) {
        setSection(s);
        sessionStorage.setItem('adminSection', s);
        setMobileOpen(false);
    }

    function handleToggleSidebar() {
        if (window.innerWidth <= 768) setMobileOpen(o => !o);
        else setCollapsed(c => !c);
    }

    return (
        <div className="dashboard-root">
            <AdminNavbar onToggleSidebar={handleToggleSidebar} onSecurity={() => setSecurity(true)} onNavigate={handleSelect} />
            {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={() => setMobileOpen(false)} />}
            <div className="dashboard-body">
                <AdminSidebar activeSection={activeSection} onSelect={handleSelect} collapsed={collapsed} ticketCount={openTicketCount} mobileOpen={mobileOpen} />
                <main className={`dashboard-main ${collapsed ? 'expanded' : ''}`}>
                    {activeSection === 'users'    && <UsersSection />}
                    {activeSection === 'support'  && <SupportSection tickets={tickets} setTickets={setTickets} />}
                    {activeSection === 'market'   && <MarketDataSection />}
                    {activeSection === 'stats'    && <StatsSection onNavigate={handleSelect} />}
                    {activeSection === 'news'     && <NewsSection />}
                    {activeSection === 'events'   && <EventsSection />}
                    {activeSection === 'exchange' && <ExchangeSection />}
                    {activeSection === 'about'    && <AboutSection />}
                </main>
            </div>
            {showSecurity && <SecurityModal onClose={() => setSecurity(false)} />}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
