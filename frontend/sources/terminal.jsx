const { useState, useEffect, useRef } = React;

const _storedUser = JSON.parse(localStorage.getItem('sessionUser') || 'null');
const SESSION_USER = {
    firstName: _storedUser?.firstName || 'Stefan',
    lastName:  _storedUser?.lastName  || 'Popescu',
    email:     _storedUser?.email     || 'stefan.popescu@example.com',
    tag:       '@' + (_storedUser?.email || 'stefan.popescu@example.com').split('@')[0],
    avatarUrl: null,
    role:      'user',
    cash:      12450.30,
    cards: [
        { id: 1, cardNumber: '4532123456780000', cardHolder: 'STEFAN UNGUREANU', expiry: '00/00', cardType: 'visa',       gradient: 'linear-gradient(135deg, #1a6b4a 0%, #00c896 100%)' },
        { id: 2, cardNumber: '5412345678901234', cardHolder: 'STEFAN UNGUREANU', expiry: '00/00', cardType: 'mastercard', gradient: 'linear-gradient(135deg, #b91c1c 0%, #f59e0b 100%)' },
    ],
};

const MOCK_STOCKS = [
    { symbol: 'AAPL',  name: 'Apple Inc.',             sector: 'Technology',  price: 182.30, change:  1.24, changePct:  0.69, volume: '58.2M',  cap: '2.81T' },
    { symbol: 'MSFT',  name: 'Microsoft Corp.',         sector: 'Technology',  price: 420.80, change:  2.15, changePct:  0.51, volume: '21.4M',  cap: '3.12T' },
    { symbol: 'NVDA',  name: 'NVIDIA Corp.',            sector: 'Technology',  price: 950.40, change: 18.30, changePct:  1.96, volume: '44.8M',  cap: '2.34T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.',           sector: 'Technology',  price: 178.90, change: -0.45, changePct: -0.25, volume: '24.1M',  cap: '2.21T' },
    { symbol: 'TSLA',  name: 'Tesla Inc.',              sector: 'Automotive',  price: 248.50, change:  5.63, changePct:  2.32, volume: '102.3M', cap: '791B'  },
    { symbol: 'AMZN',  name: 'Amazon.com Inc.',         sector: 'Consumer',    price: 198.70, change: -1.60, changePct: -0.80, volume: '35.7M',  cap: '2.08T' },
    { symbol: 'META',  name: 'Meta Platforms',          sector: 'Technology',  price: 512.30, change:  6.08, changePct:  1.20, volume: '18.9M',  cap: '1.30T' },
    { symbol: 'NFLX',  name: 'Netflix Inc.',            sector: 'Media',       price: 720.40, change:  3.58, changePct:  0.50, volume: '5.2M',   cap: '309B'  },
    { symbol: 'AMD',   name: 'Advanced Micro Devices',  sector: 'Technology',  price: 162.80, change: -2.31, changePct: -1.40, volume: '62.5M',  cap: '263B'  },
    { symbol: 'DIS',   name: 'The Walt Disney Co.',     sector: 'Media',       price: 112.40, change:  0.85, changePct:  0.76, volume: '11.3M',  cap: '205B'  },
    { symbol: 'JPM',   name: 'JPMorgan Chase',          sector: 'Finance',     price: 210.30, change:  1.20, changePct:  0.57, volume: '9.8M',   cap: '604B'  },
    { symbol: 'V',     name: 'Visa Inc.',               sector: 'Finance',     price: 280.50, change:  2.10, changePct:  0.75, volume: '7.2M',   cap: '576B'  },
    { symbol: 'JNJ',   name: 'Johnson & Johnson',       sector: 'Healthcare',  price: 156.80, change: -0.30, changePct: -0.19, volume: '6.4M',   cap: '377B'  },
    { symbol: 'WMT',   name: 'Walmart Inc.',            sector: 'Consumer',    price: 68.90,  change:  0.42, changePct:  0.61, volume: '15.8M',  cap: '555B'  },
    { symbol: 'XOM',   name: 'Exxon Mobil Corp.',       sector: 'Energy',      price: 115.20, change: -1.10, changePct: -0.95, volume: '18.2M',  cap: '461B'  },
    { symbol: 'BAC',   name: 'Bank of America',         sector: 'Finance',     price: 40.15,  change:  0.38, changePct:  0.96, volume: '42.1M',  cap: '318B'  },
    { symbol: 'INTC',  name: 'Intel Corp.',             sector: 'Technology',  price: 31.20,  change: -0.58, changePct: -1.83, volume: '38.6M',  cap: '132B'  },
    { symbol: 'PYPL',  name: 'PayPal Holdings',         sector: 'Finance',     price: 68.40,  change:  1.24, changePct:  1.85, volume: '12.4M',  cap: '72B'   },
    { symbol: 'UBER',  name: 'Uber Technologies',       sector: 'Technology',  price: 82.60,  change:  0.94, changePct:  1.15, volume: '22.8M',  cap: '174B'  },
    { symbol: 'SPOT',  name: 'Spotify Technology',      sector: 'Media',       price: 362.10, change:  5.40, changePct:  1.51, volume: '3.1M',   cap: '69B'   },
    { symbol: 'LMT',  name: 'Lockheed Martin Corp.',   sector: 'Other',       price: 468.20, change:  3.15, changePct:  0.68, volume: '1.6M',   cap: '111B'  },
    { symbol: 'WM',   name: 'Waste Management Inc.',   sector: 'Other',       price: 214.90, change: -1.02, changePct: -0.47, volume: '1.1M',   cap: '82B'   },
];

const HOLDINGS_RAW = [
    { symbol: 'AAPL',  qty: 10, avgPrice: 178.50 },
    { symbol: 'MSFT',  qty: 5,  avgPrice: 415.20 },
    { symbol: 'NVDA',  qty: 3,  avgPrice: 890.00 },
    { symbol: 'GOOGL', qty: 2,  avgPrice: 175.30 },
];

const CRYPTO_HOLDINGS_RAW = [
    { symbol: 'BTC', qty: 0.42, avgPrice: 62000.00 },
    { symbol: 'ETH', qty: 1.80, avgPrice: 3400.00  },
    { symbol: 'SOL', qty: 15,   avgPrice: 145.00   },
];

const BOND_HOLDINGS_RAW = [
    { symbol: 'US10Y',  qty: 5, avgPrice: 97.20 },
    { symbol: 'MSFT28', qty: 3, avgPrice: 98.10 },
];

const COMMODITY_HOLDINGS_RAW = [
    { symbol: 'XAU', qty: 1, avgPrice: 2240.00 },
    { symbol: 'CL',  qty: 4, avgPrice:   84.50 },
];

const ETF_HOLDINGS_RAW = [
    { symbol: 'SPY', qty: 3, avgPrice: 498.20 },
    { symbol: 'QQQ', qty: 2, avgPrice: 420.50 },
];

const ASSET_CLASS_COLORS = {
    Stocks:      '#00c896',
    Crypto:      '#f59e0b',
    Bonds:       '#3b82f6',
    Commodities: '#f472b6',
    ETF:         '#a78bfa',
};

const ASSET_CLASS_ICONS = {
    Stocks:      'bi-graph-up-arrow',
    Crypto:      'bi-currency-bitcoin',
    Bonds:       'bi-bank',
    Commodities: 'bi-box-seam',
    ETF:         'bi-layers',
};


const TRANSACTIONS_DATA = [
    { id: 1, type: 'BUY',      symbol: 'AAPL',  name: 'Apple Inc.',      qty: 2,    price: 182.30, total: 364.60,   date: '2026-03-22 14:32', orderId: 'TXN-20260322-001' },
    { id: 2, type: 'DEPOSIT',  symbol: null,     name: null,              qty: null, price: null,   total: 5000.00,  date: '2026-03-20 09:15', orderId: 'TXN-20260320-002', card: { last4: '0000', type: 'Visa' } },
    { id: 3, type: 'SELL',     symbol: 'MSFT',   name: 'Microsoft Corp.', qty: 1,    price: 420.80, total: 420.80,   date: '2026-03-18 16:45', orderId: 'TXN-20260318-003' },
    { id: 4, type: 'BUY',      symbol: 'NVDA',   name: 'NVIDIA Corp.',    qty: 1,    price: 950.40, total: 950.40,   date: '2026-03-15 11:20', orderId: 'TXN-20260315-004' },
    { id: 5, type: 'BUY',      symbol: 'GOOGL',  name: 'Alphabet Inc.',   qty: 2,    price: 175.30, total: 350.60,   date: '2026-03-10 13:55', orderId: 'TXN-20260310-005' },
    { id: 6, type: 'WITHDRAW', symbol: null,     name: null,              qty: null, price: null,   total: 2000.00,  date: '2026-03-05 15:30', orderId: 'TXN-20260305-006', card: { last4: '1234', type: 'Mastercard' } },
    { id: 7, type: 'BUY',      symbol: 'MSFT',   name: 'Microsoft Corp.', qty: 6,    price: 415.20, total: 2491.20,  date: '2026-03-02 10:10', orderId: 'TXN-20260302-007' },
    { id: 8, type: 'DEPOSIT',  symbol: null,     name: null,              qty: null, price: null,   total: 10000.00, date: '2026-03-01 08:00', orderId: 'TXN-20260301-008', card: { last4: '0000', type: 'Visa' } },
];

const TX_TYPE_CONFIG = {
    BUY:      { icon: 'bi-arrow-up-right-circle-fill',  label: 'Buy Order',  amountSign: '-', amountCls: '',         bgCls: 'tx-icon-bg-buy'      },
    SELL:     { icon: 'bi-arrow-down-left-circle-fill', label: 'Sell Order', amountSign: '+', amountCls: 'positive', bgCls: 'tx-icon-bg-sell'     },
    DEPOSIT:  { icon: 'bi-arrow-down-circle-fill',      label: 'Deposit',    amountSign: '+', amountCls: 'positive', bgCls: 'tx-icon-bg-deposit'  },
    WITHDRAW: { icon: 'bi-arrow-up-circle-fill',        label: 'Withdrawal', amountSign: '-', amountCls: 'negative', bgCls: 'tx-icon-bg-withdraw' },
    EXCHANGE: { icon: 'bi-arrow-left-right',            label: 'Exchange',   amountSign: '',  amountCls: '',         bgCls: 'tx-icon-bg-exchange' },
};

const CHART_DATA = [
    15800, 15650, 15920, 15780, 16050, 16200, 16150, 16380, 16520, 16430,
    16680, 16590, 16820, 17050, 16980, 17250, 17180, 17420, 17380, 17620,
    17720, 17650, 17890, 18100, 18020, 18280, 18350, 18520, 18590, 19586,
];

const SECTORS = ['All', 'Technology', 'Finance', 'Consumer', 'Healthcare', 'Media', 'Energy', 'Automotive', 'Other'];

const MOCK_CRYPTO = [
    { symbol: 'BTC',  name: 'Bitcoin',          category: 'Layer 1', price: 68420.50, change:  1240.30, changePct:  1.85, volume: '28.4B', cap: '1.34T' },
    { symbol: 'ETH',  name: 'Ethereum',          category: 'Layer 1', price:  3820.40, change:    48.20, changePct:  1.28, volume:  '9.2B', cap: '459B'  },
    { symbol: 'BNB',  name: 'BNB',               category: 'Exchange',price:   612.80, change:   -8.40, changePct: -1.35, volume:  '1.8B', cap: '90B'   },
    { symbol: 'SOL',  name: 'Solana',            category: 'Layer 1', price:   178.30, change:     4.90, changePct:  2.82, volume:  '3.4B', cap: '82B'   },
    { symbol: 'XRP',  name: 'XRP',               category: 'Layer 1', price:     0.62, change:     0.01, changePct:  1.64, volume:  '2.1B', cap: '34B'   },
    { symbol: 'ADA',  name: 'Cardano',           category: 'Layer 1', price:     0.48, change:    -0.02, changePct: -4.00, volume:  '0.6B', cap: '17B'   },
    { symbol: 'AVAX', name: 'Avalanche',         category: 'Layer 1', price:    38.90, change:     0.85, changePct:  2.23, volume:  '0.9B', cap: '16B'   },
    { symbol: 'DOGE', name: 'Dogecoin',          category: 'Meme',    price:     0.18, change:     0.01, changePct:  5.88, volume:  '1.4B', cap: '25B'   },
    { symbol: 'LINK', name: 'Chainlink',         category: 'DeFi',    price:    18.40, change:     0.62, changePct:  3.49, volume:  '0.5B', cap: '11B'   },
    { symbol: 'MATIC',name: 'Polygon',           category: 'Layer 2', price:     0.92, change:    -0.03, changePct: -3.16, volume:  '0.4B', cap: '8B'    },
    { symbol: 'UNI',  name: 'Uniswap',           category: 'DeFi',    price:    11.20, change:     0.38, changePct:  3.51, volume:  '0.3B', cap: '6B'    },
    { symbol: 'SHIB', name: 'Shiba Inu',         category: 'Meme',    price:  0.000028,change: 0.000001, changePct:  3.70, volume:  '0.7B', cap: '16B'   },
];

const CRYPTO_CATEGORIES = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'Exchange', 'Meme'];

const MOCK_BONDS = [
    { symbol: 'US10Y',  issuer: 'U.S. Treasury',       type: 'Government', maturity: '2034-03-15', yield: 4.28, price: 96.42,  rating: 'AAA' },
    { symbol: 'US2Y',   issuer: 'U.S. Treasury',       type: 'Government', maturity: '2026-03-15', yield: 4.72, price: 98.85,  rating: 'AAA' },
    { symbol: 'US30Y',  issuer: 'U.S. Treasury',       type: 'Government', maturity: '2054-02-15', yield: 4.44, price: 91.20,  rating: 'AAA' },
    { symbol: 'DE5Y',   issuer: 'German Bund',          type: 'Government', maturity: '2029-02-15', yield: 2.05, price: 99.10,  rating: 'AAA' },
    { symbol: 'GB10Y',  issuer: 'UK Gilt',              type: 'Government', maturity: '2034-03-07', yield: 4.10, price: 95.60,  rating: 'AA'  },
    { symbol: 'CA10Y',  issuer: 'Canada Gov. Bond',    type: 'Government', maturity: '2034-06-01', yield: 3.15, price: 96.85,  rating: 'AAA' },
    { symbol: 'AAPL26', issuer: 'Apple Inc.',           type: 'Corporate',  maturity: '2026-05-11', yield: 4.91, price: 99.20,  rating: 'AA+' },
    { symbol: 'MSFT28', issuer: 'Microsoft Corp.',      type: 'Corporate',  maturity: '2028-08-08', yield: 4.62, price: 97.85,  rating: 'AAA' },
    { symbol: 'AMZN31', issuer: 'Amazon.com Inc.',      type: 'Corporate',  maturity: '2031-06-03', yield: 5.10, price: 96.40,  rating: 'AA'  },
    { symbol: 'JPM27',  issuer: 'JPMorgan Chase',       type: 'Corporate',  maturity: '2027-09-23', yield: 5.22, price: 98.30,  rating: 'A+'  },
    { symbol: 'GS30',   issuer: 'Goldman Sachs',        type: 'Corporate',  maturity: '2030-11-15', yield: 5.48, price: 95.10,  rating: 'A'   },
];

const BOND_TYPES = ['All', 'Government', 'Corporate'];

const BOND_FLAG = {
    US10Y: 'us', US2Y: 'us', US30Y: 'us',
    DE5Y: 'de',
    CA10Y: 'ca',
    GB10Y: 'gb',
};

const MOCK_COMMODITIES = [
    { symbol: 'XAU',  name: 'Gold',          category: 'Metals',      price:  2318.40, change:   12.80, changePct:  0.56, unit: 'oz',     exchange: 'COMEX' },
    { symbol: 'XAG',  name: 'Silver',         category: 'Metals',      price:    27.34, change:    0.42, changePct:  1.56, unit: 'oz',     exchange: 'COMEX' },
    { symbol: 'XPT',  name: 'Platinum',       category: 'Metals',      price:   982.50, change:   -6.10, changePct: -0.62, unit: 'oz',     exchange: 'NYMEX' },
    { symbol: 'XPD',  name: 'Palladium',      category: 'Metals',      price:  1024.00, change:   18.30, changePct:  1.82, unit: 'oz',     exchange: 'NYMEX' },
    { symbol: 'HG',   name: 'Copper',         category: 'Metals',      price:     4.52, change:    0.08, changePct:  1.80, unit: 'lb',     exchange: 'COMEX' },
    { symbol: 'CL',   name: 'Crude Oil WTI',  category: 'Petrol',   price:    82.14, change:   -1.24, changePct: -1.49, unit: 'bbl',    exchange: 'NYMEX' },
    { symbol: 'BRN',  name: 'Brent Oil',      category: 'Petrol',   price:    86.40, change:   -0.98, changePct: -1.12, unit: 'bbl',    exchange: 'ICE'   },
    { symbol: 'NG',   name: 'Natural Energy',    category: 'Energy',         price:     1.78, change:    0.04, changePct:  2.30, unit: 'MMBtu',  exchange: 'NYMEX' },
    { symbol: 'HO',   name: 'Heating Oil',    category: 'Energy',         price:     2.61, change:   -0.03, changePct: -1.14, unit: 'gal',    exchange: 'NYMEX' },
];

const COMMODITY_CATEGORIES = ['All', 'Metals', 'Petrol', 'Energy'];

const COMMODITY_CATEGORY_ICON = {
    Metals: '../images/commodities-metals-icon.jpg',
    Petrol: '../images/commodities-petrol-icon.jpg',
    Energy: '../images/commodities-energy-icon.jpg',
};

const MOCK_ETFS = [
    { symbol: 'SPY',  name: 'SPDR S&P 500 ETF Trust',          category: 'Broad Market', price:  524.58, change:   6.32, changePct:  1.22, volume: '62.4M', aum: '507B' },
    { symbol: 'QQQ',  name: 'Invesco QQQ Trust',               category: 'Sector',       price:  442.30, change:   8.20, changePct:  1.89, volume: '38.1M', aum: '254B' },
    { symbol: 'VTI',  name: 'Vanguard Total Stock Market ETF',  category: 'Broad Market', price:  248.10, change:   2.28, changePct:  0.93, volume: '24.6M', aum: '418B' },
    { symbol: 'IWM',  name: 'iShares Russell 2000 ETF',         category: 'Small Cap',    price:  206.40, change:  -1.00, changePct: -0.48, volume: '28.2M', aum: '58B'  },
    { symbol: 'GLD',  name: 'SPDR Gold Shares',                 category: 'Thematic',     price:  232.10, change:   1.30, changePct:  0.56, volume:  '8.5M', aum: '61B'  },
    { symbol: 'TLT',  name: 'iShares 20+ Year Treasury Bond ETF',category:'Bond ETF',     price:   96.20, change:  -0.31, changePct: -0.32, volume: '14.8M', aum: '54B'  },
    { symbol: 'VNQ',  name: 'Vanguard Real Estate ETF',         category: 'Sector',       price:   88.40, change:   1.00, changePct:  1.14, volume:  '6.2M', aum: '35B'  },
    { symbol: 'ARKK', name: 'ARK Innovation ETF',               category: 'Thematic',     price:   48.90, change:   1.53, changePct:  3.22, volume: '18.3M', aum: '8B'   },
    { symbol: 'EEM',  name: 'iShares MSCI Emerging Markets ETF',category: 'International',price:   42.10, change:  -0.36, changePct: -0.85, volume: '22.4M', aum: '22B'  },
    { symbol: 'XLK',  name: 'Technology Select Sector SPDR',    category: 'Sector',       price:  224.80, change:   3.58, changePct:  1.62, volume: '12.1M', aum: '65B'  },
];

const ETF_CATEGORIES = ['All', 'Broad Market', 'Sector', 'Small Cap', 'International', 'Thematic', 'Bond ETF'];

const NAV_ITEMS = [
    { key: 'overview',     icon: 'bi-grid-1x2',        label: 'Overview'      },
    { key: 'portfolio',    icon: 'bi-pie-chart',        label: 'Portfolio'     },
    { key: 'stocks',       icon: 'bi-graph-up-arrow',   label: 'Stocks'        },
    { key: 'crypto',       icon: 'bi-currency-bitcoin', label: 'Crypto'        },
    { key: 'bonds',        icon: 'bi-bank',             label: 'Bonds'         },
    { key: 'etf',          icon: 'bi-layers',           label: 'ETF'           },
    { key: 'commodities',  icon: null, iconEl: React.createElement('img', { src: '../images/commodities-panel-icon.jpg', alt: '', className: 'sidebar-icon-img commodity-icon' }), label: 'Commodities'   },
    { key: 'transactions', icon: 'bi-clock-history',    label: 'Transactions'  },
    { key: 'exchange',     icon: 'bi-currency-exchange', label: 'Exchange' },
    { key: 'news',         icon: 'bi-globe2',             label: 'News'     },
    { key: 'events',       icon: 'bi-calendar-event',    label: 'Events'   },
    { key: 'trends',       icon: 'bi-fire',              label: 'Trends'   },
    { key: 'funding',      icon: 'bi-wallet2',           label: 'Funding'  },
];

const GUEST_HIDDEN = new Set(['overview', 'portfolio', 'transactions', 'funding']);
const _qp = new URLSearchParams(window.location.search);
const isGuest = _qp.get('mode') === 'guest' || _qp.get('guest') === '1';

function fmt(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function parseCompact(s) {
    if (!s) return 0;
    const v = parseFloat(s);
    if (s.endsWith('T')) return v * 1e12;
    if (s.endsWith('B')) return v * 1e9;
    if (s.endsWith('M')) return v * 1e6;
    if (s.endsWith('K') || s.endsWith('k')) return v * 1e3;
    return v;
}

function fmtCompact(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(2).replace(/\.?0+$/, '') + 'T';
    if (n >= 1e9)  return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
    if (n >= 1e6)  return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (n >= 1e3)  return (n / 1e3).toFixed(2).replace(/\.?0+$/, '') + 'K';
    return n.toFixed(2);
}

function fmtUSD(n, sign = false) {
    const abs = '$' + fmt(Math.abs(n));
    if (!sign) return n < 0 ? '-' + abs : abs;
    return (n >= 0 ? '+' : '-') + abs;
}

function pnlCls(n) { return n >= 0 ? 'positive' : 'negative'; }

function buildHoldings(raw) {
    return raw.map(h => {
        const stock = MOCK_STOCKS.find(s => s.symbol === h.symbol);
        if (!stock) return null;
        const currentValue = h.qty * stock.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, ...stock, currentValue, costBasis, pnl, pnlPct };
    }).filter(Boolean);
}

