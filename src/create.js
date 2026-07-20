import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [marks, setMarks] = useState('');
  const [rubric, setRubric] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setError('');
    if (!title || !marks || !rubric) { setError('Please fill in all three fields.'); return; }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('exams').insert({
        title, total_marks: parseInt(marks), rubric,
        lecturer_id: user.id, status: 'draft',
      }).select().single();
      if (err) throw err;
      navigate(`/results/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="app-wrap">
      <Navbar showNew={false}/>
      <div className="create-wrap">
        <div className="create-card">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
          <div className="create-title">New coursework</div>
          <div className="create-sub">Three things and you're ready to mark.</div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handle}>
            <div className="form-group">
              <label>Coursework title</label>
              <input placeholder="e.g. ENG 201 Mid-semester coursework" value={title} onChange={e => setTitle(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label>Total marks</label>
              <input type="number" placeholder="e.g. 80" value={marks} onChange={e => setMarks(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label>Marking scheme</label>
              <textarea
                placeholder={`Paste your marking scheme here.\n\nExample:\nQ1 (20 marks)\n- Correct definition: 5 marks\n- Three examples: 5 marks each\n\nQ2 (30 marks)\n- Introduction: 5 marks\n- Main argument: 15 marks\n- Conclusion: 10 marks`}
                value={rubric}
                onChange={e => setRubric(e.target.value)}
                style={{ minHeight: 220, resize: 'vertical' }}
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: 14, fontSize: 15 }}>
              {loading ? <><span className="spinner"/>Creating...</> : '⚡ Create and start marking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  }
