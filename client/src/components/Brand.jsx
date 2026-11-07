import { Link } from 'react-router-dom';

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand-link${compact ? ' brand-link--compact' : ''}`} to="/" aria-label="DevDuel home">
      <span className="brand-symbol" aria-hidden="true">&lt;/&gt;</span>
      <span>DEV<span className="brand-accent">DUEL</span></span>
    </Link>
  );
}
