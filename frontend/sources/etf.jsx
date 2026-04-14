const { useState } = React;

const MOCK_ETFS = [
    { symbol: 'SPY',  name: 'SPDR S&P 500 ETF Trust',           category: 'Broad Market', price:  524.58, change:   6.32, changePct:  1.22, volume: '62.4M', aum: '507B' },
    { symbol: 'QQQ',  name: 'Invesco QQQ Trust',                category: 'Sector',       price:  442.30, change:   8.20, changePct:  1.89, volume: '38.1M', aum: '254B' },
    { symbol: 'VTI',  name: 'Vanguard Total Stock Market ETF',   category: 'Broad Market', price:  248.10, change:   2.28, changePct:  0.93, volume: '24.6M', aum: '418B' },
    { symbol: 'IWM',  name: 'iShares Russell 2000 ETF',          category: 'Small Cap',    price:  206.40, change:  -1.00, changePct: -0.48, volume: '28.2M', aum: '58B'  },
    { symbol: 'GLD',  name: 'SPDR Gold Shares',                  category: 'Thematic',     price:  232.10, change:   1.30, changePct:  0.56, volume:  '8.5M', aum: '61B'  },
    { symbol: 'TLT',  name: 'iShares 20+ Year Treasury Bond ETF',category: 'Bond ETF',     price:   96.20, change:  -0.31, changePct: -0.32, volume: '14.8M', aum: '54B'  },
    { symbol: 'VNQ',  name: 'Vanguard Real Estate ETF',          category: 'Sector',       price:   88.40, change:   1.00, changePct:  1.14, volume:  '6.2M', aum: '35B'  },
    { symbol: 'ARKK', name: 'ARK Innovation ETF',                category: 'Thematic',     price:   48.90, change:   1.53, changePct:  3.22, volume: '18.3M', aum: '8B'   },
    { symbol: 'EEM',  name: 'iShares MSCI Emerging Markets ETF', category: 'International', price:  42.10, change:  -0.36, changePct: -0.85, volume: '22.4M', aum: '22B'  },
    { symbol: 'XLK',  name: 'Technology Select Sector SPDR',     category: 'Sector',       price:  224.80, change:   3.58, changePct:  1.62, volume: '12.1M', aum: '65B'  },
];

const TYPE_CONFIG = {
    stock:     { icon: 'bi-graph-up-arrow',   color: '#00c896', label: 'Stocks'      },
    bond:      { icon: 'bi-bank',             color: '#3b82f6', label: 'Bonds'       },
    commodity: { icon: 'bi-box-seam',         color: '#f472b6', label: 'Commodities' },
    etf:       { icon: 'bi-layers',           color: '#a78bfa', label: 'ETF'         },
    crypto:    { icon: 'bi-currency-bitcoin', color: '#f59e0b', label: 'Crypto'      },
};

