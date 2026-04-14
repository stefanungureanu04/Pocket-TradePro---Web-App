const { useState } = React;

const MOCK_BONDS = [
    { symbol: 'US10Y',  issuer: 'U.S. Treasury',  type: 'Government', maturity: '2034-03-15', yield: 4.28, price: 96.42, rating: 'AAA' },
    { symbol: 'US2Y',   issuer: 'U.S. Treasury',  type: 'Government', maturity: '2026-03-15', yield: 4.72, price: 98.85, rating: 'AAA' },
    { symbol: 'US30Y',  issuer: 'U.S. Treasury',  type: 'Government', maturity: '2054-02-15', yield: 4.44, price: 91.20, rating: 'AAA' },
    { symbol: 'DE5Y',   issuer: 'German Bund',     type: 'Government', maturity: '2029-02-15', yield: 2.05, price: 99.10, rating: 'AAA' },
    { symbol: 'GB10Y',  issuer: 'UK Gilt',         type: 'Government', maturity: '2034-03-07', yield: 4.10, price: 95.60, rating: 'AA'  },
    { symbol: 'CA10Y',  issuer: 'Canada Gov. Bond',type: 'Government', maturity: '2034-06-01', yield: 3.15, price: 96.85, rating: 'AAA' },
    { symbol: 'AAPL26', issuer: 'Apple Inc.',      type: 'Corporate',  maturity: '2026-05-11', yield: 4.91, price: 99.20, rating: 'AA+' },
    { symbol: 'MSFT28', issuer: 'Microsoft Corp.', type: 'Corporate',  maturity: '2028-08-08', yield: 4.62, price: 97.85, rating: 'AAA' },
    { symbol: 'AMZN31', issuer: 'Amazon.com Inc.', type: 'Corporate',  maturity: '2031-06-03', yield: 5.10, price: 96.40, rating: 'AA'  },
    { symbol: 'JPM27',  issuer: 'JPMorgan Chase',  type: 'Corporate',  maturity: '2027-09-23', yield: 5.22, price: 98.30, rating: 'A+'  },
    { symbol: 'GS30',   issuer: 'Goldman Sachs',   type: 'Corporate',  maturity: '2030-11-15', yield: 5.48, price: 95.10, rating: 'A'   },
];

const BOND_FUNDAMENTALS = {
    US10Y:  { coupon: 4.25, parValue: 1000, duration: 8.62, currency: 'USD', country: 'United States', minLot: 1 },
    US2Y:   { coupon: 4.75, parValue: 1000, duration: 1.92, currency: 'USD', country: 'United States', minLot: 1 },
    US30Y:  { coupon: 4.38, parValue: 1000, duration: 18.40,currency: 'USD', country: 'United States', minLot: 1 },
    DE5Y:   { coupon: 2.00, parValue: 1000, duration: 4.65, currency: 'EUR', country: 'Germany',       minLot: 1 },
    GB10Y:  { coupon: 4.00, parValue: 1000, duration: 8.20, currency: 'GBP', country: 'United Kingdom',minLot: 1 },
    CA10Y:  { coupon: 3.00, parValue: 1000, duration: 8.44, currency: 'CAD', country: 'Canada',         minLot: 1 },
    AAPL26: { coupon: 4.85, parValue: 1000, duration: 2.08, currency: 'USD', country: 'United States', minLot: 1 },
    MSFT28: { coupon: 4.50, parValue: 1000, duration: 3.82, currency: 'USD', country: 'United States', minLot: 1 },
    AMZN31: { coupon: 5.00, parValue: 1000, duration: 6.14, currency: 'USD', country: 'United States', minLot: 1 },
    JPM27:  { coupon: 5.10, parValue: 1000, duration: 2.88, currency: 'USD', country: 'United States', minLot: 1 },
    GS30:   { coupon: 5.35, parValue: 1000, duration: 5.62, currency: 'USD', country: 'United States', minLot: 1 },
};

