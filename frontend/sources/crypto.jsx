const { useState } = React;

const MOCK_CRYPTO = [
    { symbol: 'BTC',  name: 'Bitcoin',    category: 'Layer 1', price: 68420.50,  change:  1240.30,  changePct:  1.85, volume: '28.4B', cap: '1.34T' },
    { symbol: 'ETH',  name: 'Ethereum',   category: 'Layer 1', price:  3820.40,  change:    48.20,  changePct:  1.28, volume:  '9.2B', cap: '459B'  },
    { symbol: 'BNB',  name: 'BNB',        category: 'Exchange',price:   612.80,  change:    -8.40,  changePct: -1.35, volume:  '1.8B', cap: '90B'   },
    { symbol: 'SOL',  name: 'Solana',     category: 'Layer 1', price:   178.30,  change:     4.90,  changePct:  2.82, volume:  '3.4B', cap: '82B'   },
    { symbol: 'XRP',  name: 'XRP',        category: 'Layer 1', price:     0.62,  change:     0.01,  changePct:  1.64, volume:  '2.1B', cap: '34B'   },
    { symbol: 'ADA',  name: 'Cardano',    category: 'Layer 1', price:     0.48,  change:    -0.02,  changePct: -4.00, volume:  '0.6B', cap: '17B'   },
    { symbol: 'AVAX', name: 'Avalanche',  category: 'Layer 1', price:    38.90,  change:     0.85,  changePct:  2.23, volume:  '0.9B', cap: '16B'   },
    { symbol: 'DOGE', name: 'Dogecoin',   category: 'Meme',    price:     0.18,  change:     0.01,  changePct:  5.88, volume:  '1.4B', cap: '25B'   },
    { symbol: 'LINK', name: 'Chainlink',  category: 'DeFi',    price:    18.40,  change:     0.62,  changePct:  3.49, volume:  '0.5B', cap: '11B'   },
    { symbol: 'MATIC',name: 'Polygon',    category: 'Layer 2', price:     0.92,  change:    -0.03,  changePct: -3.16, volume:  '0.4B', cap: '8B'    },
    { symbol: 'UNI',  name: 'Uniswap',   category: 'DeFi',    price:    11.20,  change:     0.38,  changePct:  3.51, volume:  '0.3B', cap: '6B'    },
    { symbol: 'SHIB', name: 'Shiba Inu', category: 'Meme',    price:  0.000028, change: 0.000001,  changePct:  3.70, volume:  '0.7B', cap: '16B'   },
];

const CRYPTO_FUNDAMENTALS = {
    BTC:  { ath: 73737.00,   atl: 0.06,       supply: '19.68M BTC',  network: 'Bitcoin',   dominance: '54.2%' },
    ETH:  { ath:  4878.26,   atl: 0.43,       supply: '120.2M ETH',  network: 'Ethereum',  dominance: '18.6%' },
    BNB:  { ath:   686.31,   atl: 0.03,       supply: '147.9M BNB',  network: 'BNB Chain', dominance:  '3.5%' },
    SOL:  { ath:   259.96,   atl: 0.50,       supply: '459.0M SOL',  network: 'Solana',    dominance:  '3.1%' },
    XRP:  { ath:     3.84,   atl: 0.002,      supply:  '55.0B XRP',  network: 'XRP Ledger',dominance:  '1.3%' },
    ADA:  { ath:     3.09,   atl: 0.017,      supply:  '35.7B ADA',  network: 'Cardano',   dominance:  '0.7%' },
    AVAX: { ath:   144.96,   atl: 2.80,       supply: '403.0M AVAX', network: 'Avalanche', dominance:  '0.6%' },
    DOGE: { ath:     0.74,   atl: 0.000086,   supply: '143.7B DOGE', network: 'Dogecoin',  dominance:  '1.0%' },
    LINK: { ath:    52.70,   atl: 0.15,       supply: '587.1M LINK', network: 'Ethereum',  dominance:  '0.4%' },
    MATIC:{ ath:     2.92,   atl: 0.003,      supply:   '9.9B MATIC',network: 'Ethereum',  dominance:  '0.3%' },
    UNI:  { ath:    44.97,   atl: 1.03,       supply: '753.8M UNI',  network: 'Ethereum',  dominance:  '0.2%' },
    SHIB: { ath: 0.000086,   atl: 0.0000000056, supply: '589.3T SHIB',network: 'Ethereum', dominance:  '0.6%' },
};

