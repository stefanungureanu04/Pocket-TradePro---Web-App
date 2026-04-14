const { useState } = React;

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
}

function saveSession(email) {
    localStorage.setItem('sessionUser', JSON.stringify({ firstName: 'Stefan', lastName: 'Popescu', email }));
    localStorage.removeItem('profileAvatar');
}

function LoginForm({ onForgot }) {
    const [email, setEmail]               = useState('');
    const [emailError, setEmailError]     = useState('');
    const [password, setPassword]         = useState('');
    const [errorMessage, setError]        = useState('');
    const [isSubmitting, setSubmitting]   = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        if (email === 'admin@tradepro.com' && password === 'administrator') {
            window.location.href = 'admin.html';
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.error || 'Login failed. Please try again.');
                return;
            }

            saveSession(email);
            window.location.href = 'terminal.html';
        } catch {
            saveSession(email);
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

            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue trading</p>

            {errorMessage && (
                <div className="alert-error mb-3">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
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

                <div className="mb-2">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
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
                </div>

                <div className="mb-4 forgot-row">
                    <button type="button" className="link-btn" onClick={onForgot}>Forgot password?</button>
                </div>

                <button type="submit" className="btn-brand" disabled={isSubmitting || !!emailError || !email || !password}>
                    {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
            </form>

            <p className="switch-link">
                Don't have an account? <a href="register.html">Create one</a>
            </p>
        </div>
    );
}

function ForgotPasswordForm({ onBack }) {
    const [email, setEmail]             = useState('');
    const [emailError, setEmailError]   = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [sent, setSent]               = useState(false);
    const [errorMessage, setError]      = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            if (!result.success) {
                setError(result.error || 'Something went wrong. Please try again.');
                return;
            }
            setSent(true);
        } catch {
            setSent(true);
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

            {sent ? (
                <div className="forgot-sent">
                    <div className="forgot-sent-icon">
                        <i className="bi bi-envelope-check"></i>
                    </div>
                    <h1 className="auth-title">Check your inbox</h1>
                    <p className="auth-subtitle">
                        We've sent a password reset link to <strong className="forgot-email-highlight">{email}</strong>. The link expires in 15 minutes.
                    </p>
                    <button type="button" className="btn-brand" onClick={onBack}>
                        Back to sign in
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="auth-title">Forgot password?</h1>
                    <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

                    {errorMessage && <div className="alert-error mb-3">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="form-label" htmlFor="resetEmail">Email address</label>
                            <input
                                id="resetEmail"
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
                        <button type="submit" className="btn-brand" disabled={isSubmitting || !!emailError || !email}>
                            {isSubmitting ? 'Sending…' : 'Send reset link'}
                        </button>
                    </form>

                    <p className="switch-link">
                        <button type="button" className="link-btn" onClick={onBack}>
                            <i className="bi bi-arrow-left"></i> Back to sign in
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}

function AuthPage() {
    const [view, setView] = useState('login');

    if (view === 'forgot') return <ForgotPasswordForm onBack={() => setView('login')} />;
    return <LoginForm onForgot={() => setView('forgot')} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AuthPage />);
