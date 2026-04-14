const { useState } = React;

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
    { symbol: 'LMT',   name: 'Lockheed Martin Corp.',   sector: 'Other',       price: 468.20, change:  3.15, changePct:  0.68, volume: '1.6M',   cap: '111B'  },
    { symbol: 'WM',    name: 'Waste Management Inc.',   sector: 'Other',       price: 214.90, change: -1.02, changePct: -0.47, volume: '1.1M',   cap: '82B'   },
];

const STOCK_FUNDAMENTALS = {
    AAPL:  { pe: 28.4,  eps: 6.42,  high52w: 199.62, low52w: 164.08, dividend: '0.92%', beta: 1.24, exchange: 'NASDAQ' },
    MSFT:  { pe: 37.1,  eps: 11.34, high52w: 430.82, low52w: 309.45, dividend: '0.72%', beta: 0.89, exchange: 'NASDAQ' },
    NVDA:  { pe: 65.2,  eps: 14.59, high52w: 974.00, low52w: 402.16, dividend: '0.03%', beta: 1.66, exchange: 'NASDAQ' },
    GOOGL: { pe: 22.8,  eps:  7.84, high52w: 191.75, low52w: 130.67, dividend: null,    beta: 1.06, exchange: 'NASDAQ' },
    TSLA:  { pe: 48.6,  eps:  5.11, high52w: 299.29, low52w: 138.80, dividend: null,    beta: 2.31, exchange: 'NASDAQ' },
    AMZN:  { pe: 43.2,  eps:  4.60, high52w: 201.20, low52w: 118.35, dividend: null,    beta: 1.15, exchange: 'NASDAQ' },
    META:  { pe: 25.7,  eps: 19.95, high52w: 531.49, low52w: 279.40, dividend: null,    beta: 1.22, exchange: 'NASDAQ' },
    NFLX:  { pe: 44.8,  eps: 16.08, high52w: 741.00, low52w: 344.73, dividend: null,    beta: 1.32, exchange: 'NASDAQ' },
    AMD:   { pe: 175.3, eps:  0.93, high52w: 227.30, low52w: 130.59, dividend: null,    beta: 1.72, exchange: 'NASDAQ' },
    DIS:   { pe: 66.1,  eps:  1.70, high52w: 123.74, low52w:  78.73, dividend: null,    beta: 1.04, exchange: 'NYSE'   },
    JPM:   { pe: 12.4,  eps: 16.97, high52w: 220.82, low52w: 143.00, dividend: '2.28%', beta: 1.14, exchange: 'NYSE'   },
    V:     { pe: 32.1,  eps:  8.74, high52w: 290.96, low52w: 211.80, dividend: '0.75%', beta: 0.96, exchange: 'NYSE'   },
    JNJ:   { pe: 15.4,  eps: 10.18, high52w: 168.78, low52w: 144.95, dividend: '3.07%', beta: 0.55, exchange: 'NYSE'   },
    WMT:   { pe: 28.8,  eps:  2.39, high52w:  73.57, low52w:  49.52, dividend: '1.30%', beta: 0.61, exchange: 'NYSE'   },
    XOM:   { pe: 14.1,  eps:  8.17, high52w: 123.75, low52w:  91.10, dividend: '3.37%', beta: 1.06, exchange: 'NYSE'   },
    BAC:   { pe: 12.9,  eps:  3.11, high52w:  43.17, low52w:  24.96, dividend: '2.49%', beta: 1.45, exchange: 'NYSE'   },
    INTC:  { pe: 26.7,  eps:  1.17, high52w:  51.28, low52w:  26.86, dividend: '2.05%', beta: 1.04, exchange: 'NASDAQ' },
    PYPL:  { pe: 16.5,  eps:  4.14, high52w:  77.78, low52w:  50.25, dividend: null,    beta: 1.43, exchange: 'NASDAQ' },
    UBER:  { pe: 68.2,  eps:  1.21, high52w:  87.00, low52w:  52.39, dividend: null,    beta: 1.39, exchange: 'NYSE'   },
    SPOT:  { pe: 114.7, eps:  3.15, high52w: 365.68, low52w: 107.05, dividend: null,    beta: 1.08, exchange: 'NYSE'   },
    LMT:   { pe: 17.2,  eps: 27.23, high52w: 591.62, low52w: 413.92, dividend: '2.76%', beta: 0.47, exchange: 'NYSE'   },
    WM:    { pe: 31.4,  eps:  6.84, high52w: 224.77, low52w: 163.41, dividend: '1.46%', beta: 0.72, exchange: 'NYSE'   },
};