const BOND_ABOUT = {
    US10Y:  'The 10-Year U.S. Treasury note is the most closely watched fixed-income instrument in the world, serving as the benchmark risk-free rate for pricing everything from mortgages and corporate bonds to equity valuations. When investors are uncertain, demand for Treasuries surges ("flight to safety"), driving prices up and yields down; when economic confidence is high, yields rise as capital moves into riskier assets. The 10-year yield has become the global proxy for long-term growth and inflation expectations, making it the most quoted single number in financial markets.',
    US2Y:   'The 2-Year U.S. Treasury note is the most sensitive government bond to Federal Reserve interest rate expectations, tracking anticipated Fed policy changes more closely than any other maturity. Its yield typically moves in near-lockstep with projections for the Fed Funds rate over the next 24 months. An inverted yield curve — when the 2-year yield exceeds the 10-year — has historically preceded every U.S. recession since 1955, making the spread between the two maturities one of the most closely monitored leading economic indicators in financial markets.',
    US30Y:  'The 30-Year U.S. Treasury bond, commonly called the "long bond," is the longest-duration sovereign debt instrument issued by the U.S. government and is particularly sensitive to long-term inflation expectations and fiscal outlook. Originally introduced in 1977, discontinued in 2002, and reintroduced in 2006 due to strong demand from pension funds and insurers seeking long-duration assets to match their liabilities, the 30-year bond carries significantly more interest rate risk than shorter maturities. A 1% rise in yields on a 30-year bond can reduce its price by 15–20%, making it a favored instrument for macro traders.',
    DE5Y:   'The 5-Year German Bund is a key intermediate-maturity sovereign instrument for the eurozone, serving the same role in European fixed income that the U.S. Treasury plays globally — a risk-free reference rate against which all other euro-denominated debt is priced. Germany\'s AAA credit rating reflects its strong fiscal position, constitutionally mandated "debt brake" limiting deficit spending, and its status as the largest and most stable economy in the European Union. The Bund yield sets the floor for eurozone borrowing costs, with spreads of Italian, Spanish, and Greek sovereign bonds measured relative to it as a gauge of risk perception.',
    CA10Y:  'The 10-Year Canada Government Bond is the benchmark sovereign instrument of one of the world\'s most fiscally disciplined advanced economies, carrying a AAA credit rating from all major agencies. Canada\'s fiscal strength is underpinned by its resource-rich economy, a well-capitalized banking system that navigated the 2008 financial crisis without a single bank failure, and a federal debt-to-GDP ratio significantly lower than most G7 peers. The Bank of Canada\'s monetary policy path has historically tracked the U.S. Federal Reserve closely given deep trade and financial linkages, making Canadian government bonds sensitive to U.S. rate expectations while offering a modest yield differential relative to U.S. Treasuries. Their AAA status makes them a favored diversifier for global fixed income portfolios.',
    GB10Y:  'The 10-Year UK Gilt is the benchmark sovereign bond for the United Kingdom, with "gilt" referring to the gold-edged certificates historically used for British government bonds dating back to the 17th century. The UK\'s fiscal credibility was severely tested in September 2022 when an unfunded tax-cut budget triggered a gilt market crisis, forcing the Bank of England to conduct emergency bond purchases to prevent a collapse in pension fund collateral. With an AA rating from S&P, UK Gilts offer a modest yield premium over German Bunds, reflecting slightly higher fiscal risk alongside the Bank of England\'s independent monetary policy path.',
    AAPL26: 'Apple\'s short-dated corporate bonds represent some of the highest-rated near-term fixed-income instruments available in the investment-grade universe. Apple regularly issues bonds despite holding hundreds of billions in cash, leveraging its pristine Aaa/AA+ credit profile to borrow at near-sovereign rates and fund share buybacks in a tax-efficient structure. With free cash flow consistently exceeding $100B annually, Apple\'s debt service capacity is extraordinary — its interest coverage ratio is among the highest of any corporate issuer, making its bonds a favorite for investors seeking safety with a modest yield premium over Treasuries.',
    MSFT28: 'Microsoft\'s corporate bonds benefit from the company\'s exceptional AAA credit rating — one of only two U.S. corporations to maintain AAA ratings from both Moody\'s and S&P, alongside Johnson & Johnson. Microsoft\'s transformation into a cloud and AI powerhouse under Satya Nadella has deepened its already formidable balance sheet, with over $140B in cash and investments and free cash flow exceeding $70B annually. The company uses bond issuance strategically to fund major acquisitions without repatriating overseas cash, maintaining pristine credit metrics while financing transformational deals like the $68.7B Activision Blizzard acquisition.',
    AMZN31: 'Amazon\'s corporate bonds carry an AA rating reflecting the dual-engine revenue model of its dominant global e-commerce marketplace and AWS cloud platform, which generates the vast majority of operating income despite being a fraction of total revenue. Amazon uses debt markets strategically to fund its capital-intensive logistics infrastructure and data center buildout, with annual capital expenditures frequently exceeding $60B as it expands same-day delivery and AI cloud capabilities. The 2031 maturity positions these bonds in an attractive intermediate window — long enough to offer meaningful yield over Treasuries, close enough that Amazon\'s fundamental business trajectory is highly visible.',
    JPM27:  'JPMorgan Chase corporate bonds carry an A+ credit rating from S&P, reflecting the bank\'s position as the largest, most profitable, and most well-capitalized major financial institution in the United States, generating over $55B in annual net income across market cycles. As a systemically important financial institution (SIFI), JPMorgan faces stricter capital requirements, supplementary leverage ratios, living wills, and resolution planning than smaller banks — structural safeguards that provide bondholders with additional protection in stress scenarios. Its diversified revenue across consumer banking, investment banking, asset management, and commercial real estate reduces concentration risk.',
    GS30:   'Goldman Sachs 2030 corporate bonds offer exposure to one of the world\'s most prestigious and profitable investment banks, with an A credit rating that reflects its strong franchise value alongside a business model that is more cyclically sensitive than other A-rated issuers. Goldman generates the majority of its revenue from markets trading, M&A advisory, and asset management — activities that fluctuate significantly with market conditions, producing earnings volatility uncommon among peers at this rating level. The longer tenor makes these bonds a higher-conviction expression of Goldman\'s long-term franchise value, with sensitivity to both interest rate movements and the broader credit cycle.',
};

