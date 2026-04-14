const { useState } = React;

const MOCK_COMMODITIES = [
    { symbol: 'XAU',  name: 'Gold',           category: 'Metals',  price:  2318.40, change:   12.80, changePct:  0.56, unit: 'oz',    exchange: 'COMEX' },
    { symbol: 'XAG',  name: 'Silver',          category: 'Metals',  price:    27.34, change:    0.42, changePct:  1.56, unit: 'oz',    exchange: 'COMEX' },
    { symbol: 'XPT',  name: 'Platinum',        category: 'Metals',  price:   982.50, change:   -6.10, changePct: -0.62, unit: 'oz',    exchange: 'NYMEX' },
    { symbol: 'XPD',  name: 'Palladium',       category: 'Metals',  price:  1024.00, change:   18.30, changePct:  1.82, unit: 'oz',    exchange: 'NYMEX' },
    { symbol: 'HG',   name: 'Copper',          category: 'Metals',  price:     4.52, change:    0.08, changePct:  1.80, unit: 'lb',    exchange: 'COMEX' },
    { symbol: 'CL',   name: 'Crude Oil WTI',   category: 'Petrol',  price:    82.14, change:   -1.24, changePct: -1.49, unit: 'bbl',   exchange: 'NYMEX' },
    { symbol: 'BRN',  name: 'Brent Oil',       category: 'Petrol',  price:    86.40, change:   -0.98, changePct: -1.12, unit: 'bbl',   exchange: 'ICE'   },
    { symbol: 'NG',   name: 'Natural Gas',      category: 'Energy',  price:     1.78, change:    0.04, changePct:  2.30, unit: 'MMBtu', exchange: 'NYMEX' },
    { symbol: 'HO',   name: 'Heating Oil',     category: 'Energy',  price:     2.61, change:   -0.03, changePct: -1.14, unit: 'gal',   exchange: 'NYMEX' },
];

const COMMODITY_ABOUT = {
    XAU:  'Gold has been a store of value for over 5,000 years, first used as currency in ancient Egypt around 3,000 BC. Today it serves as the world\'s primary safe-haven asset and inflation hedge, held in reserve by central banks globally. Its scarcity, durability, and universal acceptance make it the benchmark of the precious metals market.',
    XAG:  'Silver\'s history as money dates back to 700 BC in ancient Greece. Beyond its monetary role, silver is the most electrically conductive metal on Earth, making it essential in solar panels, electronics, and medical devices. Its dual identity as both an industrial metal and a precious metal gives it a unique price dynamic among commodities.',
    XPT:  'Platinum was first used by pre-Columbian South Americans and rediscovered by Europeans in the 18th century. Rarer than gold, it is prized for its catalytic properties — over 40% of all platinum goes into automotive catalytic converters. South Africa produces roughly 70% of the world\'s supply, making geopolitics a key price driver.',
    XPD:  'Palladium surpassed gold in price in 2019 for the first time in history, driven by tightening emissions regulations worldwide. Discovered in 1803, it is primarily mined as a byproduct of nickel and platinum operations. Russia and South Africa together account for over 80% of global production, creating significant supply concentration risk.',
    HG:   'Copper has been used by humanity for over 10,000 years, earning the nickname "Dr. Copper" for its ability to diagnose the health of the global economy. As the best non-precious conductor of electricity, it is indispensable in construction, wiring, and the energy transition — EVs use up to 4× more copper than combustion vehicles.',
    CL:   'West Texas Intermediate crude oil has been the dominant U.S. benchmark since the first commercial oil well was drilled in Pennsylvania in 1859. Priced in U.S. dollars and traded on NYMEX, WTI reflects landlocked American supply dynamics and has a lower sulfur content than Brent, making it preferable for gasoline refining.',
    BRN:  'Brent crude, named after the Brent oilfield in the North Sea, is the global benchmark for approximately two-thirds of the world\'s oil supply. First extracted in the 1970s, it trades on the ICE exchange in London and is priced relative to the ease of seaborne transport. Brent typically trades at a premium to WTI due to its superior logistical access to international markets.',
    NG:   'Natural gas became a commercially significant fuel in the mid-20th century, transforming from a nuisance byproduct of oil extraction into the world\'s fastest-growing fossil fuel. It burns cleaner than coal or oil and is central to electricity generation and home heating. The U.S. became the world\'s largest LNG exporter in 2023, reshaping global energy geopolitics.',
    HO:   'Heating oil, a refined petroleum product similar to diesel fuel, has been traded on NYMEX since 1978 — making it one of the oldest energy futures contracts. It is the primary heating fuel for the U.S. Northeast and serves as a pricing benchmark for distillate fuels worldwide. Demand peaks sharply in winter, creating pronounced seasonal price patterns.',
};