const STOCK_ABOUT = {
    AAPL:  'Apple was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976 in a garage in Cupertino, California. The company revolutionized personal computing with the Macintosh, the portable music industry with the iPod, and the smartphone era with the iPhone in 2007. Today Apple is consistently among the most valuable companies in the world by market capitalization, with its Services segment — including the App Store, iCloud, and Apple Pay representing a rapidly growing portion of profits alongside hardware revenue.',
    MSFT:  'Microsoft was founded by Bill Gates and Paul Allen in 1975 and became the dominant force in personal computing by licensing MS-DOS to IBM. Under CEO Satya Nadella, who took the helm in 2014, the company pivoted aggressively to cloud computing, transforming Azure into a direct rival to AWS. The $68.7B acquisition of Activision Blizzard in 2023 made Microsoft the third-largest gaming company globally, and its deep integration of AI through the OpenAI partnership has accelerated revenue growth across every product line.',
    NVDA:  'NVIDIA was founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem, initially focused on graphics processing units for gaming. The CUDA platform, launched in 2006, unlocked GPU computing for scientific and AI workloads — a prescient bet that became the foundation of the modern AI boom. Today NVIDIA\'s H100 and Blackwell chips are the most sought-after semiconductors on Earth, and the company became the third in history to surpass a $3 trillion market capitalization on the strength of data center AI demand.',
    GOOGL: 'Alphabet was founded as Google by Larry Page and Sergey Brin in 1998, growing from a Stanford research project into the world\'s most-used search engine and the dominant force in digital advertising. The company processes over 8.5 billion searches per day and controls approximately 90% of the global search market. Through Alphabet, Google has diversified into cloud computing (Google Cloud), autonomous vehicles (Waymo), life sciences (Verily), and has launched Gemini as its flagship AI model to compete with OpenAI and Microsoft.',
    TSLA:  'Tesla was founded in 2003 by Martin Eberhard and Marc Tarpenning, with Elon Musk joining as chairman in 2004 and becoming the face of the company. The Model S, launched in 2012, proved that electric vehicles could be desirable premium products and fundamentally shifted the automotive industry\'s trajectory. Tesla operates the world\'s largest EV charging network and is expanding into energy storage and AI-driven autonomy through its Full Self-Driving software, which generates a growing stream of recurring software revenue.',
    AMZN:  'Amazon was founded by Jeff Bezos in 1994 as an online bookstore, expanding rapidly into the "everything store" of global e-commerce. The 2006 launch of Amazon Web Services proved even more transformative — today AWS generates over 60% of Amazon\'s operating profit despite representing only a fraction of total revenue. The company\'s logistics network, with over one million employees and more than 1,000 fulfillment centers worldwide, represents one of the largest private infrastructure buildouts in history, enabling next-day and same-day delivery at scale.',
    META:  'Meta Platforms, originally Facebook, was founded by Mark Zuckerberg in 2004 at Harvard University and grew to become the world\'s largest social network, connecting over 3 billion daily active users across Facebook, Instagram, and WhatsApp. The 2012 acquisition of Instagram for $1B and WhatsApp for $19B in 2014 are considered among the most strategically successful acquisitions in technology history. Meta now generates over $130B in annual advertising revenue and is investing heavily in AI and its metaverse vision through the Reality Labs division.',
    NFLX:  'Netflix was founded by Reed Hastings and Marc Randolph in 1997 as a DVD-by-mail service, pivoting to streaming in 2007 in a move that defined modern media consumption. The company proved audiences would pay for an on-demand subscription model, triggering a streaming arms race across all of Hollywood. With 260+ million global subscribers and over $15B spent annually on original content, Netflix produces more films and series than any studio in history, and its ad-supported tier launched in 2022 has added a new revenue stream.',
    AMD:   'Advanced Micro Devices was founded in 1969 as a semiconductor company and spent decades as a distant second to Intel in CPUs. CEO Lisa Su\'s appointment in 2014 marked a dramatic operational turnaround: the Zen architecture (2017) restored AMD\'s competitiveness, and Ryzen processors now hold a substantial and growing share of the laptop and desktop CPU market. The $35B acquisition of Xilinx in 2022 added FPGAs to AMD\'s portfolio, and its MI300X AI accelerators are emerging as a credible alternative to NVIDIA\'s dominant data center GPUs.',
    DIS:   'The Walt Disney Company was founded by Walt and Roy Disney in 1923 as an animation studio, creating characters from Mickey Mouse to the Marvel Cinematic Universe. Disney\'s acquisition strategy — Pixar ($7.4B, 2006), Marvel ($4B, 2009), Lucasfilm ($4B, 2012), and 21st Century Fox ($71B, 2019) — assembled the most valuable entertainment IP portfolio in history. The launch of Disney+ in 2019 connected these franchises to a direct-to-consumer streaming platform that reached 150 million subscribers in under four years.',
    JPM:   'JPMorgan Chase traces its roots to 1799, making it the oldest major U.S. bank, formed through mergers of dozens of institutions including Chase Manhattan and J.P. Morgan & Co. Under CEO Jamie Dimon, the bank emerged from the 2008 financial crisis as the strongest of the U.S. megabanks, acquiring Bear Stearns and Washington Mutual during the crisis. Today it is the largest U.S. bank by assets, with over $3.9 trillion on its balance sheet, operations in more than 100 countries, and consistently the highest return on equity among large U.S. banks.',
    V:     'Visa was established in 1958 as BankAmericard by Bank of America and became an independent network in 1976, creating the global payment infrastructure that today processes over 200 billion transactions annually. Visa\'s business model is notably asset-light: the company does not lend money or carry credit risk — it operates the rails connecting banks and merchants and collects a small fee on every transaction. With acceptance in over 200 countries and territories, Visa\'s network forms one of the most valuable duopolies in financial services alongside Mastercard.',
    JNJ:   'Johnson & Johnson was founded in 1886 in New Brunswick, New Jersey, producing sterile surgical dressings at a time when post-operative infection was a leading cause of death. Over 135 years the company grew into a healthcare conglomerate spanning consumer health (Band-Aid, Tylenol), pharmaceuticals (Stelara, Darzalex), and medical devices (DePuy Synthes). In 2023 J&J spun off its consumer division as Kenvue and refocused entirely on pharmaceuticals and MedTech, where its blockbuster drugs and deep oncology pipeline drive the vast majority of shareholder value.',
    WMT:   'Walmart was founded by Sam Walton in 1962 in Rogers, Arkansas, pioneering the discount retail supercenter and setting new standards for supply chain logistics. Its satellite-based inventory tracking system in the 1980s was decades ahead of the industry, and today Walmart\'s supply chain remains among the most sophisticated and cost-effective in global retail. With nearly $650B in annual revenue, Walmart is the world\'s largest company by that measure, employing 2.1 million people in the U.S. alone, while its growing e-commerce and advertising businesses are becoming meaningful profit contributors.',
    XOM:   'ExxonMobil was formed in 1999 through the merger of Exxon and Mobil, themselves descendants of John D. Rockefeller\'s Standard Oil trust, which was broken up by antitrust regulators in 1911. As the largest investor-owned oil company in the world, ExxonMobil operates across the entire hydrocarbon value chain — from upstream exploration and production to downstream refining and chemicals. The 2024 acquisition of Pioneer Natural Resources for $60B created the largest acreage position in the Permian Basin, cementing ExxonMobil\'s dominance in U.S. shale production for the coming decades.',
    BAC:   'Bank of America was founded in 1904 in San Francisco as the Bank of Italy to serve immigrant communities, adopting its current name in 1930. The 2008 acquisition of Countrywide Financial and Merrill Lynch during the financial crisis proved costly in the short term but transformed Bank of America into a full-service investment bank and brokerage powerhouse with a massive wealth management franchise. Today it serves over 68 million consumer and small business clients through approximately 3,800 retail branches and is the second-largest U.S. bank by total assets.',
    INTC:  'Intel was founded by Robert Noyce and Gordon Moore in 1968, with Moore\'s Law — predicting the doubling of transistors per chip roughly every two years — guiding the semiconductor industry for five decades. Intel\'s x86 architecture became the computational backbone of the PC era, and its "Wintel" alliance with Microsoft defined personal computing through the 1990s and 2000s. The company faces intense competition from AMD and ARM-based chips and is executing a costly multi-year manufacturing turnaround under CEO Pat Gelsinger, anchored by its IDM 2.0 strategy and a new generation of foundry facilities in the U.S. and Europe.',
    PYPL:  'PayPal was founded in 1998 as Confinity by Max Levchin, Peter Thiel, and Luke Nosek, merging with Elon Musk\'s X.com in 2000 before being acquired by eBay in 2002 for $1.5B. Spun off from eBay in 2015 at a valuation of $50B, PayPal became the world\'s largest standalone digital payments company, processing over $1.5 trillion in payment volume annually across 430 million active accounts. The 2013 acquisition of Venmo embedded it in American peer-to-peer payments culture, while its merchant services and Buy Now Pay Later offerings represent significant emerging revenue streams.',
    UBER:  'Uber was founded in 2009 by Travis Kalanick and Garrett Camp after they struggled to find a taxi in Paris, growing from a luxury black car service in San Francisco into a global platform operating in over 70 countries. The company\'s expansion created an entirely new category — the gig economy ride-hailing market — while facing legal battles over driver classification across dozens of jurisdictions. Under CEO Dara Khosrowshahi, Uber achieved its first full-year profitability in 2023, driven by Uber Eats\' growth and the emergence of advertising as a meaningful revenue layer on top of its core mobility business.',
    SPOT:  'Spotify was founded in 2006 in Stockholm by Daniel Ek and Martin Lorentzon as a legal alternative to music piracy, offering on-demand streaming at a time when iTunes dominated digital music sales. The platform launched in the U.S. in 2011 and went public via a direct listing in 2018, forgoing the traditional IPO process to avoid underwriter dilution. With over 600 million monthly active users and 250 million paying subscribers, Spotify commands roughly 30% of the global music streaming market, and its aggressive expansion into podcasting and audiobooks has positioned it as the dominant audio platform worldwide.',
    LMT:   'Lockheed Martin was formed in 1995 through the merger of Lockheed Corporation and Martin Marietta, uniting two of the most storied names in American aerospace and defense. The company is the world\'s largest defense contractor by revenue, best known for the F-35 Lightning II — the most expensive weapons program in history at over $400B lifetime cost — as well as the F-22 Raptor, C-130 Hercules, and the Sikorsky Black Hawk helicopter. Beyond aviation, Lockheed Martin is a leading provider of missile defense systems, hypersonic weapons, satellites, and classified intelligence solutions, with the U.S. government representing approximately 70% of its annual revenue.',
    WM:    'Waste Management was founded in 1968 in Chicago and grew through aggressive acquisitions to become the largest waste collection, disposal, and recycling company in North America. The company operates over 250 landfills — the largest such network on the continent — along with transfer stations, recycling facilities, and a rapidly growing landfill gas-to-energy business that converts methane emissions from decomposing waste into renewable electricity. WM serves approximately 21 million residential, commercial, and industrial customers across the United States and Canada, and its 2023 acquisition of Stericycle expanded its footprint into medical and hazardous waste disposal.',
};