function buildAllHoldings(stocksRaw, cryptoRaw, bondsRaw, commoditiesRaw, etfsRaw) {
    const stocks = stocksRaw.map(h => {
        const stock = MOCK_STOCKS.find(s => s.symbol === h.symbol);
        if (!stock) return null;
        const currentValue = h.qty * stock.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, ...stock, currentValue, costBasis, pnl, pnlPct, assetClass: 'Stocks', unit: 'share', href: `stock.html?symbol=${h.symbol}` };
    }).filter(Boolean);
    const cryptos = cryptoRaw.map(h => {
        const coin = MOCK_CRYPTO.find(c => c.symbol === h.symbol);
        if (!coin) return null;
        const currentValue = h.qty * coin.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, ...coin, currentValue, costBasis, pnl, pnlPct, assetClass: 'Crypto', unit: 'unit', href: `crypto.html?symbol=${h.symbol}` };
    }).filter(Boolean);
    const bonds = bondsRaw.map(h => {
        const bond = MOCK_BONDS.find(b => b.symbol === h.symbol);
        if (!bond) return null;
        const currentValue = h.qty * bond.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, name: bond.issuer, ...bond, change: 0, changePct: 0, currentValue, costBasis, pnl, pnlPct, assetClass: 'Bonds', unit: 'unit', href: `bonds.html?symbol=${h.symbol}` };
    }).filter(Boolean);
    const commodities = commoditiesRaw.map(h => {
        const commodity = MOCK_COMMODITIES.find(c => c.symbol === h.symbol);
        if (!commodity) return null;
        const currentValue = h.qty * commodity.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, ...commodity, currentValue, costBasis, pnl, pnlPct, assetClass: 'Commodities', href: `commodity.html?symbol=${h.symbol}` };
    }).filter(Boolean);
    const etfs = etfsRaw.map(h => {
        const etf = MOCK_ETFS.find(e => e.symbol === h.symbol);
        if (!etf) return null;
        const currentValue = h.qty * etf.price;
        const costBasis    = h.qty * h.avgPrice;
        const pnl          = currentValue - costBasis;
        const pnlPct       = (pnl / costBasis) * 100;
        return { ...h, ...etf, currentValue, costBasis, pnl, pnlPct, assetClass: 'ETF', unit: 'share', href: `etf.html?symbol=${h.symbol}` };
    }).filter(Boolean);
    return [...stocks, ...cryptos, ...bonds, ...commodities, ...etfs];
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

function PortfolioChart({ data, period, onPeriodChange, chartType }) {
    const W = 800, H = 160;
    const pad = { t: 8, r: 8, b: 8, l: 8 };
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const xS = i => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
    const yS = v => H - pad.b - ((v - min) / range) * (H - pad.t - pad.b);
    const pts = data.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
    const area = `${xS(0)},${H - pad.b} ${pts} ${xS(data.length - 1)},${H - pad.b}`;
    const periods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
    const candles = chartType === 'candlestick' ? buildCandles(data) : null;

    return (
        <div className="chart-container">
            <div className="chart-controls">
                <div className="chart-periods">
                    {periods.map(p => (
                        <button key={p} className={`chart-period-btn ${period === p ? 'active' : ''}`} onClick={() => onPeriodChange(p)}>{p}</button>
                    ))}
                </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart-svg">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00c896" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#00c896" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {chartType === 'line' ? (
                    <React.Fragment>
                        <polygon points={area} fill="url(#chartGrad)" />
                        <polyline points={pts} fill="none" stroke="#00c896" strokeWidth="2.5" strokeLinejoin="round" />
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
        </div>
    );
}

function TransactionDetailModal({ tx, onClose }) {
    const cfg    = TX_TYPE_CONFIG[tx.type];
    const isTrade = tx.type === 'BUY' || tx.type === 'SELL';
    const assetHref = tx.assetType === 'crypto' ? `crypto.html?symbol=${tx.symbol}`
        : tx.assetType === 'bond'      ? `bonds.html?symbol=${tx.symbol}`
        : tx.assetType === 'etf'       ? `etf.html?symbol=${tx.symbol}`
        : tx.assetType === 'commodity' ? `commodity.html?symbol=${tx.symbol}`
        : `stock.html?symbol=${tx.symbol}`;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal tx-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div className="tx-detail-header-left">
                        <div className={`tx-detail-icon-wrap ${cfg.bgCls}`}>
                            <i className={`bi ${cfg.icon}`}></i>
                        </div>
                        <div>
                            <span className="trade-symbol">{cfg.label}</span>
                            <span className="trade-company">{tx.date}</span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>

                <div className="tx-detail-amount-row">
                    <span className={`tx-detail-amount ${cfg.amountCls}`}>{cfg.amountSign}${fmt(tx.total)}</span>
                    <span className="tx-detail-status"><i className="bi bi-check-circle-fill"></i> Completed</span>
                </div>

                <div className="tx-detail-rows">
                    {isTrade && (
                        <>
                            <div className="tx-detail-row">
                                <span className="tx-detail-label">Asset</span>
                                <a href={assetHref} className="tx-detail-asset-link" onClick={e => e.stopPropagation()}>
                                    {tx.symbol} <i className="bi bi-arrow-up-right"></i>
                                </a>
                            </div>
                            <div className="tx-detail-row">
                                <span className="tx-detail-label">Company</span>
                                <span className="tx-detail-val">{tx.name}</span>
                            </div>
                            <div className="tx-detail-row">
                                <span className="tx-detail-label">Units</span>
                                <span className="tx-detail-val">{fmt(tx.qty)}</span>
                            </div>
                            <div className="tx-detail-row">
                                <span className="tx-detail-label">Price / unit</span>
                                <span className="tx-detail-val">${fmt(tx.price)}</span>
                            </div>
                            <div className="tx-detail-row">
                                <span className="tx-detail-label">Commission</span>
                                <span className="tx-detail-val positive">$0.00 — Free</span>
                            </div>
                        </>
                    )}
                    {!isTrade && tx.card && (
                        <div className="tx-detail-row">
                            <span className="tx-detail-label">Payment method</span>
                            <span className="tx-detail-val">{tx.card.type} •••• {tx.card.last4}</span>
                        </div>
                    )}
                    <div className="tx-detail-row">
                        <span className="tx-detail-label">Order ID</span>
                        <span className="tx-detail-val tx-order-id-mono">{tx.orderId}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GuestGateModal({ onClose, title, sub }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal guest-gate-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
                <div className="guest-gate-lock">
                    <i className="bi bi-lock-fill"></i>
                </div>
                <h3 className="guest-gate-title">{title || 'Create an account to continue'}</h3>
                <p className="guest-gate-sub">{sub || 'Sign up for free to view detailed asset information, track your portfolio, and start trading.'}</p>
                <div className="guest-gate-actions">
                    <a href="register.html" className="guest-gate-btn-primary">Create free account</a>
                    <a href="login.html" className="guest-gate-btn-secondary">Sign in</a>
                </div>
            </div>
        </div>
    );
}