const COMMODITY_FUNDAMENTALS = {
    XAU:  { high52w: 2431.50, low52w: 1980.10, contractSize: '100 oz',       openInterest: '412K',  settlement: 'Physical', currency: 'USD' },
    XAG:  { high52w:   32.75, low52w:   20.68, contractSize: '5,000 oz',     openInterest: '142K',  settlement: 'Physical', currency: 'USD' },
    XPT:  { high52w: 1095.00, low52w:  875.20, contractSize: '50 oz',        openInterest: '68K',   settlement: 'Physical', currency: 'USD' },
    XPD:  { high52w: 1430.00, low52w:  895.00, contractSize: '100 oz',       openInterest: '18K',   settlement: 'Physical', currency: 'USD' },
    HG:   { high52w:    4.89, low52w:    3.52, contractSize: '25,000 lb',    openInterest: '198K',  settlement: 'Physical', currency: 'USD' },
    CL:   { high52w:   95.52, low52w:   67.81, contractSize: '1,000 bbl',    openInterest: '1.78M', settlement: 'Physical', currency: 'USD' },
    BRN:  { high52w:   98.40, low52w:   71.20, contractSize: '1,000 bbl',    openInterest: '1.24M', settlement: 'Cash',     currency: 'USD' },
    NG:   { high52w:    3.64, low52w:    1.52, contractSize: '10,000 MMBtu', openInterest: '762K',  settlement: 'Physical', currency: 'USD' },
    HO:   { high52w:    3.28, low52w:    2.14, contractSize: '42,000 gal',   openInterest: '89K',   settlement: 'Physical', currency: 'USD' },
};

const _DEFAULT_COMMODITY_HOLDINGS = [
    { symbol: 'XAU', qty: 2,  avgPrice: 2280.00 },
    { symbol: 'CL',  qty: 5,  avgPrice: 84.20   },
];
function _ssGet(key, fallback) { try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
const SESSION_USER = {
    cash:     _ssGet('ptp_cash',        12450.30),
    holdings: _ssGet('ptp_commodities', _DEFAULT_COMMODITY_HOLDINGS),
};

function nowStr() { const d = new Date(); const pad = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }

function persistTrade(symbol, name, side, qty, price, assetType, storageKey) {
    try {
        const total = qty * price;
        const tx = { id: Date.now(), type: side === 'buy' ? 'BUY' : 'SELL', symbol, name, qty, price, total, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType };
        sessionStorage.setItem('ptp_transactions', JSON.stringify([tx, ..._ssGet('ptp_transactions', [])]));
        sessionStorage.setItem('ptp_cash', JSON.stringify(side === 'buy' ? SESSION_USER.cash - total : SESSION_USER.cash + total));
        const raw = _ssGet(storageKey, []);
        let updated;
        if (side === 'buy') {
            const ex = raw.find(h => h.symbol === symbol);
            if (ex) updated = raw.map(h => h.symbol === symbol ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) } : h);
            else updated = [...raw, { symbol, qty, avgPrice: price }];
        } else {
            updated = raw.map(h => h.symbol === symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        }
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
}

const PERIOD_POINTS = { '1W': 7, '1M': 30, '3M': 90, '6M': 120, '1Y': 252, 'ALL': 300 };

function generatePriceHistory(price, changePct, numPoints) {
    let s = Math.abs((price * 137) | 0) + 1;
    function next() {
        s = ((s * 1664525) + 1013904223) & 0x7fffffff;
        return s / 0x7fffffff;
    }
    const direction  = changePct >= 0 ? 1 : -1;
    const startDelta = 1 - direction * (0.04 + next() * 0.06);
    const volatility = price * (0.006 + next() * 0.006);
    const data       = [];
    for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        const trend    = price * startDelta + (price - price * startDelta) * progress;
        const noise    = (next() - 0.5) * 2 * volatility * (1 - progress * 0.3);
        data.push(Math.max(trend + noise, price * 0.3));
    }
    data[data.length - 1] = price;
    return data;
}

