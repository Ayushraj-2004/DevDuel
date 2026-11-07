import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import api from '../utils/axiosConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not sign in. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-nav"><Brand /><Link to="/">Back to home <span aria-hidden="true">↗</span></Link></header>
      <section className="auth-panel">
        <div className="auth-intro">
          <span className="kicker"><i /> BACK IN THE GAME?</span>
          <h1>Welcome<br />back, <span>player.</span></h1>
          <p>Sign in to find your next opponent and pick up where you left off.</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-heading"><span>YOUR ACCOUNT</span><span>01 / 02</span></div>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">↗</span></button>
          <p className="auth-switch">New to the arena? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
      <footer className="auth-footer"><span>DEVDUEL · PLAYER ACCESS</span><span>Think fast. Code faster.</span></footer>
    </main>
  );
}
