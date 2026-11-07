import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import api from '../utils/axiosConfig';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create your account. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-nav"><Brand /><Link to="/">Back to home <span aria-hidden="true">↗</span></Link></header>
      <section className="auth-panel">
        <div className="auth-intro">
          <span className="kicker"><i /> YOUR NEXT MATCH AWAITS</span>
          <h1>Ready to<br />enter the <span>arena?</span></h1>
          <p>Set up your player account. Then test your skills against developers in a live quiz battle.</p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-heading"><span>CREATE YOUR ACCOUNT</span><span>01 / 02</span></div>
          <label htmlFor="register-username">Player name</label>
          <input id="register-username" name="username" type="text" autoComplete="username" placeholder="How should rivals know you?" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} <span aria-hidden="true">↗</span></button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
      <footer className="auth-footer"><span>DEVDUEL · PLAYER ACCESS</span><span>Think fast. Code faster.</span></footer>
    </main>
  );
}