function fmt(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function CommodityNavbar() {
    return (
        <nav className="stock-navbar">
            <a className="stock-nav-brand" href="terminal.html">
                <img src="../images/app-icon.jpg" alt="logo" className="stock-nav-logo" />
                <span className="stock-nav-title">Pocket TradePro</span>
            </a>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </nav>
    );
}

function CommodityIdentityCard({ commodity }) {
    const positive    = commodity.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';
    const changeIcon  = positive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';

    return (
        <div className="sidebar-card identity-card">
            <div className="identity-row">
                <div className="identity-left">
                    <span className="hero-symbol">{commodity.symbol}</span>
                    <div className="identity-name-block">
                        <span className="identity-name">{commodity.name}</span>
                        <span className="hero-sector">{commodity.category}</span>
                    </div>
                </div>
                <div className="identity-right">
                    <span className="identity-price">${fmt(commodity.price)}</span>
                    <span className={`identity-change ${changeClass}`}>
                        <i className={`bi ${changeIcon}`}></i>
                        {positive ? '+' : ''}{fmt(commodity.change)} ({positive ? '+' : ''}{fmt(commodity.changePct)}%)
                    </span>
                </div>
            </div>
            <div className="identity-meta-row">
                <span className="identity-meta-item">
                    <i className="bi bi-box"></i> Unit: {commodity.unit}
                </span>
                <span className="identity-meta-item">
                    <i className="bi bi-building"></i> {commodity.exchange}
                </span>
            </div>
        </div>
    );
}

function buildCandles(data) {
    const k = Math.max(1, Math.floor(data.length / 30));
    const pts = [];
    for (let i = 0; i < data.length; i += k) pts.push(data[i]);
    return pts.map((v, i) => {
        const open  = i === 0 ? v * 0.998 : pts[i - 1];
        const close = v;
        const wick  = Math.max(Math.abs(close - open) * 0.5, v * 0.0025);
        return { open, close, high: Math.max(open, close) + wick, low: Math.min(open, close) - wick };
    });
}

function CommodityChart({ commodity, period, onPeriodChange }) {
    const [chartType, setChartType] = React.useState(localStorage.getItem('chartType') || 'line');
    const data    = generatePriceHistory(commodity.price, commodity.changePct, PERIOD_POINTS[period]);
    const W = 800, H = 180;
    const pad     = { t: 10, r: 10, b: 10, l: 10 };
    const min     = Math.min(...data);
    const max     = Math.max(...data);
    const range   = max - min || 1;
    const xS      = i => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
    const yS      = v  => H - pad.b - ((v - min) / range) * (H - pad.t - pad.b);
    const pts     = data.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
    const area    = `${xS(0)},${H - pad.b} ${pts} ${xS(data.length - 1)},${H - pad.b}`;
    const periods = Object.keys(PERIOD_POINTS);
    const isUp    = data[data.length - 1] >= data[0];
    const color   = isUp ? '#00c896' : '#e05252';
    const gradId  = `commGrad_${commodity.symbol}`;
    const candles = chartType === 'candlestick' ? buildCandles(data) : null;

    return (
        <div className="sidebar-card stock-chart-card">
            <div className="chart-controls">
                <div className="chart-periods">
                    {periods.map(p => (
                        <button key={p} className={`chart-period-btn ${period === p ? 'active' : ''}`} onClick={() => onPeriodChange(p)}>{p}</button>
                    ))}
                </div>
                <div className="chart-type-toggle">
                    <button className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} title="Line" onClick={() => setChartType('line')}><i className="bi bi-graph-up"></i></button>
                    <button className={`chart-type-btn ${chartType === 'candlestick' ? 'active' : ''}`} title="Candlestick" onClick={() => setChartType('candlestick')}><i className="bi bi-bar-chart-line"></i></button>
                </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="stock-chart-svg">
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {chartType === 'line' ? (
                    <React.Fragment>
                        <polygon points={area} fill={`url(#${gradId})`} />
                        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {candles.map((c, i) => {
                            const cW = (W - pad.l - pad.r) / candles.length;
                            const bW = Math.max(cW * 0.6, 2);
                            const x  = pad.l + i * cW + cW / 2;
                            const cc = c.close >= c.open ? '#00c896' : '#e05252';
                            const bt = yS(Math.max(c.open, c.close));
                            const bb = yS(Math.min(c.open, c.close));
                            return (
                                <g key={i}>
                                    <line x1={x} y1={yS(c.high)} x2={x} y2={yS(c.low)} stroke={cc} strokeWidth="1.5" />
                                    <rect x={x - bW / 2} y={bt} width={bW} height={Math.max(bb - bt, 1)} fill={cc} />
                                </g>
                            );
                        })}
                    </React.Fragment>
                )}
            </svg>
            <div className="chart-price-range">
                <span className="range-label">Low <strong>${fmt(min)}</strong></span>
                <span className="range-label">High <strong>${fmt(max)}</strong></span>
            </div>
        </div>
    );
}