const CRYPTO_ABOUT = {
    BTC:  'Bitcoin was invented by the pseudonymous Satoshi Nakamoto in 2008, with the genesis block mined on January 3, 2009. It was the first decentralized digital currency to solve the double-spend problem without a trusted intermediary, using a proof-of-work blockchain secured by a global network of miners. Bitcoin is capped at 21 million coins — a fixed supply that underpins its "digital gold" narrative as an inflation hedge. The approval of spot Bitcoin ETFs in the U.S. in January 2024 marked a watershed moment for institutional adoption.',
    ETH:  'Ethereum was proposed by Vitalik Buterin in 2013 and launched in 2015, introducing programmable smart contracts to blockchain technology for the first time at scale. Its transition from proof-of-work to proof-of-stake in "The Merge" of September 2022 reduced the network\'s energy consumption by approximately 99.95%. Ether functions as both a currency and the "gas" that powers computation on the network, which hosts the vast majority of the world\'s DeFi protocols, NFT marketplaces, and tokenized real-world assets.',
    BNB:  'BNB was launched in 2017 as the utility token of the Binance exchange through an initial coin offering, initially issued as an ERC-20 token on Ethereum before migrating to its own chain in 2019. BNB Smart Chain attracted millions of users during periods of Ethereum congestion by offering dramatically lower transaction fees and high throughput, enabling a vibrant DeFi ecosystem. Binance\'s quarterly token-burning mechanism — using 20% of profits to buy back and destroy BNB — has steadily reduced its total supply over time.',
    SOL:  'Solana was founded by Anatoly Yakovenko in 2017 and launched in 2020, introducing a novel "Proof of History" consensus mechanism that allows nodes to agree on the order of events without constant communication. The network can process up to 65,000 transactions per second at sub-cent fees, making it one of the fastest programmable blockchains in existence. After recovering from the FTX-related collapse of late 2022, Solana emerged as the leading venue for memecoin launches and one of the most active NFT and DeFi ecosystems, attracting significant developer activity.',
    XRP:  'XRP was created by Ripple Labs in 2012 with a focus on enabling fast, low-cost international money transfers for banks and financial institutions, settling transactions in 3–5 seconds. Unlike most cryptocurrencies, XRP\'s total supply of 100 billion tokens was pre-mined in its entirety, with Ripple Labs holding a large reserve released through escrow on a predictable schedule. A multi-year legal battle with the U.S. SEC over whether XRP constitutes a security resulted in a partial victory for Ripple in 2023, providing regulatory clarity that fueled renewed institutional interest.',
    ADA:  'Cardano was founded by Ethereum co-founder Charles Hoskinson in 2015 and launched in 2017, positioning itself as a peer-reviewed, research-first blockchain built on formal verification methods and academic publication cycles. Its development is led by IOHK (Input Output Hong Kong) and proceeds more deliberately than competitors, with each protocol upgrade backed by published research. Cardano\'s smart contract capabilities were introduced with the Alonzo upgrade in 2021, opening the platform to decentralized applications across emerging markets in Africa and Southeast Asia.',
    AVAX: 'Avalanche was launched in 2020 by Ava Labs, founded by Cornell professor Emin Gün Sirer, introducing a novel consensus protocol that achieves finality in under two seconds while maintaining strong security guarantees. Its subnet architecture allows anyone to launch custom blockchains with their own validator sets, tokenomics, and virtual machines — making it attractive for enterprise, gaming, and institutional applications. Coca-Cola, GameSquare, and several financial institutions have deployed subnets on Avalanche, validating its enterprise positioning alongside its growing DeFi ecosystem.',
    DOGE: 'Dogecoin was created in 2013 by software engineers Billy Markus and Jackson Palmer as a lighthearted parody based on the popular "Doge" internet meme, never intended to be taken seriously. Despite its humorous origins, it accumulated a passionate community and rose to a market cap exceeding $80B in May 2021 following repeated endorsements from Elon Musk. Dogecoin uses a proof-of-work mechanism with no supply cap and produces approximately 5 billion new coins per year — a highly inflationary design that its community argues keeps transaction fees low and encourages spending over hoarding.',
    LINK: 'Chainlink was launched in 2017 by Sergey Nazarov and Steve Ellis to solve the "oracle problem" — the fundamental challenge of bringing real-world data onto blockchains in a secure and decentralized way. Its decentralized oracle network allows smart contracts to reliably access off-chain data, external APIs, payment systems, and traditional banking infrastructure, making it the connective tissue between blockchains and the real world. Chainlink has become the de facto oracle standard in DeFi, with integrations across hundreds of blockchains and protocols collectively securing trillions of dollars in value.',
    MATIC: 'Polygon was founded in 2017 by Jaynti Kanani, Sandeep Nailwal, and Anurag Arjun as a scaling solution for Ethereum under the name Matic Network, offering a sidechain that dramatically increases throughput while keeping fees near zero. Its broad ecosystem of tools — including zkEVM and various Layer 2 solutions — attracted partnerships with major brands including Starbucks, Reddit, and Nike for NFT and loyalty programs. In 2023, Polygon launched its migration from MATIC to POL as part of its "Polygon 2.0" vision: a network of interconnected ZK-powered chains unified under a shared staking and governance layer.',
    UNI:  'Uniswap was launched in 2018 by Hayden Adams as the first successful implementation of the Automated Market Maker (AMM) model, replacing the traditional order book with a mathematical formula that allows anyone to trade any ERC-20 token permissionlessly. It pioneered decentralized liquidity provision, enabling ordinary users to earn trading fees by depositing token pairs into liquidity pools without relying on a centralized exchange. Uniswap v3 (2021) introduced concentrated liquidity for dramatically improved capital efficiency, while v4 (2024) added hooks — programmable callbacks enabling fully customizable pool logic.',
    SHIB: 'Shiba Inu was launched in August 2020 by an anonymous developer known only as "Ryoshi," explicitly positioning itself as the "Dogecoin killer" and a social experiment in decentralized community building. Its creator sent 50% of the total supply to Ethereum co-founder Vitalik Buterin, who donated most of it to charity and burned the remainder, removing a significant fraction from circulation in one of the most dramatic supply events in crypto history. The Shiba Inu ecosystem has since expanded beyond its meme origins to include a decentralized exchange (ShibaSwap), a Layer 2 blockchain (Shibarium), and an emerging metaverse project.',
};

