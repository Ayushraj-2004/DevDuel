import { Link } from 'react-router-dom';
import Brand from '../components/Brand';

const steps = [
  { number: '01', title: 'Find your match', detail: 'Get paired with a developer at your level.' },
  { number: '02', title: 'Think under pressure', detail: 'Race through a set of coding questions.' },
  { number: '03', title: 'Climb the ranks', detail: 'Put your skills to the test, one duel at a time.' },
];

function BattlePreview() {
  return (
    <div className="arena-preview">
      <div className="preview-toolbar">
        <div className="preview-window-dots"><i /><i /><i /></div>
        <span>DEVDUEL / ARENA</span>
        <span className="preview-label"><i /> INTERFACE PREVIEW</span>
      </div>
      <div className="preview-main">
        <div className="preview-topline">
          <span><i /> RANKED MATCH</span>
          <span>ROUND 01 / 10</span>
        </div>
        <div className="preview-players">
          <div className="preview-player">
            <span className="preview-avatar preview-avatar--blue">AR</span>
            <span><strong>YOU</strong><small>READY TO PLAY</small></span>
          </div>
          <span className="preview-versus">VS</span>
          <div className="preview-player preview-player--right">
            <span><strong>OPPONENT</strong><small>SEARCHING FOR A MATCH</small></span>
            <span className="preview-avatar preview-avatar--amber">?</span>
          </div>
        </div>
        <div className="preview-question">
          <span>WARM-UP QUESTION</span>
          <strong>Which data structure uses FIFO ordering?</strong>
          <div className="preview-options">
            <span><i>A</i> Stack</span>
            <span><i>B</i> Queue</span>
            <span><i>C</i> Tree</span>
            <span><i>D</i> Graph</span>
          </div>
        </div>
        <div className="preview-footer"><span>LIVE QUIZ BATTLES</span><span>REACT <i /> SOCKET.IO</span></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <header className="site-nav">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
        </nav>
        <div className="nav-actions">
          <Link className="nav-login" to="/login">Log in</Link>
          <Link className="button button--small" to="/register">Create account <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <span className="kicker"><i /> THE CODING ARENA</span>
            <h1>Think fast.<br />Code <span>faster.</span></h1>
            <p>One opponent. Ten questions. A chance to prove your problem-solving skills in a real-time coding duel.</p>
            <div className="hero-cta">
              <Link className="button" to="/register">Enter the arena <span aria-hidden="true">↗</span></Link>
              <Link className="hero-secondary" to="/login">Already have an account? <span>Log in</span></Link>
            </div>
            <div className="hero-proof"><span><i /> REAL-TIME MATCHMAKING</span><span>BUILT FOR DEVELOPERS</span></div>
          </div>
          <div className="hero-visual"><BattlePreview /></div>
          <div className="hero-index">01 <span>—</span> MATCH · THINK · WIN</div>
        </section>

        <section className="steps-section" id="how-it-works">
          <div className="section-intro">
            <span className="kicker">THE CHALLENGE</span>
            <h2>Three steps.<br />One worthy rival.</h2>
          </div>
          <div className="steps-list">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="feature-banner">
            <div><span className="kicker">READY WHEN YOU ARE</span><h2>Your next duel starts here.</h2></div>
            <Link className="button button--light" to="/register">Create your account <span aria-hidden="true">↗</span></Link>
          </div>
          <footer className="home-footer"><Brand compact /><span>Build your skills. Earn your rank.</span><span>DEVDUEL · 2026</span></footer>
        </section>
      </main>
    </div>
  );
}