const ETF_TOP_HOLDINGS = {
    SPY:  [
        { symbol: 'AAPL',  name: 'Apple Inc.',          weight: 6.82, type: 'stock',     href: 'stock.html?symbol=AAPL'      },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',      weight: 6.18, type: 'stock',     href: 'stock.html?symbol=MSFT'      },
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',         weight: 5.44, type: 'stock',     href: 'stock.html?symbol=NVDA'      },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',      weight: 3.42, type: 'stock',     href: 'stock.html?symbol=AMZN'      },
        { symbol: 'META',  name: 'Meta Platforms',       weight: 2.58, type: 'stock',     href: 'stock.html?symbol=META'      },
        { symbol: 'US10Y', name: 'US Treasury 10Y',      weight: 2.14, type: 'bond',      href: 'bonds.html?symbol=US10Y'     },
        { symbol: 'US30Y', name: 'US Treasury 30Y',      weight: 1.82, type: 'bond',      href: 'bonds.html?symbol=US30Y'     },
        { symbol: 'XAU',   name: 'Gold Bullion',         weight: 0.96, type: 'commodity', href: 'commodity.html?symbol=XAU'   },
    ],
    QQQ:  [
        { symbol: 'MSFT',  name: 'Microsoft Corp.',      weight: 8.14, type: 'stock',  href: 'stock.html?symbol=MSFT'  },
        { symbol: 'AAPL',  name: 'Apple Inc.',           weight: 7.82, type: 'stock',  href: 'stock.html?symbol=AAPL'  },
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',         weight: 7.44, type: 'stock',  href: 'stock.html?symbol=NVDA'  },
        { symbol: 'META',  name: 'Meta Platforms',       weight: 4.62, type: 'stock',  href: 'stock.html?symbol=META'  },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',      weight: 4.94, type: 'stock',  href: 'stock.html?symbol=AMZN'  },
        { symbol: 'TSLA',  name: 'Tesla Inc.',           weight: 3.38, type: 'stock',  href: 'stock.html?symbol=TSLA'  },
        { symbol: 'BTC',   name: 'Bitcoin',              weight: 3.24, type: 'crypto', href: 'crypto.html?symbol=BTC'  },
        { symbol: 'ETH',   name: 'Ethereum',             weight: 2.18, type: 'crypto', href: 'crypto.html?symbol=ETH'  },
    ],
    VTI:  [
        { symbol: 'AAPL',  name: 'Apple Inc.',           weight: 5.48, type: 'stock',     href: 'stock.html?symbol=AAPL'    },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',      weight: 4.96, type: 'stock',     href: 'stock.html?symbol=MSFT'    },
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',         weight: 4.42, type: 'stock',     href: 'stock.html?symbol=NVDA'    },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',      weight: 2.98, type: 'stock',     href: 'stock.html?symbol=AMZN'    },
        { symbol: 'US10Y', name: 'US Treasury 10Y',      weight: 3.14, type: 'bond',      href: 'bonds.html?symbol=US10Y'   },
        { symbol: 'US2Y',  name: 'US Treasury 2Y',       weight: 2.48, type: 'bond',      href: 'bonds.html?symbol=US2Y'    },
        { symbol: 'XAU',   name: 'Gold Bullion',         weight: 1.28, type: 'commodity', href: 'commodity.html?symbol=XAU' },
        { symbol: 'CL',    name: 'Crude Oil WTI',        weight: 0.84, type: 'commodity', href: 'commodity.html?symbol=CL'  },
    ],
    IWM:  [
        { symbol: 'INSM',  name: 'Insmed Inc.',          weight: 0.42, type: 'stock'                                        },
        { symbol: 'RXRX',  name: 'Recursion Pharma.',    weight: 0.38, type: 'stock'                                        },
        { symbol: 'HIMS',  name: 'Hims & Hers Health',   weight: 0.33, type: 'stock'                                        },
        { symbol: 'PLXS',  name: 'Plexus Corp.',         weight: 0.31, type: 'stock'                                        },
        { symbol: 'US2Y',  name: 'US Treasury 2Y',       weight: 4.24, type: 'bond',      href: 'bonds.html?symbol=US2Y'    },
        { symbol: 'DE5Y',  name: 'Germany Bund 5Y',     weight: 2.82, type: 'bond',      href: 'bonds.html?symbol=DE5Y'   },
        { symbol: 'XAG',   name: 'Silver Spot',          weight: 1.14, type: 'commodity', href: 'commodity.html?symbol=XAG' },
        { symbol: 'BTC',   name: 'Bitcoin',              weight: 0.88, type: 'crypto',    href: 'crypto.html?symbol=BTC'    },
    ],
    GLD:  [
        { symbol: 'XAU',   name: 'Gold Bullion',         weight: 54.40, type: 'commodity', href: 'commodity.html?symbol=XAU' },
        { symbol: 'XAG',   name: 'Silver Spot',          weight: 18.60, type: 'commodity', href: 'commodity.html?symbol=XAG' },
        { symbol: 'CL',    name: 'Crude Oil WTI',        weight: 9.80,  type: 'commodity', href: 'commodity.html?symbol=CL'  },
        { symbol: 'HG',    name: 'Copper Futures',       weight: 6.40,  type: 'commodity', href: 'commodity.html?symbol=HG'  },
        { symbol: 'AAPL',  name: 'Apple Inc.',           weight: 4.20,  type: 'stock',     href: 'stock.html?symbol=AAPL'    },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',      weight: 3.40,  type: 'stock',     href: 'stock.html?symbol=MSFT'    },
        { symbol: 'BTC',   name: 'Bitcoin',              weight: 2.20,  type: 'crypto',    href: 'crypto.html?symbol=BTC'    },
        { symbol: 'ETH',   name: 'Ethereum',             weight: 1.00,  type: 'crypto',    href: 'crypto.html?symbol=ETH'    },
    ],
    TLT:  [
        { symbol: 'US30Y', name: 'US Treasury 30Y',      weight: 8.42, type: 'bond',      href: 'bonds.html?symbol=US30Y'   },
        { symbol: 'US10Y', name: 'US Treasury 10Y',      weight: 7.88, type: 'bond',      href: 'bonds.html?symbol=US10Y'   },
        { symbol: 'DE5Y',  name: 'Germany Bund 5Y',     weight: 6.24, type: 'bond',      href: 'bonds.html?symbol=DE5Y'   },
        { symbol: 'GB10Y', name: 'UK Gilt 10Y',          weight: 5.80, type: 'bond',      href: 'bonds.html?symbol=GB10Y'   },
        { symbol: 'US2Y',  name: 'US Treasury 2Y',       weight: 5.44, type: 'bond',      href: 'bonds.html?symbol=US2Y'    },
        { symbol: 'XAU',   name: 'Gold Bullion',         weight: 3.60, type: 'commodity', href: 'commodity.html?symbol=XAU' },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',      weight: 2.18, type: 'stock',     href: 'stock.html?symbol=MSFT'    },
        { symbol: 'AAPL',  name: 'Apple Inc.',           weight: 1.84, type: 'stock',     href: 'stock.html?symbol=AAPL'    },
    ],
    VNQ:  [
        { symbol: 'PLD',   name: 'Prologis Inc.',        weight: 8.42, type: 'stock'                                        },
        { symbol: 'AMT',   name: 'American Tower',       weight: 6.18, type: 'stock'                                        },
        { symbol: 'EQIX',  name: 'Equinix Inc.',         weight: 5.74, type: 'stock'                                        },
        { symbol: 'WELL',  name: 'Welltower Inc.',       weight: 4.92, type: 'stock'                                        },
        { symbol: 'MSFT28',name: 'Microsoft 2028 Bond',  weight: 4.10, type: 'bond',      href: 'bonds.html?symbol=MSFT28'  },
        { symbol: 'US10Y', name: 'US Treasury 10Y',      weight: 3.28, type: 'bond',      href: 'bonds.html?symbol=US10Y'   },
        { symbol: 'XAU',   name: 'Gold Bullion',         weight: 2.14, type: 'commodity', href: 'commodity.html?symbol=XAU' },
        { symbol: 'SPY',   name: 'SPDR S&P 500 ETF',    weight: 1.88, type: 'etf',       href: 'etf.html?symbol=SPY'       },
    ],
    ARKK: [
        { symbol: 'TSLA',  name: 'Tesla Inc.',           weight: 11.40, type: 'stock',  href: 'stock.html?symbol=TSLA'  },
        { symbol: 'ROKU',  name: 'Roku Inc.',            weight: 8.64,  type: 'stock'                                   },
        { symbol: 'RBLX',  name: 'Roblox Corp.',         weight: 7.48,  type: 'stock'                                   },
        { symbol: 'PATH',  name: 'UiPath Inc.',          weight: 6.92,  type: 'stock'                                   },
        { symbol: 'BTC',   name: 'Bitcoin',              weight: 9.82,  type: 'crypto', href: 'crypto.html?symbol=BTC'  },
        { symbol: 'ETH',   name: 'Ethereum',             weight: 6.40,  type: 'crypto', href: 'crypto.html?symbol=ETH'  },
        { symbol: 'SOL',   name: 'Solana',               weight: 4.18,  type: 'crypto', href: 'crypto.html?symbol=SOL'  },
        { symbol: 'US10Y', name: 'US Treasury 10Y',      weight: 3.24,  type: 'bond',   href: 'bonds.html?symbol=US10Y' },
    ],
    EEM:  [
        { symbol: 'TSM',      name: 'Taiwan Semiconductor',  weight: 8.24, type: 'stock'                                        },
        { symbol: 'BABA',     name: 'Alibaba Group',         weight: 4.10, type: 'stock'                                        },
        { symbol: 'TCEHY',    name: 'Tencent Holdings',      weight: 3.82, type: 'stock'                                        },
        { symbol: 'INFY',     name: 'Infosys Ltd.',          weight: 1.84, type: 'stock'                                        },
        { symbol: 'CL',       name: 'Crude Oil WTI',         weight: 3.48, type: 'commodity', href: 'commodity.html?symbol=CL'  },
        { symbol: 'XAU',      name: 'Gold Bullion',          weight: 2.62, type: 'commodity', href: 'commodity.html?symbol=XAU' },
        { symbol: 'DE10Y',    name: 'Germany Bund 10Y',      weight: 2.18, type: 'bond',      href: 'bonds.html?symbol=DE5Y'   },
        { symbol: 'GB10Y',    name: 'UK Gilt 10Y',           weight: 1.74, type: 'bond',      href: 'bonds.html?symbol=GB10Y'   },
    ],
    XLK:  [
        { symbol: 'AAPL', name: 'Apple Inc.',           weight: 21.84, type: 'stock',  href: 'stock.html?symbol=AAPL' },
        { symbol: 'MSFT', name: 'Microsoft Corp.',      weight: 21.42, type: 'stock',  href: 'stock.html?symbol=MSFT' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.',         weight: 18.96, type: 'stock',  href: 'stock.html?symbol=NVDA' },
        { symbol: 'AVGO', name: 'Broadcom Inc.',        weight: 5.82,  type: 'stock'                                  },
        { symbol: 'ORCL', name: 'Oracle Corp.',         weight: 3.44,  type: 'stock'                                  },
        { symbol: 'BTC',  name: 'Bitcoin',              weight: 4.82,  type: 'crypto', href: 'crypto.html?symbol=BTC' },
        { symbol: 'ETH',  name: 'Ethereum',             weight: 3.14,  type: 'crypto', href: 'crypto.html?symbol=ETH' },
        { symbol: 'HG',   name: 'Copper Futures',       weight: 1.96,  type: 'commodity', href: 'commodity.html?symbol=HG' },
    ],
};

