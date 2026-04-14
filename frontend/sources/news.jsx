const { useState } = React;

const MOCK_STOCKS = [
    { symbol: 'AAPL',  name: 'Apple Inc.',             sector: 'Technology',  price: 182.30, change:  1.24, changePct:  0.69, volume: '58.2M',  cap: '2.81T' },
    { symbol: 'MSFT',  name: 'Microsoft Corp.',         sector: 'Technology',  price: 420.80, change:  2.15, changePct:  0.51, volume: '21.4M',  cap: '3.12T' },
    { symbol: 'NVDA',  name: 'NVIDIA Corp.',            sector: 'Technology',  price: 950.40, change: 18.30, changePct:  1.96, volume: '44.8M',  cap: '2.34T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.',           sector: 'Technology',  price: 178.90, change: -0.45, changePct: -0.25, volume: '24.1M',  cap: '2.21T' },
    { symbol: 'TSLA',  name: 'Tesla Inc.',              sector: 'Automotive',  price: 248.50, change:  5.63, changePct:  2.32, volume: '102.3M', cap: '791B'  },
    { symbol: 'AMZN',  name: 'Amazon.com Inc.',         sector: 'Consumer',    price: 198.70, change: -1.60, changePct: -0.80, volume: '35.7M',  cap: '2.08T' },
    { symbol: 'META',  name: 'Meta Platforms',          sector: 'Technology',  price: 512.30, change:  6.08, changePct:  1.20, volume: '18.9M',  cap: '1.30T' },
    { symbol: 'JPM',   name: 'JPMorgan Chase',          sector: 'Finance',     price: 210.30, change:  1.20, changePct:  0.57, volume: '9.8M',   cap: '604B'  },
    { symbol: 'INTC',  name: 'Intel Corp.',             sector: 'Technology',  price: 31.20,  change: -0.58, changePct: -1.83, volume: '38.6M',  cap: '132B'  },
    { symbol: 'XOM',   name: 'Exxon Mobil Corp.',       sector: 'Energy',      price: 115.20, change: -1.10, changePct: -0.95, volume: '18.2M',  cap: '461B'  },
];

