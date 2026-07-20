import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ showNew = true }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
        Mark<span>IQ</span>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-greeting">👋 {profile?.name?.split(' ')[0] || 'Welcome'}</span>
            {showNew && profile?.role !== 'student' && (
              <button className="btn-primary" style={{padding:'9px 18px',fontSize:13}} onClick={() => navigate('/create')}>
                + New coursework
              </button>
            )}
            <button className="btn-ghost" style={{padding:'8px 16px',fontSize:13}} onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" style={{padding:'9px 18px',fontSize:13}} onClick={() => navigate('/login')}>Log in</button>
            <button className="btn-primary" style={{padding:'9px 18px',fontSize:13}} onClick={() => navigate('/signup')}>Sign up free</button>
          </>
        )}
      </div>
    </nav>
  );
  }
