import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Typewriter effect
    const el = document.querySelector('.typewriter');
    if (el) {
      setTimeout(() => { el.style.width = '100%'; }, 800);
    }
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{transform:translateX(-100%) rotate(15deg);}100%{transform:translateX(300%) rotate(15deg);}}
        @keyframes typewriter{from{width:0;}to{width:100%;}}
        @keyframes cursorBlink{0%,100%{border-color:#3C3489;}50%{border-color:transparent;}}
        @keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0.8;}100%{transform:translateY(-100px) translateX(20px);opacity:0;}}
        @keyframes waveOrb{0%,100%{transform:scale(1) translate(0,0);}33%{transform:scale(1.1) translate(20px,-10px);}66%{transform:scale(0.95) translate(-10px,15px);}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(127,119,221,0.15);}50%{box-shadow:0 0 40px rgba(127,119,221,0.4);}}
        @keyframes bounce{0%,80%,100%{transform:scale(0);opacity:0.3;}40%{transform:scale(1);opacity:1;}}

        :root{--p:#3C3489;--pm:#534AB7;--ps:#7F77DD;--pl:#EEEDFE;--pb:#CECBF6;--muted:#5f5f7a;}

        .nav{display:flex;justify-content:space-between;align-items:center;padding:16px 56px;border-bottom:1px solid var(--pl);position:sticky;top:0;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);z-index:100;}
        .logo{font-family:'Sora',sans-serif;font-size:22px;font-weight:700;color:var(--p);letter-spacing:-0.5px;cursor:pointer;}
        .logo span{color:var(--ps);}
        .nav-links{display:flex;gap:28px;}
        .nav-lnk{background:none;border:none;font-size:14px;color:var(--muted);cursor:pointer;font-family:'Inter',sans-serif;transition:color 0.2s;}
        .nav-lnk:hover{color:var(--p);}
        .nav-actions{display:flex;gap:10px;}
        .btn-gh{background:transparent;color:var(--p);border:1.5px solid var(--p);padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .btn-gh:hover{background:var(--pl);}
        .btn-pr{background:var(--p);color:#fff;border:none;padding:9px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .btn-pr:hover{background:#26215C;transform:translateY(-1px);}

        .hero-section{position:relative;overflow:hidden;background:#fff;padding:80px 56px 0;}
        .hero-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);animation:waveOrb 8s ease-in-out infinite;}
        .orb-1{width:700px;height:700px;background:radial-gradient(circle,rgba(127,119,221,0.15),transparent 70%);top:-200px;left:-200px;animation-duration:8s;}
        .orb-2{width:600px;height:600px;background:radial-gradient(circle,rgba(60,52,137,0.1),transparent 70%);top:0;right:-200px;animation-duration:10s;animation-delay:-3s;}
        .orb-3{width:500px;height:500px;background:radial-gradient(circle,rgba(206,203,246,0.2),transparent 70%);bottom:-100px;left:40%;animation-duration:12s;animation-delay:-6s;}
        .particles{position:absolute;inset:0;pointer-events:none;}
        .particle{position:absolute;border-radius:50%;animation:particleFloat linear infinite;}

        .hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;}
        .hero-text{text-align:center;max-width:780px;margin:0 auto 60px;animation:fadeUp 0.7s ease forwards;}
        .live-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.9);border:1px solid var(--pl);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:500;color:var(--p);margin-bottom:24px;backdrop-filter:blur(8px);box-shadow:0 4px 16px rgba(60,52,137,0.08);animation:glow 3s ease-in-out infinite;}
        .live-dot{width:8px;height:8px;background:#0F6E56;border-radius:50%;animation:pulse 1s infinite;display:inline-block;}
        .hero-h1{font-family:'Sora',sans-serif;font-size:56px;font-weight:700;line-height:1.08;color:#1a1a2e;margin-bottom:20px;letter-spacing:-2px;}
        .typewriter-wrap{display:inline-block;overflow:hidden;vertical-align:bottom;}
        .typewriter{display:inline-block;color:var(--p);white-space:nowrap;overflow:hidden;border-right:3px solid var(--p);animation:typewriter 2s steps(11) 0.8s forwards,cursorBlink 0.8s step-end 0.8s infinite;width:0;}
        .hero-sub{font-size:17px;color:var(--muted);line-height:1.75;margin-bottom:36px;max-width:520px;margin-left:auto;margin-right:auto;}
        .hero-ctas{display:flex;gap:14px;justify-content:center;margin-bottom:14px;flex-wrap:wrap;}
        .cta-main{background:var(--p);color:#fff;border:none;padding:15px 36px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.25s;}
        .cta-main:hover{background:#26215C;transform:translateY(-2px);box-shadow:0 12px 32px rgba(60,52,137,0.3);}
        .cta-sec{background:transparent;color:var(--p);border:1.5px solid var(--pb);padding:14px 28px;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .cta-sec:hover{background:var(--pl);border-color:var(--p);}
        .hero-note{font-size:12px;color:#aaa;margin-bottom:32px;}
        .proof-pills{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;}
        .proof-pill{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);}
        .proof-check{color:var(--p);font-weight:700;font-size:15px;}

        .screenshot-section{position:relative;z-index:2;max-width:1200px;margin:52px auto 0;animation:fadeUp 0.7s ease 0.3s both;}
        .browser-wrap{border-radius:16px 16px 0 0;overflow:hidden;border:1px solid #e0e0e0;border-bottom:none;box-shadow:0 -8px 60px rgba(60,52,137,0.12);}
        .browser-bar{background:#f5f5f5;border-bottom:1px solid #e8e8e8;padding:10px 18px;display:flex;align-items:center;gap:10px;}
        .b-dots{display:flex;gap:6px;}
        .b-dot{width:11px;height:11px;border-radius:50%;}
        .b-url{flex:1;background:#fff;border:1px solid #e0e0e0;border-radius:6px;padding:5px 14px;font-size:11px;color:#aaa;text-align:center;max-width:300px;margin:0 auto;}
        .browser-body{background:#F9F8FF;position:relative;overflow:hidden;}
        .shimmer-line{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.5) 50%,transparent 65%);animation:shimmer 4s ease-in-out infinite;pointer-events:none;z-index:10;}
        .product-ui{display:grid;grid-template-columns:200px 1fr 320px;min-height:460px;}

        .p-sidebar{background:#1a1a2e;display:flex;flex-direction:column;}
        .p-sidebar-logo{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;padding:18px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .p-sidebar-logo span{color:var(--ps);}
        .p-nav{padding:12px 0;}
        .p-nav-item{padding:9px 18px;font-size:11px;color:rgba(255,255,255,0.45);display:flex;align-items:center;gap:8px;}
        .p-nav-item.on{color:#fff;background:rgba(127,119,221,0.15);border-right:2px solid var(--ps);}
        .p-section-label{font-size:9px;color:rgba(255,255,255,0.25);padding:14px 18px 6px;letter-spacing:1.5px;text-transform:uppercase;}
        .p-cw-item{padding:7px 18px;font-size:11px;color:rgba(255,255,255,0.5);display:flex;justify-content:space-between;align-items:center;}
        .p-cw-item.on{color:rgba(255,255,255,0.85);}
        .p-cw-badge{background:var(--ps);color:#fff;font-size:9px;padding:1px 6px;border-radius:8px;}

        .p-main{background:#F9F8FF;padding:18px;}
        .p-main-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
        .p-main-title{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#1a1a2e;}
        .p-main-sub{font-size:10px;color:var(--muted);margin-top:2px;}
        .p-ai-badge{background:var(--p);color:#fff;font-size:9px;font-weight:600;padding:3px 8px;border-radius:8px;}
        .p-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
        .p-stat{background:#fff;border-radius:8px;padding:10px;border:1px solid var(--pl);}
        .p-stat-num{font-family:'Sora',sans-serif;font-size:17px;font-weight:700;color:var(--p);}
        .p-stat-label{font-size:9px;color:var(--muted);margin-top:1px;}
        .p-table{background:#fff;border-radius:10px;border:1px solid var(--pl);overflow:hidden;}
        .p-table-head{padding:8px 12px;font-size:9px;font-weight:600;color:var(--muted);border-bottom:1px solid var(--pl);display:grid;grid-template-columns:1fr auto;letter-spacing:0.5px;text-transform:uppercase;}
        .p-row{padding:8px 12px;border-bottom:1px solid var(--pl);display:grid;grid-template-columns:1fr auto;align-items:center;}
        .p-row:last-child{border-bottom:none;}
        .p-row.sel{background:var(--pl);}
        .p-row-name{font-size:11px;font-weight:500;color:#1a1a2e;}
        .p-row-meta{font-size:9px;color:var(--muted);margin-top:1px;}
        .p-score{font-size:10px;font-weight:700;padding:3px 8px;border-radius:10px;}

        .p-right{background:#fff;border-left:1px solid var(--pl);padding:16px;display:flex;flex-direction:column;}
        .p-right-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--pl);}
        .p-right-name{font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#1a1a2e;}
        .p-right-sub{font-size:9px;color:var(--muted);margin-top:2px;}
        .p-total{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:var(--p);}
        .p-q{padding:7px 0;border-bottom:1px solid var(--pl);display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
        .p-q-label{font-size:11px;font-weight:600;color:#1a1a2e;margin-bottom:2px;}
        .p-q-reason{font-size:9px;color:var(--muted);line-height:1.4;}
        .p-score-input{width:38px;padding:4px 5px;border:1.5px solid var(--pb);border-radius:5px;font-size:11px;font-weight:700;color:var(--p);text-align:center;outline:none;}
        .p-fb{background:var(--pl);border-radius:8px;padding:10px;margin-top:10px;border:1px solid var(--pb);flex:1;}
        .p-fb-label{font-size:9px;font-weight:700;color:var(--p);letter-spacing:0.5px;margin-bottom:4px;}
        .p-fb-text{font-size:10px;color:#1a1a2e;line-height:1.5;}
        .p-release-btn{margin-top:10px;background:var(--p);color:#fff;border:none;padding:9px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;width:100%;}

        .float-card{position:absolute;background:#fff;border:1px solid var(--pl);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 28px rgba(60,52,137,0.12);animation:float 4s ease-in-out infinite;z-index:20;}
        .float-card-icon{font-size:22px;}
        .float-card-title{font-size:12px;font-weight:600;color:#1a1a2e;}
        .float-card-sub{font-size:10px;color:var(--muted);}
        .float-card-dark{background:var(--p);border-color:var(--p);}
        .float-card-dark .float-card-title{color:#fff;}
        .float-card-dark .float-card-sub{color:#AFA9EC;}

        .stats-band{background:var(--p);padding:48px 56px;display:grid;grid-template-columns:repeat(3,1fr);}
        .s-item{text-align:center;padding:0 20px;border-right:1px solid rgba(255,255,255,0.1);}
        .s-item:last-child{border-right:none;}
        .s-num{font-family:'Sora',sans-serif;font-size:44px;font-weight:700;color:#fff;}
        .s-label{font-size:13px;color:#AFA9EC;margin-top:5px;}

        .proof-section{padding:60px 56px;background:#F9F8FF;}
        .proof-inner{max-width:900px;margin:0 auto;text-align:center;}
        .proof-label{font-size:12px;font-weight:600;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:32px;}
        .testimonial{background:#fff;border-radius:18px;padding:32px 36px;border:1px solid var(--pl);text-align:left;max-width:640px;margin:0 auto;box-shadow:0 4px 24px rgba(60,52,137,0.06);}
        .t-stars{color:#F5A623;font-size:16px;margin-bottom:14px;letter-spacing:2px;}
        .t-text{font-size:16px;color:#1a1a2e;line-height:1.75;margin-bottom:20px;font-style:italic;}
        .t-author{display:flex;align-items:center;gap:12px;}
        .t-avatar{width:44px;height:44px;background:var(--pl);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:2px solid var(--pb);}
        .t-name{font-size:14px;font-weight:600;color:#1a1a2e;}
        .t-role{font-size:12px;color:var(--muted);margin-top:2px;}

        .how-section{padding:80px 56px;max-width:1100px;margin:0 auto;}
        .section-eyebrow{font-size:12px;font-weight:600;color:var(--pm);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;}
        .section-title{font-family:'Sora',sans-serif;font-size:34px;font-weight:700;color:#1a1a2e;margin-bottom:48px;letter-spacing:-0.5px;}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
        .step-card{padding:30px;border:1px solid var(--pl);border-radius:16px;background:#fff;transition:all 0.25s;}
        .step-card:hover{border-color:var(--pb);box-shadow:0 8px 32px rgba(60,52,137,0.09);transform:translateY(-4px);}
        .step-n{font-size:11px;font-weight:700;color:var(--pb);letter-spacing:1px;margin-bottom:14px;}
        .step-icon{font-size:36px;margin-bottom:16px;}
        .step-title{font-size:15px;font-weight:600;color:#1a1a2e;margin-bottom:10px;}
        .step-desc{font-size:13px;color:var(--muted);line-height:1.7;}

        .pricing-section{background:#F9F8FF;padding:1px 0;}
        .pricing-inner{max-width:1100px;margin:0 auto;padding:80px 56px;}
        .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .plan-card{background:#fff;border:1px solid var(--pl);border-radius:18px;padding:30px;display:flex;flex-direction:column;position:relative;transition:all 0.25s;}
        .plan-card:hover{box-shadow:0 8px 32px rgba(60,52,137,0.09);transform:translateY(-2px);}
        .plan-card.featured{border:2px solid var(--p);box-shadow:0 8px 32px rgba(60,52,137,0.14);}
        .pop-tag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--p);color:#fff;font-size:11px;font-weight:600;padding:4px 16px;border-radius:20px;white-space:nowrap;}
        .plan-tier{font-size:11px;font-weight:700;color:var(--ps);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
        .plan-price{font-family:'Sora',sans-serif;font-size:28px;font-weight:700;color:#1a1a2e;margin-bottom:4px;}
        .plan-period{font-family:'Inter',sans-serif;font-size:13px;color:#aaa;font-weight:400;}
        .plan-desc{font-size:13px;color:var(--muted);margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid var(--pl);}
        .plan-feats{list-style:none;flex:1;margin-bottom:22px;}
        .plan-feat{font-size:13px;color:#1a1a2e;padding:6px 0;display:flex;gap:9px;align-items:flex-start;}
        .feat-check{color:var(--p);font-weight:700;flex-shrink:0;font-size:15px;}
        .plan-btn{width:100%;padding:13px;border-radius:9px;font-size:14px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;border:1.5px solid var(--p);background:transparent;color:var(--p);transition:all 0.2s;}
        .plan-btn:hover{background:var(--pl);}
        .plan-card.featured .plan-btn{background:var(--p);color:#fff;border:none;}
        .plan-card.featured .plan-btn:hover{background:#26215C;}

        .final-section{background:var(--p);padding:88px 56px;text-align:center;position:relative;overflow:hidden;}
        .final-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .final-inner{position:relative;z-index:2;}
        .final-icon{font-size:56px;margin-bottom:22px;}
        .final-title{font-family:'Sora',sans-serif;font-size:38px;font-weight:700;color:#fff;margin-bottom:14px;letter-spacing:-0.5px;}
        .final-sub{font-size:17px;color:#AFA9EC;margin-bottom:38px;line-height:1.65;max-width:480px;margin-left:auto;margin-right:auto;}
        .final-btn{background:#fff;color:var(--p);border:none;padding:17px 44px;border-radius:12px;font-size:17px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .final-btn:hover{background:var(--pl);transform:translateY(-2px);}
        .final-note{font-size:13px;color:#AFA9EC;margin-top:16px;}

        .footer{padding:30px 56px;border-top:1px solid var(--pl);display:flex;justify-content:space-between;align-items:center;}
        .foot-logo{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--p);}
        .foot-logo span{color:var(--ps);}
        .foot-copy{font-size:13px;color:#aaa;}
        .foot-links{display:flex;gap:22px;}
        .foot-link{font-size:13px;color:#aaa;cursor:pointer;}

        @media(max-width:900px){
          .nav{padding:14px 20px;}
          .nav-links{display:none;}
          .hero-section{padding:40px 20px 0;}
          .hero-h1{font-size:34px;}
          .hero-ctas{flex-direction:column;align-items:center;}
          .product-ui{grid-template-columns:1fr;}
          .p-sidebar,.p-right{display:none;}
          .stats-band{padding:36px 20px;grid-template-columns:1fr;gap:24px;}
          .s-item{border-right:none;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:20px;}
          .s-item:last-child{border-bottom:none;}
          .proof-section,.pricing-inner,.final-section{padding-left:20px;padding-right:20px;}
          .how-section{padding:44px 20px;}
          .steps,.plans{grid-template-columns:1fr;}
          .footer{padding:24px 20px;flex-direction:column;gap:14px;text-align:center;}
          .foot-links{justify-content:center;}
          .float-card{display:none;}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">Mark<span>IQ</span></div>
        <div className="nav-links">
          <button className="nav-lnk" onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>How it works</button>
          <button className="nav-lnk" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>Pricing</button>
          <button className="nav-lnk" onClick={() => document.getElementById('proof').scrollIntoView({ behavior: 'smooth' })}>Reviews</button>
        </div>
        <div className="nav-actions">
          <button className="btn-gh" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-pr" onClick={() => navigate('/signup')}>Sign up free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="particles">
          {[
            { s: 5, c: '#7F77DD', l: '8%', t: '20%', d: '5s', dl: '0s' },
            { s: 4, c: '#3C3489', l: '20%', t: '65%', d: '6s', dl: '1s' },
            { s: 6, c: '#CECBF6', l: '45%', t: '25%', d: '7s', dl: '2s' },
            { s: 4, c: '#7F77DD', l: '68%', t: '70%', d: '5