const MOCK_NEWS = [
    {
        id: 1, symbol: 'NVDA', impact: 'positive', impactPct: +4.20,
        headline: 'NVIDIA beats Q1 estimates with record data center revenue of $22.6B',
        source: 'Reuters', time: '2h ago',
        body: [
            'NVIDIA Corporation reported first-quarter earnings that surpassed Wall Street expectations by a wide margin, with data center revenue reaching $22.6 billion — a 427% year-over-year increase. Adjusted earnings per share came in at $5.98, well above the consensus estimate of $5.16.',
            'The surge was driven by insatiable demand for H100 and H200 GPUs from hyperscalers and enterprise customers building generative AI infrastructure. CEO Jensen Huang described the quarter as "extraordinary" and noted that demand continues to significantly exceed supply across all major product lines.',
            'NVIDIA also raised its Q2 revenue guidance to approximately $28 billion, plus or minus 2%, versus analyst expectations of $26.8 billion. The company announced a 10-for-1 stock split effective June 10, making shares more accessible to retail investors.',
            'Shares rose over 4% in after-hours trading following the announcement, with several Wall Street analysts raising their price targets, citing the company\'s dominant position in AI accelerator hardware and its expanding software ecosystem.',
        ],
    },
    {
        id: 2, symbol: 'AAPL', impact: 'negative', impactPct: -1.80,
        headline: 'Apple faces new EU antitrust probe over App Store payment rules',
        source: 'Bloomberg', time: '4h ago',
        body: [
            'The European Commission has opened a formal antitrust investigation into Apple over its App Store payment policies, alleging that the company\'s compliance measures with the Digital Markets Act fall short of regulatory requirements.',
            'Specifically, regulators are scrutinizing Apple\'s "core technology fee" — a €0.50 charge per install beyond one million annual downloads — which app developers argue is a disguised attempt to maintain the dominance of Apple\'s own payment infrastructure despite the DMA\'s mandate for third-party alternatives.',
            'Apple issued a statement saying it "strongly disagrees" with the Commission\'s preliminary findings and intends to vigorously defend its position. The company has until September to submit a formal response, after which regulators will determine whether to pursue formal charges.',
            'The probe adds to a growing list of regulatory pressures facing Apple in Europe, following a €1.8 billion fine earlier this year over a complaint by Spotify regarding music streaming competition.',
        ],
    },
    {
        id: 3, symbol: 'TSLA', impact: 'negative', impactPct: -3.50,
        headline: 'Tesla Q1 deliveries fall short of expectations amid weak demand in Europe',
        source: 'CNBC', time: '5h ago',
        body: [
            'Tesla reported first-quarter deliveries of 386,810 vehicles, missing analyst expectations of approximately 449,000 units. The shortfall marks the company\'s first year-over-year delivery decline since 2020, raising fresh questions about demand for premium electric vehicles.',
            'The miss was attributed to a combination of factors: production disruptions at the Fremont factory during a scheduled retooling, an extended factory pause in Germany, and softening consumer demand in key European markets including Germany, the UK, and the Netherlands — where EV incentives have been scaled back.',
            'CEO Elon Musk acknowledged the challenging quarter but said the company remains on track to begin deliveries of its Cybercab robotaxi in 2025. He also highlighted Tesla\'s energy division, which posted a record quarter for both storage deployments and revenue, partially offsetting automotive weakness.',
            'Shares fell over 3% following the announcement, extending a year-to-date decline of approximately 30%. Several analysts downgraded their delivery estimates for the full year, though most maintained their long-term ratings pending further clarity on robotaxi timelines.',
        ],
    },
    {
        id: 4, symbol: 'MSFT', impact: 'positive', impactPct: +2.10,
        headline: 'Microsoft Azure revenue surges 31% YoY driven by AI workloads',
        source: 'TechCrunch', time: '6h ago',
        body: [
            'Microsoft reported quarterly revenue of $61.9 billion, up 17% year-over-year, with its Azure cloud platform growing 31% — ahead of the consensus estimate of 28.6%. The strong result was largely attributed to accelerating demand for AI services built on the Azure OpenAI platform.',
            'More than 53,000 organizations are now using Azure OpenAI Service, up from 18,000 in the prior-year period. Microsoft also disclosed that Copilot for Microsoft 365 had 1.3 million paid enterprise seats at quarter end, a 124% sequential increase driven by expanded enterprise rollouts.',
            'CFO Amy Hood raised full-year cloud guidance to $135–136 billion and noted that AI\'s contribution to Azure\'s growth had reached 12 percentage points — a record high. She added that capital expenditures would remain elevated through fiscal 2025 as the company builds out AI inference capacity.',
            'The stock rose approximately 2% in extended trading and remains up nearly 18% year-to-date, outperforming the broader technology sector.',
        ],
    },
    {
        id: 5, symbol: 'AMZN', impact: 'positive', impactPct: +1.60,
        headline: 'Amazon AWS announces $15B expansion of data centers in Southeast Asia',
        source: 'WSJ', time: '8h ago',
        body: [
            'Amazon Web Services has announced a $15 billion investment in new data center infrastructure across Southeast Asia, with facilities planned in Malaysia, Thailand, and the Philippines. The expansion is expected to create over 14,000 direct and indirect jobs in the region by 2030.',
            'The investment reflects AWS\'s assessment that Southeast Asia represents one of the fastest-growing cloud adoption markets globally, with enterprise and government customers rapidly migrating on-premise workloads to cloud platforms amid digital transformation initiatives.',
            'AWS currently operates infrastructure in Singapore and has existing plans in Indonesia. The new announcement expands its regional footprint significantly, positioning the company ahead of Microsoft Azure and Google Cloud, which have smaller presences across the region.',
            'Amazon shares edged up 1.6% following the announcement, with analysts citing the move as evidence of the company\'s long-term commitment to international cloud growth and its ability to capture enterprise spend outside North America and Western Europe.',
        ],
    },
    {
        id: 6, symbol: 'META', impact: 'positive', impactPct: +3.80,
        headline: 'Meta AI assistant reaches 500M monthly active users globally',
        source: 'The Verge', time: '10h ago',
        body: [
            'Meta Platforms announced that its AI assistant has reached 500 million monthly active users, making it the most widely used AI assistant in the world by this metric — surpassing ChatGPT, Google Gemini, and Apple Intelligence in total user base.',
            'The assistant is embedded across WhatsApp, Instagram, Facebook, and Messenger, giving it an inherent distribution advantage over standalone AI applications. CEO Mark Zuckerberg said the company intends to make Meta AI "the leading AI assistant in the world" by end of 2025 and plans to expand its capabilities to include real-time voice and vision.',
            'Meta is also investing heavily in its Llama model family, which now has over 650 million downloads as an open-weight model. The upcoming Llama 4 series is expected to be released in mid-2025 with significantly expanded multimodal capabilities and a new mixture-of-experts architecture.',
            'Meta stock rose 3.8% on the announcement, extending its year-to-date gains to over 40%. Analysts have increasingly pointed to AI monetization through Advantage+ advertising as a major driver of near-term earnings upside.',
        ],
    },
    {
        id: 7, symbol: 'GOOGL', impact: 'neutral', impactPct: -0.30,
        headline: 'Alphabet antitrust ruling expected next month in DOJ search case',
        source: 'FT', time: '12h ago',
        body: [
            'A federal judge is expected to issue a landmark ruling next month in the U.S. Department of Justice\'s antitrust case against Alphabet\'s Google, which argued that the company illegally maintained its monopoly in the general search and search advertising markets.',
            'The DOJ\'s proposed remedies include potentially forcing Google to divest its Chrome browser, share its search index with competitors on commercially reasonable terms, or terminate its practice of paying device manufacturers and carriers to be the default search engine — deals worth approximately $18 billion annually.',
            'Google has argued that its dominance is the result of superior product quality rather than anticompetitive behavior, and that the proposed remedies would be harmful to consumers and to American innovation in an increasingly competitive global technology landscape. The company has indicated it will appeal any adverse ruling.',
            'Legal experts have described the expected ruling as one of the most consequential antitrust decisions in the history of the technology industry, with broad implications not only for Google but for how regulators approach the dominance of large platform companies going forward.',
        ],
    },
    {
        id: 8, symbol: 'JPM', impact: 'positive', impactPct: +1.20,
        headline: 'JPMorgan raises full-year NII guidance on higher-for-longer rates',
        source: 'MarketWatch', time: '14h ago',
        body: [
            'JPMorgan Chase raised its full-year net interest income guidance to approximately $91 billion, up from its prior estimate of $89 billion, citing expectations that the Federal Reserve will hold interest rates higher for longer than previously anticipated by markets.',
            'The bank reported first-quarter earnings per share of $4.44, beating the consensus estimate of $4.17. Total revenue rose 9% year-over-year to $42.5 billion, supported by strong performance in its investment banking division, where fees increased 21%, and its markets business, where fixed income trading revenue rose 8%.',
            'CEO Jamie Dimon struck a cautious tone on the broader economic environment, pointing to geopolitical tensions, persistent core inflation, and elevated government debt levels as risks to the outlook. He also flagged continued stress in the commercial real estate segment, noting elevated charge-off rates that the bank expects to persist through mid-year.',
            'JPMorgan shares rose 1.2% following the earnings release, with the stock up approximately 12% year-to-date, outperforming the KBW Bank Index by a wide margin.',
        ],
    },
    {
        id: 9, symbol: 'INTC', impact: 'negative', impactPct: -5.60,
        headline: 'Intel delays next-gen Panther Lake chip by one quarter amid yield issues',
        source: 'Wired', time: '1d ago',
        body: [
            'Intel Corporation has delayed the volume production launch of its next-generation Panther Lake processor by one quarter, pushing commercial availability from Q2 to Q3, after encountering lower-than-expected manufacturing yields on its Intel 18A process node.',
            'The delay is a significant setback for Intel\'s turnaround narrative. CEO Pat Gelsinger had positioned the 18A node as a return to process leadership, claiming it would be a full generation ahead of TSMC\'s N2 and Samsung\'s SF2 in power efficiency and transistor density.',
            'Intel reiterated that 18A remains on track for its first external foundry customer, Amazon Web Services, and that Panther Lake CPUs would still ship to consumers in volume by end of 2024. The company also noted that its current-generation Meteor Lake chips continue to gain design wins in the commercial laptop segment.',
            'Intel shares fell over 5% following the announcement, extending a painful stretch for long-term investors who have seen the stock lose nearly half its value over the past twelve months as the company struggles to close the gap with TSMC and NVIDIA.',
        ],
    },
    {
        id: 10, symbol: 'XOM', impact: 'neutral', impactPct: +0.10,
        headline: 'Exxon Mobil acquires Pioneer Natural Resources integration on track',
        source: 'Oil & Gas J.', time: '1d ago',
        body: [
            'Exxon Mobil reported that the integration of Pioneer Natural Resources, acquired for $59.5 billion in a deal that closed in May 2024, is proceeding ahead of schedule, with annual cost and operating synergies expected to exceed the initial guidance of $2 billion by 2025.',
            'The combined entity now operates one of the largest Permian Basin positions in the industry, with approximately 1.4 million net acres spanning the Midland and Delaware sub-basins. Exxon expects to increase Permian production to over 2 million barrels of oil equivalent per day by 2027, cementing its position as the basin\'s top producer.',
            'CEO Darren Woods noted that the combined company\'s low-cost, high-return portfolio positions it well across a wide range of oil price scenarios, and reiterated the company\'s commitment to returning capital to shareholders through a growing dividend and a $20 billion share buyback program.',
            'Exxon shares were little changed following the update, reflecting the broadly in-line nature of the integration progress report. The stock has outperformed the S&P 500 year-to-date, supported by resilient oil prices and improving operational efficiency.',
        ],
    },
    {
        id: 11, symbol: 'NVDA', impact: 'positive', impactPct: +2.80,
        headline: 'NVIDIA Blackwell GPU demand forces hyperscalers to extend supply contracts',
        source: 'Bloomberg', time: '1d ago',
        body: [
            'NVIDIA\'s next-generation Blackwell GPU architecture is generating unprecedented demand from hyperscale cloud providers, with Microsoft, Google, and Amazon reportedly signing multi-year supply agreements worth tens of billions of dollars to secure priority allocation of GB200 NVL72 rack systems.',
            'Sources familiar with the negotiations say lead times for Blackwell-based infrastructure have stretched to 12–18 months, forcing customers to commit capital well in advance of deployment. TSMC, which manufactures NVIDIA\'s chips on its CoWoS advanced packaging line, is expanding capacity to accommodate the volume but cannot fully close the supply gap until late 2025.',
            'The contracts represent a structural shift in how AI compute is procured — moving from spot purchasing toward long-term committed capacity, similar to how airlines and semiconductor fabs negotiate capacity years ahead. Analysts at Morgan Stanley estimate that Blackwell will generate over $100 billion in cumulative revenue within its first two years on the market.',
            'NVIDIA shares gained 2.8% on the news, adding approximately $70 billion in market capitalization in a single session. The stock is now up over 85% year-to-date, cementing NVIDIA\'s position as the third most valuable publicly traded company in the world.',
        ],
    },
    {
        id: 12, symbol: 'AAPL', impact: 'positive', impactPct: +1.40,
        headline: 'Apple iPhone 17 Pro leak confirms periscope camera and A19 chip upgrade',
        source: 'MacRumors', time: '2d ago',
        body: [
            'Leaked supply chain documentation and component renders shared by reliable Apple analyst Ming-Chi Kuo confirm that the iPhone 17 Pro will feature a periscope telephoto camera with 5× optical zoom across the entire Pro lineup — expanding a feature previously exclusive to the iPhone 15 Pro Max.',
            'The device will be powered by the Apple A19 Pro chip, fabricated on TSMC\'s second-generation 3nm process node, which is expected to deliver a 15–20% improvement in CPU performance and up to 30% improvement in Neural Engine throughput compared to the A18 Pro.',
            'Additional confirmed upgrades include a 48MP ultrawide sensor with autofocus, a redesigned thinner Dynamic Island, and a new camera control button on the right rail that supports gesture-based adjustments. The base models are expected to transition to an A19 chip on the standard 3nm node.',
            'Apple shares climbed 1.4% on the leaked specifications, with analysts noting that the camera improvements represent a compelling upgrade cycle driver for the roughly 350 million iPhone users currently on devices three or more generations old.',
        ],
    },
    {
        id: 13, symbol: 'TSLA', impact: 'positive', impactPct: +5.10,
        headline: 'Tesla Full Self-Driving v13 achieves 99.2% intervention-free mile rate in US fleet',
        source: 'Electrek', time: '2d ago',
        body: [
            'Tesla has released internal fleet telemetry showing that Full Self-Driving version 13, currently in supervised beta, achieved a 99.2% intervention-free mile rate across the North American fleet during the last 30-day measurement period — a meaningful improvement from the 97.8% rate reported for FSD v12.5.',
            'The improvement is attributed primarily to a significant expansion of training data volume and a new end-to-end neural network architecture that processes camera inputs without the intermediate rule-based planning layer present in earlier versions. Elon Musk has repeatedly stated that the approach will eventually enable fully unsupervised operation.',
            'Tesla is expected to file for regulatory approval of an unsupervised version of FSD in California, Texas, and Arizona in the coming months, positioning it ahead of Waymo in raw fleet size if approved. The Cybercab robotaxi, unveiled last year, is planned to use the same underlying FSD stack with additional redundant sensor inputs.',
            'Tesla stock surged over 5% on the data release, its largest single-day gain in three months, as investors who had grown skeptical of the autonomous driving timeline recalibrated their probability estimates for a near-term commercial robotaxi launch.',
        ],
    },
    {
        id: 14, symbol: 'MSFT', impact: 'negative', impactPct: -0.90,
        headline: 'Microsoft faces US FTC scrutiny over OpenAI exclusive licensing terms',
        source: 'Politico', time: '2d ago',
        body: [
            'The Federal Trade Commission has issued a formal civil investigative demand to Microsoft requesting documents related to its licensing arrangement with OpenAI, according to people familiar with the matter. Regulators are examining whether the terms of the agreement unreasonably restrict OpenAI from working with competing cloud providers.',
            'Microsoft invested approximately $13 billion in OpenAI across several funding rounds and holds the exclusive right to deploy OpenAI models through Azure. The FTC is assessing whether this exclusivity, combined with Microsoft\'s distribution leverage across enterprise software, constitutes anticompetitive conduct in the rapidly growing AI services market.',
            'Microsoft and OpenAI both confirmed receipt of the demand but declined to comment on its contents. A Microsoft spokesperson said the company is cooperating fully with regulators and is confident its partnership with OpenAI complies with applicable law.',
            'Microsoft shares dipped 0.9% on the news. Analysts noted that the investigation is in early stages and that regulatory proceedings of this type rarely result in material near-term disruption, but that the overhang could weigh on sentiment heading into the company\'s next earnings report.',
        ],
    },
    {
        id: 15, symbol: 'NVDA', impact: 'positive', impactPct: +1.50,
        headline: 'NVIDIA unveils GeForce RTX 5090 with 2× the performance of RTX 4090',
        source: 'The Verge', time: '3d ago',
        body: [
            'NVIDIA officially unveiled the GeForce RTX 5090 at its GPU Technology Conference, claiming the flagship consumer graphics card delivers more than twice the rasterization performance of its predecessor, the RTX 4090, while consuming the same 450W TDP envelope.',
            'The RTX 5090 is built on the GB202 die using TSMC\'s 4nm process and features 192 shader multiprocessors, 32GB of GDDR7 memory with a 512-bit bus, and a new fifth-generation Tensor Core architecture that significantly accelerates AI-based upscaling and frame generation via DLSS 4.',
            'The card will be priced at $1,999 and is scheduled to launch on January 30, with availability in the US, EU, and select Asian markets simultaneously. NVIDIA also announced the RTX 5080 at $999 and RTX 5070 Ti at $749, rounding out the high-end Blackwell consumer lineup.',
            'Shares of NVIDIA gained 1.5% on the announcement, with analysts noting that while the consumer GPU segment contributes only a fraction of total revenue compared to data center, the RTX 5090 launch reinforces the company\'s technology leadership narrative and drives favorable press coverage ahead of its next earnings cycle.',
        ],
    },
    {
        id: 16, symbol: 'AAPL', impact: 'negative', impactPct: -2.40,
        headline: 'Apple Vision Pro sales reportedly slow sharply after initial launch surge',
        source: 'WSJ', time: '3d ago',
        body: [
            'Apple Vision Pro sales have declined significantly after a strong opening month, according to supply chain sources cited by The Wall Street Journal. Weekly unit shipments are said to have fallen by more than 75% from their February peak, prompting Apple to reduce orders with component suppliers for the remainder of the year.',
            'The slowdown reflects the challenges of selling a $3,499 device in a product category with no established consumer use case. Early buyers have praised the display quality and immersive media experience but cited the weight, limited battery life, and absence of a compelling productivity workflow as barriers to sustained daily use.',
            'Apple is reportedly accelerating development of a lower-cost Vision product, potentially priced below $1,500, which could launch as early as 2026. The company is also said to be working on a lighter chassis design that reduces the headset\'s weight by approximately 30% compared to the current model.',
            'Apple shares fell 2.4% on the report. Analysts who had modeled Vision Pro as a meaningful revenue contributor revised their estimates downward, though several noted that near-term softness was not unexpected for a first-generation product in a nascent category.',
        ],
    },
    {
        id: 17, symbol: 'MSFT', impact: 'positive', impactPct: +3.20,
        headline: 'Microsoft GitHub Copilot Enterprise crosses 1M paid seats milestone',
        source: 'TechCrunch', time: '3d ago',
        body: [
            'Microsoft announced that GitHub Copilot Enterprise has surpassed one million paid seats, less than eight months after its general availability launch. The milestone represents a significant acceleration from the 400,000 seats reported at the end of the prior quarter, driven by large enterprise deals across financial services, healthcare, and technology verticals.',
            'Copilot Enterprise, priced at $39 per user per month, generates annual recurring revenue of approximately $468 million at the current seat count — a figure analysts expect to grow substantially as Microsoft integrates Copilot capabilities deeper into the broader GitHub platform and Visual Studio ecosystem.',
            'Microsoft CEO Satya Nadella highlighted the milestone during a developer conference keynote, noting that internal data shows Copilot users complete pull requests 55% faster on average and that enterprise customers report meaningful reductions in bug density post-deployment. He described AI-augmented development as "the single biggest productivity shift in software engineering since version control."',
            'Microsoft shares responded positively, gaining 3.2% on the day, as investors interpreted the milestone as confirmation that enterprise AI monetization is materializing faster than initially modeled.',
        ],
    },
    {
        id: 18, symbol: 'TSLA', impact: 'negative', impactPct: -1.70,
        headline: 'Tesla recalls 125,000 vehicles over seatbelt warning chime software bug',
        source: 'Reuters', time: '4d ago',
        body: [
            'Tesla has issued a recall covering approximately 125,000 Model S, Model X, Model 3, and Model Y vehicles in the United States after the National Highway Traffic Safety Administration identified a software defect that may prevent the front seatbelt warning chime from activating under certain conditions.',
            'The issue affects vehicles manufactured between 2021 and 2023 running a specific firmware range. NHTSA\'s investigation found that the warning chime may fail to sound if a passenger disconnects and reconnects the seatbelt within two seconds of vehicle startup — a scenario the software does not correctly re-evaluate.',
            'Tesla will address the issue through an over-the-air software update at no cost to owners, consistent with how the company handles the majority of its recalls. No accidents or injuries related to the defect have been reported. The OTA update is expected to be pushed to affected vehicles within two weeks.',
            'Tesla shares dipped 1.7% following the recall announcement. While recalls of this nature are common across the automotive industry and the OTA resolution mechanism is considered a competitive advantage for Tesla, the news added to a series of regulatory interactions that have attracted negative press coverage in recent weeks.',
        ],
    },
    {
        id: 19, symbol: 'AMZN', impact: 'positive', impactPct: +2.30,
        headline: 'Amazon advertising revenue overtakes Comcast to become third-largest US ad platform',
        source: 'CNBC', time: '4d ago',
        body: [
            'Amazon\'s advertising business generated $14.7 billion in revenue in the most recent quarter, surpassing Comcast\'s NBCUniversal to become the third-largest advertising platform in the United States by revenue, trailing only Google and Meta. The segment grew 24% year-over-year, making it the fastest-growing major division within Amazon.',
            'The advertising unit is particularly profitable relative to Amazon\'s other businesses, with estimated operating margins above 30%, compared to single-digit margins in the core e-commerce segment. Analysts have increasingly highlighted advertising as a key driver of Amazon\'s overall margin expansion story, alongside AWS.',
            'Amazon has expanded its advertising reach significantly through its Prime Video streaming service, which launched a new ad-supported tier and began selling premium ad inventory at rates comparable to linear television. The company also benefits from first-party purchase intent data that advertisers consider among the most valuable in the industry.',
            'Amazon shares climbed 2.3% on the advertising revenue disclosure, with several analysts raising their price targets and emphasizing the high-margin nature of the advertising segment as a structural driver of free cash flow growth over the next several years.',
        ],
    },
    {
        id: 20, symbol: 'NVDA', impact: 'neutral', impactPct: -0.60,
        headline: 'NVIDIA China revenue cut anticipated as US tightens H20 chip export controls',
        source: 'FT', time: '5d ago',
        body: [
            'The Biden administration is preparing additional restrictions on the export of NVIDIA\'s H20 graphics processing units to China, according to people briefed on the deliberations. The H20 was specifically designed to comply with earlier export control thresholds but regulators now view its performance as exceeding updated national security benchmarks.',
            'China accounted for approximately 15–17% of NVIDIA\'s total revenue in recent quarters, down from over 20% before previous rounds of export controls. An H20 restriction would effectively close NVIDIA\'s last meaningful avenue for selling advanced AI accelerators into the Chinese market, which had been partially served by the H20 as a downgraded alternative to the H100.',
            'NVIDIA has previously stated that it designs products to comply with applicable export regulations and that it actively works with the Commerce Department to ensure compliance. The company has also been accelerating development of products specifically tailored to other emerging markets as a partial offset to potential China revenue losses.',
            'Shares fell modestly by 0.6%, with investors broadly expecting some form of additional China restriction and viewing the potential revenue impact as manageable given the extraordinary growth in non-China data center demand driven by US, European, and Japanese hyperscaler investment in AI infrastructure.',
        ],
    },
];

