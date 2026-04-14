const { useState, useRef, useEffect } = React;

function FlagImg({ code }) {
    return (
        <img
            className="flag-img"
            src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
            alt={code}
        />
    );
}

const COUNTRIES = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'CV', name: 'Cabo Verde' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo (DR)' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GR', name: 'Greece' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: 'North Korea' },
    { code: 'KR', name: 'South Korea' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestine' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'São Tomé and Príncipe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatican City' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
];

const DIAL_CODE_MAP = {
    AF: '+93',   AL: '+355',  DZ: '+213',  AD: '+376',  AO: '+244',
    AG: '+1268', AR: '+54',   AM: '+374',  AU: '+61',   AT: '+43',
    AZ: '+994',  BS: '+1242', BH: '+973',  BD: '+880',  BB: '+1246',
    BY: '+375',  BE: '+32',   BZ: '+501',  BJ: '+229',  BT: '+975',
    BO: '+591',  BA: '+387',  BW: '+267',  BR: '+55',   BN: '+673',
    BG: '+359',  BF: '+226',  BI: '+257',  CV: '+238',  KH: '+855',
    CM: '+237',  CA: '+1',    CF: '+236',  TD: '+235',  CL: '+56',
    CN: '+86',   CO: '+57',   KM: '+269',  CG: '+242',  CD: '+243',
    CR: '+506',  HR: '+385',  CU: '+53',   CY: '+357',  CZ: '+420',
    DK: '+45',   DJ: '+253',  DM: '+1767', DO: '+1809', EC: '+593',
    EG: '+20',   SV: '+503',  GQ: '+240',  ER: '+291',  EE: '+372',
    SZ: '+268',  ET: '+251',  FJ: '+679',  FI: '+358',  FR: '+33',
    GA: '+241',  GM: '+220',  GE: '+995',  DE: '+49',   GH: '+233',
    GR: '+30',   GD: '+1473', GT: '+502',  GN: '+224',  GW: '+245',
    GY: '+592',  HT: '+509',  HN: '+504',  HU: '+36',   IS: '+354',
    IN: '+91',   ID: '+62',   IR: '+98',   IQ: '+964',  IE: '+353',
    IL: '+972',  IT: '+39',   JM: '+1876', JP: '+81',   JO: '+962',
    KZ: '+7',    KE: '+254',  KI: '+686',  KP: '+850',  KR: '+82',
    KW: '+965',  KG: '+996',  LA: '+856',  LV: '+371',  LB: '+961',
    LS: '+266',  LR: '+231',  LY: '+218',  LI: '+423',  LT: '+370',
    LU: '+352',  MG: '+261',  MW: '+265',  MY: '+60',   MV: '+960',
    ML: '+223',  MT: '+356',  MH: '+692',  MR: '+222',  MU: '+230',
    MX: '+52',   FM: '+691',  MD: '+373',  MC: '+377',  MN: '+976',
    ME: '+382',  MA: '+212',  MZ: '+258',  MM: '+95',   NA: '+264',
    NR: '+674',  NP: '+977',  NL: '+31',   NZ: '+64',   NI: '+505',
    NE: '+227',  NG: '+234',  MK: '+389',  NO: '+47',   OM: '+968',
    PK: '+92',   PW: '+680',  PS: '+970',  PA: '+507',  PG: '+675',
    PY: '+595',  PE: '+51',   PH: '+63',   PL: '+48',   PT: '+351',
    QA: '+974',  RO: '+40',   RU: '+7',    RW: '+250',  KN: '+1869',
    LC: '+1758', VC: '+1784', WS: '+685',  SM: '+378',  ST: '+239',
    SA: '+966',  SN: '+221',  RS: '+381',  SC: '+248',  SL: '+232',
    SG: '+65',   SK: '+421',  SI: '+386',  SB: '+677',  SO: '+252',
    ZA: '+27',   SS: '+211',  ES: '+34',   LK: '+94',   SD: '+249',
    SR: '+597',  SE: '+46',   CH: '+41',   SY: '+963',  TW: '+886',
    TJ: '+992',  TZ: '+255',  TH: '+66',   TL: '+670',  TG: '+228',
    TO: '+676',  TT: '+1868', TN: '+216',  TR: '+90',   TM: '+993',
    TV: '+688',  UG: '+256',  UA: '+380',  AE: '+971',  GB: '+44',
    US: '+1',    UY: '+598',  UZ: '+998',  VU: '+678',  VA: '+379',
    VE: '+58',   VN: '+84',   YE: '+967',  ZM: '+260',  ZW: '+263',
};

const DIAL_CODES = COUNTRIES.map(c => ({
    code: c.code,
    name: c.name,

    dial: DIAL_CODE_MAP[c.code] || '',
})).sort((a, b) => a.name.localeCompare(b.name));

const THEMES = [
    { id: 'dark',   icon: 'bi-moon-stars-fill', label: 'Dark' },
    { id: 'system', icon: 'bi-circle-half',      label: 'System' },
    { id: 'light',  icon: 'bi-sun-fill',         label: 'Light' },
];




const CHART_TYPES = [
    { id: 'line',        icon: 'bi-graph-up',        label: 'Line' },
    { id: 'candlestick', icon: 'bi-bar-chart-line',   label: 'Candlestick' },
];

const NOTIFICATION_OPTIONS = [
    { key: 'tradeConfirmations', icon: 'bi-check-circle',  label: 'Trade confirmations',  description: 'Email for every executed order' },
    { key: 'priceAlerts',        icon: 'bi-bell',           label: 'Price alerts',          description: 'When a watchlisted stock hits your target' },
    { key: 'marketNews',         icon: 'bi-newspaper',      label: 'Market news',           description: 'Daily digest of relevant market news' },
    { key: 'weeklySummary',      icon: 'bi-calendar-week',  label: 'Weekly summary',        description: 'Portfolio performance report every Monday' },
];

const CURRENCIES = [
    { code: 'RON', symbol: 'lei', label: 'Romanian Leu',  flag: 'ro' },
    { code: 'EUR', symbol: '€',   label: 'Euro',          flag: 'eu' },
    { code: 'USD', symbol: '$',   label: 'US Dollar',     flag: 'us' },
    { code: 'GBP', symbol: '£',   label: 'British Pound', flag: 'gb' },
    { code: 'CHF', symbol: 'Fr',  label: 'Swiss Franc',   flag: 'ch' },
];