const ETF_FUNDAMENTALS = {
    SPY:  { expenseRatio: 0.0945, holdings: 503,  inception: '1993-01-22', exchange: 'NYSE Arca', currency: 'USD', index: 'S&P 500'                        },
    QQQ:  { expenseRatio: 0.20,   holdings: 101,  inception: '1999-03-10', exchange: 'NASDAQ',    currency: 'USD', index: 'NASDAQ-100'                      },
    VTI:  { expenseRatio: 0.03,   holdings: 3621, inception: '2001-05-24', exchange: 'NYSE Arca', currency: 'USD', index: 'CRSP US Total Market'            },
    IWM:  { expenseRatio: 0.19,   holdings: 1971, inception: '2000-05-22', exchange: 'NYSE Arca', currency: 'USD', index: 'Russell 2000'                    },
    GLD:  { expenseRatio: 0.40,   holdings: 1,    inception: '2004-11-18', exchange: 'NYSE Arca', currency: 'USD', index: 'Gold Spot Price (LBMA)'          },
    TLT:  { expenseRatio: 0.15,   holdings: 39,   inception: '2002-07-22', exchange: 'NASDAQ',    currency: 'USD', index: 'ICE U.S. Treasury 20+ Year Bond' },
    VNQ:  { expenseRatio: 0.12,   holdings: 162,  inception: '2004-09-23', exchange: 'NYSE Arca', currency: 'USD', index: 'MSCI US REIT'                    },
    ARKK: { expenseRatio: 0.75,   holdings: 36,   inception: '2014-10-31', exchange: 'NYSE Arca', currency: 'USD', index: 'Active (no benchmark)'           },
    EEM:  { expenseRatio: 0.70,   holdings: 1225, inception: '2003-04-07', exchange: 'NYSE Arca', currency: 'USD', index: 'MSCI Emerging Markets'           },
    XLK:  { expenseRatio: 0.09,   holdings: 65,   inception: '1998-12-16', exchange: 'NYSE Arca', currency: 'USD', index: 'Technology Select Sector'        },
};

