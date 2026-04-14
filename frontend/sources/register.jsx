const { useState } = React;

const PASSWORD_CRITERIA = [
    { label: 'At least 8 characters',    test: pwd => pwd.length >= 8 },
    { label: 'At least 1 number',         test: pwd => /[0-9]/.test(pwd) },
    { label: 'At least 1 uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
    { label: 'At least 1 special character', test: pwd => /[^A-Za-z0-9]/.test(pwd) },
];

const PASSWORD_STRENGTH_LEVELS = [
    { label: 'Weak',   color: '#e05252' },
    { label: 'Weak',   color: '#e05252' },
    { label: 'Medium', color: '#f0b429' },
    { label: 'Medium', color: '#f0b429' },
    { label: 'Strong', color: '#00c896' },
];

function PasswordStrengthBar({ password }) {
    const criteriaResults = PASSWORD_CRITERIA.map(criterion => ({
        label: criterion.label,
        met:   password ? criterion.test(password) : false,
    }));

    const metCount   = criteriaResults.filter(c => c.met).length;
    const fillWidth  = password ? Math.max(25, (metCount / PASSWORD_CRITERIA.length) * 100) : 0;
    const level      = password ? PASSWORD_STRENGTH_LEVELS[metCount] : null;
    const unmetExist = criteriaResults.some(c => !c.met);

    return (
        <div className={`strength-bar-wrapper ${!password ? 'strength-bar-hidden' : ''}`}>
            <div className="strength-bar-track">
                <div
                    className="strength-bar-fill"
                    style={{
                        width:           fillWidth + '%',
                        backgroundColor: level ? level.color : 'transparent',
                    }}
                />
            </div>

            {password && (
                <div className="strength-checklist">
                    <p className="strength-summary">
                        {unmetExist
                            ? <><span style={{ color: level.color }}>{level.label} password.</span> Password must contain:</>
                            : <span style={{ color: level.color }}>Strong Password.</span>
                        }
                    </p>
                    {criteriaResults.map(criterion => (
                        <div key={criterion.label} className={`strength-criterion ${criterion.met ? 'met' : 'unmet'}`}>
                            <i className={criterion.met ? 'bi bi-check-lg' : 'bi bi-x-lg'}></i>
                            <span>{criterion.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function RegisterForm() {
    const [firstName, setFirstName]               = useState('');
    const [lastName, setLastName]                 = useState('');
    const [email, setEmail]                       = useState('');
    const [emailError, setEmailError]             = useState('');
    const [password, setPassword]                 = useState('');
    const [confirmPassword, setConfirm]           = useState('');
    const [errorMessage, setError]                = useState('');
    const [isSubmitting, setSubmitting]           = useState(false);

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
    }
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmVisible, setConfirmVisible]   = useState(false);

    const allCriteriaMet = PASSWORD_CRITERIA.every(criterion => criterion.test(password));

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (!allCriteriaMet) {
            setError('Password does not meet all requirements.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.error || 'Registration failed. Please try again.');
                return;
            }

            localStorage.setItem('sessionUser', JSON.stringify({ firstName, lastName, email }));
            localStorage.removeItem('profileAvatar');
            window.location.href = 'terminal.html';
        } catch {
            localStorage.setItem('sessionUser', JSON.stringify({ firstName, lastName, email }));
            localStorage.removeItem('profileAvatar');
            window.location.href = 'terminal.html';
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-card">
            <div className="brand-heading">
                <img src="../images/app-icon.jpg" alt="Pocket TradePro logo" className="brand-logo-img" />
                <span>Pocket TradePro</span>
            </div>

            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Start trading in minutes — it's free</p>

            {errorMessage && (
                <div className="alert-error mb-3">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <label className="form-label" htmlFor="firstName">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            autoComplete="given-name"
                            required
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label" htmlFor="lastName">Last name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            autoComplete="family-name"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        className={`form-control ${emailError ? 'input-error' : ''}`}
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
                        onBlur={e => setEmailError(validateEmail(e.target.value))}
                        autoComplete="email"
                        required
                    />
                    {emailError && <p className="field-error">{emailError}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setPasswordVisible(prev => !prev)}
                            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        >
                            <i className={isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                        </button>
                    </div>
                    <PasswordStrengthBar password={password} />
                </div>

                <div className="mb-4">
                    <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                    <div className="password-wrapper">
                        <input
                            id="confirmPassword"
                            type={isConfirmVisible ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirm(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setConfirmVisible(prev => !prev)}
                            aria-label={isConfirmVisible ? 'Hide password' : 'Show password'}
                        >
                            <i className={isConfirmVisible ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-brand" disabled={isSubmitting || !!emailError || !email || !allCriteriaMet || !confirmPassword || password !== confirmPassword}>
                    {isSubmitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="switch-link">
                Already have an account? <a href="login.html">Sign in</a>
            </p>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RegisterForm />);
