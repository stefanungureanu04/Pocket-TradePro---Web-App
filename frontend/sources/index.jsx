const FEATURES = [
    { icon: '📊', title: 'Real-Time Market Data',   description: 'Track live prices and market movements across NYSE, NASDAQ and BVB.',        img: '../images/startpage-info-market-data.jpg' },
    { icon: '💼', title: 'Portfolio Management',    description: 'Monitor holdings, average buy prices and portfolio performance in one view.', img: '../images/startpage-info-portofolio-management.jpg' },
    { icon: '🔒', title: 'Secure Trading',          description: 'Industry-standard encryption protects your funds and personal data.',          img: '../images/startpage-info-secure-trading.jpg' },
    { icon: '📈', title: 'Instant Buy & Sell',      description: 'Execute trades at current market prices with a simple, intuitive interface.',  img: '../images/startpage-info-buy-and-sell.jpg' },
    { icon: '💰', title: 'Flexible Funding',        description: 'Deposit and withdraw RON funds at any time with full transaction history.',    img: '../images/startpage-info-flexible-funding.jpg' },
    { icon: '🧾', title: 'Transaction History',     description: 'Full audit trail of every buy, sell, deposit and withdrawal you have made.',   img: '../images/startpage-info-transaction-history.jpg' },
];

const STATS = [
    { value: '3',    label: 'Markets covered' },
    { value: '50+',  label: 'Stocks available' },
    { value: '0%',   label: 'Transaction fee' },
    { value: '100%', label: 'Secure platform' },
];

const GALLERY_IMAGES = [
    { src: '../images/startpage-gallery-wall-street.jpg',    alt: 'Wall Street' },
    { src: '../images/startpage-gallery-stock-table.jpg',    alt: 'Stock market data' },
    { src: '../images/startpage-gallery-cryptocurrency.jpg', alt: 'Cryptocurrency' },
    { src: '../images/startpage-gallery-vault.jpg',          alt: 'Secure vault' },
];

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg sticky-top navbar-main">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2" href="index.html">
                    <img src="../images/app-icon.jpg" alt="Pocket TradePro logo" className="navbar-logo-img" />
                    <span className="navbar-brand-name">Pocket TradePro</span>
                </a>

                <div className="navbar-right-group">
                    <a href="login.html" className="btn-nav-outline">Login</a>
                    <a href="register.html" className="btn-nav-primary">Get started</a>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav me-auto ms-4 gap-1">
                        <li className="nav-item"><a className="nav-link" href="index.html">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="contact.html?guest=1">Contact</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

function GallerySlider() {
    const [active, setActive] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % GALLERY_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="gallery-card">
            <div className="gallery-track">
                {GALLERY_IMAGES.map((img, i) => (
                    <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        className={`gallery-slide${i === active ? ' gallery-slide-active' : ''}`}
                    />
                ))}
            </div>
            <div className="gallery-dots">
                {GALLERY_IMAGES.map((_, i) => (
                    <button
                        key={i}
                        className={`gallery-dot${i === active ? ' gallery-dot-active' : ''}`}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>
        </div>
    );
}

function HeroSection() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <p className="hero-eyebrow">The smart way to invest</p>
                        <h1 className="hero-title">
                            Trade stocks with <span className="highlight">confidence</span>
                        </h1>
                        <p className="hero-subtitle">
                            Pocket TradePro gives you real-time market data, a personal portfolio
                            and seamless buy/sell execution — all in one platform.
                        </p>
                        <div className="d-flex gap-3 flex-wrap">
                            <a href="register.html" className="btn-hero-primary">Get started free</a>
                            <a href="terminal.html?mode=guest" className="btn-hero-ghost">Continue as Guest</a>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <GallerySlider />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatsBar() {
    return (
        <div className="stats-bar">
            <div className="container">
                <div className="row text-center g-4">
                    {STATS.map(stat => (
                        <div key={stat.label} className="col-6 col-md-3">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeaturesSection() {
    return (
        <section className="features-section">
            <div className="container">
                <h2 className="section-title">Everything you need to invest smarter</h2>
                <p className="section-subtitle">From first deposit to full portfolio — Pocket TradePro has you covered.</p>
                <div className="row g-4">
                    {FEATURES.map(feature => (
                        <div key={feature.title} className="col-md-6 col-lg-4">
                            <div className="feature-card" style={{'--card-bg': `url('${feature.img}')`}}>
                                <span className="feature-icon">{feature.icon}</span>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaSection() {
    return (
        <section className="cta-section">
            <div className="container">
                <h2 className="cta-title">Ready to start investing?</h2>
                <p className="cta-subtitle">Create a free account in under 30 seconds.</p>
                <a href="register.html" className="btn-hero-primary">Create free account</a>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer>
            <div className="container">
                <span>© 2026 Pocket TradePro. All rights reserved.</span>
            </div>
        </footer>
    );
}

function App() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <StatsBar />
            <FeaturesSection />
            <CtaSection />
            <Footer />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