function FundamentalsCard({ fundamentals, commodity }) {
    const metrics = [
        { label: '52W High',      value: `$${fmt(fundamentals.high52w)}`   },
        { label: '52W Low',       value: `$${fmt(fundamentals.low52w)}`    },
        { label: 'Contract Size', value: fundamentals.contractSize          },
        { label: 'Open Interest', value: fundamentals.openInterest          },
        { label: 'Settlement',    value: fundamentals.settlement            },
        { label: 'Currency',      value: fundamentals.currency              },
        { label: 'Exchange',      value: commodity.exchange                 },
    ];

    return (
        <div className="sidebar-card fundamentals-card">
            <h3 className="card-section-title">Fundamentals</h3>
            <div className="fundamentals-grid">
                {metrics.map(m => (
                    <div key={m.label} className="fundamental-item">
                        <span className="fundamental-label">{m.label}</span>
                        <span className="fundamental-value">{m.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TradeModal({ commodity, initialSide, cash, ownedQty, onClose, onTradeComplete }) {
    const [side,   setSide]   = useState(initialSide);
    const [rawQty, setRawQty] = useState('1');
    const [done,   setDone]   = useState(false);

    const qty        = parseFloat(rawQty.replace(',', '.')) || 0;
    const displayQty = rawQty.startsWith('.') ? '0' + rawQty : rawQty;
    const price    = commodity.price;
    const total    = qty * price;
    const canTrade = qty > 0 && (side === 'buy' ? total <= cash : qty <= ownedQty);

    function handleQty(e) {
        const val = e.target.value;
        if (val.replace(/[,.]/g, '').length > 8) return;
        if (/^0[0-9]/.test(val)) return;
        if (/^[0-9]*[,.]?[0-9]*$/.test(val)) setRawQty(val);
    }

    function handleConfirm() {
        persistTrade(commodity.symbol, commodity.name, side, qty, commodity.price, 'commodity', 'ptp_commodities');
        if (onTradeComplete) onTradeComplete(side, qty, commodity.price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{commodity.symbol}</span>
                        <span className="trade-company">{commodity.name}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {done ? (
                    <div className="trade-success">
                        <i className="bi bi-check-circle-fill trade-success-icon"></i>
                        <p>Order placed successfully!</p>
                    </div>
                ) : (
                    <>
                        <div className="trade-side-toggle">
                            <button className={`trade-side-btn buy ${side === 'buy' ? 'active' : ''}`} onClick={() => setSide('buy')}>Buy</button>
                            <button className={`trade-side-btn sell ${side === 'sell' ? 'active' : ''}`} onClick={() => setSide('sell')}>Sell</button>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Market price</span>
                            <span className="trade-info-val">${fmt(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Quantity</span>
                            <div className="trade-qty-ctrl">
                                <input type="text" value={rawQty} onChange={handleQty} />
                            </div>
                        </div>
                        <div className="trade-summary">
                            <div className="trade-summary-row">
                                <span>Price per unit</span><span>${fmt(price)}</span>
                            </div>
                            <div className="trade-summary-row">
                                <span>Units</span><span>{displayQty || '0'}</span>
                            </div>
                            <div className="trade-summary-row total">
                                <span>{side === 'buy' ? 'Total cost' : 'Total proceeds'}</span>
                                <span>${fmt(total)}</span>
                            </div>
                            {side === 'buy' && (
                                <div className="trade-summary-row muted">
                                    <span>Available cash</span>
                                    <span className={total > cash ? 'negative' : ''}>${fmt(cash)}</span>
                                </div>
                            )}
                            {side === 'sell' && (
                                <div className="trade-summary-row muted">
                                    <span>Owned units</span>
                                    <span className={qty > ownedQty ? 'negative' : ''}>{ownedQty}</span>
                                </div>
                            )}
                        </div>
                        {rawQty !== '' && qty > 0 && !canTrade && (
                            <p className="trade-error">{side === 'buy' ? 'Insufficient funds.' : 'Insufficient units.'}</p>
                        )}
                        <button className={`trade-confirm-btn ${side}`} onClick={handleConfirm} disabled={!canTrade}>
                            {qty === 0
                                ? (side === 'buy' ? 'Buy units' : 'Sell units')
                                : `${side === 'buy' ? 'Buy' : 'Sell'} ${displayQty} unit${qty !== 1 ? 's' : ''} of ${commodity.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function WatchlistBtnLg({ symbol, type }) {
    const [active, setActive] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
            return saved.some(i => i.symbol === symbol && i.type === type);
        } catch { return false; }
    });

    function toggle() {
        const saved = (() => { try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; } })();
        const next = active
            ? saved.filter(i => !(i.symbol === symbol && i.type === type))
            : [...saved, { symbol, type }];
        localStorage.setItem('watchlist', JSON.stringify(next));
        setActive(!active);
    }

    return (
        <button className={`btn-watchlist-lg ${active ? 'active' : ''}`} onClick={toggle}>
            <span className="bell-plus-wrap">
                <i className={`bi ${active ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                <span className="bell-plus-badge">+</span>
            </span>
            {active ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
    );
}

function TradeCard({ commodity }) {
    const [modal,    setModal]    = useState(null);
    const [cash,     setCash]     = useState(SESSION_USER.cash);
    const [holdings, setHoldings] = useState(SESSION_USER.holdings);

    const ownedQty = holdings.find(h => h.symbol === commodity.symbol)?.qty || 0;

    function handleTradeComplete(side, qty, price) {
        const total = qty * price;
        setCash(c => side === 'buy' ? c - total : c + total);
        setHoldings(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === commodity.symbol);
                if (ex) return prev.map(h => h.symbol === commodity.symbol ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) } : h);
                return [...prev, { symbol: commodity.symbol, qty, avgPrice: price }];
            }
            return prev.map(h => h.symbol === commodity.symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        });
    }

    const positive    = commodity.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';

    return (
        <>
            <div className="sidebar-card trade-card">
                <h3 className="card-section-title">Trade</h3>
                <div className="trade-price-center">
                    <span className="trade-current-price">${fmt(commodity.price)}</span>
                    <span className={`trade-change-badge ${changeClass}`}>
                        {positive ? '+' : ''}{fmt(commodity.changePct)}%
                    </span>
                </div>
                <div className="trade-btn-row">
                    <button className="trade-action-btn buy-btn"  onClick={() => setModal('buy')}>Buy</button>
                    <button className="trade-action-btn sell-btn" onClick={() => setModal('sell')}>Sell</button>
                </div>
                <div className="watchlist-trade-row">
                    <WatchlistBtnLg symbol={commodity.symbol} type="commodity" />
                </div>
            </div>
            {modal && <TradeModal commodity={commodity} initialSide={modal} cash={cash} ownedQty={ownedQty} onClose={() => setModal(null)} onTradeComplete={handleTradeComplete} />}
        </>
    );
}

const INGOT_CONFIG = {
    XAU: { purity: '999.9', weight: '1000g', theme: 'ingot-gold'      },
    XAG: { purity: '999.9', weight: '1000g', theme: 'ingot-silver'    },
    XPT: { purity: '999.5', weight: '1000g', theme: 'ingot-platinum'  },
    XPD: { purity: '999.5', weight: '1000g', theme: 'ingot-palladium' },
    HG:  { purity: '999.9', weight: '1000g', theme: 'ingot-copper'    },
};

function IngotWidget({ symbol, name }) {
    const cfg = INGOT_CONFIG[symbol];
    if (!cfg) return null;
    return (
        <div className={`ingot-wrap ${cfg.theme}`}>
            <div className="ingot-bar">
                <div className="ingot-stamp">
                    <div className="ingot-stamp-outer">
                        <div className="ingot-stamp-inner">
                            <span className="ingot-stamp-symbol">{symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="ingot-info">
                    <span className="ingot-weight">{cfg.weight}</span>
                    <span className="ingot-purity">{cfg.purity}</span>
                    <span className="ingot-name">{name.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}

const BARREL_CONFIG = {
    CL:  { label: 'CRUDE OIL WTI', grade: 'Light Sweet', theme: 'barrel-wti'   },
    BRN: { label: 'BRENT CRUDE',   grade: 'North Sea',   theme: 'barrel-brent' },
};

function BarrelWidget({ symbol }) {
    const cfg = BARREL_CONFIG[symbol];
    if (!cfg) return null;
    return (
        <div className={`barrel-wrap ${cfg.theme}`}>
            <div className="barrel-body">
                <div className="barrel-top-ellipse"></div>
                <div className="barrel-cylinder">
                    <div className="barrel-band"></div>
                    <div className="barrel-label-area">
                        <span className="barrel-label-text">{cfg.label}</span>
                        <span className="barrel-grade">{cfg.grade}</span>
                    </div>
                    <div className="barrel-band"></div>
                </div>
                <div className="barrel-bottom-ellipse"></div>
            </div>
        </div>
    );
}

const FLAME_CONFIG = {
    NG: { label: 'NATURAL GAS', sublabel: 'Methane CH₄', theme: 'flame-gas'  },
    HO: { label: 'HEATING OIL', sublabel: 'Distillate',  theme: 'flame-heat' },
};

function FlameWidget({ symbol }) {
    const cfg = FLAME_CONFIG[symbol];
    if (!cfg) return null;
    return (
        <div className={`flame-wrap ${cfg.theme}`}>
            <div className="flame-container">
                <div className="flame-outer">
                    <div className="flame-mid">
                        <div className="flame-inner"></div>
                    </div>
                </div>
            </div>
            <div className="flame-info">
                <span className="flame-label">{cfg.label}</span>
                <span className="flame-sublabel">{cfg.sublabel}</span>
            </div>
        </div>
    );
}

function AboutCard({ symbol, name, category }) {
    const text = COMMODITY_ABOUT[symbol];
    if (!text) return null;

    let widget = null;
    if (category === 'Metals')  widget = <IngotWidget symbol={symbol} name={name} />;
    if (category === 'Petrol')  widget = <BarrelWidget symbol={symbol} />;
    if (category === 'Energy')  widget = <FlameWidget symbol={symbol} />;

    return (
        <div className="sidebar-card">
            <h3 className="card-section-title">About</h3>
            <p className="about-commodity-text">{text}</p>
            {widget}
        </div>
    );
}

function NotFoundView() {
    return (
        <div className="not-found-view">
            <i className="bi bi-bar-chart-steps not-found-icon"></i>
            <h2 className="not-found-title">Commodity not found</h2>
            <p className="not-found-body">The commodity you are looking for does not exist in our database.</p>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </div>
    );
}

function CommodityPage() {
    const [period, setPeriod] = useState('1M');

    const params     = new URLSearchParams(window.location.search);
    const symbol     = params.get('symbol');
    const commodity  = MOCK_COMMODITIES.find(c => c.symbol === symbol);

    if (!commodity) {
        return (
            <div className="stock-page">
                <CommodityNavbar />
                <main className="stock-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    const fundamentals = COMMODITY_FUNDAMENTALS[symbol];

    return (
        <div className="stock-page">
            <CommodityNavbar />
            <main className="stock-main">
                <div className="container stock-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <CommodityIdentityCard commodity={commodity} />
                            <CommodityChart commodity={commodity} period={period} onPeriodChange={setPeriod} />
                            {fundamentals && <FundamentalsCard fundamentals={fundamentals} commodity={commodity} />}
                        </div>
                        <div className="col-lg-4">
                            <TradeCard commodity={commodity} />
                            <AboutCard symbol={symbol} name={commodity.name} category={commodity.category} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CommodityPage />);