const ETF_ABOUT = {
    SPY:  'The SPDR S&P 500 ETF Trust, launched in January 1993, was the first ETF listed in the United States and remains the world\'s most traded security by dollar volume. Managed by State Street Global Advisors, SPY tracks the S&P 500 index, giving investors exposure to 503 of the largest publicly traded U.S. companies across all 11 GICS sectors. With over $500 billion in assets under management and an average daily trading volume exceeding $20 billion, SPY has become the definitive instrument for expressing a view on U.S. large-cap equities, used by retail investors, institutional traders, and hedge funds alike for both long-term investment and intraday speculation.',
    QQQ:  'The Invesco QQQ Trust, launched in 1999, tracks the NASDAQ-100 index, which consists of the 100 largest non-financial companies listed on the NASDAQ Stock Market. QQQ is heavily weighted toward technology — Apple, Microsoft, NVIDIA, Amazon, and Meta alone account for nearly 40% of the fund — making it the most efficient vehicle for concentrated technology sector exposure. With over $250 billion in assets and among the highest trading volumes of any ETF globally, QQQ has delivered exceptional long-term returns driven by the secular growth of software, cloud computing, semiconductors, and consumer internet platforms, making it a core holding for growth-oriented investors.',
    VTI:  'The Vanguard Total Stock Market ETF provides comprehensive exposure to the entire U.S. equity market across all capitalizations — large, mid, small, and micro-cap — through a single, ultra-low-cost instrument. Tracking the CRSP US Total Market Index and holding over 3,600 securities, VTI represents the purest expression of passive market-cap-weighted U.S. equity investing. At just 0.03% expense ratio, it is one of the cheapest investment vehicles in the world. VTI is the flagship product of Vanguard\'s index investing philosophy, embodying the belief that broad diversification at minimal cost produces superior long-term outcomes compared to active management.',
    IWM:  'The iShares Russell 2000 ETF is the world\'s most widely used instrument for accessing U.S. small-cap equities, tracking nearly 2,000 companies with market capitalizations below $5 billion. Small-cap stocks tend to be more domestically focused, more sensitive to U.S. economic cycles, and less covered by Wall Street analysts — making IWM a cyclical barometer and a vehicle for capturing the "small-cap premium" that academic research suggests exists over long time horizons. IWM is also heavily used as a macro hedge, with institutional investors frequently trading it against SPY or QQQ to express relative value views between large-cap and small-cap segments.',
    GLD:  'The SPDR Gold Shares ETF, launched in November 2004 and backed physically by gold bullion stored in HSBC vaults in London, democratized gold investment by eliminating the complexity of futures contracts and physical storage. GLD\'s price tracks the LBMA gold spot price, with each share representing approximately 1/10th of a troy ounce. Gold has served as a store of value for thousands of years, and GLD provides modern investors with efficient access to this safe-haven asset. Inflows into GLD typically surge during periods of elevated inflation, dollar weakness, geopolitical uncertainty, or financial market stress — making it a classic portfolio hedge and flight-to-safety instrument.',
    TLT:  'The iShares 20+ Year Treasury Bond ETF provides exposure to long-duration U.S. government bonds, making it one of the most interest-rate-sensitive instruments in the ETF universe. A 1% rise in long-term yields can reduce TLT\'s price by approximately 15-18%, while falling yields drive equivalent gains — creating a powerful instrument for expressing views on the long end of the yield curve. TLT is widely used as a flight-to-safety trade during equity market downturns, as Treasury bonds historically rally when stocks fall. It is also used to hedge duration risk in fixed-income portfolios and as a tactical tool by macro investors positioning around Federal Reserve policy and inflation expectations.',
    VNQ:  'The Vanguard Real Estate ETF provides diversified exposure to U.S. real estate investment trusts (REITs), which are required by law to distribute at least 90% of taxable income to shareholders — making VNQ a natural choice for income-seeking investors. The fund holds over 160 REITs spanning residential, commercial, retail, industrial, data center, and healthcare real estate. VNQ is sensitive to interest rates — higher rates increase borrowing costs for REITs and make their dividend yields less competitive with bonds — but it also offers inflation protection, as property values and rents tend to rise with inflation over long time horizons, making it a component in inflation-aware portfolio construction.',
    ARKK: 'The ARK Innovation ETF, managed by Cathie Wood\'s ARK Invest, is the world\'s most prominent actively managed ETF focused on disruptive innovation across genomics, artificial intelligence, robotics, energy storage, and blockchain technology. ARKK experienced one of the most dramatic rises and falls in ETF history — surging over 150% in 2020 driven by pandemic-era technology euphoria, then losing over 75% of its value through 2022 as interest rates rose and speculative growth stocks collapsed. As an active fund without a benchmark constraint, ARKK takes concentrated positions in high-conviction names and accepts significant volatility in pursuit of long-term transformational returns, attracting investors with high risk tolerance and long investment horizons.',
    EEM:  'The iShares MSCI Emerging Markets ETF provides broad exposure to over 1,200 large and mid-cap companies across 24 emerging market countries, with heavy weightings toward China, India, Taiwan, South Korea, and Brazil. EEM captures the growth potential of developing economies but carries risks absent in developed markets — currency volatility, political uncertainty, regulatory intervention, liquidity risk, and governance standards that diverge from Western norms. China\'s weight in EEM has been a particular focus for investors navigating geopolitical tensions and regulatory crackdowns. Despite higher volatility, emerging markets offer a demographic and economic growth trajectory that can generate superior long-term returns in favorable macro environments.',
    XLK:  'The Technology Select Sector SPDR Fund provides concentrated exposure to the technology sector within the S&P 500, holding approximately 65 companies including Apple, Microsoft, NVIDIA, Broadcom, and Salesforce. With one of the lowest expense ratios among sector ETFs at 0.09%, XLK has been among the best-performing sector funds over the past decade, driven by the dominance of U.S. technology companies in global earnings, innovation, and market capitalization. The fund is heavily concentrated — its top five holdings often exceed 50% of total assets — reflecting the winner-takes-most dynamics of software, semiconductors, and cloud computing that have defined the modern technology economy.',
};