const IMPACT_CONFIG = {
    positive: { cls: 'impact-positive', icon: 'bi-arrow-up-circle-fill',   label: 'Positive' },
    negative: { cls: 'impact-negative', icon: 'bi-arrow-down-circle-fill', label: 'Negative' },
    neutral:  { cls: 'impact-neutral',  icon: 'bi-dash-circle-fill',       label: 'Neutral'  },
};

function NewsNavbar() {
    return (
        <nav className="news-navbar">
            <a className="news-nav-brand" href="terminal.html">
                <img src="../images/app-icon.jpg" alt="logo" className="news-nav-logo" />
                <span className="news-nav-title">Pocket TradePro</span>
            </a>
            <button className="news-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back to News
            </button>
        </nav>
    );
}

function StockInfoCard({ stock }) {
    const positive = stock.changePct >= 0;
    const changeClass = positive ? 'stock-change-positive' : 'stock-change-negative';
    const changeIcon  = positive ? 'bi-arrow-up' : 'bi-arrow-down';

    return (
        <div className="sidebar-card stock-info-card">
            <div className="stock-info-header">
                <span className="stock-info-symbol">{stock.symbol}</span>
                <span className="stock-info-sector">{stock.sector}</span>
            </div>
            <p className="stock-info-name">{stock.name}</p>
            <div className="stock-info-price-row">
                <span className="stock-info-price">${stock.price.toFixed(2)}</span>
                <span className={`stock-info-change ${changeClass}`}>
                    <i className={`bi ${changeIcon}`}></i>
                    {positive ? '+' : ''}{stock.change.toFixed(2)} ({positive ? '+' : ''}{stock.changePct.toFixed(2)}%)
                </span>
            </div>
            <div className="stock-info-stats">
                <div className="stock-stat">
                    <span className="stock-stat-label">Volume</span>
                    <span className="stock-stat-value">{stock.volume}</span>
                </div>
                <div className="stock-stat">
                    <span className="stock-stat-label">Market Cap</span>
                    <span className="stock-stat-value">{stock.cap}</span>
                </div>
            </div>
            <a href={`stock.html?symbol=${stock.symbol}`} className="stock-trade-btn">
                <i className="bi bi-graph-up-arrow"></i> View stock
            </a>
        </div>
    );
}