const PASSWORD_CRITERIA = [
    { label: 'At least 8 characters',       test: pwd => pwd.length >= 8 },
    { label: 'At least 1 number',            test: pwd => /[0-9]/.test(pwd) },
    { label: 'At least 1 uppercase letter',  test: pwd => /[A-Z]/.test(pwd) },
    { label: 'At least 1 special character', test: pwd => /[^A-Za-z0-9]/.test(pwd) },
];

const PASSWORD_STRENGTH_LEVELS = [
    { label: 'Weak',   color: '#e05252' },
    { label: 'Weak',   color: '#e05252' },
    { label: 'Medium', color: '#f0b429' },
    { label: 'Medium', color: '#f0b429' },
    { label: 'Strong', color: '#00c896' },
];

const CARD_ICONS = {
    visa:       'bi-credit-card-2-front',
    mastercard: 'bi-credit-card-2-back',
    default:    'bi-credit-card',
};

function detectCardType(number) {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    return null;
}

const CARD_MID_IMAGES = {
    visa:       '../images/card-mid-visa.jpg',
    mastercard: '../images/card-mid-mastercard.jpg',
    amex:       '../images/card-mid-american-express.jpg',
};

function CardMajorIndustryIdentifier({ type }) {
    if (!type || !CARD_MID_IMAGES[type]) return null;
    return <img src={CARD_MID_IMAGES[type]} className="vc-brand-img" alt={type} />;
}

function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function maskCardNumber(number) {
    return '\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ' + number.replace(/\s/g, '').slice(-4);
}


const _storedUser = JSON.parse(localStorage.getItem('sessionUser') || 'null');
const SESSION_USER = {
    firstName:       _storedUser?.firstName || 'Stefan',
    lastName:        _storedUser?.lastName  || 'Popescu',
    email:           _storedUser?.email     || 'stefan@example.com',
    tag:             null,
    avatarUrl:       null,
    salutation:      '',
    alias:           '',
    dateOfBirth:     '',
    dialCountryCode: 'RO',
    localNumber:     '',
    country:         '',
    currency:            'RON',
    theme:               'dark',
    chartType:           'line',
    notifications:       { tradeConfirmations: true, priceAlerts: true, marketNews: false, weeklySummary: true },
    cards:               [],
    verificationStatus:  null,
    accountStatus:       'active',
    memberSince:         '2026-01-01',
};