const MOCK_NEWS = [
    { id: 1,  symbol: 'SPY',  impact: 'positive', impactPct: +1.20, headline: 'S&P 500 hits record high as Fed signals rate cuts are back on the table',               time: '1h ago'  },
    { id: 2,  symbol: 'QQQ',  impact: 'positive', impactPct: +1.85, headline: 'NASDAQ-100 surges as NVIDIA and Microsoft beat earnings estimates by wide margins',       time: '3h ago'  },
    { id: 3,  symbol: 'ARKK', impact: 'positive', impactPct: +3.22, headline: 'ARK Innovation ETF rallies as AI biotech portfolio names see renewed institutional buying', time: '5h ago' },
    { id: 4,  symbol: 'TLT',  impact: 'negative', impactPct: -0.32, headline: 'Long-duration Treasury ETFs slide as CPI data surprises to the upside at 3.5%',           time: '6h ago'  },
    { id: 5,  symbol: 'EEM',  impact: 'negative', impactPct: -0.85, headline: 'Emerging market ETFs fall on stronger dollar and China PMI contraction data',              time: '8h ago'  },
    { id: 6,  symbol: 'GLD',  impact: 'positive', impactPct: +0.56, headline: 'Gold ETF inflows surge as geopolitical tensions in the Middle East escalate',              time: '10h ago' },
    { id: 7,  symbol: 'VNQ',  impact: 'positive', impactPct: +1.14, headline: 'REIT ETFs rebound as 10-year Treasury yields pull back from 4.8% peak',                   time: '12h ago' },
    { id: 8,  symbol: 'IWM',  impact: 'negative', impactPct: -0.48, headline: 'Small-cap ETF underperforms large caps as credit conditions tighten for regional banks',   time: '1d ago'  },
    { id: 9,  symbol: 'XLK',  impact: 'positive', impactPct: +1.62, headline: 'Tech sector ETF hits 52-week high driven by semiconductor supercycle narrative',           time: '1d ago'  },
    { id: 10, symbol: 'VTI',  impact: 'positive', impactPct: +0.93, headline: 'Total market ETF sees record weekly inflows as retail investors buy the dip',              time: '2d ago'  },
    { id: 11, symbol: 'SPY',  impact: 'neutral',  impactPct: -0.10, headline: 'S&P 500 consolidates near record highs as investors await PCE inflation data',             time: '2d ago'  },
    { id: 12, symbol: 'QQQ',  impact: 'positive', impactPct: +0.80, headline: 'QQQ options activity surges as institutional hedging activity increases ahead of FOMC',   time: '3d ago'  },
    { id: 13, symbol: 'ARKK', impact: 'negative', impactPct: -1.40, headline: 'ARK ETF outflows accelerate as retail investors rotate into value and dividend funds',     time: '3d ago'  },
    { id: 14, symbol: 'EEM',  impact: 'positive', impactPct: +0.60, headline: 'India-heavy EM ETFs outperform on strong GDP growth and manufacturing PMI data',           time: '4d ago'  },
    { id: 15, symbol: 'TLT',  impact: 'positive', impactPct: +0.90, headline: 'Long bond ETF rallies as recession fears drive flight-to-safety Treasury demand',         time: '5d ago'  },
];