function RelatedNewsPanel({ items }) {
    return (
        <div className="sidebar-card related-card">
            <h3 className="related-title">Related News</h3>
            <div className="related-list">
                {items.map(item => {
                    const cfg = IMPACT_CONFIG[item.impact];
                    return (
                        <a key={item.id} href={`news.html?id=${item.id}`} className="related-item">
                            <div className="related-item-top">
                                <span className="news-symbol">{item.symbol}</span>
                                <span className={`related-impact ${cfg.cls}`}>
                                    <i className={`bi ${cfg.icon}`}></i>
                                </span>
                                <span className={`related-impact-pct ${cfg.cls}`}>
                                    {item.impactPct > 0 ? '+' : ''}{item.impactPct.toFixed(2)}%
                                </span>
                                <span className="related-time">{item.time}</span>
                            </div>
                            <p className="related-headline">{item.headline}</p>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function ArticleView({ article }) {
    const cfg = IMPACT_CONFIG[article.impact];
    return (
        <article className="article-container">
            <div className="article-header">
                <div className="article-badges">
                    <span className="news-symbol article-symbol">{article.symbol}</span>
                    <span className={`article-impact ${cfg.cls}`}>
                        <i className={`bi ${cfg.icon}`}></i> {cfg.label}
                    </span>
                    <span className={`article-impact-pct ${cfg.cls}`}>
                        {article.impactPct > 0 ? '+' : ''}{article.impactPct.toFixed(2)}%
                    </span>
                </div>
                <div className="article-meta">
                    <span className="article-time">
                        <i className="bi bi-clock"></i> {article.time}
                    </span>
                </div>
                <h1 className="article-headline">{article.headline}</h1>
            </div>
            <hr className="article-divider" />
            <div className="article-body">
                {article.body.map((para, i) => (
                    <p key={i} className="article-paragraph">{para}</p>
                ))}
            </div>
        </article>
    );
}

function NotFoundView() {
    return (
        <div className="not-found-view">
            <i className="bi bi-newspaper not-found-icon"></i>
            <h2 className="not-found-title">Article not found</h2>
            <p className="not-found-body">The article you are looking for does not exist or has been removed.</p>
            <button className="news-back-btn" onClick={() => window.history.back()}>
                <i className="bi bi-reply"></i> Back to News
            </button>
        </div>
    );
}

function NewsArticlePage() {
    const params    = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get('id'));
    const article   = MOCK_NEWS.find(n => n.id === articleId);

    if (!article) {
        return (
            <div className="news-page">
                <NewsNavbar />
                <main className="news-main">
                    <NotFoundView />
                </main>
            </div>
        );
    }

    const stock   = MOCK_STOCKS.find(s => s.symbol === article.symbol);
    const related = MOCK_NEWS.filter(n => n.id !== article.id).slice(0, 3);

    return (
        <div className="news-page">
            <NewsNavbar />
            <main className="news-main">
                <div className="container news-container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <ArticleView article={article} />
                        </div>
                        <div className="col-lg-4">
                            {stock && <StockInfoCard stock={stock} />}
                            <RelatedNewsPanel items={related} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NewsArticlePage />);
