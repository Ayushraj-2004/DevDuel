import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import api from '../utils/axiosConfig';
import socket from '../socket/socket';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [queueing, setQueueing] = useState(false);
  const navigate = useNavigate();

  const handleMatch = useCallback(({ roomId }) => {
    navigate(`/battle/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('token');
    const handleConnectError = () => {
      setQueueing(false);
      setError('Could not connect to the battle server. Please try again.');
    };

    if (!token) {
      navigate('/login', { replace: true });
      return () => {};
    }

    api.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (active) setUser(data);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login', { replace: true });
          return;
        }
        setError(requestError.response?.data?.message || 'Your player profile could not be loaded.');
      });

    socket.on('matchFound', handleMatch);
    socket.on('connect_error', handleConnectError);

    return () => {
      active = false;
      socket.off('matchFound', handleMatch);
      socket.off('connect_error', handleConnectError);
    };
  }, [handleMatch, navigate]);

  function handleFindBattle() {
    if (!user || queueing) return;
    setError('');
    setQueueing(true);
    socket.connect();
    socket.emit('joinQueue', { userId: user._id, rating: user.rating });
  }

  function handleLogout() {
    socket.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  }

  if (!user && !error) {
    return <main className="loading-screen"><Brand /><p>Loading your player profile…</p></main>;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <Brand />
        <div className="dashboard-nav-right"><span className="online-indicator"><i /> PLAYER DASHBOARD</span><button className="text-button" type="button" onClick={handleLogout}>Sign out</button></div>
      </header>
      <section className="dashboard-content">
        {error && <p className="dashboard-alert" role="alert">{error}</p>}
        {!user ? (
          <div className="dashboard-error"><span className="kicker">PROFILE UNAVAILABLE</span><h1>We couldn&apos;t load your stats.</h1><p>Check that the DevDuel API and database are running, then try again.</p><button className="button" onClick={() => window.location.reload()}>Try again ↗</button></div>
        ) : (
          <>
            <div className="dashboard-heading">
              <div><span className="kicker">THE ARENA IS YOURS</span><h1>Welcome back, <span>{user.username}.</span></h1><p>Ready to put your problem-solving skills to the test?</p></div>
              <span className="rating-badge"><small>YOUR RATING</small><strong>{user.rating ?? 0}</strong></span>
            </div>
            <div className="dashboard-grid">
              <section className="match-card">
                <div className="match-card-top"><span className="kicker">01 / QUICK MATCH</span><span className="match-live"><i /> LIVE QUEUE</span></div>
                <div className="match-emblem" aria-hidden="true">&lt;/&gt;</div>
                <h2>{queueing ? 'Searching for a rival…' : 'Find your next rival.'}</h2>
                <p>{queueing ? 'You’re in the matchmaking queue. We’ll take you to the battle as soon as a match is found.' : 'Jump into a real-time quiz battle and see how you stack up.'}</p>
                <button className="button match-button" onClick={handleFindBattle} disabled={queueing}>{queueing ? 'Searching…' : 'Find a battle'} <span aria-hidden="true">↗</span></button>
                <span className="match-note">MATCHED BY LIVE QUEUE · 10 QUESTIONS</span>
              </section>
              <aside className="stats-column">
                <div className="stats-card"><span className="kicker">YOUR RECORD</span><div className="stats-values"><div><strong>{user.wins ?? 0}</strong><span>WINS</span></div><i /><div><strong>{user.loss ?? 0}</strong><span>LOSSES</span></div></div></div>
                <div className="guide-card"><span className="kicker">HOW BATTLES WORK</span><div><i>01</i><span>Get matched with another player.</span></div><div><i>02</i><span>Answer a set of coding questions.</span></div><div><i>03</i><span>Finish all questions to compare results.</span></div><Link to="/">Back to home ↗</Link></div>
              </aside>
            </div>
          </>
        )}
      </section>
      <footer className="dashboard-footer"><Brand compact /><span>Build your skills. Earn your rank.</span></footer>
    </main>
  );
}