const _DEFAULT_BOND_HOLDINGS = [
    { symbol: 'US10Y', qty: 5, avgPrice: 96.10 },
    { symbol: 'MSFT28',qty: 3, avgPrice: 97.50 },
];
function _ssGet(key, fallback) { try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
const SESSION_USER = {
    cash:     _ssGet('ptp_cash',  12450.30),
    holdings: _ssGet('ptp_bonds', _DEFAULT_BOND_HOLDINGS),
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

const MOCK_NEWS = [
    { id: 1,  symbol: 'US10Y',  impact: 'negative', impactPct: -0.80, headline: 'Fed holds rates at 5.25–5.50%, signals only one cut in 2024 amid sticky inflation',    source: 'Reuters',      time: '2h ago'  },
    { id: 2,  symbol: 'US2Y',   impact: 'negative', impactPct: -1.20, headline: 'US 2-year yield hits 5.0% as markets price out early rate cut expectations',           source: 'Bloomberg',    time: '4h ago'  },
    { id: 3,  symbol: 'US30Y',  impact: 'neutral',  impactPct: +0.20, headline: 'Treasury auction sees strong demand as foreign central banks boost dollar reserves',   source: 'WSJ',          time: '6h ago'  },
    { id: 4,  symbol: 'DE5Y',  impact: 'positive', impactPct: +0.60, headline: 'ECB signals June rate cut as eurozone inflation falls to 2.4% in March',              source: 'FT',           time: '8h ago'  },
    { id: 5,  symbol: 'AAPL26', impact: 'positive', impactPct: +0.30, headline: 'Apple corporate bond demand surges after Moody\'s reaffirms Aa1 rating outlook',      source: 'MarketWatch',  time: '10h ago' },
    { id: 6,  symbol: 'US10Y',  impact: 'negative', impactPct: -0.50, headline: 'Yield curve inversion deepens as recession fears resurface in latest PMI data',       source: 'Bloomberg',    time: '12h ago' },
    { id: 7,  symbol: 'MSFT28', impact: 'positive', impactPct: +0.40, headline: 'Microsoft bond spread tightens to decade-low on strong AI revenue outlook',           source: 'TechCrunch',   time: '1d ago'  },
    { id: 8,  symbol: 'GB10Y',  impact: 'negative', impactPct: -0.90, headline: 'UK gilt yields spike as CPI data surprises to the upside at 3.2% in February',       source: 'FT',           time: '1d ago'  },
    { id: 9,  symbol: 'GS30',   impact: 'neutral',  impactPct: -0.10, headline: 'Goldman Sachs prices $3B in new bonds to refinance 2025 maturities at tighter spread',source: 'WSJ',          time: '2d ago'  },
    { id: 10, symbol: 'AMZN31', impact: 'positive', impactPct: +0.50, headline: 'Amazon AWS earnings beat drives credit spread compression across tech corporate bonds', source: 'Bloomberg',   time: '2d ago'  },
    { id: 11, symbol: 'US10Y',  impact: 'positive', impactPct: +0.70, headline: 'Safe-haven demand lifts Treasuries as Middle East tensions escalate',                 source: 'Reuters',      time: '3d ago'  },
    { id: 12, symbol: 'JPM27',  impact: 'positive', impactPct: +0.35, headline: 'JPMorgan Q1 earnings beat strengthens investment-grade credit profile',               source: 'MarketWatch',  time: '3d ago'  },
    { id: 13, symbol: 'DE5Y',  impact: 'neutral',  impactPct: -0.15, headline: 'German bund supply calendar heavy in Q2 as fiscal expansion plans confirmed',        source: 'FT',           time: '4d ago'  },
    { id: 14, symbol: 'US30Y',  impact: 'negative', impactPct: -0.60, headline: 'Long-end Treasury selloff resumes as CBO revises US deficit forecast upward',        source: 'Bloomberg',    time: '4d ago'  },
    { id: 15, symbol: 'AAPL26', impact: 'positive', impactPct: +0.25, headline: 'Short-dated Apple bonds attract record retail demand via brokerage platform inflows', source: 'CNBC',         time: '5d ago'  },
];

const IMPACT_CONFIG = {
    positive: { cls: 'impact-positive', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
    negative: { cls: 'impact-negative', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
    neutral:  { cls: 'impact-neutral',  icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
};

const PERIOD_POINTS = { '1W': 7, '1M': 30, '3M': 90, '6M': 120, '1Y': 252, 'ALL': 300 };

function generatePriceHistory(price, yieldVal, numPoints) {
    let s = Math.abs((price * 137) | 0) + 1;
    function next() {
        s = ((s * 1664525) + 1013904223) & 0x7fffffff;
        return s / 0x7fffffff;
    }
    const direction  = yieldVal < 4.5 ? 1 : -1;
    const startDelta = 1 - direction * (0.008 + next() * 0.012);
    const volatility = price * (0.001 + next() * 0.001);
    const data       = [];
    for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        const trend    = price * startDelta + (price - price * startDelta) * progress;
        const noise    = (next() - 0.5) * 2 * volatility * (1 - progress * 0.3);
        data.push(Math.max(trend + noise, price * 0.85));
    }
    data[data.length - 1] = price;
    return data;
}

function fmt(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

const BOND_FLAG = {
    US10Y: 'us', US2Y: 'us', US30Y: 'us',
    DE5Y: 'de',
    GB10Y: 'gb',
    CA10Y: 'ca',
};

function ratingColor(r) {
    if (r === 'AAA' || r === 'AA+') return 'positive';
    if (r === 'AA'  || r === 'A+')  return 'neutral';
    return 'negative';
}

function BondNavbar() {
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

function BondIdentityCard({ bond }) {
    const rc = ratingColor(bond.rating);

    return (
        <div className="sidebar-card identity-card">
            <div className="identity-row">
                <div className="identity-left">
                    <span className="hero-symbol">{bond.symbol}</span>
                    <div className="identity-name-block">
                        <span className="identity-name">
                            {BOND_FLAG[bond.symbol] && (
                                <img
                                    src={`https://flagcdn.com/${BOND_FLAG[bond.symbol]}.svg`}
                                    alt=""
                                    className="bond-flag"
                                />
                            )}
                            {bond.issuer}
                        </span>
                        <span className="hero-sector">{bond.type}</span>
                    </div>
                </div>
                <div className="identity-right">
                    <span className="identity-price">${fmt(bond.price)}</span>
                    <span className={`identity-change positive`}>
                        <i className="bi bi-percent"></i> Yield {fmt(bond.yield)}%
                    </span>
                </div>
            </div>
            <div className="identity-meta-row">
                <span className="identity-meta-item">
                    <i className="bi bi-calendar3"></i> Maturity: {bond.maturity}
                </span>
                <span className="identity-meta-item">
                    <span className={`rating-badge-large ${rc}`}>{bond.rating}</span>
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

function BondChart({ bond, period, onPeriodChange }) {
    const [chartType, setChartType] = React.useState(localStorage.getItem('chartType') || 'line');
    const data    = generatePriceHistory(bond.price, bond.yield, PERIOD_POINTS[period]);
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
    const gradId  = `bondGrad_${bond.symbol}`;
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

function FundamentalsCard({ fundamentals, bond }) {
    const metrics = [
        { label: 'Coupon Rate',  value: `${fmt(fundamentals.coupon)}%`       },
        { label: 'Current Yield',value: `${fmt(bond.yield)}%`                },
        { label: 'Par Value',    value: `$${fmt(fundamentals.parValue, 0)}`   },
        { label: 'Duration',     value: `${fmt(fundamentals.duration)} yrs`   },
        { label: 'Maturity',     value: bond.maturity                         },
        { label: 'Currency',     value: fundamentals.currency                 },
        { label: 'Country',      value: fundamentals.country                  },
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

function TradeModal({ bond, cash, onClose, onTradeComplete }) {
    const [qty,  setQty]  = useState(1);
    const [done, setDone] = useState(false);

    const price    = bond.price;
    const total    = qty * price;
    const canTrade = qty > 0 && total <= cash;

    function handleConfirm() {
        persistTrade(bond.symbol, bond.issuer, 'buy', qty, price, 'bond', 'ptp_bonds');
        if (onTradeComplete) onTradeComplete('buy', qty, price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{bond.symbol}</span>
                        <span className="trade-company">{bond.issuer}</span>
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
                        <div className="trade-info-row">
                            <span className="trade-info-label">Market price</span>
                            <span className="trade-info-val">${fmt(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Quantity</span>
                            <div className="bond-qty-stepper">
                                <button className="bond-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                                    <i className="bi bi-dash"></i>
                                </button>
                                <span className="bond-qty-val">{qty}</span>
                                <button className="bond-qty-btn" onClick={() => setQty(q => q + 1)}>
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="trade-summary">
                            <div className="trade-summary-row">
                                <span>Price per unit</span><span>${fmt(price)}</span>
                            </div>
                            <div className="trade-summary-row">
                                <span>Units</span><span>{qty}</span>
                            </div>
                            <div className="trade-summary-row total">
                                <span>Total cost</span>
                                <span>${fmt(total)}</span>
                            </div>
                            <div className="trade-summary-row muted">
                                <span>Available cash</span>
                                <span className={total > cash ? 'negative' : ''}>${fmt(cash)}</span>
                            </div>
                        </div>
                        {qty > 0 && !canTrade && (
                            <p className="trade-error">Insufficient funds.</p>
                        )}
                        <button className="trade-confirm-btn buy" onClick={handleConfirm} disabled={!canTrade}>
                            {`Buy ${qty} unit${qty !== 1 ? 's' : ''} of ${bond.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function SellWarningModal({ bond, ownedQty, onClose, onTradeComplete }) {
    const [proceed, setProceed] = useState(false);
    const [done,    setDone]    = useState(false);
    const [qty,     setQty]     = useState(1);

    const price   = bond.price;
    const total   = qty * price;
    const canSell = qty > 0 && qty <= ownedQty;

    function handleConfirm() {
        persistTrade(bond.symbol, bond.issuer, 'sell', qty, price, 'bond', 'ptp_bonds');
        if (onTradeComplete) onTradeComplete('sell', qty, price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{bond.symbol}</span>
                        <span className="trade-company">{bond.issuer}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                {done ? (
                    <div className="trade-success">
                        <i className="bi bi-check-circle-fill trade-success-icon"></i>
                        <p>Order placed successfully!</p>
                    </div>
                ) : !proceed ? (
                    <div className="bond-early-warn">
                        <i className="bi bi-exclamation-triangle-fill bond-warn-icon"></i>
                        <p className="bond-warn-title">Early sale warning</p>
                        <p className="bond-warn-body">
                            This bond matures on <strong>{bond.maturity}</strong>. Selling before maturity means
                            any accrued interest will be forfeited. The sale price may also be below par value
                            depending on current market conditions.
                        </p>
                        <div className="bond-warn-actions">
                            <button className="bond-warn-cancel" onClick={onClose}>Cancel</button>
                            <button className="bond-warn-proceed" onClick={() => setProceed(true)}>Proceed anyway</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Market price</span>
                            <span className="trade-info-val">${fmt(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Quantity</span>
                            <div className="bond-qty-stepper">
                                <button className="bond-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                                    <i className="bi bi-dash"></i>
                                </button>
                                <span className="bond-qty-val">{qty}</span>
                                <button className="bond-qty-btn" onClick={() => setQty(q => q + 1)}>
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="trade-summary">
                            <div className="trade-summary-row">
                                <span>Price per unit</span><span>${fmt(price)}</span>
                            </div>
                            <div className="trade-summary-row">
                                <span>Units</span><span>{qty}</span>
                            </div>
                            <div className="trade-summary-row total">
                                <span>Total proceeds</span>
                                <span>${fmt(total)}</span>
                            </div>
                            <div className="trade-summary-row muted">
                                <span>Owned units</span>
                                <span className={qty > ownedQty ? 'negative' : ''}>{ownedQty}</span>
                            </div>
                        </div>
                        {qty > 0 && !canSell && (
                            <p className="trade-error">Insufficient units.</p>
                        )}
                        <button className="trade-confirm-btn sell" onClick={handleConfirm} disabled={!canSell}>
                            {`Sell ${qty} unit${qty !== 1 ? 's' : ''} of ${bond.symbol}`}
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

function TradeCard({ bond }) {
    const [buyOpen,  setBuyOpen]  = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [cash,     setCash]     = useState(SESSION_USER.cash);
    const [holdings, setHoldings] = useState(SESSION_USER.holdings);

    const ownedQty = holdings.find(h => h.symbol === bond.symbol)?.qty || 0;
    const matured  = new Date() >= new Date(bond.maturity);

    function handleTradeComplete(side, qty, price) {
        const total = qty * price;
        setCash(c => side === 'buy' ? c - total : c + total);
        setHoldings(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === bond.symbol);
                if (ex) return prev.map(h => h.symbol === bond.symbol ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) } : h);
                return [...prev, { symbol: bond.symbol, qty, avgPrice: price }];
            }
            return prev.map(h => h.symbol === bond.symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        });
    }

    return (
        <>
            <div className="sidebar-card trade-card">
                <h3 className="card-section-title">Trade</h3>
                <div className="trade-price-center">
                    <span className="trade-current-price">${fmt(bond.price)}</span>
                    <span className="trade-change-badge positive">
                        {fmt(bond.yield)}% yield
                    </span>
                </div>
                <div className="trade-btn-row">
                    <button className="trade-action-btn buy-btn"  onClick={() => setBuyOpen(true)}>Buy</button>
                    <button className="trade-action-btn sell-btn" onClick={() => setSellOpen(true)} disabled={matured}>Sell</button>
                </div>
                {matured && (
                    <p className="bond-matured-note">
                        <i className="bi bi-info-circle"></i> This bond has matured. Funds were automatically credited to your account.
                    </p>
                )}
                <div className="watchlist-trade-row">
                    <WatchlistBtnLg symbol={bond.symbol} type="bond" />
                </div>
            </div>
            {buyOpen  && <TradeModal       bond={bond} cash={cash}               onClose={() => setBuyOpen(false)}  onTradeComplete={handleTradeComplete} />}
            {sellOpen && <SellWarningModal bond={bond} ownedQty={ownedQty}       onClose={() => setSellOpen(false)} onTradeComplete={handleTradeComplete} />}
        </>
    );
}

function RelatedNewsPanel({ symbol }) {
    const items = MOCK_NEWS.filter(n => n.symbol === symbol).slice(0, 3);

    return (
        <div className="sidebar-card related-news-card">
            <h3 className="card-section-title">Related News</h3>
            {items.length === 0 ? (
                <p className="no-news-msg">No recent news for {symbol}.</p>
            ) : (
                <div className="related-news-list">
                    {items.map(item => {
                        const cfg = IMPACT_CONFIG[item.impact];
                        return (
                            <a key={item.id} href={`news.html?id=${item.id}`} className="related-news-item">
                                <div className="related-news-top">
                                    <span className={`related-news-impact ${cfg.cls}`}>
                                        <i className={`bi ${cfg.icon}`}></i>
                                    </span>
                                    <span className={`related-news-pct ${cfg.cls}`}>
                                        {item.impactPct > 0 ? '+' : ''}{item.impactPct.toFixed(2)}%
                                    </span>
                                    <span className="related-news-time">{item.time}</span>
                                </div>
                                <p className="related-news-headline">{item.headline}</p>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AboutCard({ symbol }) {
    const text = BOND_ABOUT[symbol];
    if (!text) return null;
    return (
        <div className="sidebar-card">
            <h3 className="card-section-title">About</h3>
            <p className="about-text">{text}</p>
        </div>
    );
}

function NotFoundView() {
    return (
        <div className="not-found-view">
            <i className="bi bi-bank not-found-icon"></i>
            <h2 className="not-found-title">Bond not found</h2>
            <p className="not-found-body">The bond you are looking for does not exist in our database.</p>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </div>
    );
}

function BondPage() {
    const [period, setPeriod] = useState('1M');

    const params = new URLSearchParams(window.location.search);
    const symbol = params.get('symbol');
    const bond   = MOCK_BONDS.find(b => b.symbol === symbol && new Date() < new Date(b.maturity));

    if (!bond) {
        return (
            <div className="stock-page">
                <BondNavbar />
                <main className="stock-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    const fundamentals = BOND_FUNDAMENTALS[symbol];

    return (
        <div className="stock-page">
            <BondNavbar />
            <main className="stock-main">
                <div className="container stock-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <BondIdentityCard bond={bond} />
                            <BondChart bond={bond} period={period} onPeriodChange={setPeriod} />
                            {fundamentals && <FundamentalsCard fundamentals={fundamentals} bond={bond} />}
                        </div>
                        <div className="col-lg-4">
                            <TradeCard bond={bond} />
                            <AboutCard symbol={symbol} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BondPage />);