function TradeModal({ target, holdings, cash, onClose, onConfirm }) {
    const [side,   setSide]   = useState(target.side || 'buy');
    const [rawQty, setRawQty] = useState('1');
    const [done,   setDone]   = useState(false);

    const qty        = parseFloat(rawQty.replace(',', '.')) || 0;
    const displayQty = rawQty.startsWith('.') ? '0' + rawQty : rawQty;
    const unit     = target.unitLabel || 'unit';
    const price    = target.price;
    const total    = qty * price;
    const ownedQty = holdings.find(h => h.symbol === target.symbol)?.qty || 0;
    const canTrade = qty > 0 && (side === 'buy' ? total <= cash : qty <= ownedQty);

    function handleQty(e) {
        const val = e.target.value;
        if (val.replace(/[,.]/g, '').length > 8) return;
        if (/^0[0-9]/.test(val)) return;
        if (/^[0-9]*[,.]?[0-9]*$/.test(val)) setRawQty(val);
    }

    function handleConfirm() {
        if (onConfirm) onConfirm(side, qty);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{target.symbol}</span>
                        <span className="trade-company">{target.name}</span>
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
                                <span>Price per {unit}</span><span>${fmt(price)}</span>
                            </div>
                            <div className="trade-summary-row">
                                <span>{unit.charAt(0).toUpperCase() + unit.slice(1)}s</span><span>{displayQty || '0'}</span>
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
                                    <span>Owned {unit}s</span>
                                    <span className={qty > ownedQty ? 'negative' : ''}>{ownedQty}</span>
                                </div>
                            )}
                        </div>
                        {rawQty !== '' && qty > 0 && !canTrade && (
                            <p className="trade-error">{side === 'buy' ? 'Insufficient funds.' : `Insufficient ${unit}s.`}</p>
                        )}
                        <button className={`trade-confirm-btn ${side}`} onClick={handleConfirm} disabled={!canTrade}>
                            {qty === 0
                                ? (side === 'buy' ? `Buy ${unit}s` : `Sell ${unit}s`)
                                : `${side === 'buy' ? 'Buy' : 'Sell'} ${displayQty} ${unit}${qty !== 1 ? 's' : ''} of ${target.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function BondTradeModal({ target, cash, onClose, onConfirm }) {
    const [qty,  setQty]  = useState(1);
    const [done, setDone] = useState(false);

    const price    = target.price;
    const total    = qty * price;
    const canTrade = qty > 0 && total <= cash;

    function handleConfirm() {
        if (onConfirm) onConfirm(qty);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{target.symbol}</span>
                        <span className="trade-company">{target.name}</span>
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
                            {`Buy ${qty} unit${qty !== 1 ? 's' : ''} of ${target.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function BondSellModal({ target, onClose, onConfirm }) {
    const [proceed, setProceed] = useState(false);
    const [done,    setDone]    = useState(false);
    const [qty,     setQty]     = useState(1);

    const bond     = MOCK_BONDS.find(b => b.symbol === target.symbol) || {};
    const price    = target.price;
    const total    = qty * price;
    const ownedQty = target.ownedQty || 0;
    const canSell  = qty > 0 && qty <= ownedQty;

    function handleConfirm() {
        if (onConfirm) onConfirm(qty);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{target.symbol}</span>
                        <span className="trade-company">{target.name}</span>
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
                                <button className="bond-qty-btn" onClick={() => setQty(q => Math.min(ownedQty, q + 1))} disabled={qty >= ownedQty}>
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
                                <span>Units owned</span>
                                <span>{ownedQty}</span>
                            </div>
                        </div>
                        {qty > ownedQty && (
                            <p className="trade-error">Insufficient units.</p>
                        )}
                        <button className="trade-confirm-btn sell" onClick={handleConfirm} disabled={!canSell}>
                            {`Sell ${qty} unit${qty !== 1 ? 's' : ''} of ${target.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function ETFTradeModal({ target, initialSide = 'buy', cash, onClose, onConfirm, etfsRaw = [] }) {
    const [side,   setSide]   = useState(initialSide);
    const [amount, setAmount] = useState('');
    const [done,   setDone]   = useState(false);

    const parsed     = parseFloat(amount.replace(',', '.')) || 0;
    const price      = target.price;
    const ownedQty   = (etfsRaw.find(h => h.symbol === target.symbol)?.qty) || 0;
    const ownedValue = ownedQty * price;
    const estShares  = parsed > 0 ? parsed / price : 0;
    const canBuy     = parsed > 0 && parsed <= cash;
    const canSell    = parsed > 0 && parsed <= ownedValue;
    const canTrade   = side === 'buy' ? canBuy : canSell;
    const showErr    = parsed > 0 && !canTrade;

    function handleAmount(e) {
        const v = e.target.value;
        if (v.replace(/[,.]/g, '').length > 9) return;
        if (/^0[0-9]/.test(v)) return;
        if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setAmount(v);
    }

    function confirm() { if (onConfirm) onConfirm(side, parsed); setDone(true); setTimeout(onClose, 1600); }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{target.symbol}</span>
                        <span className="trade-company">{target.name}</span>
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
                            <button className={`trade-side-btn buy ${side === 'buy' ? 'active' : ''}`} onClick={() => { setSide('buy'); setAmount(''); }}>Buy</button>
                            <button className={`trade-side-btn sell ${side === 'sell' ? 'active' : ''}`} onClick={() => { setSide('sell'); setAmount(''); }}>Sell</button>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Market price</span>
                            <span className="trade-info-val">${fmt(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Amount ($)</span>
                            <div className="trade-qty-ctrl">
                                <input type="text" inputMode="decimal" placeholder="0.00" value={amount} onChange={handleAmount} />
                            </div>
                        </div>
                        <div className="trade-summary">
                            <div className="trade-summary-row">
                                <span>Estimated shares</span>
                                <span>{estShares > 0 ? estShares.toFixed(2) : '0'}</span>
                            </div>
                            <div className="trade-summary-row total">
                                <span>{side === 'buy' ? 'Total cost' : 'Total proceeds'}</span>
                                <span>${fmt(parsed)}</span>
                            </div>
                            {side === 'buy' && (
                                <div className="trade-summary-row muted">
                                    <span>Available cash</span>
                                    <span className={parsed > cash ? 'negative' : ''}>${fmt(cash)}</span>
                                </div>
                            )}
                            {side === 'sell' && (
                                <div className="trade-summary-row muted">
                                    <span>Owned value</span>
                                    <span className={parsed > ownedValue ? 'negative' : ''}>${fmt(ownedValue)}</span>
                                </div>
                            )}
                        </div>
                        {showErr && (
                            <p className="trade-error">{side === 'buy' ? 'Insufficient funds.' : 'Insufficient value.'}</p>
                        )}
                        <button className={`trade-confirm-btn ${side}`} onClick={confirm} disabled={!canTrade}>
                            {parsed === 0
                                ? `${side === 'buy' ? 'Buy' : 'Sell'} ${target.symbol}`
                                : `${side === 'buy' ? 'Buy' : 'Sell'} $${amount} of ${target.symbol}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function resolveWatchlistItem({ symbol, type }) {
    const hrefs = { stock: `stock.html?symbol=${symbol}`, crypto: `crypto.html?symbol=${symbol}`, bond: `bonds.html?symbol=${symbol}`, commodity: `commodity.html?symbol=${symbol}`, etf: `etf.html?symbol=${symbol}` };
    const href = hrefs[type] || `stock.html?symbol=${symbol}`;
    if (type === 'stock')     { const d = MOCK_STOCKS.find(s => s.symbol === symbol);      return d ? { symbol: d.symbol, name: d.name, price: d.price, changePct: d.changePct, href } : null; }
    if (type === 'crypto')    { const d = MOCK_CRYPTO.find(s => s.symbol === symbol);      return d ? { symbol: d.symbol, name: d.name, price: d.price, changePct: d.changePct, href } : null; }
    if (type === 'bond')      { const d = MOCK_BONDS.find(s => s.symbol === symbol);       return d ? { symbol: d.symbol, name: d.issuer, price: d.price, changePct: d.yield, isBond: true, href } : null; }
    if (type === 'commodity') { const d = MOCK_COMMODITIES.find(s => s.symbol === symbol); return d ? { symbol: d.symbol, name: d.name, price: d.price, changePct: d.changePct, href } : null; }
    if (type === 'etf')       { const d = MOCK_ETFS.find(s => s.symbol === symbol);        return d ? { symbol: d.symbol, name: d.name, price: d.price, changePct: d.changePct, href } : null; }
    return null;
}

function HoldingsSnippet({ allHoldings }) {
    const PS = 6;
    const top = [...allHoldings].sort((a, b) => b.currentValue - a.currentValue).slice(0, PS);

    return (
        <div className="card-panel">
            <h3 className="section-title panel-title">Top Holdings</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>P&amp;L</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {top.map(h => (
                        <tr key={h.symbol} className="clickable-row" onClick={() => window.location.href = h.href}>
                            <td>
                                <span className="symbol-badge">{h.symbol}</span>
                            </td>
                            <td>${fmt(h.price)}</td>
                            <td className={pnlCls(h.pnl)}>{fmtUSD(h.pnl, true)}</td>
                            <td>${fmt(h.currentValue)}</td>
                        </tr>
                    ))}
                    {Array.from({ length: PS - top.length }).map((_, i) => (
                        <tr key={`ph_${i}`} className="table-row-placeholder"><td colSpan={4}></td></tr>
                    ))}
                </tbody>
            </table>
            <div className="holdings-pagination" />
        </div>
    );
}

function WatchlistSnippet({ watchlistData }) {
    const [page, setPage] = useState(1);
    const PS = 5;
    const paged = watchlistData.slice((page - 1) * PS, page * PS);
    const placeholders = PS - paged.length;

    return (
        <div className="card-panel">
            <h3 className="section-title panel-title">Watchlist</h3>
            <div className="watchlist-list">
                {paged.map(s => (
                    <div key={s.symbol} className="watchlist-item" onClick={() => window.location.href = s.href}>
                        <div className="watchlist-left">
                            <span className="symbol-badge">{s.symbol}</span>
                            <span className="watchlist-name">{s.name}</span>
                        </div>
                        <div className="watchlist-right">
                            <span className="watchlist-price">${fmt(s.price)}</span>
                            {s.isBond
                                ? <span className="watchlist-change positive">{fmt(s.changePct)}% yield</span>
                                : <span className={`watchlist-change ${pnlCls(s.changePct)}`}>{s.changePct >= 0 ? '+' : ''}{fmt(s.changePct)}%</span>
                            }
                        </div>
                    </div>
                ))}
                {Array.from({ length: placeholders }).map((_, i) => (
                    <div key={`wl-ph-${i}`} className="watchlist-item table-row-placeholder" />
                ))}
            </div>
            <div className="watchlist-pagination-wrap">
                <Pagination page={page} total={watchlistData.length} onChange={setPage} pageSize={PS} />
            </div>
        </div>
    );
}

function OverviewSection({ holdings, allHoldings, cash, onTrade, watchlist, transactions }) {
    const [period, setPeriod]     = useState('1M');
    const [txDetail, setTxDetail] = useState(null);
    const [chartType, setChartType] = useState(localStorage.getItem('chartType') || 'line');

    function handleChartType(t) {
        localStorage.setItem('chartType', t);
        setChartType(t);
    }

    const holdingsValue = allHoldings.reduce((s, h) => s + h.currentValue, 0);
    const totalValue    = holdingsValue + cash;
    const totalPnl      = allHoldings.reduce((s, h) => s + h.pnl, 0);
    const totalCost     = allHoldings.reduce((s, h) => s + h.costBasis, 0);
    const totalPnlPct   = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    const dayChange     = allHoldings.reduce((s, h) => s + h.qty * (h.change || 0), 0);

    const _fallbackSymbols = MOCK_STOCKS.filter(s => !holdings.find(h => h.symbol === s.symbol)).slice(0, 5).map(s => s.symbol);
    const _fallbackItems   = _fallbackSymbols.map(sym => resolveWatchlistItem({ symbol: sym, type: 'stock' })).filter(Boolean);
    const _extraItems      = watchlist.filter(w => !_fallbackSymbols.includes(w.symbol)).map(resolveWatchlistItem).filter(Boolean);
    const watchlistData    = [..._fallbackItems, ..._extraItems];
    const recentTx = transactions.slice(0, 6);

    return (
        <div className="section-content">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total account value</div>
                    <div className="stat-value">${fmt(totalValue)}</div>
                    <div className={`stat-sub ${pnlCls(dayChange)}`}>
                        {fmtUSD(dayChange, true)} today
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Portfolio value</div>
                    <div className="stat-value">${fmt(holdingsValue)}</div>
                    <div className={`stat-sub ${pnlCls(totalPnl)}`}>
                        {fmtUSD(totalPnl, true)} ({fmt(totalPnlPct)}%) total return
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Available cash</div>
                    <div className="stat-value">${fmt(cash)}</div>
                    <div className="stat-sub neutral">Ready to invest</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Open positions</div>
                    <div className="stat-value">{allHoldings.length}</div>
                    <div className="stat-sub neutral">{allHoldings.length} active asset{allHoldings.length !== 1 ? 's' : ''}</div>
                </div>
            </div>

            <div className="chart-card">
                <div className="chart-title-row">
                    <h3 className="section-title">Account value</h3>
                    <div className="chart-type-toggle">
                        <button className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} title="Line" onClick={() => handleChartType('line')}><i className="bi bi-graph-up"></i></button>
                        <button className={`chart-type-btn ${chartType === 'candlestick' ? 'active' : ''}`} title="Candlestick" onClick={() => handleChartType('candlestick')}><i className="bi bi-bar-chart-line"></i></button>
                    </div>
                </div>
                <PortfolioChart data={CHART_DATA} period={period} onPeriodChange={setPeriod} chartType={chartType} />
            </div>

            <div className="overview-bottom-grid">
                <HoldingsSnippet allHoldings={allHoldings} />

                <WatchlistSnippet watchlistData={watchlistData} />

                <div className="card-panel">
                    <h3 className="section-title panel-title">Recent transactions</h3>
                    <div className="tx-list">
                        {recentTx.map(tx => (
                            <div key={tx.id} className="tx-item" style={{ cursor: 'pointer' }} onClick={() => setTxDetail(tx)}>
                                <span className={`tx-badge tx-${tx.type.toLowerCase()}`}>{tx.type}</span>
                                <div className="tx-info">
                                    <span className="tx-label">{tx.symbol ? `${tx.symbol} × ${fmt(tx.qty)}` : tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</span>
                                    <span className="tx-date">{tx.date}</span>
                                </div>
                                <span className={`tx-amount ${TX_TYPE_CONFIG[tx.type]?.amountCls || ''}`}>
                                    {TX_TYPE_CONFIG[tx.type]?.amountSign}{fmtUSD(tx.total)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {txDetail && <TransactionDetailModal tx={txDetail} onClose={() => setTxDetail(null)} />}
        </div>
    );
}

function DonutChart({ segments }) {
    const R = 54, CX = 70, CY = 70, STROKE = 18;
    const circumference = 2 * Math.PI * R;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    let offset = 0;
    const slices = segments.map(seg => {
        const dash = (seg.value / total) * circumference;
        const slice = { ...seg, dash, offset };
        offset += dash;
        return slice;
    });

    return (
        <div className="donut-wrap">
            <svg viewBox="0 0 140 140" className="donut-svg">
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--surface-alt)" strokeWidth={STROKE} />
                {slices.map(({ label, dash, offset: off, color }) => (
                    <circle key={label} cx={CX} cy={CY} r={R} fill="none"
                        stroke={color} strokeWidth={STROKE}
                        strokeDasharray={`${dash - 2} ${circumference - dash + 2}`}
                        strokeDashoffset={-(off - circumference / 4)}
                        strokeLinecap="butt"
                    />
                ))}
            </svg>
            <div className="donut-legend">
                {slices.map(({ label, value, color }) => (
                    <div key={label} className="donut-legend-item">
                        <span className="donut-legend-dot" style={{ background: color }}></span>
                        <span className="donut-legend-label">{label}</span>
                        <span className="donut-legend-pct">{((value / total) * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PortfolioSection({ allHoldings, cash, onTrade, onBondTrade, onBondSell, onETFTrade }) {
    const [filter, setFilter] = useState('All');
    const [period, setPeriod] = useState('1M');
    const [holdPage, setHoldPage] = useState(1);
    const [filterDdOpen, setFilterDdOpen] = useState(false);
    const filterDdRef = React.useRef(null);

    React.useEffect(() => {
        if (!filterDdOpen) return;
        const handler = e => { if (filterDdRef.current && !filterDdRef.current.contains(e.target)) setFilterDdOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [filterDdOpen]);

    const totalValue    = allHoldings.reduce((s, h) => s + h.currentValue, 0);
    const totalInvested = allHoldings.reduce((s, h) => s + h.costBasis, 0);
    const totalPnl      = totalValue - totalInvested;
    const totalPnlPct   = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    const ALL_CLASSES  = ['Stocks', 'Crypto', 'Bonds', 'ETF', 'Commodities'];
    const classSummary = ALL_CLASSES.map(cls => {
        const items  = allHoldings.filter(h => h.assetClass === cls);
        const value  = items.reduce((s, h) => s + h.currentValue, 0);
        const cost   = items.reduce((s, h) => s + h.costBasis, 0);
        const pnl    = value - cost;
        const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
        return { cls, value, pnl, pnlPct, count: items.length };
    }).filter(s => s.count > 0);

    const filtered = filter === 'All' ? allHoldings : allHoldings.filter(h => h.assetClass === filter);
    const holdPaged = filtered.slice((holdPage - 1) * PAGE_SIZE, holdPage * PAGE_SIZE);

    useEffect(() => setHoldPage(1), [filter]);

    const PERIOD_SLICES = { '1W': 7, '1M': 30, '3M': 90, '6M': 120, '1Y': 180, 'ALL': 300 };
    const chartSlice = CHART_DATA.slice(-Math.min(PERIOD_SLICES[period], CHART_DATA.length));
    const W = 800, H = 80;
    const cMin = Math.min(...chartSlice), cMax = Math.max(...chartSlice), cRange = cMax - cMin || 1;
    const cX = i => (i / (chartSlice.length - 1)) * W;
    const cY = v => H - ((v - cMin) / cRange) * H;
    const linePts = chartSlice.map((v, i) => `${cX(i)},${cY(v)}`).join(' ');
    const areaPts = `0,${H} ${linePts} ${W},${H}`;

    return (
        <div className="section-content">
            <div className="portfolio-hero">
                <div className="portfolio-hero-label">Capital at risk</div>
                <div className="portfolio-hero-value">${fmt(totalValue + cash)}</div>
                <div className={`portfolio-hero-sub ${pnlCls(totalPnl)}`}>
                    <span>{fmtUSD(totalPnl, true)}</span>
                    <span className="portfolio-hero-pct">{totalPnlPct >= 0 ? '▴' : '▾'}{fmt(Math.abs(totalPnlPct))}%</span>
                </div>
            </div>

            <div className="portfolio-sparkline-wrap">
                <div className="portfolio-periods">
                    {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map(p => (
                        <button key={p} className={`portfolio-period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
                    ))}
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="portfolio-sparkline-svg">
                    <defs>
                        <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00c896" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon points={areaPts} fill="url(#portGrad)" />
                    <polyline points={linePts} fill="none" stroke="#00c896" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            </div>


            <div className="portfolio-bottom-grid">
            <div className="card-panel">
                <div className="breakdown-row">
                    <div className="breakdown-icon" style={{ background: 'rgba(139,148,158,0.15)' }}>
                        <i className="bi bi-wallet2" style={{ color: 'var(--text-muted)' }}></i>
                    </div>
                    <div className="breakdown-info">
                        <span className="breakdown-name">Account Balance</span>
                        <span className={`breakdown-sub ${pnlCls(totalPnl)}`}>{fmtUSD(totalPnl, true)} {'  '}{totalPnlPct >= 0 ? '▴' : '▾'}{fmt(Math.abs(totalPnlPct))}%</span>
                    </div>
                    <div className="breakdown-right">
                        <span className="breakdown-value">${fmt(totalValue + cash)}</span>
                    </div>
                    <i className="bi bi-chevron-right breakdown-chevron"></i>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-row" onClick={() => setFilter('All')}>
                    <div className="breakdown-icon" style={{ background: 'rgba(139,148,158,0.15)' }}>
                        <i className="bi bi-cash-coin" style={{ color: 'var(--text-muted)' }}></i>
                    </div>
                    <div className="breakdown-info">
                        <span className="breakdown-name">Cash</span>
                    </div>
                    <div className="breakdown-right">
                        <span className="breakdown-value">${fmt(cash)}</span>
                    </div>
                    <i className="bi bi-chevron-right breakdown-chevron"></i>
                </div>
                {classSummary.map(({ cls, value, pnl, pnlPct }) => (
                    <div key={cls} className="breakdown-row" onClick={() => setFilter(cls)}>
                        <div className="breakdown-icon" style={{ background: ASSET_CLASS_COLORS[cls] + '22' }}>
                            <i className={`bi ${ASSET_CLASS_ICONS[cls]}`} style={{ color: ASSET_CLASS_COLORS[cls] }}></i>
                        </div>
                        <div className="breakdown-info">
                            <span className="breakdown-name">{cls}</span>
                            <span className="breakdown-sub">{allHoldings.filter(h => h.assetClass === cls).length} positions</span>
                        </div>
                        <div className="breakdown-right">
                            <span className="breakdown-value">${fmt(value)}</span>
                            <span className={`breakdown-pnl ${pnlCls(pnl)}`}>{pnl >= 0 ? '+' : ''}{fmt(pnlPct)}%</span>
                        </div>
                        <i className="bi bi-chevron-right breakdown-chevron"></i>
                    </div>
                ))}
                <DonutChart segments={[
                    ...classSummary.map(({ cls, value }) => ({ label: cls, value, color: ASSET_CLASS_COLORS[cls] })),
                    { label: 'Cash', value: cash, color: '#8b949e' },
                ]} />
            </div>

            <div className="card-panel">
                <div className="portfolio-holdings-header">
                    <h3 className="section-title panel-title">Holdings</h3>
                    <div className="portfolio-filter-tabs">
                        {['All', ...ALL_CLASSES].map(f => (
                            <button
                                key={f}
                                className={`portfolio-filter-tab ${filter === f ? 'active' : ''}`}
                                style={filter === f && f !== 'All' ? { borderColor: ASSET_CLASS_COLORS[f], color: ASSET_CLASS_COLORS[f] } : {}}
                                onClick={() => setFilter(f)}
                            >{f}</button>
                        ))}
                    </div>
                    <div className="portfolio-filter-select" ref={filterDdRef}>
                        <button
                            className="pf-dd-trigger"
                            onClick={() => setFilterDdOpen(o => !o)}
                        >
                            <span
                                className="pf-dd-dot"
                                style={{ background: filter !== 'All' ? ASSET_CLASS_COLORS[filter] : 'var(--brand-primary)' }}
                            />
                            <span className="pf-dd-label">{filter}</span>
                            <i className={`bi bi-chevron-${filterDdOpen ? 'up' : 'down'} pf-dd-chevron`} />
                        </button>
                        {filterDdOpen && (
                            <div className="pf-dd-menu">
                                {['All', ...ALL_CLASSES].map(f => (
                                    <button
                                        key={f}
                                        className={`pf-dd-option ${filter === f ? 'active' : ''}`}
                                        onClick={() => { setFilter(f); setFilterDdOpen(false); }}
                                    >
                                        <span
                                            className="pf-dd-dot"
                                            style={{ background: f !== 'All' ? ASSET_CLASS_COLORS[f] : 'var(--brand-primary)' }}
                                        />
                                        {f}
                                        {filter === f && <i className="bi bi-check2 pf-dd-check" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="holding-list">
                    {holdPaged.map(h => {
                        const color    = ASSET_CLASS_COLORS[h.assetClass];
                        const rawQty   = h.qty % 1 === 0 ? h.qty.toString() : fmt(h.qty, h.qty < 1 ? 4 : 2);
                        const unitDisp = h.assetClass === 'Commodities' ? h.unit : h.unit + (h.qty !== 1 ? 's' : '');
                        const fmtPrice = (h.assetClass === 'Crypto' && h.price < 1) ? fmt(h.price, 4) : fmt(h.price);

                        return (
                            <div key={`${h.assetClass}-${h.symbol}`} className="holding-item" onClick={() => window.location.href = h.href}>
                                <div className="holding-avatar" style={{ background: color + '22', color }}>
                                    {h.symbol.slice(0, 3)}
                                </div>
                                <div className="holding-item-left">
                                    <span className="holding-item-name">{h.name}</span>
                                    <span className="holding-item-meta">
                                        {rawQty} {unitDisp}
                                        {h.assetClass === 'Bonds'
                                            ? <> · yield {fmt(h.yield)}%</>
                                            : <> · ${fmtPrice}</>
                                        }
                                    </span>
                                </div>
                                <div className="holding-item-right">
                                    <span className="holding-item-value">${fmt(h.currentValue)}</span>
                                    <span className={`holding-item-pnl ${pnlCls(h.pnl)}`}>{h.pnlPct >= 0 ? '+' : ''}{fmt(h.pnlPct)}%</span>
                                </div>
                                <div className="holding-item-actions" onClick={e => e.stopPropagation()}>
                                    <button className="btn-trade buy" onClick={() => {
                                        if (h.assetClass === 'Bonds') onBondTrade({ symbol: h.symbol, name: h.name, price: h.price });
                                        else if (h.assetClass === 'ETF') onETFTrade({ symbol: h.symbol, name: h.name, price: h.price });
                                        else onTrade({ symbol: h.symbol, name: h.name, price: h.price, side: 'buy', unitLabel: h.unit, assetType: h.assetClass === 'Crypto' ? 'crypto' : h.assetClass === 'Commodities' ? 'commodity' : 'stock' });
                                    }}>Buy</button>
                                    <button className="btn-trade sell" onClick={() => {
                                        if (h.assetClass === 'Bonds') onBondSell({ symbol: h.symbol, name: h.name, price: h.price, ownedQty: h.qty });
                                        else if (h.assetClass === 'ETF') onETFTrade({ symbol: h.symbol, name: h.name, price: h.price });
                                        else onTrade({ symbol: h.symbol, name: h.name, price: h.price, side: 'sell', unitLabel: h.unit, assetType: h.assetClass === 'Crypto' ? 'crypto' : h.assetClass === 'Commodities' ? 'commodity' : 'stock' });
                                    }}>Sell</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Pagination page={holdPage} total={filtered.length} onChange={setHoldPage} />
            </div>
            </div>
        </div>
    );
}

const PAGE_SIZE = 10;

function Pagination({ page, total, onChange, pageSize = PAGE_SIZE }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const buildPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const around = new Set([1, totalPages, page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages));
        const sorted = [...around].sort((a, b) => a - b);
        const result = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
            result.push(sorted[i]);
        }
        return result;
    };

    return (
        <div className="table-pagination">
            {buildPages().map((p, i) =>
                p === '...'
                    ? <span key={`el-${i}`} className="pagination-ellipsis">…</span>
                    : <button key={p} className={`pagination-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
            )}
        </div>
    );
}

function WatchlistBtn({ symbol, type, watchlist, onToggle }) {
    const active = watchlist
        ? watchlist.some(i => i.symbol === symbol && i.type === type)
        : false;

    function toggle(e) {
        e.stopPropagation();
        if (onToggle) onToggle(symbol, type);
    }

    return (
        <button className={`btn-watchlist ${active ? 'active' : ''}`} onClick={toggle} data-tooltip={active ? 'Remove from Watchlist' : 'Add to Watchlist'}>
            <span className="bell-plus-wrap">
                <i className={`bi ${active ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                <span className="bell-plus-badge">+</span>
            </span>
        </button>
    );
}

const CAROUSEL_IMG_MAP = {
    stock: {
        Technology:  '../images/stocks-subcategory-technology.jpg',
        Finance:     '../images/stocks-subcategory-finance.jpg',
        Consumer:    '../images/stocks-subcategory-consumer.jpg',
        Healthcare:  '../images/stocks-subcategory-healthcare.jpg',
        Media:       '../images/stocks-subcategory-media.jpg',
        Energy:      '../images/stocks-subcategory-energy.jpg',
        Automotive:  '../images/stocks-subcategory-automotive.jpg',
        Other:       '../images/stocks-subcategory-other.jpg',
    },
    crypto: {
        'Layer 1':  '../images/crypto-subcategory-layer1.jpg',
        'Layer 2':  '../images/crypto-subcategory-layer2.jpg',
        DeFi:       '../images/crypto-subcategory-defi.jpg',
        Exchange:   '../images/crypto-subcategory-exchange.jpg',
        Meme:       '../images/crypto-subcategory-meme.jpg',
    },
    bond: {
        Government: '../images/bonds-category-government.jpg',
        Corporate:  '../images/bonds-category-corporate.jpg',
    },
    commodity: {
        Metals: '../images/commodities-subcategory-metals.jpg',
        Petrol: '../images/commodities-subcategory-petrol.jpg',
        Energy: '../images/commodities-subcategory-energy.jpg',
    },
};

const CAROUSEL_ICON_MAP = {
    stock: {
        Technology:  'bi-cpu',
        Finance:     'bi-bank',
        Consumer:    'bi-cart3',
        Healthcare:  'bi-heart-pulse',
        Media:       'bi-play-circle',
        Energy:      'bi-lightning',
        Automotive:  'bi-car-front',
        Other:       'bi-three-dots',
    },
    crypto: {
        'Layer 1':  'bi-layers',
        'Layer 2':  'bi-stack',
        DeFi:       'bi-currency-exchange',
        Exchange:   'bi-arrow-left-right',
        Meme:       'bi-emoji-laughing',
    },
    bond: {
        Government: 'bi-building',
        Corporate:  'bi-briefcase',
    },
    etf: {
        'Broad Market': 'bi-globe',
        Sector:         'bi-pie-chart',
        'Small Cap':    'bi-graph-up',
        International:  'bi-globe2',
        Thematic:       'bi-lightbulb',
        'Bond ETF':     'bi-shield-check',
    },
    commodity: {
        Metals: 'bi-gem',
        Petrol: 'bi-droplet-half',
        Energy: 'bi-lightning-charge',
    },
};

const STOCK_SECTOR_GROUPS = (() => {
    return SECTORS.filter(s => s !== 'All').map(sec => {
        const items = MOCK_STOCKS.filter(s => s.sector === sec);
        if (!items.length) return null;
        const avg         = items.reduce((sum, s) => sum + s.changePct, 0) / items.length;
        const best        = items.reduce((a, b) => a.changePct > b.changePct ? a : b);
        const worst       = items.reduce((a, b) => a.changePct < b.changePct ? a : b);
        const totalVolume = items.reduce((sum, s) => sum + parseCompact(s.volume), 0);
        const totalCap    = items.reduce((sum, s) => sum + parseCompact(s.cap), 0);
        return { label: sec, count: items.length, avgChangePct: avg, best, worst, totalVolume, totalCap };
    }).filter(Boolean);
})();

const CRYPTO_CATEGORY_GROUPS = (() => {
    return CRYPTO_CATEGORIES.filter(c => c !== 'All').map(cat => {
        const items = MOCK_CRYPTO.filter(c => c.category === cat);
        if (!items.length) return null;
        const avg         = items.reduce((sum, c) => sum + c.changePct, 0) / items.length;
        const best        = items.reduce((a, b) => a.changePct > b.changePct ? a : b);
        const worst       = items.reduce((a, b) => a.changePct < b.changePct ? a : b);
        const totalVolume = items.reduce((sum, c) => sum + parseCompact(c.volume), 0);
        const totalCap    = items.reduce((sum, c) => sum + parseCompact(c.cap), 0);
        return { label: cat, count: items.length, avgChangePct: avg, best, worst, totalVolume, totalCap };
    }).filter(Boolean);
})();

const BOND_TYPE_GROUPS = (() => {
    return BOND_TYPES.filter(t => t !== 'All').map(type => {
        const items = MOCK_BONDS.filter(b => b.type === type && new Date() < new Date(b.maturity));
        if (!items.length) return null;
        const avgYield = items.reduce((sum, b) => sum + b.yield, 0) / items.length;
        const best     = items.reduce((a, b) => a.yield > b.yield ? a : b);
        const worst    = items.reduce((a, b) => a.yield < b.yield ? a : b);
        return { label: type, count: items.length, avgYield, best, worst };
    }).filter(Boolean);
})();

const COMMODITY_CATEGORY_GROUPS = (() => {
    return COMMODITY_CATEGORIES.filter(c => c !== 'All').map(cat => {
        const items = MOCK_COMMODITIES.filter(c => c.category === cat);
        if (!items.length) return null;
        const avg   = items.reduce((sum, c) => sum + c.changePct, 0) / items.length;
        const best  = items.reduce((a, b) => a.changePct > b.changePct ? a : b);
        const worst = items.reduce((a, b) => a.changePct < b.changePct ? a : b);
        return { label: cat, count: items.length, avgChangePct: avg, best, worst };
    }).filter(Boolean);
})();

const ETF_CATEGORY_GROUPS = (() => {
    return ETF_CATEGORIES.filter(c => c !== 'All').map(cat => {
        const items = MOCK_ETFS.filter(e => e.category === cat);
        if (!items.length) return null;
        const avg         = items.reduce((sum, e) => sum + e.changePct, 0) / items.length;
        const best        = items.reduce((a, b) => a.changePct > b.changePct ? a : b);
        const worst       = items.reduce((a, b) => a.changePct < b.changePct ? a : b);
        const totalVolume = items.reduce((sum, e) => sum + parseCompact(e.volume), 0);
        const totalAum    = items.reduce((sum, e) => sum + parseCompact(e.aum), 0);
        return { label: cat, count: items.length, avgChangePct: avg, best, worst, totalVolume, totalAum };
    }).filter(Boolean);
})();

function FilterDropdown({ options, value, onChange, colors }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (!open) return;
        const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);
    const activeColor = colors && colors[value];
    return (
        <div className="filter-dd-wrap" ref={ref}>
            <button className="pf-dd-trigger" onClick={() => setOpen(o => !o)}>
                {activeColor && <span className="pf-dd-color-dot" style={{ background: activeColor }} />}
                <span className="pf-dd-label">{value}</span>
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} pf-dd-chevron`} />
            </button>
            {open && (
                <div className="pf-dd-menu">
                    {options.map(opt => (
                        <button key={opt} className={`pf-dd-option ${value === opt ? 'active' : ''}`}
                            onClick={() => { onChange(opt); setOpen(false); }}>
                            {colors && colors[opt]
                                ? <span className="pf-dd-color-dot" style={{ background: colors[opt] }} />
                                : null}
                            {opt}
                            {value === opt && <i className="bi bi-check2 pf-dd-check" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function MarketSummaryCarousel({ groups, selectedFilter, onSelect, type }) {
    const iconMap    = CAROUSEL_ICON_MAP[type] || {};
    const imgMap     = CAROUSEL_IMG_MAP[type]  || {};
    const totalPages = Math.ceil(groups.length / 3);
    const [page, setPage]     = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const targetPage = (!selectedFilter || selectedFilter === 'All')
            ? 0
            : Math.floor(groups.findIndex(g => g.label === selectedFilter) / 3);
        if (targetPage < 0 || targetPage === page) return;
        setFading(true);
        setTimeout(() => {
            setPage(targetPage);
            setFading(false);
        }, 300);
    }, [selectedFilter]);

    function advance(dir) {
        if (fading) return;
        setFading(true);
        setTimeout(() => {
            setPage(p => (p + dir + totalPages) % totalPages);
            setFading(false);
        }, 300);
    }

    const visibleGroups = groups.slice(page * 3, page * 3 + 3);

    return (
        <div className="asset-carousel-wrap">
            <button className={`carousel-arrow${totalPages <= 1 ? ' carousel-arrow-hidden' : ''}`} onClick={() => advance(-1)}>
                <i className="bi bi-chevron-left"></i>
            </button>
            <div className={`asset-carousel${fading ? ' carousel-fading' : ''}`}>
                {visibleGroups.map((g, i) => (
                    <div
                        key={g.label}
                        className={`summary-card summary-card-type-${type}${selectedFilter === g.label ? ' summary-card-active' : ''}${imgMap[g.label] ? ' summary-card-has-bg' : ' summary-card-has-icon'}`}
                        onClick={() => onSelect(selectedFilter === g.label ? 'All' : g.label)}
                    >
                        {imgMap[g.label] ? (
                            <div className="summary-card-img" style={{ backgroundImage: `url(${imgMap[g.label]})` }}></div>
                        ) : (
                            <div className="summary-card-icon-hero">
                                <i className={`bi ${iconMap[g.label] || 'bi-circle'}`}></i>
                            </div>
                        )}
                        <div className="summary-card-header">
                            <span className="summary-card-label">{g.label}</span>
                            <span className="summary-card-count">{g.count}</span>
                        </div>
                        <div className="summary-card-body">
                        <div className="summary-card-stats">
                            {type === 'bond' ? (
                                <>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Avg yield</span>
                                        <div className="summary-stat-right">
                                            <span className="summary-stat-sym"></span>
                                            <span className="positive summary-stat-val">{fmt(g.avgYield)}%</span>
                                        </div>
                                    </div>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Highest</span>
                                        <div className="summary-stat-right">
                                            <span className="summary-stat-sym">{g.best.symbol}</span>
                                            <span className="positive summary-stat-val">{fmt(g.best.yield)}%</span>
                                        </div>
                                    </div>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Lowest</span>
                                        <div className="summary-stat-right">
                                            <span className="summary-stat-sym">{g.worst.symbol}</span>
                                            <span className="positive summary-stat-val">{fmt(g.worst.yield)}%</span>
                                        </div>
                                    </div>
                                </>
                            ) : type === 'commodity' ? (
                                <>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Avg return</span>
                                        <div className="summary-stat-right">
                                            <span className="summary-stat-sym"></span>
                                            <span className={`${pnlCls(g.avgChangePct)} summary-stat-val`}>
                                                {g.avgChangePct >= 0 ? '+' : ''}{fmt(g.avgChangePct)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Best</span>
                                        <div className="summary-stat-right">
                                            <span className="summary-stat-sym">{g.best.symbol}</span>
                                            <span className={`${pnlCls(g.best.changePct)} summary-stat-val`}>
                                                {g.best.changePct >= 0 ? '+' : ''}{fmt(g.best.changePct)}%
                                            </span>
                                        </div>
                                    </div>
                                    {g.worst.symbol !== g.best.symbol && (
                                        <div className="summary-stat-row">
                                            <span className="summary-stat-label">Worst</span>
                                            <div className="summary-stat-right">
                                                <span className="summary-stat-sym">{g.worst.symbol}</span>
                                                <span className={`${pnlCls(g.worst.changePct)} summary-stat-val`}>
                                                    {g.worst.changePct >= 0 ? '+' : ''}{fmt(g.worst.changePct)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Avg return</span>
                                        <span className={`${pnlCls(g.avgChangePct)} summary-stat-val`}>
                                            {g.avgChangePct >= 0 ? '+' : ''}{fmt(g.avgChangePct)}%
                                        </span>
                                    </div>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">Volume</span>
                                        <span className="summary-stat-val">{fmtCompact(g.totalVolume)}</span>
                                    </div>
                                    <div className="summary-stat-row">
                                        <span className="summary-stat-label">{type === 'etf' ? 'AUM' : 'Market Cap'}</span>
                                        <span className="summary-stat-val">{fmtCompact(type === 'etf' ? g.totalAum : g.totalCap)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className={`carousel-arrow${totalPages <= 1 ? ' carousel-arrow-hidden' : ''}`} onClick={() => advance(1)}>
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
}

function StocksSection({ holdings, onTrade, watchlist, onWatchlistToggle, isGuest = false, onGuestGate }) {
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('All');
    const [page, setPage]     = useState(1);
    const owned = new Set(holdings.map(h => h.symbol));

    const filtered = MOCK_STOCKS.filter(s =>
        (sector === 'All' || s.sector === sector) &&
        (s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    );
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [search, sector]);

    return (
        <div className="section-content">
            <div className="stocks-toolbar">
                <div className="search-wrap">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search stocks…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="sector-pills">
                    {SECTORS.map(s => (
                        <button key={s} className={`sector-pill ${sector === s ? 'active' : ''}`} onClick={() => setSector(s)}>{s}</button>
                    ))}
                </div>
                <FilterDropdown options={SECTORS} value={sector} onChange={setSector} />
            </div>

            <MarketSummaryCarousel groups={STOCK_SECTOR_GROUPS} selectedFilter={sector} onSelect={setSector} type="stock" />

            <div className="card-panel">
                <table className="data-table market-table stocks-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Sector</th>
                            <th>Price</th>
                            <th>Return</th>
                            <th>Volume</th>
                            <th>Market cap</th>
                            {!isGuest && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(s => (
                            <tr key={s.symbol} className={`${owned.has(s.symbol) ? 'owned-row' : ''} clickable-row`} onClick={() => isGuest ? onGuestGate() : window.location.href = `stock.html?symbol=${s.symbol}`}>
                                <td>
                                    <div className="symbol-cell-row">
                                        <span className="symbol-badge">{s.symbol}</span>
                                        {owned.has(s.symbol) && <span className="owned-dot" title="In portfolio"></span>}
                                    </div>
                                </td>
                                <td><div className="company-cell">{s.name}</div></td>
                                <td><span className="sector-tag">{s.sector}</span></td>
                                <td>${fmt(s.price)}</td>
                                <td className={pnlCls(s.changePct)}>{s.changePct >= 0 ? '+' : ''}{fmt(s.changePct)}%</td>
                                <td className="muted-cell">{s.volume}</td>
                                <td className="muted-cell">{s.cap}</td>
                                {!isGuest && (
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-trade buy" onClick={e => { e.stopPropagation(); onTrade({ symbol: s.symbol, name: s.name, price: s.price, side: 'buy', unitLabel: 'share', assetType: 'stock' }); }}>Trade</button>
                                            <WatchlistBtn symbol={s.symbol} type="stock" watchlist={watchlist} onToggle={onWatchlistToggle} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isGuest ? 7 : 8} className="empty-cell">No stocks found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>
        </div>
    );
}

function CryptoSection({ onTrade, watchlist, onWatchlistToggle, cryptoRaw = [], isGuest = false, onGuestGate }) {
    const [search, setSearch]     = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage]         = useState(1);
    const ownedCrypto = new Set(cryptoRaw.map(h => h.symbol));

    const filtered = MOCK_CRYPTO.filter(c =>
        (category === 'All' || c.category === category) &&
        (c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()))
    );
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [search, category]);

    return (
        <div className="section-content">
            <div className="stocks-toolbar">
                <div className="search-wrap">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search crypto…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="sector-pills">
                    {CRYPTO_CATEGORIES.map(cat => (
                        <button key={cat} className={`sector-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
                    ))}
                </div>
                <FilterDropdown options={CRYPTO_CATEGORIES} value={category} onChange={setCategory} />
            </div>

            <MarketSummaryCarousel groups={CRYPTO_CATEGORY_GROUPS} selectedFilter={category} onSelect={setCategory} type="crypto" />

            <div className="card-panel">
                <table className="data-table market-table crypto-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Return</th>
                            <th>Volume</th>
                            <th>Market cap</th>
                            {!isGuest && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(c => (
                            <tr key={c.symbol} className={`${ownedCrypto.has(c.symbol) ? 'owned-row' : ''} clickable-row`} onClick={() => isGuest ? onGuestGate() : window.location.href = `crypto.html?symbol=${c.symbol}`}>
                                <td>
                                    <div className="symbol-cell-row">
                                        <span className="symbol-badge">{c.symbol}</span>
                                        {ownedCrypto.has(c.symbol) && <span className="owned-dot" title="In portfolio"></span>}
                                    </div>
                                </td>
                                <td>{c.name}</td>
                                <td><span className="sector-tag">{c.category}</span></td>
                                <td>${fmt(c.price)}</td>
                                <td className={pnlCls(c.changePct)}>{c.changePct >= 0 ? '+' : ''}{fmt(c.changePct)}%</td>
                                <td className="muted-cell">{c.volume}</td>
                                <td className="muted-cell">{c.cap}</td>
                                {!isGuest && (
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-trade buy" onClick={e => { e.stopPropagation(); onTrade({ symbol: c.symbol, name: c.name, price: c.price, side: 'buy', assetType: 'crypto' }); }}>Trade</button>
                                            <WatchlistBtn symbol={c.symbol} type="crypto" watchlist={watchlist} onToggle={onWatchlistToggle} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isGuest ? 7 : 8} className="empty-cell">No results found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>
        </div>
    );
}

function BondsSection({ cash, watchlist, onWatchlistToggle, onBondTradeConfirm, bondsRaw = [], isGuest = false, onGuestGate }) {
    const [search,     setSearch]     = useState('');
    const [type,       setType]       = useState('All');
    const [bondTarget, setBondTarget] = useState(null);
    const [page, setPage]             = useState(1);
    const ownedBonds = new Set(bondsRaw.map(h => h.symbol));

    const filtered = MOCK_BONDS.filter(b =>
        new Date() < new Date(b.maturity) &&
        (type === 'All' || b.type === type) &&
        (b.symbol.toLowerCase().includes(search.toLowerCase()) || b.issuer.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => {
        const typeOrder = { 'Government': 0, 'Corporate': 1 };
        const typeDiff = (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
        if (typeDiff !== 0) return typeDiff;
        const ratingOrder = { 'AAA': 0, 'AA+': 1, 'AA': 2, 'AA-': 3, 'A+': 4, 'A': 5, 'A-': 6, 'BBB+': 7, 'BBB': 8, 'BBB-': 9 };
        return (ratingOrder[a.rating] ?? 99) - (ratingOrder[b.rating] ?? 99);
    });
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [search, type]);

    function ratingColor(r) {
        if (r === 'AAA' || r === 'AA+') return 'positive';
        if (r === 'AA' || r === 'A+')   return 'neutral';
        return 'negative';
    }

    return (
        <div className="section-content">
            <div className="stocks-toolbar">
                <div className="search-wrap">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search bonds…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="sector-pills">
                    {BOND_TYPES.map(t => (
                        <button key={t} className={`sector-pill ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
                    ))}
                </div>
                <FilterDropdown options={BOND_TYPES} value={type} onChange={setType} />
            </div>

            <MarketSummaryCarousel groups={BOND_TYPE_GROUPS} selectedFilter={type} onSelect={setType} type="bond" />

            <div className="card-panel">
                <table className="data-table bonds-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Issuer</th>
                            <th>Type</th>
                            <th>Maturity</th>
                            <th>Yield</th>
                            <th>Price</th>
                            <th>Rating</th>
                            {!isGuest && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(b => (
                            <tr key={b.symbol} className={`${ownedBonds.has(b.symbol) ? 'owned-row' : ''} clickable-row`} onClick={() => isGuest ? onGuestGate() : window.location.href = `bonds.html?symbol=${b.symbol}`}>
                                <td>
                                    <div className="symbol-cell-row">
                                        <span className="symbol-badge">{b.symbol}</span>
                                        {ownedBonds.has(b.symbol) && <span className="owned-dot" title="In portfolio"></span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="issuer-cell">
                                        {BOND_FLAG[b.symbol] && (
                                            <img src={`https://flagcdn.com/${BOND_FLAG[b.symbol]}.svg`} alt="" className="bond-flag-sm" />
                                        )}
                                        {b.issuer}
                                    </div>
                                </td>
                                <td><span className="sector-tag">{b.type}</span></td>
                                <td className="muted-cell">{b.maturity}</td>
                                <td className="positive">{fmt(b.yield)}%</td>
                                <td>${fmt(b.price)}</td>
                                <td><span className={`rating-badge ${ratingColor(b.rating)}`}>{b.rating}</span></td>
                                {!isGuest && (
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-trade buy" onClick={e => { e.stopPropagation(); setBondTarget({ symbol: b.symbol, name: b.issuer, price: b.price }); }}>Buy</button>
                                            <WatchlistBtn symbol={b.symbol} type="bond" watchlist={watchlist} onToggle={onWatchlistToggle} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isGuest ? 7 : 8} className="empty-cell">No results found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>

            {bondTarget && (
                <BondTradeModal target={bondTarget} cash={cash} onClose={() => setBondTarget(null)} onConfirm={qty => { if (onBondTradeConfirm) onBondTradeConfirm(bondTarget, qty); }} />
            )}
        </div>
    );
}

function ETFSection({ onETFTrade, watchlist, onWatchlistToggle, etfsRaw = [], isGuest = false, onGuestGate }) {
    const [search, setSearch]     = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage]         = useState(1);
    const ownedEtfs = new Set(etfsRaw.map(h => h.symbol));

    const filtered = MOCK_ETFS.filter(e =>
        (category === 'All' || e.category === category) &&
        (e.symbol.toLowerCase().includes(search.toLowerCase()) || e.name.toLowerCase().includes(search.toLowerCase()))
    );
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [search, category]);

    return (
        <div className="section-content">
            <div className="stocks-toolbar">
                <div className="search-wrap">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search ETFs…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="sector-pills">
                    {ETF_CATEGORIES.map(cat => (
                        <button key={cat} className={`sector-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
                    ))}
                </div>
                <FilterDropdown options={ETF_CATEGORIES} value={category} onChange={setCategory} />
            </div>

            <MarketSummaryCarousel groups={ETF_CATEGORY_GROUPS} selectedFilter={category} onSelect={setCategory} type="etf" />

            <div className="card-panel">
                <table className="data-table etf-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Return</th>
                            <th>Volume</th>
                            <th>AUM</th>
                            {!isGuest && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(e => (
                            <tr key={e.symbol} className={`${ownedEtfs.has(e.symbol) ? 'owned-row' : ''} clickable-row`} onClick={() => isGuest ? onGuestGate() : window.location.href = `etf.html?symbol=${e.symbol}`}>
                                <td>
                                    <div className="symbol-cell-row">
                                        <span className="symbol-badge">{e.symbol}</span>
                                        {ownedEtfs.has(e.symbol) && <span className="owned-dot" title="In portfolio"></span>}
                                    </div>
                                </td>
                                <td>{e.name}</td>
                                <td><span className="sector-tag">{e.category}</span></td>
                                <td>${fmt(e.price)}</td>
                                <td className={pnlCls(e.change)}>{e.change >= 0 ? '+' : ''}{fmt(e.change)}</td>
                                <td className={pnlCls(e.changePct)}>{e.changePct >= 0 ? '+' : ''}{fmt(e.changePct)}%</td>
                                <td className="muted-cell">{e.volume}</td>
                                <td className="muted-cell">{e.aum}</td>
                                {!isGuest && (
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-trade buy" onClick={ev => { ev.stopPropagation(); onETFTrade({ symbol: e.symbol, name: e.name, price: e.price }); }}>Trade</button>
                                            <WatchlistBtn symbol={e.symbol} type="etf" watchlist={watchlist} onToggle={onWatchlistToggle} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isGuest ? 8 : 9} className="empty-cell">No results found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>
        </div>
    );
}

function CommoditiesSection({ onTrade, watchlist, onWatchlistToggle, commoditiesRaw = [], isGuest = false, onGuestGate }) {
    const [search, setSearch]       = useState('');
    const [category, setCategory]   = useState('All');
    const [page, setPage]           = useState(1);
    const ownedCommodities = new Set(commoditiesRaw.map(h => h.symbol));

    const filtered = MOCK_COMMODITIES.filter(c =>
        (category === 'All' || c.category === category) &&
        (c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()))
    );
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [search, category]);

    return (
        <div className="section-content">
            <div className="stocks-toolbar">
                <div className="search-wrap">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search commodities…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="sector-pills">
                    {COMMODITY_CATEGORIES.map(cat => (
                        <button key={cat} className={`sector-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
                    ))}
                </div>
                <FilterDropdown options={COMMODITY_CATEGORIES} value={category} onChange={setCategory} />
            </div>

            <MarketSummaryCarousel groups={COMMODITY_CATEGORY_GROUPS} selectedFilter={category} onSelect={setCategory} type="commodity" />

            <div className="card-panel">
                <table className="data-table commodity-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Return</th>
                            <th>Unit</th>
                            <th>Exchange</th>
                            {!isGuest && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(c => (
                            <tr key={c.symbol} className={`${ownedCommodities.has(c.symbol) ? 'owned-row' : ''} clickable-row`} onClick={() => isGuest ? onGuestGate() : window.location.href = `commodity.html?symbol=${c.symbol}`}>
                                <td>
                                    <div className="symbol-cell-row">
                                        <span className="symbol-badge">{c.symbol}</span>
                                        {ownedCommodities.has(c.symbol) && <span className="owned-dot" title="In portfolio"></span>}
                                    </div>
                                </td>
                                <td>{c.name}</td>
                                <td><span className="sector-tag">{c.category}</span></td>
                                <td>${fmt(c.price)}</td>
                                <td className={pnlCls(c.change)}>{c.change >= 0 ? '+' : ''}{fmt(c.change)}</td>
                                <td className={pnlCls(c.changePct)}>{c.changePct >= 0 ? '+' : ''}{fmt(c.changePct)}%</td>
                                <td className="muted-cell">{c.unit}</td>
                                <td className="muted-cell">{c.exchange}</td>
                                {!isGuest && (
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-trade buy" onClick={e => { e.stopPropagation(); onTrade({ symbol: c.symbol, name: c.name, price: c.price, side: 'buy', assetType: 'commodity' }); }}>Trade</button>
                                            <WatchlistBtn symbol={c.symbol} type="commodity" watchlist={watchlist} onToggle={onWatchlistToggle} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isGuest ? 8 : 9} className="empty-cell">No results found.</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
            </div>
        </div>
    );
}

const TX_COLORS = { BUY: '#3b82f6', SELL: '#f0b429', DEPOSIT: '#00c896', WITHDRAW: '#e05252', EXCHANGE: '#8b5cf6' };

function TxBreakdownPanel({ transactions }) {
    const [hov, setHov] = useState(null);
    const types = ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAW'];
    const total = transactions.length;

    const stats = types.map(type => {
        const txs = transactions.filter(tx => tx.type === type);
        return { type, count: txs.length, volume: txs.reduce((s, tx) => s + tx.total, 0) };
    });

    const buyCounts = {};
    transactions.forEach(tx => { if (tx.type === 'BUY' && tx.symbol) buyCounts[tx.symbol] = (buyCounts[tx.symbol] || 0) + 1; });
    const topBuys = Object.entries(buyCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

    const totalTraded   = transactions.filter(tx => tx.type === 'BUY' || tx.type === 'SELL').reduce((s, tx) => s + tx.total, 0);
    const totalDeposited = transactions.filter(tx => tx.type === 'DEPOSIT').reduce((s, tx) => s + tx.total, 0);

    return (
        <div className="tx-sidebar">
            <div className="card-panel tx-sidebar-card">
                <div className="tx-sidebar-title">Overview</div>
                <div className="tx-overview-stats">
                    <div className="tx-ov-item">
                        <span className="tx-ov-label">Total transactions</span>
                        <span className="tx-ov-value">{total}</span>
                    </div>
                    <div className="tx-ov-item">
                        <span className="tx-ov-label">Volume traded</span>
                        <span className="tx-ov-value">{fmtUSD(totalTraded)}</span>
                    </div>
                    <div className="tx-ov-item">
                        <span className="tx-ov-label">Total deposited</span>
                        <span className="tx-ov-value positive">{fmtUSD(totalDeposited)}</span>
                    </div>
                    <div className="tx-ov-item">
                        <span className="tx-ov-label">Commission</span>
                        <span className="tx-ov-value">$0.00</span>
                    </div>
                </div>

                <div className="tx-sidebar-sep"></div>
                <div className="tx-sidebar-title">Breakdown</div>

                {(() => {
                    const r = 44, sw = 10, cx = 50, cy = 50;
                    const circ = 2 * Math.PI * r;
                    let cumulative = 0;
                    const segments = stats.map(s => {
                        const len = total > 0 ? (s.count / total) * circ : 0;
                        const startLen = cumulative;
                        cumulative += len;
                        return { ...s, len, startLen, pct: total > 0 ? (s.count / total) * 100 : 0 };
                    });
                    return (
                        <div className="tx-breakdown-layout">
                            <div className="tx-donut-wrap">
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
                                    {segments.filter(s => s.len > 0).map(s => (
                                        <g key={s.type}>
                                            <circle
                                                cx={cx} cy={cy} r={r} fill="none"
                                                stroke={TX_COLORS[s.type]}
                                                strokeWidth={hov === s.type ? sw + 4 : sw}
                                                strokeLinecap="butt"
                                                strokeDasharray={`${s.len} ${circ - s.len}`}
                                                strokeDashoffset={-s.startLen}
                                                transform={`rotate(-90 ${cx} ${cy})`}
                                                style={{ transition: 'stroke-width 0.15s, opacity 0.15s', opacity: hov && hov !== s.type ? 0.3 : 1 }}
                                            />
                                            <circle
                                                cx={cx} cy={cy} r={r} fill="none" stroke="transparent"
                                                strokeWidth={sw + 14}
                                                strokeDasharray={`${s.len} ${circ - s.len}`}
                                                strokeDashoffset={-s.startLen}
                                                transform={`rotate(-90 ${cx} ${cy})`}
                                                style={{ cursor: 'pointer' }}
                                                onMouseEnter={() => setHov(s.type)}
                                                onMouseLeave={() => setHov(null)}
                                            />
                                        </g>
                                    ))}
                                </svg>
                                <div className="tx-donut-center">
                                    <span className="tx-donut-center-total">{total}</span>
                                    <span className="tx-donut-center-sub">total</span>
                                </div>
                            </div>

                            <div className="tx-donut-legend">
                                {segments.map(s => (
                                    <div key={s.type}
                                        className={`tx-donut-legend-item ${hov === s.type ? 'active' : ''}`}
                                        onMouseEnter={() => setHov(s.type)}
                                        onMouseLeave={() => setHov(null)}>
                                        <span className="tx-legend-dot-wrap">
                                            <span className="tx-legend-dot" style={{ background: TX_COLORS[s.type] }}></span>
                                            {hov === s.type && (
                                                <div className="tx-legend-tooltip">
                                                    <div className="tx-legend-tooltip-row">
                                                        <span className="tx-legend-tooltip-label">Share</span>
                                                        <span className="tx-legend-tooltip-pct" style={{ color: TX_COLORS[s.type] }}>{Math.round(s.pct)}%</span>
                                                    </div>
                                                    <div className="tx-legend-tooltip-row">
                                                        <span className="tx-legend-tooltip-label">Count</span>
                                                        <span className="tx-legend-tooltip-count">{s.count} transaction{s.count !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="tx-legend-tooltip-row">
                                                        <span className="tx-legend-tooltip-label">Volume</span>
                                                        <span className="tx-legend-tooltip-vol">{fmtUSD(s.volume)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                        <span className="tx-legend-type">{s.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {topBuys.length > 0 && (
                    <>
                        <div className="tx-sidebar-sep"></div>
                        <div className="tx-sidebar-title">Most bought</div>
                        <div className="tx-top-buys">
                            {topBuys.map(([symbol, count], i) => (
                                <div key={symbol} className="tx-top-buy-row">
                                    <span className="tx-top-buy-rank">{i + 1}</span>
                                    <span className="symbol-badge">{symbol}</span>
                                    <span className="tx-top-symbol-count">{count} transaction{count > 1 ? 's' : ''}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function TransactionsSection({ transactions }) {
    const [filter, setFilter]     = useState('ALL');
    const [txDetail, setTxDetail] = useState(null);
    const [page, setPage]         = useState(1);
    const types = ['ALL', 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAW'];
    const filtered = transactions.filter(tx => filter === 'ALL' || tx.type === filter);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => setPage(1), [filter]);

    return (
        <div className="section-content">
            <div className="tx-filters">
                {types.map(t => (
                    <button key={t} className={`sector-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
                ))}
                <FilterDropdown options={types} value={filter} onChange={setFilter} />
            </div>

            <div className="tx-layout">
                <div className="tx-main-col">
                    <div className="card-panel">
                        <table className="data-table tx-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Symbol</th>
                                    <th>Units</th>
                                    <th>Price / unit</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map(tx => (
                                    <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => setTxDetail(tx)}>
                                        <td className="muted-cell">{tx.date}</td>
                                        <td><span className={`tx-badge tx-${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                                        <td>{tx.symbol ?? '—'}</td>
                                        <td>{tx.qty != null ? fmt(tx.qty) : '—'}</td>
                                        <td>{tx.price ? `$${fmt(tx.price)}` : '—'}</td>
                                        <td className={TX_TYPE_CONFIG[tx.type]?.amountCls || ''}>
                                            {TX_TYPE_CONFIG[tx.type]?.amountSign}{fmtUSD(tx.total)}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="empty-cell">No transactions found.</td></tr>
                                )}
                                {Array.from({ length: PAGE_SIZE - paged.length }).map((_, i) => (
                                    <tr key={`ph-${i}`} className="table-row-placeholder"><td colSpan={6}></td></tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination page={page} total={filtered.length} onChange={setPage} />
                    </div>
                </div>

                <TxBreakdownPanel transactions={transactions} />
            </div>

            {txDetail && <TransactionDetailModal tx={txDetail} onClose={() => setTxDetail(null)} />}
        </div>
    );
}

const EXCHANGE_RATES = [
    { from: 'USD', to: 'EUR', rate: 0.9182, flag: 'eu', change: -0.12, name: 'Euro'                  },
    { from: 'USD', to: 'RON', rate: 4.5830, flag: 'ro', change: +0.08, name: 'Romanian Leu'          },
    { from: 'USD', to: 'GBP', rate: 0.7894, flag: 'gb', change: +0.21, name: 'British Pound'         },
    { from: 'USD', to: 'CHF', rate: 0.8971, flag: 'ch', change: -0.15, name: 'Swiss Franc'           },
    { from: 'USD', to: 'JPY', rate: 149.62, flag: 'jp', change: +0.34, name: 'Japanese Yen'          },
    { from: 'USD', to: 'CAD', rate: 1.3641, flag: 'ca', change: -0.09, name: 'Canadian Dollar'       },
    { from: 'USD', to: 'AUD', rate: 1.5283, flag: 'au', change: +0.18, name: 'Australian Dollar'     },
    { from: 'USD', to: 'SEK', rate: 10.412, flag: 'se', change: -0.22, name: 'Swedish Krona'         },
    { from: 'USD', to: 'NOK', rate: 10.581, flag: 'no', change: +0.11, name: 'Norwegian Krone'       },
    { from: 'USD', to: 'DKK', rate: 6.8540, flag: 'dk', change: -0.08, name: 'Danish Krone'          },
    { from: 'USD', to: 'HUF', rate: 357.40, flag: 'hu', change: +0.47, name: 'Hungarian Forint'      },
    { from: 'USD', to: 'PLN', rate: 3.9620, flag: 'pl', change: -0.19, name: 'Polish Zloty'          },
    { from: 'USD', to: 'NZD', rate: 1.6320, flag: 'nz', change: +0.14, name: 'New Zealand Dollar'    },
    { from: 'USD', to: 'SGD', rate: 1.3412, flag: 'sg', change: -0.07, name: 'Singapore Dollar'      },
    { from: 'USD', to: 'HKD', rate: 7.8231, flag: 'hk', change: +0.02, name: 'Hong Kong Dollar'      },
    { from: 'USD', to: 'CNY', rate: 7.2415, flag: 'cn', change: -0.31, name: 'Chinese Yuan'          },
    { from: 'USD', to: 'INR', rate: 83.412, flag: 'in', change: +0.18, name: 'Indian Rupee'          },
    { from: 'USD', to: 'BRL', rate: 4.9720, flag: 'br', change: -0.43, name: 'Brazilian Real'        },
    { from: 'USD', to: 'MXN', rate: 17.052, flag: 'mx', change: +0.29, name: 'Mexican Peso'          },
    { from: 'USD', to: 'ZAR', rate: 18.614, flag: 'za', change: -0.52, name: 'South African Rand'    },
    { from: 'USD', to: 'TRY', rate: 32.180, flag: 'tr', change: -0.88, name: 'Turkish Lira'          },
    { from: 'USD', to: 'KRW', rate: 1325.4, flag: 'kr', change: +0.22, name: 'South Korean Won'      },
    { from: 'USD', to: 'THB', rate: 35.420, flag: 'th', change: -0.16, name: 'Thai Baht'             },
    { from: 'USD', to: 'MYR', rate: 4.7120, flag: 'my', change: +0.08, name: 'Malaysian Ringgit'     },
    { from: 'USD', to: 'IDR', rate: 15842.,  flag: 'id', change: -0.27, name: 'Indonesian Rupiah'    },
    { from: 'USD', to: 'PHP', rate: 56.340, flag: 'ph', change: +0.11, name: 'Philippine Peso'       },
    { from: 'USD', to: 'CZK', rate: 23.180, flag: 'cz', change: -0.14, name: 'Czech Koruna'          },
    { from: 'USD', to: 'ILS', rate: 3.7420, flag: 'il', change: -0.33, name: 'Israeli Shekel'        },
    { from: 'USD', to: 'AED', rate: 3.6725, flag: 'ae', change:  0.00, name: 'UAE Dirham'            },
    { from: 'USD', to: 'SAR', rate: 3.7500, flag: 'sa', change:  0.00, name: 'Saudi Riyal'           },
    { from: 'USD', to: 'QAR', rate: 3.6410, flag: 'qa', change: +0.01, name: 'Qatari Riyal'          },
    { from: 'USD', to: 'KWD', rate: 0.3072, flag: 'kw', change: +0.00, name: 'Kuwaiti Dinar'          },
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

function CurrencySelect({ value, onChange }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="ccy-select" ref={ref}>
            <button type="button" className="ccy-select-btn" onClick={() => setOpen(o => !o)}>
                <img src={`https://flagcdn.com/${CCY_FLAG[value]}.svg`} className="ccy-flag" alt="" />
                <span className="ccy-code">{value}</span>
                <i className="bi bi-chevron-down ccy-chevron"></i>
            </button>
            {open && (
                <div className="ccy-dropdown">
                    {ALL_CURRENCIES.map(c => (
                        <div key={c} className={`ccy-option ${c === value ? 'active' : ''}`} onClick={() => { onChange(c); setOpen(false); }}>
                            <img src={`https://flagcdn.com/${CCY_FLAG[c]}.svg`} className="ccy-flag" alt="" />
                            <span className="ccy-code">{c}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const RATE_MAP = {};
EXCHANGE_RATES.forEach(r => { RATE_MAP[`${r.from}_${r.to}`] = r.rate; RATE_MAP[`${r.to}_${r.from}`] = 1 / r.rate; });
ALL_CURRENCIES.forEach(c => { RATE_MAP[`${c}_${c}`] = 1; });

function getRate(from, to) {
    if (from === to) return 1;
    if (RATE_MAP[`${from}_${to}`]) return RATE_MAP[`${from}_${to}`];
    if (RATE_MAP[`USD_${to}`] && RATE_MAP[`USD_${from}`]) return RATE_MAP[`USD_${to}`] / RATE_MAP[`USD_${from}`];
    return null;
}

function fmt4(n) { return isNaN(n) || !isFinite(n) ? '' : (+n.toFixed(4)).toString(); }

function ConvertConfirmModal({ fromVal, toVal, fromCcy, toCcy, rateLabel, onClose }) {
    const [confirming, setConfirming] = useState(false);
    const [done, setDone] = useState(false);

    function confirm() {
        setConfirming(true);
        setTimeout(() => { setConfirming(false); setDone(true); }, 1200);
        setTimeout(onClose, 2800);
    }

    const fmtAmt = (v, ccy) => {
        const n = Number(v);
        return isNaN(n) ? v : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' ' + ccy;
    };

    if (done) return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-success">
                    <i className="bi bi-check-circle-fill trade-success-icon"></i>
                    <div className="trade-success-title">Exchange Successful</div>
                    <div className="trade-success-sub">{fmtAmt(fromVal, fromCcy)} → {fmtAmt(toVal, toCcy)}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <span className="trade-modal-title">Confirm Exchange</span>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="exchange-modal-summary">
                    <div className="exchange-modal-amount-row">
                        <div className="exchange-modal-side">
                            <div className="exchange-modal-side-label">You Send</div>
                            <div className="exchange-modal-side-val">{fmtAmt(fromVal, fromCcy)}</div>
                        </div>
                        <i className="bi bi-arrow-right exchange-modal-arrow"></i>
                        <div className="exchange-modal-side">
                            <div className="exchange-modal-side-label">You Receive</div>
                            <div className="exchange-modal-side-val exchange-modal-to-val">{fmtAmt(toVal, toCcy)}</div>
                        </div>
                    </div>
                    <div className="exchange-modal-info">
                        <div className="trade-info-row">
                            <span className="trade-info-label">Rate</span>
                            <span className="trade-info-val">{rateLabel}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Commission</span>
                            <span className="trade-info-val">$0.00</span>
                        </div>
                    </div>
                </div>
                <div className="trade-modal-actions">
                    <button className="trade-btn-cancel" onClick={onClose} disabled={confirming}>Cancel</button>
                    <button className="trade-btn-confirm" onClick={confirm} disabled={confirming}>
                        {confirming
                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                            : 'Confirm Exchange'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

function ExchangeSection({ onGuestGate }) {
    const defaultCcy = localStorage.getItem('preferredCurrency') || 'USD';
    const defaultTo  = defaultCcy === 'USD' ? 'EUR' : 'USD';
    const [fromCcy, setFrom]                   = useState(defaultCcy);
    const [toCcy, setTo]                       = useState(defaultTo);
    const [fromVal, setFromVal]                = useState('1');
    const [toVal, setToVal]                    = useState(() => fmt4(getRate(defaultCcy, defaultTo) || 0));
    const [swapping, setSwapping]   = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [ratePage, setRatePage]   = useState(0);
    const RATE_PS = window.innerWidth <= 768 ? 8 : 16;
    const lastEdited  = React.useRef('from');
    const skipEffect  = React.useRef(false);

    const rate         = getRate(fromCcy, toCcy);
    const rateLabel    = rate !== null ? `1 ${fromCcy} = ${rate.toFixed(4)} ${toCcy}` : '—';
    const inverseLabel = rate !== null ? `1 ${toCcy} = ${(1 / rate).toFixed(4)} ${fromCcy}` : '—';

    React.useEffect(() => {
        if (skipEffect.current) { skipEffect.current = false; return; }
        const r = getRate(fromCcy, toCcy);
        if (!r) { setToVal(''); return; }
        if (lastEdited.current === 'from' && fromVal !== '') {
            const v = Number(fromVal);
            if (!isNaN(v) && v >= 0) setToVal(fmt4(v * r));
        } else if (lastEdited.current === 'to' && toVal !== '') {
            const v = Number(toVal);
            if (!isNaN(v) && v > 0) setFromVal(fmt4(v / r));
        }
    }, [fromCcy, toCcy]);

    function validateExchangeInput(val) {
        if (val.length > 12) return false;
        if (!/^[0-9]*\.?[0-9]*$/.test(val)) return false;
        if (/^0[0-9]/.test(val)) return false;
        const parts = val.split('.');
        if (parts.length > 1 && parts[1].length > 5) return false;
        return true;
    }

    function handleFromChange(e) {
        const v = e.target.value;
        if (!validateExchangeInput(v)) return;
        lastEdited.current = 'from';
        setFromVal(v);
        const num = Number(v);
        if (rate !== null && v !== '' && num >= 0) setToVal(fmt4(num * rate));
        else setToVal('');
    }

    function handleToChange(e) {
        const v = e.target.value;
        if (!validateExchangeInput(v)) return;
        lastEdited.current = 'to';
        setToVal(v);
        const num = Number(v);
        if (rate !== null && v !== '' && num > 0) setFromVal(fmt4(num / rate));
        else setFromVal('');
    }

    function swap() {
        setSwapping(true);
        setTimeout(() => setSwapping(false), 420);
        skipEffect.current = true;
        setFrom(toCcy);
        setTo(fromCcy);
        setFromVal(toVal || '');
        setToVal(fromVal || '');
        lastEdited.current = lastEdited.current === 'from' ? 'to' : 'from';
    }

    const canConvert = rate !== null && Number(fromVal) > 0 && Number(toVal) > 0;

    return (
        <div className="section-content">
            <div className="exchange-layout">
                <div className="exchange-converter-col">
                    <div className="exchange-main-card">
                        <div className="exchange-card-body">
                            <div className="exchange-live-badge">
                                <span className="exchange-live-dot"></span>
                                Live Rates
                            </div>

                            <div className="exchange-field">
                                <div className="exchange-field-label">You Send</div>
                                <div className="exchange-field-body">
                                    <input
                                        type="number"
                                        className="exchange-amount-input"
                                        value={fromVal}
                                        min="0"
                                        step="any"
                                        onChange={handleFromChange}
                                    />
                                    <CurrencySelect value={fromCcy} onChange={setFrom} />
                                </div>
                            </div>

                            <div className="exchange-swap-row">
                                <div className="exchange-swap-line"></div>
                                <button type="button" className={`exchange-swap-center${swapping ? ' swapping' : ''}`} onClick={swap}>
                                    <i className="bi bi-arrow-down-up"></i>
                                </button>
                                <div className="exchange-swap-line"></div>
                            </div>

                            <div className="exchange-field exchange-field-receive">
                                <div className="exchange-field-label">You Receive</div>
                                <div className="exchange-field-body">
                                    <input
                                        type="number"
                                        className="exchange-amount-input"
                                        value={toVal}
                                        min="0"
                                        step="any"
                                        placeholder="0"
                                        onChange={handleToChange}
                                    />
                                    <CurrencySelect value={toCcy} onChange={setTo} />
                                </div>
                            </div>

                            <div className="exchange-rate-bar">
                                <i className="bi bi-info-circle exchange-rate-info-icon"></i>
                                <span className="exchange-rate-text">{rateLabel}</span>
                                <span className="exchange-rate-sep">·</span>
                                <span className="exchange-rate-text">{inverseLabel}</span>
                                <span className="exchange-commission">
                                    <i className="bi bi-check-circle-fill"></i> No commission
                                </span>
                            </div>

                            <button
                                type="button"
                                className={`exchange-convert-btn${onGuestGate ? ' exchange-convert-locked' : ''}`}
                                disabled={onGuestGate ? true : !canConvert}
                            >
                                {onGuestGate
                                    ? <><i className="bi bi-lock-fill"></i> Convert</>
                                    : 'Convert'
                                }
                            </button>
                        </div>
                    </div>

                </div>

                <div className="exchange-rates-col">
                    <h3 className="exchange-sub">USD Base Rates <span className="exchange-sub-note">1 USD =</span></h3>
                    <div className="exchange-rates-body">
                        <div className="exchange-rates-grid">
                            {EXCHANGE_RATES.slice(ratePage * RATE_PS, ratePage * RATE_PS + RATE_PS).map(r => (
                                <div key={r.to} className="exchange-rate-card" onClick={() => { setFrom('USD'); setTo(r.to); }}>
                                    <div className="exchange-rate-card-top">
                                        <img src={`https://flagcdn.com/${r.flag}.svg`} alt={r.to} className="exchange-rate-flag" />
                                        <span className="exchange-rate-code">{r.to}</span>
                                        <span className={`exchange-rate-chg ${r.change >= 0 ? 'positive' : 'negative'}`}>
                                            {r.change >= 0 ? '▴' : '▾'}{Math.abs(r.change).toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="exchange-rate-main">{r.rate.toFixed(4)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="exchange-rates-pagination">
                            <button className={`exchange-page-btn${ratePage === 0 ? ' active' : ''}`} onClick={() => setRatePage(0)}>1</button>
                            <button className={`exchange-page-btn${ratePage === 1 ? ' active' : ''}`} onClick={() => setRatePage(1)}>2</button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <ConvertConfirmModal
                    fromVal={fromVal}
                    toVal={toVal}
                    fromCcy={fromCcy}
                    toCcy={toCcy}
                    rateLabel={rateLabel}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

const CARD_MID_IMAGES_TERMINAL = {
    visa:       '../images/card-mid-visa.jpg',
    mastercard: '../images/card-mid-mastercard.jpg',
    amex:       '../images/card-mid-american-express.jpg',
};

function FundingCardOption({ card, selected, onSelect }) {
    const last4    = card.cardNumber.slice(-4);
    const brandImg = CARD_MID_IMAGES_TERMINAL[card.cardType];
    return (
        <div className={`funding-card-option ${selected ? 'selected' : ''}`} onClick={() => onSelect(card.id)}>
            <div className="funding-card-mini" style={{ background: card.gradient }}>
                <div className="funding-card-mini-top">
                    <div className="funding-card-chip"></div>
                    {brandImg && <img src={brandImg} className={`funding-card-brand ${card.cardType !== 'mastercard' ? 'white-logo' : ''}`} alt={card.cardType} />}
                </div>
                <div className="funding-card-number">•••• {last4}</div>
            </div>
            <div className="funding-card-info">
                <span className="funding-card-holder">{card.cardHolder}</span>
                <span className="funding-card-expiry">Expires {card.expiry}</span>
            </div>
            <i className={`bi ${selected ? 'bi-check-circle-fill funding-card-check' : 'bi-circle'} funding-card-radio`}></i>
        </div>
    );
}

function FundingModal({ tab, amount, cash, onClose, onConfirm }) {
    const cards = JSON.parse(localStorage.getItem('profileCards') || '[]');
    const [selectedCard, setCard] = useState(cards.length > 0 ? cards[0].id : null);
    const [done, setDone]         = useState(false);
    const [submitting, setSub]    = useState(false);

    const overMax = tab === 'withdraw' && Number(amount) > cash;
    const canConfirm = selectedCard && !overMax;

    function handleConfirm() {
        setSub(true);
        setTimeout(() => {
            setSub(false);
            setDone(true);
            const card = cards.find(c => c.id === selectedCard);
            if (onConfirm) onConfirm(tab, Number(amount), card);
            setTimeout(onClose, 1600);
        }, 1200);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{tab === 'deposit' ? 'Deposit' : 'Withdraw'}</span>
                        <span className="trade-company">${fmt(Number(amount))}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>

                {done ? (
                    <div className="trade-success">
                        <i className="bi bi-check-circle-fill trade-success-icon"></i>
                        <p>{tab === 'deposit' ? 'Deposit' : 'Withdrawal'} completed successfully!</p>
                    </div>
                ) : (
                    <>
                        {cards.length === 0 ? (
                            <div className="funding-no-cards">
                                <div className="funding-no-cards-icon">
                                    <i className="bi bi-credit-card-x"></i>
                                </div>
                                <p className="funding-no-cards-title">No cards enrolled</p>
                                <p className="funding-no-cards-desc">This operation requires a linked payment method.</p>
                                <a href="profile.html?section=payments" className="funding-no-cards-btn">
                                    Click here to add a card
                                </a>
                            </div>
                        ) : (
                            <>
                                <p className="funding-modal-label">
                                    {tab === 'deposit' ? 'Charge from card' : 'Withdraw to card'}
                                </p>
                                <div className="funding-cards-list">
                                    {cards.map(card => (
                                        <FundingCardOption key={card.id} card={card} selected={selectedCard === card.id} onSelect={setCard} />
                                    ))}
                                </div>

                                <div className="trade-summary" style={{ marginTop: '1rem' }}>
                                    <div className="trade-summary-row">
                                        <span>Amount</span><span>${fmt(Number(amount))}</span>
                                    </div>
                                    {tab === 'withdraw' && (
                                        <div className="trade-summary-row muted">
                                            <span>Available cash</span>
                                            <span className={overMax ? 'negative' : ''}>${fmt(cash)}</span>
                                        </div>
                                    )}
                                </div>

                                {overMax && <p className="trade-error">Insufficient funds.</p>}

                                <button className="trade-confirm-btn buy" onClick={handleConfirm} disabled={!canConfirm || submitting}>
                                    {submitting
                                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing…</>
                                        : `Confirm ${tab === 'deposit' ? 'deposit' : 'withdrawal'}`
                                    }
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const MOCK_NOTIFICATIONS = [
    { id: 1, category: 'Trading',       icon: 'bi-check-circle-fill', color: 'brand',   title: 'Order Executed',    body: 'Bought 2 AAPL @ $182.30',                       time: '2m ago'  },
    { id: 2, category: 'Trading',       icon: 'bi-x-circle-fill',     color: 'danger',  title: 'Order Cancelled',   body: 'TSLA limit order at $245.00 expired',           time: '35m ago' },
    { id: 3, category: 'Market Alerts', icon: 'bi-graph-up-arrow',    color: 'brand',   title: 'Price Alert',       body: 'NVDA crossed $960.00 ↑',                        time: '18m ago' },
    { id: 4, category: 'Market Alerts', icon: 'bi-graph-down-arrow',  color: 'danger',  title: 'Price Alert',       body: 'AMD dropped below $160.00 ↓',                   time: '1h ago'  },
    { id: 5, category: 'Account',       icon: 'bi-wallet2',           color: 'brand',   title: 'Deposit Confirmed', body: '$5,000.00 added to your account',               time: '2h ago'  },
    { id: 6, category: 'Account',       icon: 'bi-shield-check',      color: 'brand',   title: 'Login Detected',    body: 'New sign-in from Windows · Bucharest, RO',      time: '4h ago'  },
    { id: 7, category: 'News & Events', icon: 'bi-newspaper',         color: 'warning', title: 'Market News',       body: 'Fed holds interest rates steady at 5.25–5.50%', time: '3h ago'  },
    { id: 8, category: 'News & Events', icon: 'bi-calendar-event',    color: 'info',    title: 'Upcoming Earnings', body: 'MSFT reports earnings in 2 days',               time: '5h ago'  },
];

const MOCK_NEWS = [
    { id: 1,  symbol: 'NVDA',  impact: 'positive', impactPct:  +4.20, headline: 'NVIDIA beats Q1 estimates with record data center revenue of $22.6B', source: 'Reuters',      time: '2h ago'  },
    { id: 2,  symbol: 'AAPL',  impact: 'negative', impactPct:  -1.80, headline: 'Apple faces new EU antitrust probe over App Store payment rules',      source: 'Bloomberg',    time: '4h ago'  },
    { id: 3,  symbol: 'TSLA',  impact: 'negative', impactPct:  -3.50, headline: 'Tesla Q1 deliveries fall short of expectations amid weak demand in Europe', source: 'CNBC',    time: '5h ago'  },
    { id: 4,  symbol: 'MSFT',  impact: 'positive', impactPct:  +2.10, headline: 'Microsoft Azure revenue surges 31% YoY driven by AI workloads',       source: 'TechCrunch',   time: '6h ago'  },
    { id: 5,  symbol: 'AMZN',  impact: 'positive', impactPct:  +1.60, headline: 'Amazon AWS announces $15B expansion of data centers in Southeast Asia', source: 'WSJ',         time: '8h ago'  },
    { id: 6,  symbol: 'META',  impact: 'positive', impactPct:  +3.80, headline: 'Meta AI assistant reaches 500M monthly active users globally',         source: 'The Verge',    time: '10h ago' },
    { id: 7,  symbol: 'GOOGL', impact: 'neutral',  impactPct:  -0.30, headline: 'Alphabet antitrust ruling expected next month in DOJ search case',    source: 'FT',           time: '12h ago' },
    { id: 8,  symbol: 'JPM',   impact: 'positive', impactPct:  +1.20, headline: 'JPMorgan raises full-year NII guidance on higher-for-longer rates',   source: 'MarketWatch',  time: '14h ago' },
    { id: 9,  symbol: 'INTC',  impact: 'negative', impactPct:  -5.60, headline: 'Intel delays next-gen Panther Lake chip by one quarter amid yield issues', source: 'Wired',   time: '1d ago'  },
    { id: 10, symbol: 'XOM',   impact: 'neutral',  impactPct:  +0.10, headline: 'Exxon Mobil acquires Pioneer Natural Resources integration on track', source: 'Oil & Energy J.', time: '1d ago'  },
    { id: 11, symbol: 'NVDA',  impact: 'positive', impactPct:  +2.80, headline: 'NVIDIA Blackwell GPU demand forces hyperscalers to extend supply contracts', source: 'Bloomberg',    time: '1d ago'  },
    { id: 12, symbol: 'AAPL',  impact: 'positive', impactPct:  +1.40, headline: 'Apple iPhone 17 Pro leak confirms periscope camera and A19 chip upgrade', source: 'MacRumors',    time: '2d ago'  },
    { id: 13, symbol: 'TSLA',  impact: 'positive', impactPct:  +5.10, headline: 'Tesla Full Self-Driving v13 achieves 99.2% intervention-free mile rate in US fleet', source: 'Electrek', time: '2d ago' },
    { id: 14, symbol: 'MSFT',  impact: 'negative', impactPct:  -0.90, headline: 'Microsoft faces US FTC scrutiny over OpenAI exclusive licensing terms',  source: 'Politico',     time: '2d ago'  },
    { id: 15, symbol: 'NVDA',  impact: 'positive', impactPct:  +1.50, headline: 'NVIDIA unveils GeForce RTX 5090 with 2× the performance of RTX 4090',  source: 'The Verge',    time: '3d ago'  },
    { id: 16, symbol: 'AAPL',  impact: 'negative', impactPct:  -2.40, headline: 'Apple Vision Pro sales reportedly slow sharply after initial launch surge', source: 'WSJ',         time: '3d ago'  },
    { id: 17, symbol: 'MSFT',  impact: 'positive', impactPct:  +3.20, headline: 'Microsoft GitHub Copilot Enterprise crosses 1M paid seats milestone',   source: 'TechCrunch',   time: '3d ago'  },
    { id: 18, symbol: 'TSLA',  impact: 'negative', impactPct:  -1.70, headline: 'Tesla recalls 125,000 vehicles over seatbelt warning chime software bug', source: 'Reuters',      time: '4d ago'  },
    { id: 19, symbol: 'AMZN',  impact: 'positive', impactPct:  +2.30, headline: 'Amazon advertising revenue overtakes Comcast to become third-largest US ad platform', source: 'CNBC', time: '4d ago' },
    { id: 20, symbol: 'NVDA',  impact: 'neutral',  impactPct:  -0.60, headline: 'NVIDIA China revenue cut anticipated as US tightens H20 chip export controls', source: 'FT',      time: '5d ago'  },
];

const MOCK_EVENTS = [
    { id: 1,  type: 'earnings',  symbol: 'AAPL',  title: 'Q4 2025 Earnings Call',             date: '2026-02-12', detail: 'EPS $2.40 · Revenue $124.3B'                },
    { id: 2,  type: 'dividend',  symbol: 'MSFT',  title: 'Dividend Detachment',               date: '2026-02-19', detail: '$0.83/share · Ex-dividend date'              },
    { id: 3,  type: 'split',     symbol: 'AMZN',  title: 'Stock Split 3:1',                   date: '2026-02-26', detail: 'Record date: Feb 21'                        },
    { id: 4,  type: 'earnings',  symbol: 'NVDA',  title: 'Q4 2025 Earnings Call',             date: '2026-03-05', detail: 'EPS $0.89 · Revenue $39.3B'                 },
    { id: 5,  type: 'dividend',  symbol: 'JPM',   title: 'Dividend Detachment',               date: '2026-03-05', detail: '$1.25/share · Ex-dividend date'              },
    { id: 6,  type: 'meeting',   symbol: 'GOOGL', title: 'Annual Shareholder Meeting',        date: '2026-03-12', detail: 'Topics: AI overview, cloud growth'           },
    { id: 7,  type: 'earnings',  symbol: 'TSLA',  title: 'Q4 2025 Earnings Call',             date: '2026-03-18', detail: 'EPS $0.73 · Revenue $25.7B'                 },
    { id: 8,  type: 'dividend',  symbol: 'XOM',   title: 'Dividend Detachment',               date: '2026-03-18', detail: '$0.99/share · Ex-dividend date'              },
    { id: 9,  type: 'split',     symbol: 'META',  title: 'Stock Split 2:1',                   date: '2026-03-24', detail: 'Record date: Mar 19'                        },
    { id: 10, type: 'meeting',   symbol: 'MSFT',  title: 'Annual Shareholder Meeting',        date: '2026-03-24', detail: 'Topics: Copilot rollout, Azure expansion'   },
    { id: 11, type: 'earnings',  symbol: 'JPM',   title: 'Q1 2026 Earnings Call',             date: '2026-03-28', detail: 'EPS $4.61 · Revenue $41.9B'                 },
    { id: 12, type: 'dividend',  symbol: 'AAPL',  title: 'Dividend Detachment',               date: '2026-03-28', detail: '$0.25/share · Ex-dividend date'              },
    { id: 13, type: 'split',     symbol: 'WM',    title: 'Stock Split 2:1',                   date: '2026-03-28', detail: 'Record date: Mar 23'                        },
    { id: 14, type: 'dividend',  symbol: 'JPM',   title: 'Dividend Detachment',               date: '2026-04-05', detail: '$1.25/share · Ex-dividend date'              },
    { id: 15, type: 'dividend',  symbol: 'MSFT',  title: 'Dividend Detachment',               date: '2026-04-10', detail: '$0.83/share · Ex-dividend date'              },
    { id: 16, type: 'dividend',  symbol: 'XOM',   title: 'Dividend Detachment',               date: '2026-04-14', detail: '$0.99/share · Ex-dividend date'              },
    { id: 17, type: 'earnings',  symbol: 'TSLA',  title: 'Q1 2026 Earnings Call',             date: '2026-04-22', detail: 'EPS est. $0.51 · Revenue est. $22.8B'       },
    { id: 18, type: 'meeting',   symbol: 'AMZN',  title: 'Annual Shareholder Meeting',        date: '2026-04-22', detail: 'Topics: AI strategy, AWS expansion'         },
    { id: 19, type: 'earnings',  symbol: 'GOOGL', title: 'Q1 2026 Earnings Call',             date: '2026-04-23', detail: 'EPS est. $2.01 · Revenue est. $90.1B'       },
    { id: 20, type: 'earnings',  symbol: 'META',  title: 'Q1 2026 Earnings Call',             date: '2026-04-29', detail: 'EPS est. $5.28 · Revenue est. $41.7B'       },
    { id: 21, type: 'earnings',  symbol: 'AAPL',  title: 'Q2 2026 Earnings Call',             date: '2026-04-30', detail: 'EPS est. $1.62 · Revenue est. $94.2B'       },
    { id: 22, type: 'dividend',  symbol: 'NVDA',  title: 'Dividend Detachment',               date: '2026-04-30', detail: '$0.01/share · Ex-dividend date'              },
    { id: 23, type: 'earnings',  symbol: 'AMZN',  title: 'Q1 2026 Earnings Call',             date: '2026-05-01', detail: 'EPS est. $1.36 · Revenue est. $142.6B'      },
    { id: 24, type: 'split',     symbol: 'NVDA',  title: 'Stock Split 10:1',                  date: '2026-05-15', detail: 'Record date: May 10'                        },
    { id: 25, type: 'meeting',   symbol: 'AMZN',  title: 'Strategy & Outlook Meeting',        date: '2026-05-27', detail: 'Topics: logistics robotics, Prime growth'   },
];

const EVENT_TYPE_CONFIG = {
    earnings: { icon: 'bi-mic-fill',         color: '#00c896', label: 'Earnings'  },
    dividend: { icon: 'bi-cash-coin',         color: '#f0b429', label: 'Dividend'  },
    split:    { icon: 'bi-scissors',          color: '#f472b6', label: 'Split'     },
    meeting:  { icon: 'bi-people-fill',       color: '#3b82f6', label: 'Meeting'   },
};

const FG_ARC_ZONES = [
    { color: '#e05252', from: 0,  to: 25  },
    { color: '#f0b429', from: 25, to: 45  },
    { color: '#8b949e', from: 45, to: 55  },
    { color: '#00c896', from: 55, to: 75  },
    { color: '#00e87a', from: 75, to: 100 },
];

const FG_INDICATORS = [
    { label: 'Market Momentum',      score: 78 },
    { label: 'Stock Price Strength', score: 65 },
    { label: 'Trading Volume',       score: 82 },
    { label: 'Market Volatility',    score: 58 },
    { label: 'Put/Call Ratio',       score: 61 },
];

const FG_DATA = { score: 72, lastWeek: 65, lastMonth: 48 };

const MOCK_TRENDS = {
    topGainers: [
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',      changePct:  8.42, price: 1029.80 },
        { symbol: 'META',  name: 'Meta Platforms',    changePct:  5.11, price: 538.70  },
        { symbol: 'TSLA',  name: 'Tesla Inc.',        changePct:  4.87, price: 260.50  },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',   changePct:  3.20, price: 205.10  },
        { symbol: 'SPOT',  name: 'Spotify Technology',changePct:  2.98, price: 372.90  },
    ],
    topLosers: [
        { symbol: 'INTC',  name: 'Intel Corp.',       changePct: -5.63, price: 29.44  },
        { symbol: 'PYPL',  name: 'PayPal Holdings',   changePct: -3.82, price: 65.80  },
        { symbol: 'DIS',   name: 'Walt Disney Co.',   changePct: -2.94, price: 109.10 },
        { symbol: 'AMD',   name: 'Adv. Micro Devices',changePct: -2.41, price: 158.90 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.',     changePct: -1.88, price: 175.50 },
    ],
    mostActive: [
        { symbol: 'TSLA',  name: 'Tesla Inc.',         price:  248.50, volume: '102.3M', changePct:  4.87 },
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',       price:  950.40, volume:  '91.2M', changePct:  8.42 },
        { symbol: 'AAPL',  name: 'Apple Inc.',         price:  182.30, volume:  '72.8M', changePct:  0.69 },
        { symbol: 'AMD',   name: 'Adv. Micro Devices', price:  162.80, volume:  '62.5M', changePct: -2.41 },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',    price:  198.70, volume:  '58.1M', changePct:  3.20 },
        { symbol: 'BAC',   name: 'Bank of America',    price:   40.15, volume:  '42.1M', changePct:  0.96 },
        { symbol: 'INTC',  name: 'Intel Corp.',        price:   31.20, volume:  '38.6M', changePct: -1.83 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.',      price:  178.90, volume:  '24.1M', changePct: -0.25 },
        { symbol: 'UBER',  name: 'Uber Technologies',  price:   82.60, volume:  '22.8M', changePct:  1.15 },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',    price:  420.80, volume:  '21.4M', changePct:  0.51 },
    ],
};

function GlobeCanvas() {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        let count = 0;
        const onLoad = () => { if (++count === 2) setLoaded(true); };
        const day    = new Image();
        const clouds = new Image();
        day.onload    = onLoad;
        clouds.onload = onLoad;
        day.onerror    = onLoad;
        clouds.onerror = onLoad;
        day.src    = 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg';
        clouds.src = 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg';
    }, []);

    return (
        <div className={`globe-sphere${loaded ? ' globe-loaded' : ''}`}>
            <div className="globe-night"></div>
            <div className="globe-day"></div>
            <div className="globe-clouds"></div>
            <div className="globe-inner-shadow"></div>
        </div>
    );
}

const WORLD_CLOCKS = [
    { city: 'New York',   location: 'New York, USA',   tz: 'America/New_York'  },
    { city: 'London',     location: 'United Kingdom',   tz: 'Europe/London'     },
    { city: 'Dubai',      location: 'UAE',              tz: 'Asia/Dubai'        },
    { city: 'Tokyo',      location: 'Japan',            tz: 'Asia/Tokyo'        },
    { city: 'Toronto',    location: 'Ontario, Canada',  tz: 'America/Toronto'   },
    { city: 'Frankfurt',  location: 'Germany',          tz: 'Europe/Berlin'     },
    { city: 'Singapore',  location: 'Singapore',        tz: 'Asia/Singapore'    },
    { city: 'Sydney',     location: 'Australia',        tz: 'Australia/Sydney'  },
];

const WC_GROUPS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 0],
];

const MARKET_SESSIONS = [
    { exchange: 'NYSE',     market: 'New York Stock Exchange',  tz: 'America/New_York',   open: [9,30],  close: [16,0],  currency: 'USD', flag: 'us' },
    { exchange: 'LSE',      market: 'London Stock Exchange',    tz: 'Europe/London',       open: [8,0],   close: [16,30], currency: 'GBP', flag: 'gb' },
    { exchange: 'TSE',      market: 'Tokyo Stock Exchange',     tz: 'Asia/Tokyo',          open: [9,0],   close: [15,30], currency: 'JPY', flag: 'jp' },
    { exchange: 'HKEx',     market: 'Hong Kong Exchanges',      tz: 'Asia/Hong_Kong',      open: [9,30],  close: [16,0],  currency: 'HKD', flag: 'hk' },
    { exchange: 'FSE',      market: 'Frankfurt Stock Exchange', tz: 'Europe/Berlin',       open: [9,0],   close: [17,30], currency: 'EUR', flag: 'de' },
    { exchange: 'BVB',      market: 'Bucharest Stock Exchange', tz: 'Europe/Bucharest',    open: [10,0],  close: [18,0],  currency: 'RON', flag: 'ro' },
    { exchange: 'SSE',      market: 'Shanghai Stock Exchange',  tz: 'Asia/Shanghai',       open: [9,30],  close: [15,0],  currency: 'CNY', flag: 'cn' },
    { exchange: 'BSE',      market: 'Bombay Stock Exchange',    tz: 'Asia/Kolkata',        open: [9,15],  close: [15,30], currency: 'INR', flag: 'in' },
    { exchange: 'TSX',      market: 'Toronto Stock Exchange',   tz: 'America/Toronto',     open: [9,30],  close: [16,0],  currency: 'CAD', flag: 'ca' },
    { exchange: 'Euronext', market: 'Euronext Amsterdam',       tz: 'Europe/Amsterdam',    open: [9,0],   close: [17,30], currency: 'EUR', flag: 'nl' },
    { exchange: 'ASX',      market: 'Australian Sec. Exchange', tz: 'Australia/Sydney',    open: [10,0],  close: [16,0],  currency: 'AUD', flag: 'au' },
    { exchange: 'SGX',      market: 'Singapore Exchange',       tz: 'Asia/Singapore',      open: [9,0],   close: [17,0],  currency: 'SGD', flag: 'sg' },
];

const MS_GROUPS = [[0,1,2],[3,4,5],[6,7,8],[9,10,11]];

const MS_LOGO = {
    NYSE:     '../images/events-market-nyse.png',
    LSE:      '../images/events-market-lse.png',
    TSE:      '../images/events-market-tse.jpg',
    HKEx:     '../images/events-market-hkex.png',
    FSE:      '../images/events-market-fse.png',
    BVB:      '../images/events-market-bvb.png',
    SSE:      '../images/events-market-sse.png',
    BSE:      '../images/events-market-bse.png',
    TSX:      '../images/events-market-tsx.png',
    Euronext: '../images/events-market-euronext.png',
    ASX:      '../images/events-market-asx.png',
    SGX:      '../images/events-market-sgx.png',
};

function WorldClockDisplay() {
    const [now, setNow]       = useState(new Date());
    const [group, setGroup]   = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const tick = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const rotate = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setGroup(g => (g + 1) % WC_GROUPS.length);
                setFading(false);
            }, 400);
        }, 5000);
        return () => clearInterval(rotate);
    }, []);

    return (
        <div className={`world-clock-wrap${fading ? ' wc-fading' : ''}`}>
            {WC_GROUPS[group].map(idx => {
                const { city, location, tz } = WORLD_CLOCKS[idx];
                const local   = new Date(now.toLocaleString('en-US', { timeZone: tz }));
                const h       = local.getHours();
                const m       = local.getMinutes();
                const ampm    = h >= 12 ? 'pm' : 'am';
                const h12     = h % 12 || 12;
                const timeStr = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
                const gmtStr  = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
                    .formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';
                const dayStr  = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(now);
                return (
                    <div key={city} className="wc-card">
                        <div className="wc-card-left">
                            <div className="wc-city">{city}</div>
                            <div className="wc-location">{location}</div>
                        </div>
                        <div className="wc-card-right">
                            <div className="wc-time">{timeStr}</div>
                            <div className="wc-meta">{gmtStr} &nbsp; {dayStr}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}



function MarketSessionsDisplay() {
    const [now, setNow]       = useState(new Date());
    const [group, setGroup]   = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const tick = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const rotate = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setGroup(g => (g + 1) % MS_GROUPS.length);
                setFading(false);
            }, 400);
        }, 5000);
        return () => clearInterval(rotate);
    }, []);

    function isOpen(s) {
        const local = new Date(now.toLocaleString('en-US', { timeZone: s.tz }));
        const day = local.getDay();
        if (day === 0 || day === 6) return false;
        const mins = local.getHours() * 60 + local.getMinutes();
        return mins >= s.open[0] * 60 + s.open[1] && mins < s.close[0] * 60 + s.close[1];
    }

    function fmtHour(hm) {
        const h = hm[0], m = hm[1];
        const ampm = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        return `${h12}${m ? ':' + String(m).padStart(2,'0') : ''} ${ampm}`;
    }

    return (
        <div className={`world-clock-wrap ms-sessions-wrap${fading ? ' wc-fading' : ''}`}>
            {MS_GROUPS[group].map(idx => {
                const s = MARKET_SESSIONS[idx];
                const open = isOpen(s);
                const local = new Date(now.toLocaleString('en-US', { timeZone: s.tz }));
                const h = local.getHours(), m = local.getMinutes();
                const ampm = h >= 12 ? 'pm' : 'am';
                const timeStr = `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
                return (
                    <div key={s.exchange} className="wc-card">
                        <div className="wc-card-left">
                            {MS_LOGO[s.exchange] && (
                                <img src={MS_LOGO[s.exchange]} className="ms-logo" alt={s.exchange} />
                            )}
                            <div className="wc-city">{s.exchange}</div>
                            <div className="wc-location">{s.market}</div>
                        </div>
                        <div className="wc-card-right ms-card-right">
                            <span className={`ms-badge ${open ? 'ms-open' : 'ms-closed'}`}>
                                <i className="bi bi-circle-fill"></i> {open ? 'Open' : 'Closed'}
                            </span>
                            <div className="wc-meta">{fmtHour(s.open)} – {fmtHour(s.close)}</div>
                            <div className="ms-local-time">
                                <img src={`https://flagcdn.com/${s.flag}.svg`} className="ms-flag" alt={s.flag} />
                                {timeStr} · {s.currency}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function EventCalendar() {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [hoveredDate, setHoveredDate] = useState(null);

    const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAY_NAMES   = ['Mo','Tu','We','Th','Fr','Sa','Su'];

    const eventMap = {};
    MOCK_EVENTS.forEach(ev => {
        if (!eventMap[ev.date]) eventMap[ev.date] = [];
        eventMap[ev.date].push(ev.type);
    });

    const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const hoveredEvents = hoveredDate ? MOCK_EVENTS.filter(ev => ev.date === hoveredDate) : [];

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
        else setViewMonth(m => m-1);
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
        else setViewMonth(m => m+1);
    }

    return (
        <div className="event-calendar">
            <div className="ec-header">
                <button className="ec-nav-btn" onClick={prevMonth}><i className="bi bi-chevron-left"></i></button>
                <span className="ec-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <button className="ec-nav-btn" onClick={nextMonth}><i className="bi bi-chevron-right"></i></button>
            </div>
            <div className="ec-grid-header">
                {DAY_NAMES.map(d => <span key={d} className="ec-day-name">{d}</span>)}
            </div>
            <div className="ec-grid" onMouseLeave={() => setHoveredDate(null)}>
                {cells.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} className="ec-cell ec-empty"></div>;
                    const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isToday = dateStr === todayStr;
                    const isPast  = dateStr < todayStr;
                    const evTypes = eventMap[dateStr] || [];
                    return (
                        <div
                            key={dateStr}
                            className={`ec-cell${isToday ? ' ec-today' : ''}${evTypes.length && isPast && !isToday ? ' ec-past-event' : ''}${evTypes.length ? ' ec-has-event' : ''}`}
                            onMouseEnter={() => setHoveredDate(evTypes.length ? dateStr : null)}
                        >
                            <span className="ec-day-num">{day}</span>
                            {evTypes.length > 0 && (
                                <div className="ec-dots">
                                    {[...new Set(evTypes)].slice(0,3).map(t => (
                                        <span key={t} className="ec-dot" style={{ background: EVENT_TYPE_CONFIG[t].color }}></span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className={`ec-detail-panel${hoveredEvents.length ? ' ec-detail-visible' : ''}`}>
                {hoveredEvents.map(ev => {
                    const cfg = EVENT_TYPE_CONFIG[ev.type];
                    return (
                        <div key={ev.id} className="ec-detail-event">
                            <i className={`bi ${cfg.icon}`} style={{ color: cfg.color, fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}></i>
                            <div className="ec-detail-body">
                                <div className="ec-detail-top">
                                    <span className="news-symbol">{ev.symbol}</span>
                                    <span className="ec-detail-type" style={{ color: cfg.color }}>{cfg.label}</span>
                                </div>
                                <div className="ec-detail-title">{ev.title}</div>
                                <div className="ec-detail-sub">{ev.detail}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function NewsSection({ onGuestGate }) {
    const [filter, setFilter] = useState('all');
    const [page, setPage]     = useState(1);

    const total         = MOCK_NEWS.length;
    const positiveCount = MOCK_NEWS.filter(n => n.impact === 'positive').length;
    const negativeCount = MOCK_NEWS.filter(n => n.impact === 'negative').length;
    const neutralCount  = MOCK_NEWS.filter(n => n.impact === 'neutral').length;
    const positivePct   = Math.round(positiveCount / total * 100);
    const negativePct   = Math.round(negativeCount / total * 100);
    const neutralPct    = 100 - positivePct - negativePct;

    const NEWS_PS = 6;
    const filters = ['all', 'positive', 'neutral', 'negative'];
    const filtered = filter === 'all' ? MOCK_NEWS : MOCK_NEWS.filter(n => n.impact === filter);
    const paged = filtered.slice((page - 1) * NEWS_PS, page * NEWS_PS);

    useEffect(() => setPage(1), [filter]);

    const impactConfig = {
        positive: { cls: 'impact-positive', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
        negative: { cls: 'impact-negative', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
        neutral:  { cls: 'impact-neutral',  icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
    };

    return (
        <div className="section-content">
            <div className="card-panel news-main-card">
                <div className="news-globe-col">
                    <div className="globe-wrap">
                        <GlobeCanvas />
                        <div className="globe-outer-glow"></div>
                    </div>
                    <div className="globe-news-title">Global Market Coverage</div>
                    <div className="globe-news-sub">Real-time financial news from global markets</div>
                    <span className="globe-live-badge">
                        <i className="bi bi-circle-fill"></i> LIVE
                    </span>
                    <WorldClockDisplay />
                </div>
                <div className="news-content-col">
                    <div className="globe-sentiment">
                        <div className="globe-sent-total">
                            <i className="bi bi-newspaper"></i> <span>{total}</span> active stories
                        </div>
                        <div className="globe-sentiment-labels">
                            <div className="globe-sent-item sent-positive">
                                <div className="globe-sent-count">{positiveCount}</div>
                                <div className="globe-sent-pct">{positivePct}%</div>
                                <div className="globe-sent-name"><i className="bi bi-arrow-up-circle-fill"></i> Positive</div>
                            </div>
                            <div className="globe-sent-item sent-negative">
                                <div className="globe-sent-count">{negativeCount}</div>
                                <div className="globe-sent-pct">{negativePct}%</div>
                                <div className="globe-sent-name"><i className="bi bi-arrow-down-circle-fill"></i> Negative</div>
                            </div>
                            <div className="globe-sent-item sent-neutral">
                                <div className="globe-sent-count">{neutralCount}</div>
                                <div className="globe-sent-pct">{neutralPct}%</div>
                                <div className="globe-sent-name"><i className="bi bi-dash-circle-fill"></i> Neutral</div>
                            </div>
                        </div>
                    </div>
                    <div className="news-main-sep"></div>
                    <div className="news-filters">
                        {filters.map(f => (
                            <button key={f} className={`sector-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                        <FilterDropdown
                            options={filters.map(f => f.charAt(0).toUpperCase() + f.slice(1))}
                            value={filter.charAt(0).toUpperCase() + filter.slice(1)}
                            onChange={v => setFilter(v.toLowerCase())}
                        />
                    </div>
                    <div className="news-list news-list-compact">
                        {paged.map(item => {
                            const cfg = impactConfig[item.impact];
                            return (
                                <div key={item.id} className="news-card" onClick={() => onGuestGate ? onGuestGate() : window.location.href = `news.html?id=${item.id}`}>
                                    <div className="news-card-top">
                                        <span className="news-symbol">{item.symbol}</span>
                                        <span className={`news-impact ${cfg.cls}`}>
                                            <i className={`bi ${cfg.icon}`}></i> {cfg.label}
                                        </span>
                                        <span className={`news-impact-pct ${cfg.cls}`}>
                                            {item.impactPct > 0 ? '+' : ''}{item.impactPct.toFixed(2)}%
                                        </span>
                                        <span className="news-time">{item.time}</span>
                                    </div>
                                    <p className="news-headline">{item.headline}</p>
                                </div>
                            );
                        })}
                    </div>
                    <Pagination page={page} total={filtered.length} onChange={setPage} pageSize={NEWS_PS} />
                </div>
            </div>
        </div>
    );
}

function EventsSection() {
    const [filter, setFilter] = useState('all');
    const [page, setPage]     = useState(1);
    const EVENTS_PS = 6;
    const types = ['all', 'earnings', 'dividend', 'split', 'meeting'];

    const filtered = filter === 'all' ? MOCK_EVENTS : MOCK_EVENTS.filter(e => e.type === filter);
    const sorted   = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    const paged    = sorted.slice((page-1) * EVENTS_PS, page * EVENTS_PS);

    useEffect(() => setPage(1), [filter]);

    const counts = {};
    ['earnings','dividend','split','meeting'].forEach(t => { counts[t] = MOCK_EVENTS.filter(e => e.type === t).length; });

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    function daysUntil(d) {
        const diff = Math.ceil((new Date(d) - new Date()) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        if (diff < 0) return `${Math.abs(diff)} days ago`;
        return `In ${diff} days`;
    }

    return (
        <div className="section-content">
            <div className="card-panel news-main-card">
                <div className="news-globe-col events-left-col">
                    <EventCalendar />
                    <div className="globe-news-sep ec-sep"></div>
                    <div className="ec-sessions-header">
                        <div className="globe-news-title">Market Sessions</div>
                        <div className="globe-news-sub">Live trading session status</div>
                    </div>
                    <MarketSessionsDisplay />
                </div>
                <div className="news-content-col">
                    <div className="globe-sentiment">
                        <div className="globe-sent-total">
                            <i className="bi bi-calendar-event"></i> <span>{MOCK_EVENTS.length}</span> events this season
                        </div>
                        <div className="globe-sentiment-labels events-sentiment-labels">
                            {['earnings','dividend','split','meeting'].map(t => {
                                const cfg = EVENT_TYPE_CONFIG[t];
                                return (
                                    <div key={t} className="globe-sent-item" style={{ borderLeftColor: cfg.color }}>
                                        <div className="globe-sent-count" style={{ color: cfg.color }}>{counts[t]}</div>
                                        <div className="globe-sent-name" style={{ color: cfg.color }}>
                                            <i className={`bi ${cfg.icon}`}></i> {cfg.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="news-main-sep"></div>
                    <div className="news-filters">
                        {types.map(t => (
                            <button key={t} className={`sector-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                        <FilterDropdown
                            options={types.map(t => t.charAt(0).toUpperCase() + t.slice(1))}
                            value={filter.charAt(0).toUpperCase() + filter.slice(1)}
                            onChange={v => setFilter(v.toLowerCase())}
                            colors={Object.fromEntries(types.filter(t => t !== 'all').map(t => [t.charAt(0).toUpperCase() + t.slice(1), EVENT_TYPE_CONFIG[t].color]))}
                        />
                    </div>
                    <div className="events-list events-list-compact">
                        {paged.map(ev => {
                            const cfg = EVENT_TYPE_CONFIG[ev.type];
                            return (
                                <div key={ev.id} className="event-card">
                                    <div className="event-icon-wrap" style={{ color: cfg.color }}>
                                        <i className={`bi ${cfg.icon}`}></i>
                                    </div>
                                    <div className="event-body">
                                        <div className="event-top">
                                            <span className="news-symbol">{ev.symbol}</span>
                                            <span className="event-type-badge" style={{ color: cfg.color }}>{cfg.label}</span>
                                        </div>
                                        <p className="event-title">{ev.title}</p>
                                        <span className="event-detail">{ev.detail}</span>
                                    </div>
                                    <div className="event-date-wrap">
                                        <span className="event-date">{formatDate(ev.date)}</span>
                                        <span className="event-countdown">{daysUntil(ev.date)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Pagination page={page} total={sorted.length} onChange={setPage} pageSize={EVENTS_PS} />
                </div>
            </div>
        </div>
    );
}

function fgZone(score) {
    if (score <= 24) return { label: 'Extreme Fear', color: '#e05252' };
    if (score <= 44) return { label: 'Fear',         color: '#f0b429' };
    if (score <= 54) return { label: 'Neutral',      color: '#8b949e' };
    if (score <= 74) return { label: 'Greed',        color: '#00c896' };
    return                  { label: 'Extreme Greed',color: '#00e87a' };
}

function fgArcPath(fromScore, toScore) {
    const cx = 100, cy = 110, r = 82;
    function pt(sc) {
        const a = (180 - sc * 1.8) * Math.PI / 180;
        return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
    }
    const s = pt(fromScore), e = pt(toScore);
    const la = (toScore - fromScore) * 1.8 > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${la} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function FearGreedGauge() {
    const score = FG_DATA.score;
    const [displayed, setDisplayed] = React.useState(0);
    React.useEffect(() => {
        const dur = 1400, t0 = performance.now();
        function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            setDisplayed(Math.round(score * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }, []);
    const zone = fgZone(score);
    const needleAngle = displayed * 1.8 - 90;
    return (
        <div className="fg-gauge-wrap">
            <svg viewBox="0 0 200 118" className="fg-svg">
                <path d={fgArcPath(0, 100)} stroke="rgba(48,54,61,0.9)" strokeWidth="12" fill="none" strokeLinecap="round" />
                {FG_ARC_ZONES.map(z => (
                    <path key={z.from} d={fgArcPath(z.from, z.to)} stroke={z.color} strokeWidth="12" fill="none" strokeLinecap="round" />
                ))}
                <line x1="100" y1="110" x2="100" y2="38"
                      stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"
                      transform={`rotate(${needleAngle}, 100, 110)`} />
                <circle cx="100" cy="110" r="5.5" fill="var(--text)" />
                <circle cx="100" cy="110" r="3" fill="var(--bg)" />
            </svg>
            <div className="fg-score-row">
                <span className="fg-score">{displayed}</span>
                <span className="fg-zone-label" style={{ color: zone.color }}>{zone.label}</span>
            </div>
            <div className="fg-history-row">
                <span className="fg-hist-item">Last week: <span style={{ color: fgZone(FG_DATA.lastWeek).color }}>{FG_DATA.lastWeek} · {fgZone(FG_DATA.lastWeek).label}</span></span>
                <span className="fg-hist-item">Last month: <span style={{ color: fgZone(FG_DATA.lastMonth).color }}>{FG_DATA.lastMonth} · {fgZone(FG_DATA.lastMonth).label}</span></span>
            </div>
        </div>
    );
}

function TrendsSection({ onGuestGate }) {
    const posColor = '#00c896';
    const negColor = '#e05252';
    const MA_PS = 5;
    const [maPage, setMaPage] = useState(1);
    const maItems = MOCK_TRENDS.mostActive.slice((maPage - 1) * MA_PS, maPage * MA_PS);

    function TrendRow({ item, rank }) {
        const isPos = item.changePct >= 0;
        return (
            <div className="trend-row clickable-row" onClick={() => onGuestGate ? onGuestGate() : window.location.href = `stock.html?symbol=${item.symbol}`}>
                <span className="trend-rank">#{rank}</span>
                <div className="trend-info">
                    <span className="trend-symbol">{item.symbol}</span>
                    <span className="trend-name">{item.name}</span>
                </div>
                {item.price !== undefined && <span className={`trend-price${item.volume === undefined ? ' trend-price-gainer' : ''}`}>${fmt(item.price)}</span>}
                {item.volume !== undefined && <span className="trend-volume">{item.price !== undefined ? <span className="trend-vol-label">Vol</span> : null}{item.volume}</span>}
                <span className="trend-change" style={{ color: isPos ? posColor : negColor }}>
                    <i className={`bi bi-arrow-${isPos ? 'up' : 'down'}-short`}></i>
                    {Math.abs(item.changePct).toFixed(2)}%
                </span>
            </div>
        );
    }

    return (
        <div className="section-content">
            <div className="trends-main-layout">
                <div className="trends-gauge-col">
                    <div className="card-panel">
                        <div className="fg-header">
                            <div className="globe-news-title">Fear &amp; Greed Index</div>
                            <div className="globe-news-sub">Market sentiment · Updated daily</div>
                        </div>
                        <FearGreedGauge />
                        <div className="fg-sep"></div>
                        <div className="fg-signals-title">Market Signals</div>
                        <br></br>
                        <div className="fg-indicators">
                            {FG_INDICATORS.map(ind => {
                                const z = fgZone(ind.score);
                                return (
                                    <div key={ind.label} className="fg-ind-row">
                                        <span className="fg-ind-label">{ind.label}</span>
                                        <div className="fg-ind-bar-wrap">
                                            <div className="fg-ind-bar" style={{ width: `${ind.score}%`, background: z.color }}></div>
                                        </div>
                                        <span className="fg-ind-score" style={{ color: z.color }}>{ind.score}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="fg-zone-section">
                            <div className="fg-sep"></div>
                            <div className="fg-signals-title">Market Context</div>
                            <p className="fg-context-text">{({
                                'Extreme Fear': 'Investors are panic-selling. Markets are deeply oversold — historically a strong buying opportunity for long-term investors.',
                                'Fear':         'Uncertainty dominates the market. Investors are cautious and defensive positions are increasing.',
                                'Neutral':      'The market is balanced between optimism and caution. No clear directional sentiment prevails.',
                                'Greed':        'Investors are showing confidence. Markets may be overextended — consider taking profits or proceeding with caution.',
                                'Extreme Greed':'Markets are driven by irrational exuberance. A correction is increasingly likely — exercise extreme caution.',
                            })[fgZone(FG_DATA.score).label]}</p>
                        </div>
                    </div>
                </div>
                <div className="trends-content-col">
                    <div className="trends-grid">
                        <div className="trends-panel">
                            <h3 className="trends-panel-title positive-title">
                                <i className="bi bi-graph-up-arrow"></i> Top Gainers
                            </h3>
                            {MOCK_TRENDS.topGainers.map((item, i) => <TrendRow key={item.symbol} item={item} rank={i + 1} />)}
                        </div>
                        <div className="trends-panel">
                            <h3 className="trends-panel-title negative-title">
                                <i className="bi bi-graph-down-arrow"></i> Top Losers
                            </h3>
                            {MOCK_TRENDS.topLosers.map((item, i) => <TrendRow key={item.symbol} item={item} rank={i + 1} />)}
                        </div>
                        <div className="trends-panel trends-panel-full">
                            <h3 className="trends-panel-title neutral-title">
                                <i className="bi bi-bar-chart-fill"></i> Most Active
                            </h3>
                            {maItems.map((item, i) => <TrendRow key={item.symbol} item={item} rank={(maPage - 1) * MA_PS + i + 1} />)}
                            <Pagination page={maPage} total={MOCK_TRENDS.mostActive.length} pageSize={MA_PS} onChange={setMaPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FLOW_DATA = {
    '1W': [
        { label: 'Mon', deposit: 800,  withdraw: 200  },
        { label: 'Tue', deposit: 1200, withdraw: 500  },
        { label: 'Wed', deposit: 600,  withdraw: 300  },
        { label: 'Thu', deposit: 2000, withdraw: 400  },
        { label: 'Fri', deposit: 500,  withdraw: 1000 },
        { label: 'Sat', deposit: 300,  withdraw: 150  },
        { label: 'Sun', deposit: 800,  withdraw: 250  },
    ],
    '1M': [
        { label: 'W1', deposit: 3000, withdraw: 500  },
        { label: 'W2', deposit: 1200, withdraw: 1500 },
        { label: 'W3', deposit: 5000, withdraw: 800  },
        { label: 'W4', deposit: 1000, withdraw: 800  },
    ],
    '3M': [
        { label: 'Jan', deposit: 7000, withdraw: 2000 },
        { label: 'Feb', deposit: 2000, withdraw: 4000 },
        { label: 'Mar', deposit: 5000, withdraw: 2000 },
    ],
    '6M': [
        { label: 'Oct', deposit: 8000, withdraw: 1000 },
        { label: 'Nov', deposit: 5000, withdraw: 2000 },
        { label: 'Dec', deposit: 1000, withdraw: 2500 },
        { label: 'Jan', deposit: 7000, withdraw: 2000 },
        { label: 'Feb', deposit: 2000, withdraw: 4000 },
        { label: 'Mar', deposit: 5000, withdraw: 2000 },
    ],
    '1Y': [
        { label: 'Apr', deposit: 3000, withdraw: 1000 },
        { label: 'May', deposit: 6000, withdraw: 2500 },
        { label: 'Jun', deposit: 2000, withdraw: 3500 },
        { label: 'Jul', deposit: 8000, withdraw: 1000 },
        { label: 'Aug', deposit: 4000, withdraw: 2000 },
        { label: 'Sep', deposit: 1500, withdraw: 3000 },
        { label: 'Oct', deposit: 8000, withdraw: 1000 },
        { label: 'Nov', deposit: 5000, withdraw: 2000 },
        { label: 'Dec', deposit: 1000, withdraw: 2500 },
        { label: 'Jan', deposit: 7000, withdraw: 2000 },
        { label: 'Feb', deposit: 2000, withdraw: 4000 },
        { label: 'Mar', deposit: 5000, withdraw: 2000 },
    ],
};

const FLOW_GRID_TICKS = [0.25, 0.5, 0.75, 1];

function fmtYAxis(v) {
    if (v >= 1000) return `$${(v / 1000 % 1 === 0 ? v / 1000 : (v / 1000).toFixed(1))}k`;
    return `$${v}`;
}

function NetFlowChart() {
    const [period, setPeriod]     = React.useState('6M');
    const [viewType, setViewType] = React.useState('bar');
    const data = FLOW_DATA[period];

    const W = 500, H = 180, PAD = { top: 16, bottom: 28, left: 44, right: 8 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxVal = Math.max(...data.flatMap(d => [d.deposit, d.withdraw]), 1);
    const groupW = innerW / data.length;
    const gap    = groupW * 0.15;
    const barW   = (groupW - gap * 2) / 2;
    const baseY  = PAD.top + innerH;
    const xC     = i => PAD.left + i * groupW + groupW / 2;
    const yV     = v => baseY - (v / maxVal) * innerH;
    const depPts = data.map((d, i) => `${xC(i)},${yV(d.deposit)}`).join(' ');
    const wdrPts = data.map((d, i) => `${xC(i)},${yV(d.withdraw)}`).join(' ');

    return (
        <React.Fragment>
            <div className="flow-chart-header">
                <div className="flow-chart-left">
                    <h3 className="flow-chart-title">Flow History</h3>
                    <div className="flow-chart-periods">
                        {Object.keys(FLOW_DATA).map(p => (
                            <button key={p} className={`chart-period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
                        ))}
                    </div>
                </div>
                <div className="chart-type-toggle">
                    <button className={`chart-type-btn ${viewType === 'line' ? 'active' : ''}`} title="Line" onClick={() => setViewType('line')}><i className="bi bi-graph-up"></i></button>
                    <button className={`chart-type-btn ${viewType === 'bar' ? 'active' : ''}`} title="Candlestick" onClick={() => setViewType('bar')}><i className="bi bi-bar-chart-line"></i></button>
                </div>
            </div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
                {FLOW_GRID_TICKS.map(t => {
                    const y = baseY - t * innerH;
                    return (
                        <g key={t}>
                            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 3" />
                            <text x={PAD.left - 5} y={y + 3} textAnchor="end" fontSize="8" fill="var(--text-muted)">{fmtYAxis(Math.round(maxVal * t))}</text>
                        </g>
                    );
                })}
                <line x1={PAD.left} y1={baseY} x2={W - PAD.right} y2={baseY} stroke="var(--border)" strokeWidth="1" />
                {viewType === 'bar' ? (
                    <React.Fragment>
                        {data.map((d, i) => {
                            const gx   = PAD.left + i * groupW;
                            const depH = (d.deposit / maxVal) * innerH;
                            const wdrH = (d.withdraw / maxVal) * innerH;
                            const midX = gx + groupW / 2;
                            return (
                                <g key={d.label + i}>
                                    <rect x={gx + gap}        y={baseY - depH} width={barW} height={depH} fill="var(--brand-primary)" opacity="0.85" rx="2" />
                                    <rect x={gx + gap + barW} y={baseY - wdrH} width={barW} height={wdrH} fill="var(--danger)"        opacity="0.85" rx="2" />
                                    <text x={midX} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{d.label}</text>
                                </g>
                            );
                        })}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <polyline points={depPts} fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinejoin="round" />
                        <polyline points={wdrPts} fill="none" stroke="var(--danger)"        strokeWidth="2" strokeLinejoin="round" />
                        {data.map((d, i) => (
                            <g key={d.label + i}>
                                <circle cx={xC(i)} cy={yV(d.deposit)}  r="3" fill="var(--brand-primary)" />
                                <circle cx={xC(i)} cy={yV(d.withdraw)} r="3" fill="var(--danger)" />
                                <text x={xC(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{d.label}</text>
                            </g>
                        ))}
                    </React.Fragment>
                )}
            </svg>
            <div className="net-flow-legend">
                <span className="net-flow-legend-item positive"><i className="bi bi-square-fill"></i> Deposit</span>
                <span className="net-flow-legend-item negative"><i className="bi bi-square-fill"></i> Withdrawal</span>
            </div>
        </React.Fragment>
    );
}

function FundingSection({ cash, transactions, onConfirm }) {
    const [tab, setTab]           = useState('deposit');
    const [raw, setRaw]           = useState('');
    const [showModal, setModal]   = useState(false);
    const [txDetail, setTxDetail] = useState(null);
    const quickAmounts = [100, 500, 1000, 5000];

    const numericValue = parseFloat(raw.replace(/,/g, '')) || 0;
    const isNegative   = raw !== '' && numericValue <= 0;
    const isOverMax    = tab === 'withdraw' && numericValue > cash;
    const hasError     = isNegative || isOverMax;
    const canSubmit    = raw !== '' && numericValue > 0 && !hasError;

    function switchTab(t) { setTab(t); setRaw(''); }

    function handleRawChange(e) {
        const val = e.target.value.replace(/,/g, '');
        if (val.replace(/\./g, '').length > 9) return;
        if (!/^[0-9]*\.?[0-9]*$/.test(val)) return;
        if (/^0[0-9]/.test(val)) return;
        const parts   = val.split('.');
        const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setRaw(parts.length > 1 ? `${integer}.${parts[1]}` : integer);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (canSubmit) setModal(true);
    }

    const fundingTxs    = transactions.filter(t => t.type === 'DEPOSIT' || t.type === 'WITHDRAW').slice(0, 3);
    const totalDeposited = transactions.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.total, 0);
    const totalWithdrawn = transactions.filter(t => t.type === 'WITHDRAW').reduce((s, t) => s + t.total, 0);

    return (
        <div className="section-content">
            <div className="funding-layout">
                <div className="funding-sidebar">
                    <div className="card-panel funding-flow-card">
                        <NetFlowChart />
                    </div>
                    <div className="funding-summary-row-grid">
                        <div className="card-panel funding-summary-card">
                            <h3 className="card-section-title">Account Summary</h3>
                            <div className="funding-summary-cash">
                                <span className="funding-summary-cash-label">Available Cash</span>
                                <span className="funding-summary-cash-value">${fmt(cash)}</span>
                            </div>
                            <div className="funding-summary-rows">
                                <div className="funding-summary-row">
                                    <span><i className="bi bi-arrow-down-circle text-success me-2"></i>Total Deposited</span>
                                    <span className="positive">+${fmt(totalDeposited)}</span>
                                </div>
                                <div className="funding-summary-row">
                                    <span><i className="bi bi-arrow-up-circle text-danger me-2"></i>Total Withdrawn</span>
                                    <span className="negative">-${fmt(totalWithdrawn)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-panel">
                            <h3 className="card-section-title">Recent Activity</h3>
                            <div className="funding-activity-list">
                                {fundingTxs.map(tx => (
                                    <div key={tx.id} className="funding-activity-row" style={{ cursor: 'pointer' }} onClick={() => setTxDetail(tx)}>
                                        <div className={`funding-activity-icon ${tx.type === 'DEPOSIT' ? 'deposit' : 'withdraw'}`}>
                                            <i className={`bi ${tx.type === 'DEPOSIT' ? 'bi-arrow-down' : 'bi-arrow-up'}`}></i>
                                        </div>
                                        <div className="funding-activity-info">
                                            <span className="funding-activity-type">{tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</span>
                                            <span className="funding-activity-date">{tx.date}</span>
                                        </div>
                                        <span className={`funding-activity-amount ${tx.type === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${fmt(tx.total)}
                                        </span>
                                    </div>
                                ))}
                                {Array.from({ length: 3 - fundingTxs.length }).map((_, i) => (
                                    <div key={`ph-${i}`} className="funding-activity-row funding-activity-placeholder"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="funding-right-col">
                <div className="card-panel funding-wrap">
                    <div className="funding-tabs">
                        <button className={`funding-tab ${tab === 'deposit' ? 'active' : ''}`} onClick={() => switchTab('deposit')}>
                            <i className="bi bi-arrow-down-circle"></i> Deposit
                        </button>
                        <button className={`funding-tab ${tab === 'withdraw' ? 'active' : ''}`} onClick={() => switchTab('withdraw')}>
                            <i className="bi bi-arrow-up-circle"></i> Withdraw
                        </button>
                    </div>

                    <form className="funding-form" onSubmit={handleSubmit}>
                        <label className="funding-label">Amount (USD)</label>
                        <div className="quick-amounts">
                            {quickAmounts.map(a => (
                                <button type="button" key={a} className={`quick-amount-btn ${numericValue === a ? 'active' : ''}`} onClick={() => setRaw(String(a))}>
                                    ${a.toLocaleString()}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            inputMode="decimal"
                            className={`funding-input ${hasError ? 'funding-input-error' : ''}`}
                            placeholder="Enter amount"
                            value={raw}
                            onChange={handleRawChange}
                        />
                        {isNegative && (
                            <p className="funding-error">Amount must be greater than zero.</p>
                        )}
                        {isOverMax && (
                            <p className="funding-error">Amount exceeds available balance of <strong>${fmt(cash)}</strong>.</p>
                        )}
                        {tab === 'withdraw' && !hasError && (
                            <p className="funding-available">Available: <strong>${fmt(cash)}</strong></p>
                        )}
                        <button type="submit" className="funding-submit-btn" disabled={!canSubmit}>
                            {tab === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
                        </button>
                    </form>
                </div>
                </div>
            </div>

            {showModal && (
                <FundingModal tab={tab} amount={String(numericValue)} cash={cash} onClose={() => setModal(false)} onConfirm={onConfirm} />
            )}
            {txDetail && <TransactionDetailModal tx={txDetail} onClose={() => setTxDetail(null)} />}
        </div>
    );
}

function TopNavbar({ user, onToggleSidebar, isGuest }) {
    const [open, setOpen]           = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs]       = useState(MOCK_NOTIFICATIONS);
    const [expandedId, setExpandedId] = useState(null);
    const [isDark, setDark]         = useState(() => {
        const t = localStorage.getItem('theme');
        if (t === 'light') return false;
        if (t === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
        return true;
    });
    const ref      = useRef(null);
    const notifRef = useRef(null);
    const initials   = user.firstName[0] + user.lastName[0];
    const avatarSrc  = localStorage.getItem('profileAvatar') || null;

    const unreadCount = notifs.length;


    function toggleTheme() {
        const next = isDark ? 'light' : 'dark';
        setDark(!isDark);
        document.documentElement.setAttribute('data-bs-theme', next);
        localStorage.setItem('theme', next);
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
                <a href={isGuest ? 'index.html' : 'terminal.html'} className="nav-brand-link">
                    <img src="../images/app-icon.jpg" alt="logo" className="nav-logo-img" />
                    <span className="nav-brand-name">Pocket TradePro</span>
                </a>
            </div>
            <div className="navbar-right">
                {!isGuest && (
                    <a href="contact.html" className="support-btn">
                        <i className="bi bi-chat-dots"></i>
                        <span>Contact & Support</span>
                    </a>
                )}
                {isGuest ? (
                    <a href="register.html" className="nav-signup-btn">
                        <i className="bi bi-person-plus"></i>
                        <span>Sign Up</span>
                    </a>
                ) : (<>
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
                                            <div
                                                key={n.id}
                                                className={`notif-item ${n.read ? 'read' : 'unread'} ${expandedId === n.id ? 'expanded' : ''}`}
                                                onClick={() => {
                                                    setExpandedId(expandedId === n.id ? null : n.id);
                                                    setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x));
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
                        <div className="avatar-circle">
                            {avatarSrc
                                ? <img src={avatarSrc} alt="avatar" className="avatar-circle-img" />
                                : initials
                            }
                        </div>
                        <span className="user-name-nav">{user.firstName} {user.lastName}</span>
                        <i className={`bi bi-chevron-${open ? 'up' : 'down'} chevron-icon`}></i>
                    </button>
                    {open && (
                        <div className="user-dropdown">
                            <div className="dropdown-divider"></div>
                            <a href="profile.html?section=personal"      className="dropdown-item"><i className="bi bi-person"></i> Personal Info</a>
                            <a href="profile.html?section=security"      className="dropdown-item"><i className="bi bi-shield-lock"></i> Security</a>
                            <a href="profile.html?section=preferences"   className="dropdown-item"><i className="bi bi-sliders"></i> Preferences</a>
                            <a href="profile.html?section=payments"      className="dropdown-item"><i className="bi bi-credit-card"></i> Payment Methods</a>
                            <a href="profile.html?section=status"  className="dropdown-item"><i className="bi bi-person-check"></i> Status</a>
                            <button className="dropdown-item theme-toggle-row" onClick={toggleTheme}>
                                <span><i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'}`}></i> Dark mode</span>
                                <div className={`toggle-switch ${isDark ? 'on' : ''}`}><div className="toggle-knob"></div></div>
                            </button>
                            <div className="dropdown-divider"></div>
                            <a href="index.html" className="dropdown-item danger" onClick={() => ['profilePersonal','profileCards','profileAvatar','profileNotifications','sessionUser','preferredCurrency','chartType','watchlist'].forEach(k => localStorage.removeItem(k))}><i className="bi bi-box-arrow-right"></i> Log out</a>
                        </div>
                    )}
                </div>
                </>)}
            </div>
        </header>
    );
}

function Sidebar({ activeSection, onSelect, collapsed, mobileOpen, isGuest }) {
    const items = isGuest ? NAV_ITEMS.filter(i => !GUEST_HIDDEN.has(i.key)) : NAV_ITEMS;
    return (
        <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            <nav className="sidebar-nav">
                {items.map(item => (
                    <button
                        key={item.key}
                        className={`sidebar-nav-item ${activeSection === item.key ? 'active' : ''}`}
                        onClick={() => onSelect(item.key)}
                        title={collapsed ? item.label : ''}
                    >
                        {item.iconEl
                            ? item.iconEl
                            : <i className={`bi ${item.icon} sidebar-icon`}></i>
                        }
                        {!collapsed && <span className="sidebar-label">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

function lsGet(key, fallback) {
    try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
}

function DashboardApp() {
    useEffect(() => {
        if (!isGuest) return;
        window.history.pushState(null, '', window.location.href);
        const handler = () => { window.location.href = 'index.html'; };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);

    const [cash, setCash]                         = useState(() => lsGet('ptp_cash', SESSION_USER.cash));
    const [stocksRaw, setStocksRaw]               = useState(() => lsGet('ptp_stocks', HOLDINGS_RAW));
    const [cryptoRaw, setCryptoRaw]               = useState(() => lsGet('ptp_crypto', CRYPTO_HOLDINGS_RAW));
    const [bondsRaw, setBondsRaw]                 = useState(() => lsGet('ptp_bonds', BOND_HOLDINGS_RAW));
    const [commoditiesRaw, setCommoditiesRaw]     = useState(() => lsGet('ptp_commodities', COMMODITY_HOLDINGS_RAW));
    const [etfsRaw, setEtfsRaw]                   = useState(() => lsGet('ptp_etfs', ETF_HOLDINGS_RAW));
    const [transactions, setTransactions]         = useState(() => lsGet('ptp_transactions', TRANSACTIONS_DATA));
    const [watchlist, setWatchlist]               = useState(() => {
        const saved = (() => { try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; } })();
        const ownedSymbols = new Set(lsGet('ptp_stocks', HOLDINGS_RAW).map(h => h.symbol));
        const defaults = MOCK_STOCKS.filter(s => !ownedSymbols.has(s.symbol)).slice(0, 5).map(s => ({ symbol: s.symbol, type: 'stock' }));
        const extras = saved.filter(w => !defaults.some(d => d.symbol === w.symbol));
        const merged = [...defaults, ...extras];
        localStorage.setItem('watchlist', JSON.stringify(merged));
        return merged;
    });

    useEffect(() => { sessionStorage.setItem('ptp_cash',         JSON.stringify(cash));         }, [cash]);
    useEffect(() => { sessionStorage.setItem('ptp_stocks',       JSON.stringify(stocksRaw));    }, [stocksRaw]);
    useEffect(() => { sessionStorage.setItem('ptp_crypto',       JSON.stringify(cryptoRaw));    }, [cryptoRaw]);
    useEffect(() => { sessionStorage.setItem('ptp_bonds',        JSON.stringify(bondsRaw));     }, [bondsRaw]);
    useEffect(() => { sessionStorage.setItem('ptp_commodities',  JSON.stringify(commoditiesRaw)); }, [commoditiesRaw]);
    useEffect(() => { sessionStorage.setItem('ptp_etfs',         JSON.stringify(etfsRaw));      }, [etfsRaw]);
    useEffect(() => { sessionStorage.setItem('ptp_transactions', JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { sessionStorage.setItem('watchlist', JSON.stringify(watchlist)); localStorage.setItem('watchlist', JSON.stringify(watchlist)); }, [watchlist]);
    const [activeSection, setSection]             = useState(sessionStorage.getItem('activeSection') || (isGuest ? 'stocks' : 'overview'));
    const [collapsed, setCollapsed]               = useState(false);
    const [mobileOpen, setMobileOpen]             = useState(false);
    const [tradeTarget, setTrade]                 = useState(null);
    const [bondTrade, setBondTrade]               = useState(null);
    const [bondSell,  setBondSell]                = useState(null);
    const [etfTarget, setETFTrade]                = useState(null);
    const [guestGate, setGuestGate]               = useState(null);

    const holdings        = buildHoldings(stocksRaw);
    const _activeBondsRaw = bondsRaw.filter(h => { const b = MOCK_BONDS.find(x => x.symbol === h.symbol); return b ? new Date() < new Date(b.maturity) : true; });
    const allHoldings     = buildAllHoldings(stocksRaw, cryptoRaw, _activeBondsRaw, commoditiesRaw, etfsRaw);

    function nowStr() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function toggleWatchlist(symbol, type) {
        setWatchlist(prev => {
            const exists = prev.some(i => i.symbol === symbol && i.type === type);
            return exists
                ? prev.filter(i => !(i.symbol === symbol && i.type === type))
                : [...prev, { symbol, type }];
        });
    }

    function updateRaw(setter, symbol, side, qty, price) {
        setter(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === symbol);
                if (ex) return prev.map(h => h.symbol === symbol
                    ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) }
                    : h);
                return [...prev, { symbol, qty, avgPrice: price }];
            }
            return prev.map(h => h.symbol === symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        });
    }

    function handleTradeConfirm(side, qty) {
        const { symbol, name, price, assetType } = tradeTarget;
        const total = qty * price;
        const tx = { id: Date.now(), type: side === 'buy' ? 'BUY' : 'SELL', symbol, name, qty, price, total, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType };
        if (side === 'buy') setCash(c => c - total); else setCash(c => c + total);
        if (assetType === 'crypto') updateRaw(setCryptoRaw, symbol, side, qty, price);
        else if (assetType === 'commodity') updateRaw(setCommoditiesRaw, symbol, side, qty, price);
        else updateRaw(setStocksRaw, symbol, side, qty, price);
        setTransactions(prev => [tx, ...prev]);
    }

    function handleBondSellConfirm(target, qty) {
        const { symbol, name, price } = target;
        const total = qty * price;
        const tx = { id: Date.now(), type: 'SELL', symbol, name, qty, price, total, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType: 'bond' };
        setCash(c => c + total);
        setBondsRaw(prev => prev.map(h => h.symbol === symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0));
        setTransactions(prev => [tx, ...prev]);
    }

    function handleBondSectionConfirm(target, qty) {
        const { symbol, name, price } = target;
        const total = qty * price;
        const tx = { id: Date.now(), type: 'BUY', symbol, name, qty, price, total, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType: 'bond' };
        setCash(c => c - total);
        setBondsRaw(prev => {
            const ex = prev.find(h => h.symbol === symbol);
            if (ex) return prev.map(h => h.symbol === symbol
                ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) }
                : h);
            return [...prev, { symbol, qty, avgPrice: price }];
        });
        setTransactions(prev => [tx, ...prev]);
    }

    function handleFundingConfirm(tab, amount, card) {
        const type = tab === 'deposit' ? 'DEPOSIT' : 'WITHDRAW';
        const tx = { id: Date.now(), type, symbol: null, name: null, qty: null, price: null, total: amount, date: nowStr(), orderId: `TXN-${Date.now()}`, card: { last4: card.cardNumber?.slice(-4), type: card.cardType } };
        if (tab === 'deposit') setCash(c => c + amount); else setCash(c => c - amount);
        setTransactions(prev => [tx, ...prev]);
    }

    function handleETFTradeConfirm(side, amount) {
        const { symbol, name, price } = etfTarget;
        const shares = parseFloat((amount / price).toFixed(4));
        const tx = { id: Date.now(), type: side === 'buy' ? 'BUY' : 'SELL', symbol, name, qty: shares, price, total: amount, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType: 'etf' };
        if (side === 'buy') {
            setCash(c => c - amount);
            setEtfsRaw(prev => {
                const ex = prev.find(h => h.symbol === symbol);
                if (ex) return prev.map(h => h.symbol === symbol
                    ? { ...h, qty: h.qty + shares, avgPrice: (h.avgPrice * h.qty + price * shares) / (h.qty + shares) }
                    : h);
                return [...prev, { symbol, qty: shares, avgPrice: price }];
            });
        } else {
            setCash(c => c + amount);
            setEtfsRaw(prev => prev.map(h => h.symbol === symbol ? { ...h, qty: h.qty - shares } : h).filter(h => h.qty > 0));
        }
        setTransactions(prev => [tx, ...prev]);
    }

    return (
        <div className="dashboard-root">
            <TopNavbar user={SESSION_USER} onToggleSidebar={() => { if (window.innerWidth <= 768) setMobileOpen(o => !o); else setCollapsed(c => !c); }} isGuest={isGuest} />
            <div className="dashboard-body">
                {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={() => setMobileOpen(false)} />}
                <Sidebar activeSection={activeSection} onSelect={s => { sessionStorage.setItem('activeSection', s); setSection(s); setMobileOpen(false); }} collapsed={collapsed} mobileOpen={mobileOpen} isGuest={isGuest} />
                <main className={`dashboard-main ${collapsed ? 'expanded' : ''}`}>
                    {activeSection === 'overview'     && <OverviewSection      holdings={holdings} allHoldings={allHoldings} cash={cash} onTrade={setTrade} watchlist={watchlist} transactions={transactions} />}
                    {activeSection === 'portfolio'    && <PortfolioSection     allHoldings={allHoldings} cash={cash} onTrade={setTrade} onBondTrade={setBondTrade} onBondSell={setBondSell} onETFTrade={setETFTrade} />}
                    {activeSection === 'stocks'       && <StocksSection        holdings={holdings} onTrade={setTrade} watchlist={watchlist} onWatchlistToggle={toggleWatchlist} isGuest={isGuest} onGuestGate={() => setGuestGate({})} />}
                    {activeSection === 'crypto'       && <CryptoSection        onTrade={setTrade} watchlist={watchlist} onWatchlistToggle={toggleWatchlist} cryptoRaw={cryptoRaw} isGuest={isGuest} onGuestGate={() => setGuestGate({})} />}
                    {activeSection === 'bonds'        && <BondsSection         cash={cash} watchlist={watchlist} onWatchlistToggle={toggleWatchlist} onBondTradeConfirm={handleBondSectionConfirm} bondsRaw={bondsRaw} isGuest={isGuest} onGuestGate={() => setGuestGate({})} />}
                    {activeSection === 'etf'          && <ETFSection           onETFTrade={setETFTrade} watchlist={watchlist} onWatchlistToggle={toggleWatchlist} etfsRaw={etfsRaw} isGuest={isGuest} onGuestGate={() => setGuestGate({})} />}
                    {activeSection === 'commodities'  && <CommoditiesSection   onTrade={setTrade} watchlist={watchlist} onWatchlistToggle={toggleWatchlist} commoditiesRaw={commoditiesRaw} isGuest={isGuest} onGuestGate={() => setGuestGate({})} />}
                    {activeSection === 'transactions' && <TransactionsSection  transactions={transactions} />}
                    {activeSection === 'funding'      && <FundingSection       cash={cash} transactions={transactions} onConfirm={handleFundingConfirm} />}
                    {activeSection === 'exchange'     && <ExchangeSection onGuestGate={isGuest ? () => setGuestGate({}) : null} />}
                    {activeSection === 'news'         && <NewsSection onGuestGate={isGuest ? () => setGuestGate({ title: 'Sign up to read the full article', sub: 'Create a free account to access market news, analysis, and real-time financial updates.' }) : null} />}
                    {activeSection === 'events'       && <EventsSection />}
                    {activeSection === 'trends'       && <TrendsSection onGuestGate={isGuest ? () => setGuestGate({}) : null} />}
                </main>
            </div>
            {tradeTarget && (
                <TradeModal target={tradeTarget} holdings={holdings} cash={cash} onClose={() => setTrade(null)} onConfirm={handleTradeConfirm} />
            )}
            {bondTrade && (
                <BondTradeModal target={bondTrade} cash={cash} onClose={() => setBondTrade(null)} onConfirm={qty => handleBondSectionConfirm(bondTrade, qty)} />
            )}
            {bondSell && (
                <BondSellModal target={bondSell} onClose={() => setBondSell(null)} onConfirm={qty => handleBondSellConfirm(bondSell, qty)} />
            )}
            {etfTarget && (
                <ETFTradeModal target={etfTarget} cash={cash} etfsRaw={etfsRaw} onClose={() => setETFTrade(null)} onConfirm={handleETFTradeConfirm} />
            )}
            {guestGate && <GuestGateModal title={guestGate.title} sub={guestGate.sub} onClose={() => setGuestGate(null)} />}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DashboardApp />);
