import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', university: '', role: 'lecturer', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  async function handle(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const data = await signUp(form.email, form.password, form.name, form.university, form.role);
      if (data.session) {
        navigate('/dashboard');
      } else {
        setError('');
        // Show confirmation message
        document.getElementById('confirmMsg').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Mark<span>IQ</span></div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start marking faster today</div>

        <div id="confirmMsg" style={{ display: 'none' }} className="success-msg">
          ✅ Account created! Check your email to confirm, then <Link to="/login" style={{ color: '#0F6E56', fontWeight: 600 }}>log in here.</Link>
        </div>

        <div id="signupForm">
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handle}>
            <div className="form-group"><label>Full name</label><input name="name" placeholder="Dr. Sarah Nakato" value={form.name} onChange={set} required/></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" placeholder="you@university.ac.ug" value={form.email} onChange={set} required/></div>
            <div className="form-group"><label>University</label><input name="university" placeholder="Makerere University" value={form.university} onChange={set} required/></div>
            <div className="form-group"><label>I am a</label>
              <select name="role" value={form.role} onChange={set}>
                <option value="lecturer">Lecturer</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="form-group"><label>Password</label><input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={set} required/></div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15 }}>
              {loading ? <><span className="spinner"/>Creating account...</> : 'Create account →'}
            </button>
          </form>
          <div className="auth-switch">Already have an account? <Link to="/login" style={{ color: '#3C3489', fontWeight: 500 }}>Sign in</Link></div>
        </div>
      </div>
    </div>
  );
    }