function PasswordStrengthBar({ password }) {
    const criteriaResults = PASSWORD_CRITERIA.map(c => ({ label: c.label, met: password ? c.test(password) : false }));
    const metCount  = criteriaResults.filter(c => c.met).length;
    const fillWidth = password ? Math.max(25, (metCount / PASSWORD_CRITERIA.length) * 100) : 0;
    const level     = password ? PASSWORD_STRENGTH_LEVELS[metCount] : null;
    const hasUnmet  = criteriaResults.some(c => !c.met);

    return (
        <div className={`strength-bar-wrapper ${!password ? 'strength-bar-hidden' : ''}`}>
            <div className="strength-bar-track">
                <div
                    className="strength-bar-fill"
                    style={{ width: fillWidth + '%', backgroundColor: level ? level.color : 'transparent' }}
                />
            </div>
            {password && (
                <div className="strength-checklist">
                    <p className="strength-summary">
                        {hasUnmet
                            ? <><span style={{ color: level.color }}>{level.label} password.</span> Password must contain:</>
                            : <span style={{ color: level.color }}>Strong Password.</span>
                        }
                    </p>
                    {criteriaResults.map(c => (
                        <div key={c.label} className={`strength-criterion ${c.met ? 'met' : 'unmet'}`}>
                            <i className={c.met ? 'bi bi-check-lg' : 'bi bi-x-lg'}></i>
                            <span>{c.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProfileSidebar({ user, avatarPreview, activeSection, onSelect, onAvatarChange, fileInputRef, mobileOpen }) {
    const initials = user.firstName[0] + user.lastName[0];

    const navItems = [
        { key: 'personal',      icon: 'bi-person',        label: 'Personal Info' },
        { key: 'security',      icon: 'bi-shield-lock',   label: 'Security' },
        { key: 'preferences',   icon: 'bi-sliders',       label: 'Preferences' },
        { key: 'payments',      icon: 'bi-credit-card',   label: 'Payment Methods' },
        { key: 'verification',  icon: 'bi-patch-check',   label: 'Account Verification' },
        { key: 'status',        icon: 'bi-person-gear',   label: 'Status' },
    ];

    return (
        <aside className={`profile-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
            <div className="avatar-section">
                <div className="avatar-wrapper" onClick={() => fileInputRef.current.click()}>
                    {avatarPreview
                        ? <img src={avatarPreview} alt="Profile photo" className="avatar-img" />
                        : <span className="avatar-initials">{initials}</span>
                    }
                    <div className="avatar-overlay">
                        <i className="bi bi-camera"></i>
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="d-none"
                    onChange={onAvatarChange}
                />
                <div className="sidebar-user-info">
                    <div className="user-name">{user.firstName} {user.lastName}</div>
                    <div className="user-tag">{user.tag ?? <span className="tag-pending">tag pending</span>}</div>
                    <div className="user-email">{user.email}</div>
                </div>
            </div>

            <nav className="profile-nav">
                {navItems.map(item => (
                    <button
                        key={item.key}
                        className={`profile-nav-item ${activeSection === item.key ? 'active' : ''}`}
                        onClick={() => onSelect(item.key)}
                    >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.label}</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </button>
                ))}
            </nav>

            <a href="terminal.html" className="back-link">
                <i className="bi bi-reply"></i> Back to dashboard
            </a>
        </aside>
    );
}

function SelectDropdown({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false);
    const wrapperRef      = useRef(null);

    const selected = options.find(o => o.value === value);

    React.useEffect(() => {
        function onOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, []);

    return (
        <div className="sel-dropdown" ref={wrapperRef}>
            <button
                type="button"
                className={`sel-trigger ${open ? 'open' : ''}`}
                onClick={() => open ? setOpen(false) : setTimeout(() => setOpen(true), 120)}
            >
                <span className={selected ? '' : 'sel-placeholder'}>{selected ? selected.label : placeholder}</span>
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} sel-chevron`}></i>
            </button>
            {open && (
                <ul className="sel-list">
                    {options.map(o => (
                        <li
                            key={o.value}
                            className={`sel-item ${o.value === value ? 'active' : ''}`}
                            onMouseDown={() => { onChange(o.value); setOpen(false); }}
                        >
                            {o.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function CountrySelect({ value, onChange }) {
    const [open, setOpen]     = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef          = useRef(null);

    const selected = COUNTRIES.find(c => c.code === value);
    const filtered = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    React.useEffect(() => {
        function onOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, []);

    return (
        <div className="custom-select-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className={`custom-select-trigger ${open ? 'open' : ''}`}
                onClick={() => open ? setOpen(false) : setTimeout(() => setOpen(true), 120)}
            >
                {selected ? (
                    <>
                        <FlagImg code={selected.code} />
                        <span className="cs-name">{selected.name}</span>
                    </>
                ) : (
                    <span className="cs-placeholder">Select country</span>
                )}
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} cs-chevron`}></i>
            </button>
            {open && (
                <div className="custom-select-dropdown">
                    <div className="cs-search-wrapper">
                        <i className="bi bi-search cs-search-icon"></i>
                        <input
                            type="text"
                            className="cs-search-input"
                            placeholder="Search country..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="cs-list">
                        {filtered.map(c => (
                            <li
                                key={c.code}
                                className={`cs-item ${c.code === value ? 'active' : ''}`}
                                onMouseDown={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                            >
                                <FlagImg code={c.code} />
                                <span className="cs-name">{c.name}</span>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="cs-empty">No countries found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

function DialCodeSelect({ value, onChange }) {
    const [open, setOpen]     = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef          = useRef(null);

    const selected = DIAL_CODES.find(d => d.code === value);
    const filtered = DIAL_CODES.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.dial.includes(search)
    );

    React.useEffect(() => {
        function onOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, []);

    return (
        <div className="dial-code-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className={`dial-code-trigger ${open ? 'open' : ''}`}
                onClick={() => open ? setOpen(false) : setTimeout(() => setOpen(true), 120)}
            >
                {selected ? (
                    <>
                        <FlagImg code={selected.code} />
                        <span className="ds-dial">{selected.dial}</span>
                    </>
                ) : (
                    <span className="cs-placeholder">+?</span>
                )}
                <i className={`bi bi-chevron-${open ? 'up' : 'down'} cs-chevron`}></i>
            </button>
            {open && (
                <div className="custom-select-dropdown ds-dropdown">
                    <div className="cs-search-wrapper">
                        <i className="bi bi-search cs-search-icon"></i>
                        <input
                            type="text"
                            className="cs-search-input"
                            placeholder="Country or +code..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="cs-list">
                        {filtered.map(d => (
                            <li
                                key={d.code}
                                className={`cs-item ${d.code === value ? 'active' : ''}`}
                                onMouseDown={() => { onChange(d.code); setOpen(false); setSearch(''); }}
                            >
                                <FlagImg code={d.code} />
                                <span className="cs-name">{d.name}</span>
                                <span className="ds-dial-badge">{d.dial}</span>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="cs-empty">No results</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

function PersonalSection({ user, onSave }) {
    const firstName = user.firstName;
    const lastName  = user.lastName;
    const [salutation, setSalutation]       = useState(user.salutation || '');
    const [alias, setAlias]                 = useState(user.alias || '');
    const [dobDay, setDobDay]               = useState(user.dateOfBirth ? user.dateOfBirth.split('-')[2] : '');
    const [dobMonth, setDobMonth]           = useState(user.dateOfBirth ? user.dateOfBirth.split('-')[1] : '');
    const [dobYear, setDobYear]             = useState(user.dateOfBirth ? user.dateOfBirth.split('-')[0] : '');
    const [country, setCountry]             = useState(user.country);
    const [dialCountryCode, setDialCode]    = useState(user.dialCountryCode || 'RO');
    const [localNumber, setLocalNumber]     = useState(user.localNumber || '');
    const [phoneError, setPhoneError]       = useState('');
    const [isSaving, setSaving]             = useState(false);
    const [feedback, setFeedback]           = useState(null);

    const dialCode = DIAL_CODE_MAP[dialCountryCode] || '+40';

    function isUnder18() {
        if (!dobDay || !dobMonth || !dobYear) return false;
        const dob   = new Date(Number(dobYear), Number(dobMonth) - 1, Number(dobDay));
        const today = new Date();
        const age18 = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
        return today < age18;
    }

    function validatePhone(value) {
        if (!value) return '';
        const digits = value.replace(/[\s\-().]/g, '');
        const valid = /^\d+$/.test(digits) && digits.length >= 4 && digits.length <= 15;
        return valid ? '' : 'Invalid phone number format.';
    }

    async function handleSave(e) {
        e.preventDefault();
        const phoneValidationError = validatePhone(localNumber);
        if (phoneValidationError) {
            setPhoneError(phoneValidationError);
            return;
        }
        setSaving(true);
        setFeedback(null);
        try {
            const response = await fetch('/api/profile/personal', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ firstName, lastName, salutation, alias, dateOfBirth: [dobYear, dobMonth, dobDay].filter(Boolean).join('-'), country, dialCountryCode, dialCode, localNumber }),
            });
            const result = await response.json();
            if (!result.success) {
                setFeedback({ type: 'error', message: result.error || 'Failed to save changes.' });
                return;
            }
            onSave({ salutation, alias, dateOfBirth: [dobYear, dobMonth, dobDay].filter(Boolean).join('-'), country, dialCountryCode, localNumber });
            setFeedback({ type: 'success', message: 'Personal info updated successfully.' });
        } catch {
            onSave({ salutation, alias, dateOfBirth: [dobYear, dobMonth, dobDay].filter(Boolean).join('-'), country, dialCountryCode, localNumber });
            setFeedback({ type: 'success', message: 'Personal info updated successfully.' });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Personal Info</h2>
                <p className="section-subtitle">Update your personal details and contact information</p>
            </div>

            {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            <form onSubmit={handleSave}>
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <div className="gender-picker">
                        {['Mr.', 'Mrs.', 'Ms.'].map(opt => (
                            <button
                                key={opt}
                                type="button"
                                className={`gender-chip ${salutation === opt ? 'selected' : ''}`}
                                onClick={() => setSalutation(prev => prev === opt ? '' : opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <label className="form-label" htmlFor="firstName">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            value={firstName}
                            readOnly
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label" htmlFor="lastName">Last name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            value={lastName}
                            readOnly
                        />
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="alias">Alias</label>
                        <input
                            id="alias"
                            type="text"
                            className="form-control"
                            placeholder="e.g. Alias"
                            value={alias}
                            onChange={e => setAlias(e.target.value)}
                            autoComplete="nickname"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Date of birth</label>
                        <div className="dob-wrapper">
                            <SelectDropdown
                                value={dobDay}
                                onChange={setDobDay}
                                placeholder="Day"
                                options={Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: String(i + 1) }))}
                            />
                            <SelectDropdown
                                value={dobMonth}
                                onChange={setDobMonth}
                                placeholder="Month"
                                options={['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => ({ value: String(i + 1).padStart(2, '0'), label: m }))}
                            />
                            <SelectDropdown
                                value={dobYear}
                                onChange={setDobYear}
                                placeholder="Year"
                                options={Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => ({ value: String(y), label: String(y) }))}
                            />
                        </div>
                        {isUnder18() && (
                            <div className="field-error">You must be at least 18 years old to use this platform.</div>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Your tag</label>
                    <div className="tag-display">
                        <span className={user.tag ? '' : 'tag-pending'}>{user.tag ?? 'Your tag will be assigned automatically'}</span>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Country of origin</label>
                    <CountrySelect value={country} onChange={code => { setCountry(code); setDialCode(code); }} />
                </div>

                <div className="mb-4">
                    <label className="form-label" htmlFor="localNumber">Phone number</label>
                    <div className="phone-wrapper">
                        <DialCodeSelect value={dialCountryCode} onChange={setDialCode} />
                        <input
                            id="localNumber"
                            type="tel"
                            className={`form-control phone-input ${phoneError ? 'input-error' : ''}`}
                            placeholder="000 000 0000"
                            value={localNumber}
                            onChange={e => { setLocalNumber(e.target.value); setPhoneError(validatePhone(e.target.value)); }}
                            autoComplete="tel-national"
                        />
                    </div>
                    {phoneError && <p className="field-error">{phoneError}</p>}
                </div>

                <button type="submit" className="btn-brand" disabled={isSaving || isUnder18()}>
                    {isSaving ? 'Saving\u2026' : 'Save changes'}
                </button>
            </form>
        </div>
    );
}

function SecuritySection() {
    const [currentPwd, setCurrentPwd]   = useState('');
    const [newPwd, setNewPwd]           = useState('');
    const [confirmPwd, setConfirmPwd]   = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setSaving]         = useState(false);
    const [feedback, setFeedback]       = useState(null);

    const allCriteriaMet = PASSWORD_CRITERIA.every(c => c.test(newPwd));
    const canSubmit      = currentPwd && allCriteriaMet && newPwd === confirmPwd;

    async function handleSave(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setSaving(true);
        setFeedback(null);
        try {
            const response = await fetch('/api/profile/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
            });
            const result = await response.json();
            if (!result.success) {
                setFeedback({ type: 'error', message: result.error || 'Failed to change password.' });
                return;
            }
            setCurrentPwd('');
            setNewPwd('');
            setConfirmPwd('');
            setFeedback({ type: 'success', message: 'Password changed successfully.' });
        } catch {
            setCurrentPwd('');
            setNewPwd('');
            setConfirmPwd('');
            setFeedback({ type: 'success', message: 'Password changed successfully.' });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Security</h2>
                <p className="section-subtitle">Change your account password</p>
            </div>

            {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            <form onSubmit={handleSave} noValidate>
                <div className="mb-3">
                    <label className="form-label" htmlFor="currentPwd">Current password</label>
                    <div className="password-wrapper">
                        <input
                            id="currentPwd"
                            type={showCurrent ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={currentPwd}
                            onChange={e => setCurrentPwd(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowCurrent(p => !p)}
                            aria-label={showCurrent ? 'Hide password' : 'Show password'}
                        >
                            <i className={showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="newPwd">New password</label>
                    <div className="password-wrapper">
                        <input
                            id="newPwd"
                            type={showNew ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={newPwd}
                            onChange={e => setNewPwd(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNew(p => !p)}
                            aria-label={showNew ? 'Hide password' : 'Show password'}
                        >
                            <i className={showNew ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                        </button>
                    </div>
                    <PasswordStrengthBar password={newPwd} />
                </div>

                <div className="mb-4">
                    <label className="form-label" htmlFor="confirmPwd">Confirm new password</label>
                    <div className="password-wrapper">
                        <input
                            id="confirmPwd"
                            type={showConfirm ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={confirmPwd}
                            onChange={e => setConfirmPwd(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirm(p => !p)}
                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                            <i className={showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                        </button>
                    </div>
                    {confirmPwd && newPwd !== confirmPwd && (
                        <p className="mismatch-hint">Passwords do not match.</p>
                    )}
                </div>

                <button type="submit" className="btn-brand" disabled={isSaving || !canSubmit}>
                    {isSaving ? 'Changing\u2026' : 'Change password'}
                </button>
            </form>
        </div>
    );
}

function PreferencesSection({ user, onSave }) {
    const [currency, setCurrency]   = useState(localStorage.getItem('preferredCurrency') || user.currency);
    const [theme, setTheme]         = useState(localStorage.getItem('theme') || user.theme || 'dark');
    const [chartType, setChartType] = useState(localStorage.getItem('chartType') || user.chartType || 'line');
    const [notifs, setNotifs]       = useState(JSON.parse(localStorage.getItem('profileNotifications') || 'null') || user.notifications || { tradeConfirmations: true, priceAlerts: true, marketNews: false, weeklySummary: true });
    const [isSaving, setSaving]     = useState(false);
    const [feedback, setFeedback]   = useState(null);

    function toggleNotif(key) {
        setNotifs(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem('profileNotifications', JSON.stringify(next));
            return next;
        });
    }

    function applyTheme(t) {
        const resolved = t === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : t;
        document.documentElement.setAttribute('data-bs-theme', resolved);
        localStorage.setItem('theme', t);
    }

    React.useEffect(() => { applyTheme(theme); }, []);

    function handleThemeClick(id) {
        setTheme(id);
        applyTheme(id);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);
        localStorage.setItem('preferredCurrency', currency);
        localStorage.setItem('chartType', chartType);
        localStorage.setItem('profileNotifications', JSON.stringify(notifs));
        try {
            const response = await fetch('/api/profile/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currency, theme, chartType, notifications: notifs }),
            });
            const result = await response.json();
            if (!result.success) {
                setFeedback({ type: 'error', message: result.error || 'Failed to save changes.' });
                return;
            }
            onSave({ currency, theme, chartType, notifications: notifs });
            setFeedback({ type: 'success', message: 'Preferences updated successfully.' });
        } catch {
            onSave({ currency, theme, chartType, notifications: notifs });
            setFeedback({ type: 'success', message: 'Preferences updated successfully.' });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Preferences</h2>
                <p className="section-subtitle">Customize your display, trading and notification preferences</p>
            </div>

            {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            <form onSubmit={handleSave}>
                <div className="mb-4">
                    <label className="form-label">Theme</label>
                    <div className="theme-grid">
                        {THEMES.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                className={`theme-option ${theme === t.id ? 'selected' : ''}`}
                                onClick={() => handleThemeClick(t.id)}
                            >
                                <i className={`bi ${t.icon} theme-icon`}></i>
                                <span className="theme-label">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>


                <div className="mb-4">
                    <label className="form-label">Preferred currency</label>
                    <div className="currency-grid">
                        {CURRENCIES.map(cur => (
                            <button
                                key={cur.code}
                                type="button"
                                className={`currency-option ${currency === cur.code ? 'selected' : ''}`}
                                onClick={() => setCurrency(cur.code)}
                            >
                                <img
                                    className="currency-flag"
                                    src={`https://flagcdn.com/${cur.flag}.svg`}
                                    alt={cur.code}
                                />
                                <div className="currency-name-row">
                                    <span className="currency-code">{cur.code}</span>
                                    <span className="currency-symbol">{cur.symbol}</span>
                                </div>
                                <span className="currency-label">{cur.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Default chart type</label>
                    <div className="theme-grid">
                        {CHART_TYPES.map(ct => (
                            <button
                                key={ct.id}
                                type="button"
                                className={`theme-option ${chartType === ct.id ? 'selected' : ''}`}
                                onClick={() => { setChartType(ct.id); localStorage.setItem('chartType', ct.id); }}
                            >
                                <i className={`bi ${ct.icon} theme-icon`}></i>
                                <span className="theme-label">{ct.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Notifications</label>
                    <div className="notif-list">
                        {NOTIFICATION_OPTIONS.map(opt => (
                            <div key={opt.key} className="notif-row" onClick={() => toggleNotif(opt.key)} style={{ cursor: 'pointer' }}>
                                <div className="notif-info">
                                    <i className={`bi ${opt.icon} notif-icon`}></i>
                                    <div className="notif-text">
                                        <span className="notif-label">{opt.label}</span>
                                        <span className="notif-desc">{opt.description}</span>
                                    </div>
                                </div>
                                <div
                                    className={`pref-toggle ${notifs[opt.key] ? 'on' : ''}`}
                                    role="switch"
                                    aria-checked={notifs[opt.key]}
                                >
                                    <div className="pref-toggle-thumb"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-brand" disabled={isSaving}>
                    {isSaving ? 'Saving\u2026' : 'Save changes'}
                </button>
            </form>
        </div>
    );
}

const CARD_GRADIENT_POOL = [
    'linear-gradient(135deg, #1a1f71 0%, #2551a3 100%)',
    'linear-gradient(135deg, #b91c1c 0%, #f59e0b 100%)',
    'linear-gradient(135deg, #065f46 0%, #0891b2 100%)',
    'linear-gradient(135deg, #6d28d9 0%, #db2777 100%)',
    'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)',
    'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    'linear-gradient(135deg, #1e3a5f 0%, #00c896 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #2563eb 100%)',
    'linear-gradient(135deg, #7f1d1d 0%, #c2410c 100%)',
    'linear-gradient(135deg, #134e4a 0%, #6d28d9 100%)',
];

function randomCardGradient() {
    return CARD_GRADIENT_POOL[Math.floor(Math.random() * CARD_GRADIENT_POOL.length)];
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ExpiryPicker({ value, onChange }) {
    const today        = new Date();
    const currentYear  = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const parsed   = value && value.length === 5 ? { m: parseInt(value.slice(0,2)), y: 2000 + parseInt(value.slice(3)) } : null;
    const [viewYear, setViewYear] = useState(parsed ? 2000 + parseInt(value.slice(3)) : currentYear);
    const [open, setOpen]         = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function selectMonth(monthIdx) {
        const mm = String(monthIdx + 1).padStart(2, '0');
        const yy = String(viewYear).slice(-2);
        onChange(`${mm}/${yy}`);
        setOpen(false);
    }

    function isPast(monthIdx) {
        return viewYear < currentYear || (viewYear === currentYear && monthIdx + 1 < currentMonth);
    }

    return (
        <div className="expiry-picker-wrap" ref={ref}>
            <div className="expiry-input-wrapper" onClick={() => setOpen(o => !o)}>
                <i className="bi bi-calendar3 expiry-cal-icon"></i>
                <input
                    id="pm-exp"
                    type="text"
                    className="form-control expiry-input"
                    placeholder="MM/YY"
                    value={value}
                    readOnly
                />
            </div>
            {open && (
                <div className="expiry-picker-dropdown">
                    <div className="expiry-picker-header">
                        <button type="button" className="expiry-nav-btn" onClick={() => setViewYear(y => y - 1)} disabled={viewYear <= currentYear}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <span className="expiry-year-label">{viewYear}</span>
                        <button type="button" className="expiry-nav-btn" onClick={() => setViewYear(y => y + 1)}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <div className="expiry-picker-months">
                        {MONTHS_SHORT.map((m, i) => {
                            const past     = isPast(i);
                            const selected = parsed && parsed.m === i + 1 && parsed.y === viewYear;
                            const isCurrent = viewYear === currentYear && i + 1 === currentMonth;
                            return (
                                <button
                                    type="button"
                                    key={m}
                                    className={`expiry-month-btn ${selected ? 'selected' : ''} ${past ? 'past' : ''} ${isCurrent && !selected ? 'current' : ''}`}
                                    onClick={() => !past && selectMonth(i)}
                                    disabled={past}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function VisualCard({ card, onRemove }) {
    const [flipped, setFlipped] = useState(false);
    const last4    = card.cardNumber.replace(/\s/g, '').slice(-4);
    const gradient = card.gradient;

    return (
        <div className="vc-scene" onClick={() => setFlipped(f => !f)}>
            <div className={`vc-inner ${flipped ? 'is-flipped' : ''}`}>
                <div className="vc-face vc-front" style={{ background: gradient }}>
                    <div className="vc-top">
                        <div className="vc-chip"><div className="vc-chip-inner"></div></div>
                        <CardMajorIndustryIdentifier type={card.cardType} />
                    </div>
                    <div className="vc-number">
                        <span>••••</span>
                        <span>••••</span>
                        <span>••••</span>
                        <span>{last4}</span>
                    </div>
                    <div className="vc-bottom">
                        <div className="vc-field">
                            <span className="vc-label">Card Holder</span>
                            <span className="vc-value">{card.cardHolder || '—'}</span>
                        </div>
                        <div className="vc-field">
                            <span className="vc-label">Expires</span>
                            <span className="vc-value">{card.expiry}</span>
                        </div>
                        <button
                            className="vc-remove"
                            onClick={e => { e.stopPropagation(); onRemove(card.id); }}
                            aria-label="Remove card"
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>

                <div className="vc-face vc-back" style={{ background: gradient }}>
                    <div className="vc-stripe"></div>
                    <div className="vc-sig-row">
                        <div className="vc-sig-strip">
                            <span className="vc-sig-label">AUTHORIZED SIGNATURE — NOT VALID UNLESS SIGNED</span>
                            <div className="vc-sig-lines">
                                {[40,55,45,60,50].map((l, i) => (
                                    <div key={i} className="vc-sig-line" style={{ width: l + '%' }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="vc-cvv-box">
                            <span className="vc-cvv-label">CVV</span>
                            <span className="vc-cvv-val">•••</span>
                        </div>
                    </div>
                    <div className="vc-back-bottom">
                        <button
                            className="vc-remove"
                            onClick={e => { e.stopPropagation(); onRemove(card.id); }}
                            aria-label="Remove card"
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentsSection({ cards, onAddCard, onRemoveCard }) {
    const [isAdding, setIsAdding]           = useState(false);
    const [cardNumber, setCardNumber]       = useState('');
    const [cardHolder, setCardHolder]       = useState('');
    const [expiry, setExpiry]               = useState('');
    const [cvv, setCvv]                     = useState('');
    const [pendingRemoveId, setPendingRemove] = useState(null);
    const [feedback, setFeedback]           = useState(null);

    const cardType = detectCardType(cardNumber);

    function handleCardNumberChange(e) {
        setCardNumber(formatCardNumber(e.target.value));
    }

    function handleExpiryChange(e) {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
        setExpiry(val);
    }

    function handleCvvChange(e) {
        setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
    }

    async function handleAddCard(e) {
        e.preventDefault();
        const clean = cardNumber.replace(/\s/g, '');
        if (clean.length !== 16) {
            setFeedback({ type: 'error', message: 'Enter a valid 16-digit card number.' });
            return;
        }
        if (cvv.length !== 3) {
            setFeedback({ type: 'error', message: 'CVV must be exactly 3 digits.' });
            return;
        }
        onAddCard({ id: Date.now(), cardNumber: clean, cardHolder, expiry, cardType, gradient: randomCardGradient() });
        setCardNumber('');
        setCardHolder('');
        setExpiry('');
        setCvv('');
        setIsAdding(false);
        setFeedback({ type: 'success', message: 'Card added successfully.' });
    }

    function confirmRemoveCard() {
        onRemoveCard(pendingRemoveId);
        setPendingRemove(null);
    }

    function openAddForm() {
        setIsAdding(true);
        setFeedback(null);
    }

    function closeAddForm() {
        setIsAdding(false);
        setFeedback(null);
        setCardNumber('');
        setCardHolder('');
        setExpiry('');
        setCvv('');
    }

    return (
        <div className="profile-section">
            {pendingRemoveId && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <div className="modal-icon-wrap">
                            <i className="bi bi-credit-card modal-icon"></i>
                        </div>
                        <h2 className="modal-title">Remove card?</h2>
                        <p className="modal-body">
                            This card will be permanently removed from your account.
                        </p>
                        <div className="modal-actions">
                            <button type="button" className="btn-modal-cancel" onClick={() => setPendingRemove(null)}>
                                Cancel
                            </button>
                            <button type="button" className="btn-modal-danger" onClick={confirmRemoveCard}>
                                Remove card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="section-header">
                <h2 className="section-title">Payment Methods</h2>
                <p className="section-subtitle">Manage your linked bank cards</p>
            </div>

            {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            {cards.length === 0 && !isAdding && (
                <div className="empty-cards">
                    <i className="bi bi-credit-card"></i>
                    <p>No cards linked yet.</p>
                </div>
            )}

            {cards.length > 0 && (
                <div className="visual-cards-grid">
                    {cards.map(card => (
                        <VisualCard key={card.id} card={card} onRemove={id => setPendingRemove(id)} />
                    ))}
                </div>
            )}

            {!isAdding && (
                <button className="btn-add-card" onClick={openAddForm}>
                    <i className="bi bi-plus-circle"></i> Add new card
                </button>
            )}

            {isAdding && (
                <form onSubmit={handleAddCard} className="add-card-form" autoComplete="off">
                    <div className="add-card-header">
                        <span>New card</span>
                        <button type="button" className="btn-cancel-icon" onClick={closeAddForm} aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="pm-num">Card number</label>
                        <div className="card-number-wrapper">
                            <input
                                id="pm-num"
                                type="text"
                                className="form-control"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                inputMode="numeric"
                                autoComplete="off"
                                required
                            />
                            <i className={`bi ${CARD_ICONS[cardType]} card-type-badge`}></i>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="pm-holder">Cardholder name</label>
                        <input
                            id="pm-holder"
                            type="text"
                            className="form-control"
                            placeholder="FIRSTNAME LASTNAME"
                            value={cardHolder}
                            onChange={e => setCardHolder(e.target.value.toUpperCase())}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-7">
                            <label className="form-label" htmlFor="pm-exp">Expiry date</label>
                            <ExpiryPicker value={expiry} onChange={setExpiry} />
                        </div>
                        <div className="col-5">
                            <label className="form-label" htmlFor="pm-sec">
                                CVV
                                <span className="cvv-hint">3 digits</span>
                            </label>
                            <input
                                id="pm-sec"
                                type="text"
                                className="form-control"
                                placeholder="•••"
                                value={cvv}
                                onChange={handleCvvChange}
                                inputMode="numeric"
                                autoComplete="new-password"
                                maxLength={3}
                                required
                            />
                        </div>
                    </div>

                    <div className="add-card-actions">
                        <button type="button" className="btn-secondary" onClick={closeAddForm}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-brand" disabled={cardNumber.replace(/\s/g, '').length !== 16}>
                            Add card
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

const VERIFICATION_STATUS_CONFIG = {
    pending:  { icon: 'bi-hourglass-split',    color: '#f0b429', label: 'Verification Pending',  description: 'Your documents are under review. We will notify you within 1–2 business days.' },
    verified: { icon: 'bi-patch-check-fill',   color: '#00c896', label: 'Account Verified',       description: 'Your identity has been successfully verified. You now have full access to all features.' },
    failed:   { icon: 'bi-x-circle-fill',      color: '#e05252', label: 'Verification Failed',    description: 'We could not verify your identity. Please re-upload your documents and try again.' },
};

function VerificationStatusCard({ status }) {
    const cfg = VERIFICATION_STATUS_CONFIG[status];
    return (
        <div className={`verification-status-card verification-status-${status}`}>
            <i className={`bi ${cfg.icon} verification-status-icon`}></i>
            <div className="verification-status-body">
                <span className="verification-status-label">{cfg.label}</span>
                <span className="verification-status-desc">{cfg.description}</span>
            </div>
        </div>
    );
}

function UploadZone({ uploadText, icon, file, error, inputRef, onFileChange, onRemove }) {
    return (
        <div className="verification-upload-slot">
            <div
                className={`upload-zone ${file ? 'upload-zone-filled' : ''}`}
                onClick={() => !file && inputRef.current.click()}
            >
                {file ? (
                    <div className="upload-success">
                        <i className="bi bi-check-circle-fill upload-success-icon"></i>
                        <span className="upload-success-name">{file.name}</span>
                        <button
                            type="button"
                            className="upload-success-remove"
                            onClick={e => { e.stopPropagation(); onRemove(); }}
                            aria-label="Remove file"
                        >
                            <i className="bi bi-x-lg"></i> Remove
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <i className={`bi ${icon} upload-placeholder-icon`}></i>
                        <span className="upload-placeholder-text">{uploadText}</span>
                        <span className="upload-placeholder-hint">JPG or PNG · max 10 MB</span>
                    </div>
                )}
            </div>
            {error && <p className="field-error">{error}</p>}
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="d-none"
                onChange={onFileChange}
            />
        </div>
    );
}

function VerificationSection({ initialStatus }) {
    const [status, setStatus]               = useState(initialStatus ?? null);
    const [idFrontFile, setIdFrontFile]     = useState(null);
    const [idBackFile, setIdBackFile]       = useState(null);
    const [idFrontError, setIdFrontError]   = useState(null);
    const [idBackError, setIdBackError]     = useState(null);
    const [isSaving, setSaving]             = useState(false);
    const [feedback, setFeedback]           = useState(null);
    const idFrontInputRef                   = useRef(null);
    const idBackInputRef                    = useRef(null);

    function isAllowed(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
    }

    function makeHandler(setFile, setError, inputRef) {
        return function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!isAllowed(file)) {
                setError('Only JPEG, JPG and PNG files are accepted.');
                e.target.value = '';
                return;
            }
            setError(null);
            setFile(file);
        };
    }

    function makeRemover(setFile, setError, inputRef) {
        return function() {
            setFile(null);
            setError(null);
            if (inputRef.current) inputRef.current.value = '';
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!idFrontFile || !idBackFile) return;
        setSaving(true);
        setFeedback(null);
        try {
            const body = new FormData();
            body.append('idFront', idFrontFile);
            body.append('idBack', idBackFile);
            const response = await fetch('/api/profile/verification', {
                method: 'POST',
                credentials: 'include',
                body,
            });
            const result = await response.json();
            if (!result.success) {
                setFeedback({ type: 'error', message: result.error || 'Failed to submit documents.' });
                return;
            }
            setStatus('pending');
        } catch {
            setStatus('pending');
        } finally {
            setSaving(false);
        }
    }

    const canSubmit = idFrontFile && idBackFile;
    const showForm  = !status || status === 'failed';

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Account Verification</h2>
                <p className="section-subtitle">Upload your identity documents to verify your account</p>
            </div>

            {status && <VerificationStatusCard status={status} />}

            {feedback && !status && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            {showForm && <form onSubmit={handleSubmit} noValidate>
                <p className="form-label mb-2">National ID or Passport</p>
                <div className="verification-upload-grid mb-3">
                    <UploadZone
                        uploadText="Click to upload front side"
                        icon="bi-id-card"
                        file={idFrontFile}
                        error={idFrontError}
                        inputRef={idFrontInputRef}
                        onFileChange={makeHandler(setIdFrontFile, setIdFrontError, idFrontInputRef)}
                        onRemove={makeRemover(setIdFrontFile, setIdFrontError, idFrontInputRef)}
                    />
                    <UploadZone
                        uploadText="Click to upload back side"
                        icon="bi-id-card"
                        file={idBackFile}
                        error={idBackError}
                        inputRef={idBackInputRef}
                        onFileChange={makeHandler(setIdBackFile, setIdBackError, idBackInputRef)}
                        onRemove={makeRemover(setIdBackFile, setIdBackError, idBackInputRef)}
                    />
                </div>

                <p className="verification-notice">
                    <i className="bi bi-info-circle"></i>
                    Make sure the document is clearly visible and all details are legible. Accepted formats: JPEG, JPG, PNG.
                </p>

                <button type="submit" className="btn-brand" disabled={isSaving || !canSubmit}>
                    {isSaving ? 'Submitting\u2026' : 'Submit for verification'}
                </button>
            </form>}
        </div>
    );
}

function DeleteConfirmModal({ onConfirm, onCancel, isDeleting }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-icon-wrap">
                    <i className="bi bi-exclamation-triangle-fill modal-icon"></i>
                </div>
                <h2 className="modal-title">Delete account?</h2>
                <p className="modal-body">
                    This action is permanent and irreversible. All your data, portfolio history and personal information will be permanently erased.
                </p>
                <div className="modal-actions">
                    <button type="button" className="btn-modal-cancel" onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </button>
                    <button type="button" className="btn-modal-danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting…' : 'Yes, delete my account'}
                    </button>
                </div>
            </div>
        </div>
    );
}


function DeactivateConfirmModal({ onConfirm, onCancel, isDeactivating }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-icon-wrap warning">
                    <i className="bi bi-pause-circle-fill modal-icon"></i>
                </div>
                <h2 className="modal-title">Deactivate account?</h2>
                <p className="modal-body">
                    Your account will be temporarily suspended. You can reactivate it at any time by logging back in.
                </p>
                <div className="modal-actions">
                    <button type="button" className="btn-modal-cancel" onClick={onCancel} disabled={isDeactivating}>
                        Cancel
                    </button>
                    <button type="button" className="btn-modal-warning" onClick={onConfirm} disabled={isDeactivating}>
                        {isDeactivating ? 'Deactivating…' : 'Yes, deactivate'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusSection() {
    const [accountStatus, setAccountStatus] = useState(SESSION_USER.accountStatus);
    const [showDeleteModal, setShowDeleteModal]         = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [isDeleting, setDeleting]         = useState(false);
    const [isDeactivating, setDeactivating] = useState(false);
    const [feedback, setFeedback]           = useState(null);

    const memberSince = new Date(SESSION_USER.memberSince).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    async function handleDelete() {
        setDeleting(true);
        try {
            const response = await fetch('/api/profile/account', {
                method: 'DELETE',
                credentials: 'include',
            });
            const result = await response.json();
            if (!result.success) {
                setShowDeleteModal(false);
                setFeedback({ type: 'error', message: result.error || 'Failed to delete account.' });
                return;
            }
            window.location.href = 'index.html';
        } catch {
            window.location.href = 'index.html';
        } finally {
            setDeleting(false);
        }
    }

    async function handleDeactivate() {
        setDeactivating(true);
        try {
            const response = await fetch('/api/profile/deactivate', {
                method: 'POST',
                credentials: 'include',
            });
            const result = await response.json();
            if (!result.success) {
                setShowDeactivateModal(false);
                setFeedback({ type: 'error', message: result.error || 'Failed to deactivate account.' });
                return;
            }
            setAccountStatus('inactive');
            setShowDeactivateModal(false);
            setFeedback({ type: 'success', message: 'Your account has been deactivated.' });
        } catch {
            setAccountStatus('inactive');
            setShowDeactivateModal(false);
            setFeedback({ type: 'success', message: 'Your account has been deactivated.' });
        } finally {
            setDeactivating(false);
        }
    }

    return (
        <div className="profile-section">
            {showDeleteModal && (
                <DeleteConfirmModal
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    isDeleting={isDeleting}
                />
            )}
            {showDeactivateModal && (
                <DeactivateConfirmModal
                    onConfirm={handleDeactivate}
                    onCancel={() => setShowDeactivateModal(false)}
                    isDeactivating={isDeactivating}
                />
            )}

            <div className="section-header">
                <h2 className="section-title">Status</h2>
                <p className="section-subtitle">Manage your account status</p>
            </div>

            {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

            <div className="status-info-card">
                <div className="status-info-rows">
                    <div className="status-info-row">
                        <span className="status-info-label"><i className="bi bi-circle-fill"></i> Account status</span>
                        <span className={`status-badge ${accountStatus}`}>
                            {accountStatus === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="status-info-row">
                        <span className="status-info-label"><i className="bi bi-calendar3"></i> Member since</span>
                        <span className="status-info-value">{memberSince}</span>
                    </div>
                </div>
            </div>

            <div className="warning-zone">
                <div className="danger-zone-info">
                    <span className="danger-zone-label">Deactivate account</span>
                    <span className="danger-zone-desc">Temporarily suspend your account. You can reactivate it at any time by logging back in.</span>
                </div>
                <button
                    type="button"
                    className="btn-warning"
                    onClick={() => setShowDeactivateModal(true)}
                    disabled={accountStatus === 'inactive'}
                >
                    <i className="bi bi-pause-circle"></i> Deactivate
                </button>
            </div>

            <div className="danger-zone">
                <div className="danger-zone-info">
                    <span className="danger-zone-label">Delete account</span>
                    <span className="danger-zone-desc">Permanently delete your account and all associated data. This cannot be undone.</span>
                </div>
                <button type="button" className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                    <i className="bi bi-trash3"></i> Delete account
                </button>
            </div>
        </div>
    );
}

function ProfilePage() {
    const _savedPersonal = JSON.parse(localStorage.getItem('profilePersonal') || '{}');
    const _savedCards    = JSON.parse(localStorage.getItem('profileCards')    || 'null');
    const [user, setUser]             = useState({ ...SESSION_USER, ..._savedPersonal });
    const [avatarPreview, setAvatar]  = useState(localStorage.getItem('profileAvatar') || null);
    const validSections = ['personal', 'security', 'preferences', 'payments', 'verification', 'status'];
    const urlSection    = new URLSearchParams(window.location.search).get('section');
    const [activeSection, setSection] = useState(validSections.includes(urlSection) ? urlSection : 'personal');
    const [cards, setCards]           = useState(_savedCards !== null ? _savedCards : SESSION_USER.cards);
    const [mobileOpen, setMobileOpen] = useState(false);
    const fileInputRef                = useRef(null);

    function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setAvatar(ev.target.result);
            localStorage.setItem('profileAvatar', ev.target.result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="profile-page">
            <header className="profile-topbar">
                <button className="topbar-hamburger" onClick={() => setMobileOpen(o => !o)}>
                    <i className="bi bi-list"></i>
                </button>
                <a href="terminal.html" className="topbar-brand">
                    <img src="../images/app-icon.jpg" alt="Pocket TradePro logo" className="topbar-logo" />
                    <span>Pocket TradePro</span>
                </a>
            </header>

            {mobileOpen && <div className="profile-sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

            <div className="profile-layout">
                <ProfileSidebar
                    user={user}
                    avatarPreview={avatarPreview}
                    activeSection={activeSection}
                    onSelect={s => { setSection(s); setMobileOpen(false); }}
                    onAvatarChange={handleAvatarChange}
                    fileInputRef={fileInputRef}
                    mobileOpen={mobileOpen}
                />

                <main className="profile-content">
                    {activeSection === 'personal' && (
                        <PersonalSection
                            user={user}
                            onSave={updates => {
                                setUser(prev => ({ ...prev, ...updates }));
                                localStorage.setItem('profilePersonal', JSON.stringify(updates));
                            }}
                        />
                    )}
                    {activeSection === 'security' && <SecuritySection />}
                    {activeSection === 'preferences' && (
                        <PreferencesSection
                            user={user}
                            onSave={updates => setUser(prev => ({ ...prev, ...updates }))}
                        />
                    )}
                    {activeSection === 'payments' && (
                        <PaymentsSection
                            cards={cards}
                            onAddCard={card => setCards(prev => {
                                const next = [...prev, card];
                                localStorage.setItem('profileCards', JSON.stringify(next));
                                return next;
                            })}
                            onRemoveCard={id => setCards(prev => {
                                const next = prev.filter(c => c.id !== id);
                                localStorage.setItem('profileCards', JSON.stringify(next));
                                return next;
                            })}
                        />
                    )}
                    {activeSection === 'verification' && <VerificationSection initialStatus={user.verificationStatus} />}
                    {activeSection === 'status' && <StatusSection />}
                </main>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProfilePage />);
