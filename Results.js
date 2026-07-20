import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [cw, setCw] = useState(null);
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('single');
  const [sName, setSName] = useState('');
  const [sAnswers, setSAnswers] = useState('');
  const [bulk, setBulk] = useState('');
  const [marking, setMarking] = useState(false);
  const [markName, setMarkName] = useState('');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState('');
  const [releasing, setReleasing] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const { data: cwData } = await supabase.from('exams').select('*').eq('id', id).single();
    const { data: subsData } = await supabase.from('exam_submissions').select('*').eq('exam_id', id).order('student_name');
    setCw(cwData);
    setSubs(subsData || []);
    if (subsData?.length > 0) setSelected(subsData[0]);
    setLoading(false);
  }

  // Call AI via Netlify function — no CORS issues
  async function callAI(name, answers) {
    const res = await fetch('/.netlify/functions/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rubric: cw.rubric, answers, totalMarks: cw.total_marks, studentName: name }),
    });
    if (!res.ok) throw new Error('AI marking failed. Please try again.');
    return await res.json();
  }

  async function saveSub(name, answers, result) {
    const { data: sub } = await supabase.from('exam_submissions').insert({
      exam_id: id, student_name: name, script_text: answers,
      ai_result: result, final_result: result,
      total_score: result.total, status: 'marked', released: false,
    }).select().single();
    return sub;
  }

  async function markSingle() {
    setErr('');
    if (!sName.trim() || !sAnswers.trim()) { setErr('Please enter student name and answers.'); return; }
    setMarking(true); setMarkName(sName); setTotal(1); setProgress(0);
    try {
      const result = await callAI(sName, sAnswers);
      setProgress(1);
      const sub = await saveSub(sName, sAnswers, result);
      if (sub) { setSubs(p => [...p, sub]); setSelected(sub); }
      setSName(''); setSAnswers('');
    } catch(e) { setErr(e.message); }
    finally { setMarking(false); setMarkName(''); setProgress(0); setTotal(0); }
  }

  async function markBulk() {
    setErr('');
    if (!bulk.trim()) { setErr('Please paste student answers.'); return; }
    const blocks = bulk.split('---').map(b => b.trim()).filter(Boolean);
    if (!blocks.length) { setErr('No students found. Separate each student with ---'); return; }
    setMarking(true); setTotal(blocks.length); setProgress(0);
    const newSubs = [];
    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split('\n').filter(Boolean);
      const name = lines[0].trim();
      const answers = lines.slice(1).join('\n').trim();
      if (!name || !answers) continue;
      setMarkName(name); setProgress(i);
      try {
        const result = await callAI(name, answers);
        const sub = await saveSub(name, answers, result);
        if (sub) newSubs.push(sub);
      } catch(e) { console.error(`Failed: ${name}`, e); }
      setProgress(i + 1);
    }
    setSubs(p => [...p, ...newSubs]);
    if (newSubs.length > 0) setSelected(newSubs[0]);
    setBulk('');
    setMarking(false); setMarkName(''); setProgress(0); setTotal(0);
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (mode === 'single') setSAnswers(text);
    else setBulk(text);
  }

  async function override(subId, qIdx, val) {
    const sub = subs.find(s => s.id === subId);
    if (!sub) return;
    const updated = JSON.parse(JSON.stringify(sub.final_result));
    updated.questions[qIdx].awarded = parseInt(val);
    updated.total = updated.questions.reduce((sum, q) => sum + q.awarded, 0);
    await supabase.from('exam_submissions').update({ final_result: updated, total_score: updated.total }).eq('id', subId);
    setSubs(p => p.map(s => s.id === subId ? { ...s, final_result: updated, total_score: updated.total } : s));
    if (selected?.id === subId) setSelected(s => ({ ...s, final_result: updated, total_score: updated.total }));
  }

  async function release() {
    if (!window.confirm('Release results to all students?')) return;
    setReleasing(true);
    await supabase.from('exam_submissions').update({ released: true }).eq('exam_id', id);
    await supabase.from('exams').update({ status: 'released' }).eq('id', id);
    setSubs(p => p.map(s => ({ ...s, released: true })));
    setCw(p => ({ ...p, status: 'released' }));
    setReleasing(false);
  }

  if (loading) return <div className="page-loader"><div className="sp"/></div>;

  const avg = subs.length > 0 ? Math.round(subs.reduce((s, sub) => s + (sub.total_score || 0), 0) / subs.length) : 0;

  return (
    <div className="app-wrap">

      {/* MARKING OVERLAY */}
      <div className={`overlay ${marking ? 'on' : ''}`}>
        <div className="ov-card">
          <div className="ov-icon">⚡</div>
          <div className="ov-title">MarkIQ is working...</div>
          <div className="ov-name">Marking {markName}</div>
          {total > 1 && (
            <>
              <div className="prog-wrap">
                <div className="prog-bar" style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}/>
              </div>
              <div className="ov-count">{progress} of {total} students done</div>
            </>
          )}
          <div className="dots">
            <span className="dot" style={{ animationDelay: '0s' }}/>
            <span className="dot" style={{ animationDelay: '0.2s' }}/>
            <span className="dot" style={{ animationDelay: '0.4s' }}/>
          </div>
        </div>
      </div>

      <Navbar showNew={true}/>

      <div className="results-wrap">
        <div style={{ marginBottom: 22 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <div className="page-title">{cw?.title}</div>
          <div className="page-sub">{cw?.total_marks} marks total</div>
        </div>

        {/* Header actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          {subs.length > 0 && cw?.status !== 'released' && (
            <button className="btn-ghost" style={{ padding: '10px 20px', fontSize: 13 }} onClick={release} disabled={releasing}>
              {releasing ? 'Releasing...' : '📢 Release to students'}
            </button>
          )}
          {cw?.status === 'released' && <span className="released-tag">✓ Released to students</span>}
        </div>

        {/* Stats */}
        {subs.length > 0 && (
          <div className="results-stats">
            <div className="stat-card"><div className="stat-num">{subs.length}</div><div className="stat-label">Students marked</div></div>
            <div className="stat-card"><div className="stat-num">{avg}/{cw?.total_marks}</div><div className="stat-label">Class average</div></div>
            <div className="stat-card"><div className="stat-num">{Math.max(...subs.map(s => s.total_score || 0))}</div><div className="stat-label">Highest</div></div>
            <div className="stat-card"><div className="stat-num">{Math.min(...subs.map(s => s.total_score || 0))}</div><div className="stat-label">Lowest</div></div>
          </div>
        )}

        <div className="results-grid">
          {/* Left */}
          <div>
            <div className="panel">
              <div className="panel-title">Students ({subs.length})</div>
              {subs.length === 0
                ? <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '16px 0' }}>No students marked yet</p>
                : subs.map(sub => (
                  <div key={sub.id} className={`stu-row ${selected?.id === sub.id ? 'active' : ''}`} onClick={() => setSelected(sub)}>
                    <div>
                      <div className="stu-name">{sub.student_name}</div>
                      <div className="stu-score">{sub.total_score}/{cw?.total_marks}</div>
                    </div>
                    <span className="score-pill" style={{
                      background: sub.total_score / cw?.total_marks >= 0.5 ? '#E1F5EE' : '#FAECE7',
                      color: sub.total_score / cw?.total_marks >= 0.5 ? '#0F6E56' : '#993C1D'
                    }}>
                      {Math.round((sub.total_score / cw?.total_marks) * 100)}%
                    </span>
                  </div>
                ))
              }
            </div>

            <div className="panel">
              {/* Mode toggle */}
              <div className="toggle">
                <button className={`tog-btn ${mode === 'single' ? 'on' : ''}`} onClick={() => setMode('single')}>Single student</button>
                <button className={`tog-btn ${mode === 'bulk' ? 'on' : ''}`} onClick={() => setMode('bulk')}>Bulk upload</button>
              </div>

              {err && <div className="error-msg">{err}</div>}

              {/* File upload */}
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile}/>
              <div className="upload-box" onClick={() => fileRef.current.click()}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                <p style={{ fontSize: 13, color: '#5f5f7a' }}>Upload file (TXT, PDF, DOC)</p>
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>or paste below</p>
              </div>

              {mode === 'single' ? (
                <>
                  <div className="form-group"><label>Student name</label><input placeholder="e.g. Aisha Nakato" value={sName} onChange={e => setSName(e.target.value)}/></div>
                  <div className="form-group"><label>Student's answers</label><textarea placeholder="Paste answers here..." value={sAnswers} onChange={e => setSAnswers(e.target.value)} style={{ minHeight: 110, resize: 'vertical' }}/></div>
                  <button className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 14 }} onClick={markSingle} disabled={marking}>⚡ Mark with AI</button>
                </>
              ) : (
                <>
                  <div className="bulk-hint">
                    Separate each student with <code>---</code><br/>First line = student name, rest = their answers
                  </div>
                  <textarea
                    placeholder={`Aisha Nakato\nQ1: The answer is...\n---\nBrian Okello\nQ1: My answer is...`}
                    value={bulk} onChange={e => setBulk(e.target.value)}
                    style={{ width: '100%', minHeight: 150, resize: 'vertical', padding: '11px 14px', border: '1.5px solid #EEEDFE', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
                  />
                  <button className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 14, marginTop: 10 }} onClick={markBulk} disabled={marking}>⚡ Mark all students</button>
                </>
              )}
            </div>
          </div>

          {/* Right — detail */}
          <div className="panel">
            {selected ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div className="panel-title" style={{ marginBottom: 0 }}>{selected.student_name}</div>
                  <div className="total-score">{selected.total_score}/{cw?.total_marks}</div>
                </div>
                {selected.final_result?.questions?.map((q, i) => (
                  <div key={i} className="q-row">
                    <div style={{ flex: 1 }}>
                      <div className="q-label">{q.question}</div>
                      <div className="q-reason">{q.reason}</div>
                    </div>
                    <div className="q-score">
                      <input className="score-input" type="number" min={0} max={q.available} value={q.awarded} onChange={e => override(selected.id, i, e.target.value)}/>
                      <span style={{ fontSize: 13, color: '#aaa' }}>/ {q.available}</span>
                    </div>
                  </div>
                ))}
                {selected.final_result?.overall_feedback && (
                  <div className="fb-box">
                    <div className="fb-label">AI FEEDBACK</div>
                    <p style={{ fontSize: 14, color: '#1a1a2e', lineHeight: 1.6 }}>{selected.final_result.overall_feedback}</p>
                  </div>
                )}
                {selected.released && (
                  <div style={{ background: '#E1F5EE', borderRadius: 10, padding: 14, border: '1px solid #9FE1CB', marginTop: 14 }}>
                    <p style={{ fontSize: 13, color: '#0F6E56', fontWeight: 500 }}>✓ Results released to this student</p>
                  </div>
                )}
              </>
            ) : (
              <div className="no-stu">
                <div style={{ fontSize: 36, marginBottom: 10 }}>👆</div>
                <p style={{ fontSize: 14 }}>Select a student to view their results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
