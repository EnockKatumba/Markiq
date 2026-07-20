import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

const STATUS_COLOR = { draft: '#888', marking: '#534AB7', marked: '#0F6E56', released: '#3C3489' };
const STATUS_LABEL = { draft: 'Draft', marking: 'Marking...', marked: 'Marked', released: 'Released' };

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [cws, setCws] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data } = await supabase.from('exams').select('*, exam_submissions(count)').eq('lecturer_id', user.id).order('created_at', { ascending: false });
    setCws(data || []);
    setLoading(false);
  }

  async function del(id) {
    if (!window.confirm('Delete this coursework?')) return;
    await supabase.from('exams').delete().eq('id', id);
    setCws(p => p.filter(c => c.id !== id));
  }

  if (loading) return <div className="page-loader"><div className="sp"/></div>;

  return (
    <div className="app-wrap">
      <Navbar/>
      <div className="app-inner">
        <div className="page-hd">
          <div>
            <div className="page-title">Your courseworks</div>
            <div className="page-sub">Manage and track all your marking</div>
          </div>
          <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={() => navigate('/create')}>+ New coursework</button>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-num">{cws.length}</div><div className="stat-label">Total courseworks</div></div>
          <div className="stat-card"><div className="stat-num">{cws.filter(c => c.status === 'marked' || c.status === 'released').length}</div><div className="stat-label">Marked</div></div>
          <div className="stat-card"><div className="stat-num">{cws.filter(c => c.status === 'released').length}</div><div className="stat-label">Released to students</div></div>
        </div>

        {cws.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No courseworks yet</div>
            <div className="empty-sub">Create your first one to start marking faster.</div>
            <button className="btn-primary" onClick={() => navigate('/create')}>Create your first coursework</button>
          </div>
        ) : (
          <div className="cw-grid">
            {cws.map(cw => (
              <div key={cw.id} className="cw-card">
                <span className="status-pill" style={{ background: STATUS_COLOR[cw.status] || '#888' }}>{STATUS_LABEL[cw.status] || cw.status}</span>
                <div className="cw-title">{cw.title}</div>
                <div className="cw-meta">{cw.total_marks} marks · {cw.exam_submissions?.[0]?.count || 0} students marked</div>
                <div className="cw-date">Created {new Date(cw.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div className="cw-actions">
                  <button className="btn-primary" style={{ flex: 1, padding: '9px 0', fontSize: 13 }} onClick={() => navigate(`/results/${cw.id}`)}>
                    {cw.status === 'draft' ? 'Start marking' : 'View results'}
                  </button>
                  <button className="del-btn" onClick={() => del(cw.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
    }