const _DEFAULT_CRYPTO_HOLDINGS = [
    { symbol: 'BTC',  qty: 0.25, avgPrice: 62000.00 },
    { symbol: 'ETH',  qty: 2.0,  avgPrice:  3500.00 },
    { symbol: 'SOL',  qty: 10.0, avgPrice:   155.00 },
];
function _ssGet(key, fallback) { try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
const SESSION_USER = {
    cash:     _ssGet('ptp_cash',   12450.30),
    holdings: _ssGet('ptp_crypto', _DEFAULT_CRYPTO_HOLDINGS),
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
    { id: 1,  symbol: 'BTC',  impact: 'positive', impactPct: +3.20, headline: 'Bitcoin ETF inflows hit record $1.1B in a single day amid institutional demand surge',      source: 'Bloomberg',    time: '1h ago'  },
    { id: 2,  symbol: 'ETH',  impact: 'positive', impactPct: +2.40, headline: 'Ethereum Dencun upgrade slashes Layer 2 transaction fees by up to 90%',                    source: 'The Block',    time: '3h ago'  },
    { id: 3,  symbol: 'SOL',  impact: 'positive', impactPct: +4.10, headline: 'Solana processes record 65,000 TPS during memecoin trading frenzy',                         source: 'CoinDesk',     time: '5h ago'  },
    { id: 4,  symbol: 'BTC',  impact: 'neutral',  impactPct: -0.50, headline: 'Bitcoin halving countdown: miners brace for reward cut to 3.125 BTC per block',            source: 'Decrypt',      time: '7h ago'  },
    { id: 5,  symbol: 'DOGE', impact: 'positive', impactPct: +8.30, headline: 'Dogecoin surges after Elon Musk posts dog meme, trading volume spikes 400%',               source: 'CryptoSlate',  time: '9h ago'  },
    { id: 6,  symbol: 'XRP',  impact: 'positive', impactPct: +5.60, headline: 'Ripple wins partial summary judgment in SEC case, XRP not a security in exchange sales',   source: 'Reuters',      time: '11h ago' },
    { id: 7,  symbol: 'ETH',  impact: 'neutral',  impactPct: -0.80, headline: 'Ethereum staking ratio reaches 27% of total supply, raising centralization concerns',      source: 'Bankless',     time: '14h ago' },
    { id: 8,  symbol: 'LINK', impact: 'positive', impactPct: +6.20, headline: 'Chainlink CCIP goes live on 10 new blockchains, enabling cross-chain DeFi at scale',      source: 'The Defiant',  time: '1d ago'  },
    { id: 9,  symbol: 'BNB',  impact: 'negative', impactPct: -2.10, headline: 'Binance settles with US DOJ for $4.3B, CZ steps down as CEO',                              source: 'WSJ',          time: '1d ago'  },
    { id: 10, symbol: 'AVAX', impact: 'positive', impactPct: +3.80, headline: 'Avalanche subnet adoption accelerates with Coke and GameSquare enterprise deals',          source: 'CoinTelegraph', time: '2d ago' },
    { id: 11, symbol: 'BTC',  impact: 'positive', impactPct: +1.90, headline: 'MicroStrategy purchases additional 9,245 BTC, total holdings cross 200,000 coins',        source: 'CoinDesk',     time: '2d ago'  },
    { id: 12, symbol: 'SOL',  impact: 'negative', impactPct: -3.40, headline: 'Solana network experiences 4-hour outage due to consensus bug in v1.18',                   source: 'Decrypt',      time: '3d ago'  },
    { id: 13, symbol: 'UNI',  impact: 'positive', impactPct: +7.10, headline: 'Uniswap v4 launches with hooks architecture, enabling fully custom AMM pools',             source: 'The Defiant',  time: '3d ago'  },
    { id: 14, symbol: 'MATIC',impact: 'neutral',  impactPct: -1.20, headline: 'Polygon 2.0 migration to POL token proceeds as MATIC holders begin conversion',            source: 'Bankless',     time: '4d ago'  },
    { id: 15, symbol: 'ETH',  impact: 'positive', impactPct: +3.60, headline: 'BlackRock BUIDL fund tokenized on Ethereum surpasses $500M in assets under management',   source: 'Bloomberg',    time: '4d ago'  },
];

const IMPACT_CONFIG = {
    positive: { cls: 'impact-positive', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
    negative: { cls: 'impact-negative', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
    neutral:  { cls: 'impact-neutral',  icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
};

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

function fmtPrice(n) {
    return fmt(n);
}

function CryptoNavbar() {
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

function CryptoIdentityCard({ coin }) {
    const positive    = coin.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';
    const changeIcon  = positive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';

    return (
        <div className="sidebar-card identity-card">
            <div className="identity-row">
                <div className="identity-left">
                    <span className="hero-symbol">{coin.symbol}</span>
                    <div className="identity-name-block">
                        <span className="identity-name">{coin.name}</span>
                        <span className="hero-sector">{coin.category}</span>
                    </div>
                </div>
                <div className="identity-right">
                    <span className="identity-price">${fmtPrice(coin.price)}</span>
                    <span className={`identity-change ${changeClass}`}>
                        <i className={`bi ${changeIcon}`}></i>
                        {positive ? '+' : ''}{fmtPrice(Math.abs(coin.change))} ({positive ? '+' : ''}{fmt(coin.changePct)}%)
                    </span>
                </div>
            </div>
            <div className="identity-meta-row">
                <span className="identity-meta-item">
                    <i className="bi bi-bar-chart"></i> Vol: {coin.volume}
                </span>
                <span className="identity-meta-item">
                    <i className="bi bi-building"></i> Cap: {coin.cap}
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

function CryptoChart({ coin, period, onPeriodChange }) {
    const [chartType, setChartType] = React.useState(localStorage.getItem('chartType') || 'line');
    const data    = generatePriceHistory(coin.price, coin.changePct, PERIOD_POINTS[period]);
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
    const gradId  = `cryptoGrad_${coin.symbol}`;
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
                <span className="range-label">Low <strong>${fmtPrice(min)}</strong></span>
                <span className="range-label">High <strong>${fmtPrice(max)}</strong></span>
            </div>
        </div>
    );
}

function FundamentalsCard({ fundamentals, coin }) {
    const metrics = [
        { label: 'All-Time High',      value: `$${fmtPrice(fundamentals.ath)}`  },
        { label: 'All-Time Low',       value: `$${fmtPrice(fundamentals.atl)}`  },
        { label: '24h Volume',         value: coin.volume                        },
        { label: 'Market Cap',         value: coin.cap                           },
        { label: 'Circulating Supply', value: fundamentals.supply                },
        { label: 'Network',            value: fundamentals.network               },
        { label: 'Dominance',          value: fundamentals.dominance             },
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

function TradeModal({ coin, initialSide, cash, ownedQty, onClose, onTradeComplete }) {
    const [side,   setSide]   = useState(initialSide);
    const [rawQty, setRawQty] = useState('1');
    const [done,   setDone]   = useState(false);

    const qty        = parseFloat(rawQty.replace(',', '.')) || 0;
    const displayQty = rawQty.startsWith('.') ? '0' + rawQty : rawQty;
    const price    = coin.price;
    const total    = qty * price;
    const canTrade = qty > 0 && (side === 'buy' ? total <= cash : qty <= ownedQty);

    function handleQty(e) {
        const val = e.target.value;
        if (val.replace(/[,.]/g, '').length > 8) return;
        if (/^0[0-9]/.test(val)) return;
        if (/^[0-9]*[,.]?[0-9]*$/.test(val)) setRawQty(val);
    }

    function handleConfirm() {
        persistTrade(coin.symbol, coin.name, side, qty, coin.price, 'crypto', 'ptp_crypto');
        if (onTradeComplete) onTradeComplete(side, qty, coin.price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{coin.symbol}</span>
                        <span className="trade-company">{coin.name}</span>
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
                            <span className="trade-info-val">${fmtPrice(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Quantity</span>
                            <div className="trade-qty-ctrl">
                                <input type="text" value={rawQty} onChange={handleQty} />
                            </div>
                        </div>
                        <div className="trade-summary">
                            <div className="trade-summary-row">
                                <span>Price per unit</span><span>${fmtPrice(price)}</span>
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
                                : `${side === 'buy' ? 'Buy' : 'Sell'} ${displayQty} unit${qty !== 1 ? 's' : ''} of ${coin.symbol}`}
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

function TradeCard({ coin }) {
    const [modal,    setModal]    = useState(null);
    const [cash,     setCash]     = useState(SESSION_USER.cash);
    const [holdings, setHoldings] = useState(SESSION_USER.holdings);

    const ownedQty = holdings.find(h => h.symbol === coin.symbol)?.qty || 0;

    function handleTradeComplete(side, qty, price) {
        const total = qty * price;
        setCash(c => side === 'buy' ? c - total : c + total);
        setHoldings(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === coin.symbol);
                if (ex) return prev.map(h => h.symbol === coin.symbol ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) } : h);
                return [...prev, { symbol: coin.symbol, qty, avgPrice: price }];
            }
            return prev.map(h => h.symbol === coin.symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        });
    }

    const positive    = coin.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';

    return (
        <>
            <div className="sidebar-card trade-card">
                <h3 className="card-section-title">Trade</h3>
                <div className="trade-price-center">
                    <span className="trade-current-price">${fmtPrice(coin.price)}</span>
                    <span className={`trade-change-badge ${changeClass}`}>
                        {positive ? '+' : ''}{fmt(coin.changePct)}%
                    </span>
                </div>
                <div className="trade-btn-row">
                    <button className="trade-action-btn buy-btn" onClick={() => setModal('buy')}>Buy</button>
                    <button className="trade-action-btn sell-btn" onClick={() => setModal('sell')}>Sell</button>
                </div>
                <div className="watchlist-trade-row">
                    <WatchlistBtnLg symbol={coin.symbol} type="crypto" />
                </div>
            </div>
            {modal && <TradeModal coin={coin} initialSide={modal} cash={cash} ownedQty={ownedQty} onClose={() => setModal(null)} onTradeComplete={handleTradeComplete} />}
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
    const text = CRYPTO_ABOUT[symbol];
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
            <i className="bi bi-currency-bitcoin not-found-icon"></i>
            <h2 className="not-found-title">Cryptocurrency not found</h2>
            <p className="not-found-body">The cryptocurrency you are looking for does not exist in our database.</p>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </div>
    );
}

function CryptoPage() {
    const [period, setPeriod] = useState('1M');

    const params = new URLSearchParams(window.location.search);
    const symbol = params.get('symbol');
    const coin   = MOCK_CRYPTO.find(c => c.symbol === symbol);

    if (!coin) {
        return (
            <div className="stock-page">
                <CryptoNavbar />
                <main className="stock-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    const fundamentals = CRYPTO_FUNDAMENTALS[symbol];

    return (
        <div className="stock-page">
            <CryptoNavbar />
            <main className="stock-main">
                <div className="container stock-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <CryptoIdentityCard coin={coin} />
                            <CryptoChart coin={coin} period={period} onPeriodChange={setPeriod} />
                            {fundamentals && <FundamentalsCard fundamentals={fundamentals} coin={coin} />}
                        </div>
                        <div className="col-lg-4">
                            <TradeCard coin={coin} />
                            <RelatedNewsPanel symbol={symbol} />
                            <AboutCard symbol={symbol} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CryptoPage />);
