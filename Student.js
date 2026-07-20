import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function Student() {
  const { profile } = useAuth();
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from('exam_submissions')
      .select('*, exams(title, total_marks)')
      .eq('student_name', profile?.name)
      .eq('released', true)
      .order('created_at', { ascending: false });
    setResults(data || []);
    if (data?.length > 0) setSelected(data[0]);
    setLoading(false);
  }

  if (loading) return <div className="page-loader"><div className="sp"/></div>;

  return (
    <div className="app-wrap">
      <Navbar showNew={false}/>
      <div className="app-inner">
        <div className="page-hd">
          <div>
            <div className="page-title">My results</div>
            <div className="page-sub">Results released by your lecturer</div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No results yet</div>
            <div className="empty-sub">Your lecturer hasn't released any results yet. Check back later.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18 }}>
            <div className="panel">
              <div className="panel-title">My courseworks</div>
              {results.map((r, i) => (
                <div key={r.id} className={`stu-row ${selected?.id === r.id ? 'active' : ''}`} onClick={() => setSelected(r)}>
                  <div>
                    <div className="stu-name">{r.exams?.title}</div>
                    <div className="stu-score">{r.total_score}/{r.exams?.total_marks}</div>
                  </div>
                  <span className="score-pill" style={{
                    background: r.total_score / r.exams?.total_marks >= 0.5 ? '#E1F5EE' : '#FAECE7',
                    color: r.total_score / r.exams?.total_marks >= 0.5 ? '#0F6E56' : '#993C1D'
                  }}>
                    {Math.round((r.total_score / r.exams?.total_marks) * 100)}%
                  </span>
                </div>
              ))}
            </div>

            {selected && (
              <div className="panel">
                <div style={{ marginBottom: 20 }}>
                  <div className="panel-title" style={{ fontSize: 17 }}>{selected.exams?.title}</div>
                </div>
                <div className="score-circle">
                  <div className="score-big">{selected.total_score}</div>
                  <div className="score-denom">/ {selected.exams?.total_marks}</div>
                  <div className="score-pct">{Math.round((selected.total_score / selected.exams?.total_marks) * 100)}%</div>
                </div>
                <div style={{ margin: '20px 0 14px', fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Question breakdown</div>
                {selected.final_result?.questions?.map((q, i) => (
                  <div key={i} className="q-row">
                    <div style={{ flex: 1 }}>
                      <div className="q-label">{q.question}</div>
                      <div className="q-reason">{q.reason}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: q.awarded / q.available >= 0.5 ? '#0F6E56' : '#993C1D' }}>
                      {q.awarded}/{q.available}
                    </div>
                  </div>
                ))}
                {selected.final_result?.overall_feedback && (
                  <div className="fb-box" style={{ marginTop: 18 }}>
                    <div className="fb-label">FEEDBACK</div>
                    <p style={{ fontSize: 14, color: '#1a1a2e', lineHeight: 1.6 }}>{selected.final_result.overall_feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
