import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handle(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Mark<span>IQ</span></div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your account</div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handle}>
          <div className="form-group"><label>Email</label><input type="email" placeholder="you@university.ac.ug" value={email} onChange={e => setEmail(e.target.value)} required/></div>
          <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/></div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15 }}>
            {loading ? <><span className="spinner"/>Signing in...</> : 'Sign in'}
          </button>
        </form>
        <div className="auth-switch">Don't have an account? <Link to="/signup" style={{ color: '#3C3489', fontWeight: 500 }}>Sign up free</Link></div>
      </div>
    </div>
  );
    }