const IMPACT_CONFIG = {
    positive: { cls: 'impact-positive', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
    negative: { cls: 'impact-negative', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
    neutral:  { cls: 'impact-neutral',  icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
};

const PERIOD_POINTS = { '1W': 7, '1M': 30, '3M': 90, '6M': 120, '1Y': 252, 'ALL': 300 };

const _DEFAULT_ETF_HOLDINGS = [
    { symbol: 'SPY', qty: 3, avgPrice: 498.20 },
    { symbol: 'QQQ', qty: 2, avgPrice: 420.50 },
];
function _ssGet(key, fallback) { try { const v = sessionStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
const SESSION_USER = {
    cash:     _ssGet('ptp_cash', 12450.30),
    holdings: _ssGet('ptp_etfs', _DEFAULT_ETF_HOLDINGS),
};

function nowStr() { const d = new Date(); const pad = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }

function persistETFTrade(symbol, name, side, amount, price) {
    try {
        const shares = parseFloat((amount / price).toFixed(4));
        const tx = { id: Date.now(), type: side === 'buy' ? 'BUY' : 'SELL', symbol, name, qty: shares, price, total: amount, date: nowStr(), orderId: `TXN-${Date.now()}`, assetType: 'etf' };
        sessionStorage.setItem('ptp_transactions', JSON.stringify([tx, ..._ssGet('ptp_transactions', [])]));
        sessionStorage.setItem('ptp_cash', JSON.stringify(side === 'buy' ? SESSION_USER.cash - amount : SESSION_USER.cash + amount));
        const raw = _ssGet('ptp_etfs', []);
        let updated;
        if (side === 'buy') {
            const ex = raw.find(h => h.symbol === symbol);
            if (ex) updated = raw.map(h => h.symbol === symbol ? { ...h, qty: h.qty + shares, avgPrice: (h.avgPrice * h.qty + price * shares) / (h.qty + shares) } : h);
            else updated = [...raw, { symbol, qty: shares, avgPrice: price }];
        } else {
            updated = raw.map(h => h.symbol === symbol ? { ...h, qty: h.qty - shares } : h).filter(h => h.qty > 0);
        }
        sessionStorage.setItem('ptp_etfs', JSON.stringify(updated));
    } catch {}
}

function fmt(n, d = 2) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function pnlCls(n) { return n >= 0 ? 'positive' : 'negative'; }

function generatePriceHistory(price, changePct, numPoints) {
    let s = Math.abs((price * 137) | 0) + 1;
    function next() {
        s = ((s * 1664525) + 1013904223) & 0x7fffffff;
        return s / 0x7fffffff;
    }
    const direction  = changePct >= 0 ? 1 : -1;
    const startDelta = 1 - direction * (0.02 + next() * 0.04);
    const volatility = price * (0.004 + next() * 0.006);
    const data       = [];
    for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        const trend    = price * startDelta + (price - price * startDelta) * progress;
        const noise    = (next() - 0.5) * 2 * volatility * (1 - progress * 0.3);
        data.push(Math.max(trend + noise, price * 0.5));
    }
    data[data.length - 1] = price;
    return data;
}

function ETFNavbar() {
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

function ETFIdentityCard({ etf }) {
    return (
        <div className="sidebar-card identity-card">
            <div className="identity-row">
                <div className="identity-left">
                    <span className="hero-symbol">{etf.symbol}</span>
                    <div className="identity-name-block">
                        <span className="identity-name">{etf.name}</span>
                        <span className="hero-sector">{etf.category}</span>
                    </div>
                </div>
                <div className="identity-right">
                    <span className="identity-price">${fmt(etf.price)}</span>
                    <span className={`identity-change ${pnlCls(etf.changePct)}`}>
                        {etf.changePct >= 0 ? '+' : ''}{fmt(etf.changePct)}%
                        &nbsp;({etf.change >= 0 ? '+' : ''}{fmt(etf.change)})
                    </span>
                </div>
            </div>
            <div className="identity-meta-row">
                <span className="identity-meta-item">
                    <i className="bi bi-bar-chart-fill"></i> Vol: {etf.volume}
                </span>
                <span className="identity-meta-item">
                    <i className="bi bi-building"></i> AUM: {etf.aum}
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

function ETFChart({ etf, period, onPeriodChange }) {
    const [chartType, setChartType] = React.useState(localStorage.getItem('chartType') || 'line');
    const data   = generatePriceHistory(etf.price, etf.changePct, PERIOD_POINTS[period]);
    const W = 800, H = 180;
    const pad    = { t: 10, r: 10, b: 10, l: 10 };
    const min    = Math.min(...data);
    const max    = Math.max(...data);
    const range  = max - min || 1;
    const xS     = i => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
    const yS     = v  => H - pad.b - ((v - min) / range) * (H - pad.t - pad.b);
    const pts    = data.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
    const area   = `${xS(0)},${H - pad.b} ${pts} ${xS(data.length - 1)},${H - pad.b}`;
    const isUp   = data[data.length - 1] >= data[0];
    const color  = isUp ? '#00c896' : '#e05252';
    const gradId = `etfGrad_${etf.symbol}`;
    const candles = chartType === 'candlestick' ? buildCandles(data) : null;

    return (
        <div className="sidebar-card stock-chart-card">
            <div className="chart-controls">
                <div className="chart-periods">
                    {Object.keys(PERIOD_POINTS).map(p => (
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

function HoldingsBar({ holdings }) {
    const typeMap = {};
    holdings.forEach(h => {
        typeMap[h.type] = (typeMap[h.type] || 0) + h.weight;
    });
    const total = Object.values(typeMap).reduce((s, v) => s + v, 0);
    const segments = Object.entries(typeMap).map(([type, value]) => ({
        type, value,
        color: TYPE_CONFIG[type]?.color || '#8b949e',
        label: TYPE_CONFIG[type]?.label || type,
        icon:  TYPE_CONFIG[type]?.icon  || 'bi-dot',
        pct:   (value / total) * 100,
    }));

    return (
        <div className="etf-dist-wrap">
            <div className="etf-dist-bar">
                {segments.map(({ type, pct, color }, i) => (
                    <div key={type} className="etf-dist-segment"
                        style={{ width: `${pct}%`, background: color,
                            borderRadius: i === 0 ? '4px 0 0 4px' : i === segments.length - 1 ? '0 4px 4px 0' : '0'
                        }}
                    />
                ))}
            </div>
            <div className="etf-dist-legend">
                {segments.map(({ type, color, label, icon, pct }) => (
                    <div key={type} className="etf-dist-legend-item">
                        <i className={`bi ${icon}`} style={{ color, fontSize: '0.82rem' }}></i>
                        <span className="etf-dist-label">{label}</span>
                        <span className="etf-dist-pct">{pct.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopHoldingsCard({ symbol }) {
    const holdings = ETF_TOP_HOLDINGS[symbol];
    if (!holdings) return null;
    const maxWeight = Math.max(...holdings.map(h => h.weight));

    return (
        <div className="sidebar-card">
            <h3 className="card-section-title">Top Holdings</h3>
            <div className="etf-holdings-list">
                {holdings.map(h => {
                    const tc = TYPE_CONFIG[h.type] || {};
                    const inner = (
                        <>
                            <div className="etf-holding-type-icon" style={{ color: tc.color }}>
                                <i className={`bi ${tc.icon}`}></i>
                            </div>
                            <div className="etf-holding-left">
                                <span className="etf-holding-symbol">{h.symbol}</span>
                                <span className="etf-holding-name">{h.name}</span>
                            </div>
                            <div className="etf-holding-right">
                                <div className="etf-holding-bar-wrap">
                                    <div className="etf-holding-bar" style={{ width: `${(h.weight / maxWeight) * 100}%` }}></div>
                                </div>
                                <span className="etf-holding-weight">{h.weight.toFixed(2)}%</span>
                                {h.href && <i className="bi bi-chevron-right etf-holding-chevron"></i>}
                            </div>
                        </>
                    );
                    return h.href
                        ? <a key={h.symbol} href={h.href} className="etf-holding-row etf-holding-link">{inner}</a>
                        : <div key={h.symbol} className="etf-holding-row">{inner}</div>;
                })}
            </div>
            <HoldingsBar holdings={holdings} />
        </div>
    );
}

function FundamentalsCard({ etf }) {
    const f = ETF_FUNDAMENTALS[etf.symbol];
    if (!f) return null;
    const metrics = [
        { label: 'Expense Ratio', value: `${f.expenseRatio}%`      },
        { label: 'Holdings',      value: f.holdings.toLocaleString() },
        { label: 'Inception',     value: f.inception                },
        { label: 'Exchange',      value: f.exchange                 },
        { label: 'Currency',      value: f.currency                 },
        { label: 'Index Tracked', value: f.index                    },
        { label: 'AUM',           value: etf.aum                    },
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

function TradeModal({ etf, initialSide = 'buy', cash, ownedQty, onClose, onTradeComplete }) {
    const [side,   setSide]   = useState(initialSide);
    const [amount, setAmount] = useState('');
    const [done,   setDone]   = useState(false);

    const parsed     = parseFloat(amount.replace(',', '.')) || 0;
    const price      = etf.price;
    const owned      = ownedQty;
    const ownedValue = owned * price;
    const estShares  = parsed > 0 ? parsed / price : 0;
    const canBuy     = parsed > 0 && parsed <= cash;
    const canSell    = parsed > 0 && parsed <= ownedValue;
    const canTrade   = side === 'buy' ? canBuy : canSell;
    const showErr    = parsed > 0 && !canTrade;

    function handleAmountChange(e) {
        const v = e.target.value;
        if (v.replace(/[,.]/g, '').length > 9) return;
        if (/^0[0-9]/.test(v)) return;
        if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setAmount(v);
    }

    function confirm() {
        persistETFTrade(etf.symbol, etf.name, side, parsed, price);
        if (onTradeComplete) onTradeComplete(side, parsed, price);
        setDone(true);
        setTimeout(onClose, 1600);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
                <div className="trade-modal-header">
                    <div>
                        <span className="trade-symbol">{etf.symbol}</span>
                        <span className="trade-company">{etf.name}</span>
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
                            <button className={`trade-side-btn buy ${side === 'buy' ? 'active' : ''}`} onClick={() => { setSide('buy');  setAmount(''); }}>Buy</button>
                            <button className={`trade-side-btn sell ${side === 'sell' ? 'active' : ''}`} onClick={() => { setSide('sell'); setAmount(''); }}>Sell</button>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Market price</span>
                            <span className="trade-info-val">${fmt(price)}</span>
                        </div>
                        <div className="trade-info-row">
                            <span className="trade-info-label">Amount ($)</span>
                            <div className="trade-qty-ctrl">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={handleAmountChange}
                                />
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
                                ? `${side === 'buy' ? 'Buy' : 'Sell'} ${etf.symbol}`
                                : `${side === 'buy' ? 'Buy' : 'Sell'} $${amount} of ${etf.symbol}`}
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

function TradeCard({ etf }) {
    const [modal,    setModal]    = useState(null);
    const [cash,     setCash]     = useState(SESSION_USER.cash);
    const [holdings, setHoldings] = useState(SESSION_USER.holdings);

    const ownedQty = holdings.find(h => h.symbol === etf.symbol)?.qty || 0;

    function handleTradeComplete(side, amount, price) {
        const shares = parseFloat((amount / price).toFixed(4));
        setCash(c => side === 'buy' ? c - amount : c + amount);
        setHoldings(prev => {
            if (side === 'buy') {
                const ex = prev.find(h => h.symbol === etf.symbol);
                if (ex) return prev.map(h => h.symbol === etf.symbol ? { ...h, qty: h.qty + shares, avgPrice: (h.avgPrice * h.qty + price * shares) / (h.qty + shares) } : h);
                return [...prev, { symbol: etf.symbol, qty: shares, avgPrice: price }];
            }
            return prev.map(h => h.symbol === etf.symbol ? { ...h, qty: h.qty - shares } : h).filter(h => h.qty > 0);
        });
    }

    return (
        <>
            <div className="sidebar-card trade-card">
                <h3 className="card-section-title">Trade</h3>
                <div className="trade-price-center">
                    <span className="trade-current-price">${fmt(etf.price)}</span>
                    <span className={`trade-change-badge ${pnlCls(etf.changePct)}`}>
                        {etf.changePct >= 0 ? '+' : ''}{fmt(etf.changePct)}%
                    </span>
                </div>
                <div className="trade-btn-row">
                    <button className="trade-action-btn buy-btn"  onClick={() => setModal('buy')}>Buy</button>
                    <button className="trade-action-btn sell-btn" onClick={() => setModal('sell')}>Sell</button>
                </div>
                <div className="watchlist-trade-row">
                    <WatchlistBtnLg symbol={etf.symbol} type="etf" />
                </div>
            </div>
            {modal && <TradeModal etf={etf} initialSide={modal} cash={cash} ownedQty={ownedQty} onClose={() => setModal(null)} onTradeComplete={handleTradeComplete} />}
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
    const text = ETF_ABOUT[symbol];
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
            <i className="bi bi-layers not-found-icon"></i>
            <h2 className="not-found-title">ETF not found</h2>
            <p className="not-found-body">The ETF you are looking for does not exist in our database.</p>
            <button className="stock-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back
            </button>
        </div>
    );
}

function ETFPage() {
    const [period, setPeriod] = useState('1M');

    const params = new URLSearchParams(window.location.search);
    const symbol = params.get('symbol');
    const etf    = MOCK_ETFS.find(e => e.symbol === symbol);

    if (!etf) {
        return (
            <div className="stock-page">
                <ETFNavbar />
                <main className="stock-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    return (
        <div className="stock-page">
            <ETFNavbar />
            <main className="stock-main">
                <div className="container stock-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <ETFIdentityCard etf={etf} />
                            <ETFChart etf={etf} period={period} onPeriodChange={setPeriod} />
                            <FundamentalsCard etf={etf} />
                            <TopHoldingsCard symbol={symbol} />
                        </div>
                        <div className="col-lg-4">
                            <TradeCard etf={etf} />
                            <RelatedNewsPanel symbol={symbol} />
                            <AboutCard symbol={symbol} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ETFPage />);