const _DEFAULT_STOCK_HOLDINGS = [
    { symbol: 'AAPL',  qty: 10, avgPrice: 178.50 },
    { symbol: 'MSFT',  qty: 5,  avgPrice: 415.20 },
    { symbol: 'NVDA',  qty: 3,  avgPrice: 890.00 },
    { symbol: 'GOOGL', qty: 2,  avgPrice: 175.30 },
];
function _ssGet(key, fallback) { try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
const SESSION_USER = {
    cash:     _ssGet('ptp_cash',   12450.30),
    holdings: _ssGet('ptp_stocks', _DEFAULT_STOCK_HOLDINGS),
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
    { id: 1,  symbol: 'NVDA',  impact: 'positive', impactPct:  +4.20, headline: 'NVIDIA beats Q1 estimates with record data center revenue of $22.6B',       source: 'Reuters',      time: '2h ago'  },
    { id: 2,  symbol: 'AAPL',  impact: 'negative', impactPct:  -1.80, headline: 'Apple faces new EU antitrust probe over App Store payment rules',            source: 'Bloomberg',    time: '4h ago'  },
    { id: 3,  symbol: 'TSLA',  impact: 'negative', impactPct:  -3.50, headline: 'Tesla Q1 deliveries fall short of expectations amid weak demand in Europe',   source: 'CNBC',         time: '5h ago'  },
    { id: 4,  symbol: 'MSFT',  impact: 'positive', impactPct:  +2.10, headline: 'Microsoft Azure revenue surges 31% YoY driven by AI workloads',              source: 'TechCrunch',   time: '6h ago'  },
    { id: 5,  symbol: 'AMZN',  impact: 'positive', impactPct:  +1.60, headline: 'Amazon AWS announces $15B expansion of data centers in Southeast Asia',      source: 'WSJ',          time: '8h ago'  },
    { id: 6,  symbol: 'META',  impact: 'positive', impactPct:  +3.80, headline: 'Meta AI assistant reaches 500M monthly active users globally',               source: 'The Verge',    time: '10h ago' },
    { id: 7,  symbol: 'GOOGL', impact: 'neutral',  impactPct:  -0.30, headline: 'Alphabet antitrust ruling expected next month in DOJ search case',           source: 'FT',           time: '12h ago' },
    { id: 8,  symbol: 'JPM',   impact: 'positive', impactPct:  +1.20, headline: 'JPMorgan raises full-year NII guidance on higher-for-longer rates',          source: 'MarketWatch',  time: '14h ago' },
    { id: 9,  symbol: 'INTC',  impact: 'negative', impactPct:  -5.60, headline: 'Intel delays next-gen Panther Lake chip by one quarter amid yield issues',   source: 'Wired',        time: '1d ago'  },
    { id: 10, symbol: 'XOM',   impact: 'neutral',  impactPct:  +0.10, headline: 'Exxon Mobil acquires Pioneer Natural Resources integration on track',        source: 'Oil & Gas J.', time: '1d ago'  },
    { id: 11, symbol: 'NVDA',  impact: 'positive', impactPct:  +2.80, headline: 'NVIDIA Blackwell GPU demand forces hyperscalers to extend supply contracts',   source: 'Bloomberg',    time: '1d ago'  },
    { id: 12, symbol: 'AAPL',  impact: 'positive', impactPct:  +1.40, headline: 'Apple iPhone 17 Pro leak confirms periscope camera and A19 chip upgrade',      source: 'MacRumors',    time: '2d ago'  },
    { id: 13, symbol: 'TSLA',  impact: 'positive', impactPct:  +5.10, headline: 'Tesla Full Self-Driving v13 achieves 99.2% intervention-free mile rate in US fleet', source: 'Electrek', time: '2d ago' },
    { id: 14, symbol: 'MSFT',  impact: 'negative', impactPct:  -0.90, headline: 'Microsoft faces US FTC scrutiny over OpenAI exclusive licensing terms',        source: 'Politico',     time: '2d ago'  },
    { id: 15, symbol: 'NVDA',  impact: 'positive', impactPct:  +1.50, headline: 'NVIDIA unveils GeForce RTX 5090 with 2× the performance of RTX 4090',        source: 'The Verge',    time: '3d ago'  },
    { id: 16, symbol: 'AAPL',  impact: 'negative', impactPct:  -2.40, headline: 'Apple Vision Pro sales reportedly slow sharply after initial launch surge',    source: 'WSJ',          time: '3d ago'  },
    { id: 17, symbol: 'MSFT',  impact: 'positive', impactPct:  +3.20, headline: 'Microsoft GitHub Copilot Enterprise crosses 1M paid seats milestone',         source: 'TechCrunch',   time: '3d ago'  },
    { id: 18, symbol: 'TSLA',  impact: 'negative', impactPct:  -1.70, headline: 'Tesla recalls 125,000 vehicles over seatbelt warning chime software bug',      source: 'Reuters',      time: '4d ago'  },
    { id: 19, symbol: 'AMZN',  impact: 'positive', impactPct:  +2.30, headline: 'Amazon advertising revenue overtakes Comcast to become third-largest US ad platform', source: 'CNBC', time: '4d ago' },
    { id: 20, symbol: 'NVDA',  impact: 'neutral',  impactPct:  -0.60, headline: 'NVIDIA China revenue cut anticipated as US tightens H20 chip export controls', source: 'FT',           time: '5d ago'  },
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

function StockNavbar() {
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

function StockIdentityCard({ stock }) {
    const positive    = stock.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';
    const changeIcon  = positive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';

    return (
        <div className="sidebar-card identity-card">
            <div className="identity-row">
                <div className="identity-left">
                    <span className="hero-symbol">{stock.symbol}</span>
                    <div className="identity-name-block">
                        <span className="identity-name">{stock.name}</span>
                        <span className="hero-sector">{stock.sector}</span>
                    </div>
                </div>
                <div className="identity-right">
                    <span className="identity-price">${fmt(stock.price)}</span>
                    <span className={`identity-change ${changeClass}`}>
                        <i className={`bi ${changeIcon}`}></i>
                        {positive ? '+' : ''}{fmt(stock.change)} ({positive ? '+' : ''}{fmt(stock.changePct)}%)
                    </span>
                </div>
            </div>
            <div className="identity-meta-row">
                <span className="identity-meta-item">
                    <i className="bi bi-bar-chart"></i> Vol: {stock.volume}
                </span>
                <span className="identity-meta-item">
                    <i className="bi bi-building"></i> Cap: {stock.cap}
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

function StockChart({ stock, period, onPeriodChange }) {
    const [chartType, setChartType] = React.useState(localStorage.getItem('chartType') || 'line');
    const data    = generatePriceHistory(stock.price, stock.changePct, PERIOD_POINTS[period]);
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
    const gradId  = `stockGrad_${stock.symbol}`;
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

function FundamentalsCard({ fundamentals }) {
    const metrics = [
        { label: 'P/E Ratio',  value: fundamentals.pe.toFixed(1)        },
        { label: 'EPS',        value: `$${fundamentals.eps.toFixed(2)}`  },
        { label: '52W High',   value: `$${fmt(fundamentals.high52w)}`    },
        { label: '52W Low',    value: `$${fmt(fundamentals.low52w)}`     },
        { label: 'Dividend',   value: fundamentals.dividend ?? '—'       },
        { label: 'Beta',       value: fundamentals.beta.toFixed(2)       },
        { label: 'Exchange',   value: fundamentals.exchange              },
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

function TradeModal({ stock, initialSide, cash, ownedQty, onClose, onTradeComplete }) {
    const [side,   setSide]   = useState(initialSide);
    const [rawQty, setRawQty] = useState('1');
    const [done,   setDone]   = useState(false);

    const qty        = parseFloat(rawQty.replace(',', '.')) || 0;
    const displayQty = rawQty.startsWith('.') ? '0' + rawQty : rawQty;
    const price    = stock.price;
    const total    = qty * price;
    const canTrade = qty > 0 && (side === 'buy' ? total <= cash : qty <= ownedQty);

    function handleQty(e) {
        const val = e.target.value;
        if (val.replace(/[,.]/g, '').length > 8) return;
        if (/^0[0-9]/.test(val)) return;
        if (/^[0-9]*[,.]?[0-9]*$/.test(val)) setRawQty(val);
    }

    function handleConfirm() {
        persistTrade(stock.symbol, stock.name, side, qty, price, 'stock', 'ptp_stocks');
        if (onTradeComplete) onTradeComplete(side, qty, price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{stock.symbol}</span>
                        <span className="trade-company">{stock.name}</span>
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
                                <span>Price per share</span><span>${fmt(price)}</span>
                            </div>
                            <div className="trade-summary-row">
                                <span>Shares</span><span>{displayQty || '0'}</span>
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
                                    <span>Owned shares</span>
                                    <span className={qty > ownedQty ? 'negative' : ''}>{ownedQty}</span>
                                </div>
                            )}
                        </div>
                        {rawQty !== '' && qty > 0 && !canTrade && (
                            <p className="trade-error">{side === 'buy' ? 'Insufficient funds.' : 'Insufficient shares.'}</p>
                        )}
                        <button className={`trade-confirm-btn ${side}`} onClick={handleConfirm} disabled={!canTrade}>
                            {qty === 0 ? (side === 'buy' ? 'Buy shares' : 'Sell shares') : `${side === 'buy' ? 'Buy' : 'Sell'} ${displayQty} share${qty !== 1 ? 's' : ''} of ${stock.symbol}`}
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

function TradeCard({ stock }) {
    const [modal,    setModal]    = useState(null);
    const [cash,     setCash]     = useState(SESSION_USER.cash);
    const [holdings, setHoldings] = useState(SESSION_USER.holdings);

    const ownedQty = holdings.find(h => h.symbol === stock.symbol)?.qty || 0;

    function handleTradeComplete(side, qty, price) {
        const total = qty * price;
        setCash(c => side === 'buy' ? c - total : c + total);
        setHoldings(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === stock.symbol);
                if (ex) return prev.map(h => h.symbol === stock.symbol ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + price * qty) / (h.qty + qty) } : h);
                return [...prev, { symbol: stock.symbol, qty, avgPrice: price }];
            }
            return prev.map(h => h.symbol === stock.symbol ? { ...h, qty: h.qty - qty } : h).filter(h => h.qty > 0);
        });
    }

    const positive    = stock.changePct >= 0;
    const changeClass = positive ? 'positive' : 'negative';

    return (
        <>
            <div className="sidebar-card trade-card">
                <h3 className="card-section-title">Trade</h3>
                <div className="trade-price-center">
                    <span className="trade-current-price">${fmt(stock.price)}</span>
                    <span className={`trade-change-badge ${changeClass}`}>
                        {positive ? '+' : ''}{fmt(stock.changePct)}%
                    </span>
                </div>
                <div className="trade-btn-row">
                    <button className="trade-action-btn buy-btn" onClick={() => setModal('buy')}>Buy</button>
                    <button className="trade-action-btn sell-btn" onClick={() => setModal('sell')}>Sell</button>
                </div>
                <div className="watchlist-trade-row">
                    <WatchlistBtnLg symbol={stock.symbol} type="stock" />
                </div>
            </div>
            {modal && <TradeModal stock={stock} initialSide={modal} cash={cash} ownedQty={ownedQty} onClose={() => setModal(null)} onTradeComplete={handleTradeComplete} />}
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
    const text = STOCK_ABOUT[symbol];
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
            <i className="bi bi-graph-up not-found-icon"></i>
            <h2 className="not-found-title">Stock not found</h2>
            <p className="not-found-body">The stock you are looking for does not exist in our database.</p>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </div>
    );
}

function StockPage() {
    const [period, setPeriod] = useState('1M');

    const params = new URLSearchParams(window.location.search);
    const symbol = params.get('symbol');
    const stock  = MOCK_STOCKS.find(s => s.symbol === symbol);

    if (!stock) {
        return (
            <div className="stock-page">
                <StockNavbar />
                <main className="stock-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    const fundamentals = STOCK_FUNDAMENTALS[symbol];

    return (
        <div className="stock-page">
            <StockNavbar />
            <main className="stock-main">
                <div className="container stock-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <StockIdentityCard stock={stock} />
                            <StockChart stock={stock} period={period} onPeriodChange={setPeriod} />
                            {fundamentals && <FundamentalsCard fundamentals={fundamentals} />}
                        </div>
                        <div className="col-lg-4">
                            <TradeCard stock={stock} />
                            <RelatedNewsPanel symbol={symbol} />
                            <AboutCard symbol={symbol} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StockPage />);
