const { useState, useEffect, useRef } = React;

const _isGuest = new URLSearchParams(window.location.search).get('guest') === '1';

const _stored = JSON.parse(localStorage.getItem('sessionUser') || 'null');
const SESSION_USER = {
    firstName: _stored?.firstName || 'Stefan',
    lastName:  _stored?.lastName  || 'Popescu',
    email:     _stored?.email     || 'stefan.popescu@example.com',
};

const INITIAL_MESSAGES = [
    { id: 1, from: 'support', text: 'Hello! Welcome to Pocket TradePro Support. How can we help you today?', time: '09:00' },
    { id: 2, from: 'support', text: 'Our team is available Monday–Friday, 09:00–18:00 EET. For urgent issues outside business hours, please email us directly.', time: '09:00' },
];

const CONTACT_ITEMS = [
    { icon: 'bi-geo-alt-fill',    label: 'Address',  value: 'Piața Charles de Gaulle 15, București, Romania' },
    { icon: 'bi-telephone-fill',  label: 'Phone',    value: '+40 21 555 0100' },
    { icon: 'bi-envelope-fill',   label: 'Email',    value: 'support@pocket_tradepro.com' },
    { icon: 'bi-clock-fill',      label: 'Hours',    value: 'Mon – Fri, 09:00 – 18:00 EET' },
];

const SOCIAL_LINKS = [
    { icon: 'bi-instagram',  label: 'Instagram', href: 'https://www.instagram.com/pocket.tradepro/' },
    { icon: 'bi-youtube',    label: 'YouTube',   href: 'https://www.youtube.com/@PocketTradePro'    },
];

function formatTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

function Navbar() {
    return (
        <header className="contact-navbar">
            <div className="contact-navbar-left">
                <a href="terminal.html" className="contact-nav-brand">
                    <img src="../images/app-icon.jpg" alt="logo" className="contact-nav-logo" />
                    <span className="contact-nav-name">Pocket TradePro</span>
                </a>
            </div>
            <div className="contact-navbar-right">
                <a href="terminal.html" className="contact-back-btn">
                    <i className="bi bi-reply"></i>
                    <span>Back to dashboard</span>
                </a>
            </div>
        </header>
    );
}

function ContactInfo() {
    return (
        <div className="contact-info-card">
            <div className="contact-info-header">
                <div className="contact-info-logo-wrap">
                    <img src="../images/app-icon.jpg" alt="logo" className="contact-info-logo" />
                </div>
                <div>
                    <div className="contact-info-company">Pocket TradePro</div>
                    <div className="contact-info-tagline">Your trusted trading platform</div>
                </div>
            </div>

            <div className="contact-info-list">
                {CONTACT_ITEMS.map(item => (
                    <div key={item.label} className="contact-info-row">
                        <div className="contact-info-icon">
                            <i className={`bi ${item.icon}`}></i>
                        </div>
                        <div className="contact-info-text">
                            <div className="contact-info-label">{item.label}</div>
                            <div className="contact-info-value">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="contact-socials">
                <div className="contact-socials-label">Follow us</div>
                <div className="contact-socials-row">
                    {SOCIAL_LINKS.map(s => (
                        <a key={s.label} href={s.href} className="contact-social-btn" title={s.label}>
                            <i className={`bi ${s.icon}`}></i>
                        </a>
                    ))}
                </div>
            </div>

            <div className="contact-map">
                <iframe
                    title="Office location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.07880!3d44.46780!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff51adb9d96b%3A0x1c0db8df1ef1d3e5!2sPia%C8%9Ba%20Charles%20de%20Gaulle%2015%2C%20Bucure%C8%99ti!5e0!3m2!1sen!2sro!4v1700000000000"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}

function ChatPanel() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput]       = useState('');
    const [typing, setTyping]     = useState(false);
    const bottomRef               = useRef(null);
    const inputRef                = useRef(null);
    const initials                = SESSION_USER.firstName[0] + SESSION_USER.lastName[0];

    const SUPPORT_REPLIES = [
        'Thank you for reaching out! One of our agents will be with you shortly.',
        'I understand. Could you please provide more details about your issue?',
        'We appreciate your patience. Our team is looking into this.',
        "That's a great question! For account-related queries, please also check your email for any notifications from us.",
        'Is there anything else I can help you with today?',
        'Our technical team has been notified and will resolve this as soon as possible.',
    ];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    function sendMessage() {
        const text = input.trim();
        if (!text) return;
        const userMsg = { id: Date.now(), from: 'user', text, time: formatTime() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            const reply = SUPPORT_REPLIES[Math.floor(Math.random() * SUPPORT_REPLIES.length)];
            setTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, from: 'support', text: reply, time: formatTime() }]);
        }, 1400);
    }

    function handleKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="chat-header-avatar">
                    <i className="bi bi-headset"></i>
                </div>
                <div className="chat-header-info">
                    <div className="chat-header-name">PTP Support</div>
                    <div className="chat-header-status">
                        <span className="chat-status-dot"></span> Online
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-msg-wrap ${msg.from === 'user' ? 'user' : 'support'}`}>
                        {msg.from === 'support' && (
                            <div className="chat-avatar support-avatar">
                                <i className="bi bi-headset"></i>
                            </div>
                        )}
                        <div className="chat-bubble-wrap">
                            <div className={`chat-bubble ${msg.from === 'user' ? 'bubble-user' : 'bubble-support'}`}>
                                {msg.text}
                            </div>
                            <div className="chat-time">{msg.time}</div>
                        </div>
                        {msg.from === 'user' && (
                            <div className="chat-avatar user-avatar">{initials}</div>
                        )}
                    </div>
                ))}
                {typing && (
                    <div className="chat-msg-wrap support">
                        <div className="chat-avatar support-avatar">
                            <i className="bi bi-headset"></i>
                        </div>
                        <div className="chat-bubble bubble-support chat-typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef}></div>
            </div>

            <div className="chat-input-area">
                <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                />
                <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim()}>
                    <i className="bi bi-send-fill"></i>
                </button>
            </div>
        </div>
    );
}

function ChatLocked() {
    return (
        <div className="chat-panel chat-locked-panel">
            <div className="chat-header">
                <div className="chat-header-avatar">
                    <i className="bi bi-headset"></i>
                </div>
                <div className="chat-header-info">
                    <div className="chat-header-name">PTP Support</div>
                    <div className="chat-header-status">
                        <span className="chat-status-dot"></span> Online
                    </div>
                </div>
            </div>
            <div className="chat-locked-body">
                <div className="chat-locked-icon">
                    <i className="bi bi-lock-fill"></i>
                </div>
                <p className="chat-locked-title">Sign in to use live chat</p>
                <p className="chat-locked-sub">Create a free account or log in to chat directly with our support team.</p>
                <div className="chat-locked-actions">
                    <a href="login.html" className="chat-locked-btn-primary">Sign in</a>
                    <a href="register.html" className="chat-locked-btn-secondary">Create account</a>
                </div>
            </div>
        </div>
    );
}

function ContactPage() {
    return (
        <div className="contact-root">
            <Navbar />
            <main className="contact-main">
                <div className="contact-page-title">
                    <h1>Contact &amp; Support</h1>
                    <p>Get in touch with our team or chat with us directly.</p>
                </div>
                <div className="contact-layout">
                    <ContactInfo />
                    {_isGuest ? <ChatLocked /> : <ChatPanel />}
                </div>
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ContactPage />);
