import React, { useState } from 'react';
import SkeletonLoader from './SkeletonLoader';

const LoadingComponents = () => {
  const [active, setActive] = useState('full');

  const options = [
    { id: 'full', label: 'Full Page' },
    { id: 'skeleton', label: 'Skeleton Cards' },
    { id: 'inline', label: 'Inline Loaders' },
    { id: 'overlay', label: 'Overlay' },
    { id: 'progress', label: 'Progress Bar' }
  ];

  // ─── Spinner variants ───
  const Spinner = ({ size = 40, color = '#8b5cf6' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
      <circle
        cx="20" cy="20" r="16" fill="none"
        stroke="url(#grad1)" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="60 44"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </svg>
  );

  const PulseLoader = () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 12, height: 12, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
    </div>
  );

  const BounceLoader = () => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 32 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: 8, borderRadius: 4,
          background: `linear-gradient(to top, #8b5cf6, #ec4899)`,
          animation: `bounce 1s ease ${i * 0.15}s infinite`
        }} />
      ))}
    </div>
  );

  const DotsLoader = () => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#e5e7eb',
          animation: `dotPulse 1.4s ease ${i * 0.2}s infinite`
        }} />
      ))}
    </div>
  );


  // ─── Shimmer bar ───
  const Shimmer = ({ w = '100%', h = 16, mb = 0, r = 8 }) => (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)',
      backgroundSize: '600px 100%',
      animation: 'shimmer 1.4s ease-in-out infinite'
    }} />
  );

  // ─── Skeleton Story ───
  const SkeletonStory = () => (
    <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
      <div style={{ height: 280, background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)', backgroundSize: '600px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ padding: 24 }}>
        <Shimmer w="80%" h={22} mb={10} />
        <Shimmer w="95%" h={16} mb={8} />
        <Shimmer w="70%" h={16} mb={20} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)', backgroundSize: '600px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
          <div><Shimmer w={100} h={14} mb={4} /><Shimmer w={70} h={12} /></div>
        </div>
      </div>
    </div>
  );

  // ─── Full Page Loader ───
  const FullPageLoader = () => (
    <div style={{
      position: 'relative', width: '100%', minHeight: 480,
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
      borderRadius: 24, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', animation: 'float 4s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'float 5s ease-in-out 1s infinite' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <Spinner size={64} />
        </div>
        <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'Archivo, sans-serif', letterSpacing: '-0.03em', marginBottom: 8 }}>
          BookNStay
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontFamily: 'Crimson Pro, serif' }}>
          Crafting your perfect experience...
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.4)',
              animation: `dotPulse 1.4s ease ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Overlay Loader ───
  const OverlayLoader = () => (
    <div style={{ position: 'relative', width: '100%', minHeight: 420, borderRadius: 24, overflow: 'hidden', background: '#f8fafc' }}>
      {/* fake bg content */}
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, height: 160, border: '1px solid #f1f5f9' }} />
        ))}
      </div>
      {/* overlay */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', borderRadius: 24
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: '36px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <Spinner size={48} />
          <div style={{ color: '#1e293b', fontSize: 18, fontWeight: 700, fontFamily: 'Archivo, sans-serif' }}>
            Processing your booking...
          </div>
          <div style={{ color: '#64748b', fontSize: 14, fontFamily: 'Crimson Pro, serif' }}>
            Please wait a moment
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Progress Bar Loader ───
  const ProgressBarLoader = () => {
    const steps = ['Searching available options', 'Fetching best prices', 'Applying your filters', 'Ready!'];
    const [step] = useState(1);
    return (
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Spinner size={48} />
          <div style={{ marginTop: 16, color: '#1e293b', fontSize: 20, fontWeight: 800, fontFamily: 'Archivo, sans-serif' }}>
            Finding Experiences
          </div>
        </div>
        {/* progress bar */}
        <div style={{ background: '#f1f5f9', borderRadius: 12, height: 8, marginBottom: 28, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 12,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            width: '65%', animation: 'progressPulse 2s ease-in-out infinite'
          }} />
        </div>
        {/* steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < step ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : i === step ? '#f1f5f9' : '#f1f5f9',
                border: i === step ? '2px solid #8b5cf6' : 'none',
                flexShrink: 0
              }}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3 3 5-5" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : i === step ? (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', animation: 'pulse 1s ease infinite' }} />
                ) : null}
              </div>
              <span style={{
                fontSize: 14, fontWeight: i <= step ? 600 : 400,
                color: i < step ? '#10b981' : i === step ? '#1e293b' : '#94a3b8',
                fontFamily: 'Archivo, sans-serif'
              }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #fdf2f8 100%)', fontFamily: 'Archivo, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @keyframes bounce {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes progressPulse {
          0% { width: 10%; }
          50% { width: 75%; }
          100% { width: 10%; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.4)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BookNStay
          </div>
          <span style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', fontFamily: 'Crimson Pro, serif' }}>Loading Components Showcase</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ede9fe', padding: '8px 16px', borderRadius: 20, marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: '#7c3aed', fontWeight: 600 }}>⟳ Loading States</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 8 }}>Loading Components</h1>
          <p style={{ color: '#64748b', fontSize: 17, fontFamily: 'Crimson Pro, serif' }}>All loading states used across BookNStay</p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setActive(opt.id)}
              style={{
                padding: '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                fontFamily: 'Archivo, sans-serif', transition: 'all 0.3s',
                background: active === opt.id ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#fff',
                color: active === opt.id ? '#fff' : '#64748b',
                boxShadow: active === opt.id ? '0 4px 14px rgba(139,92,246,0.35)' : '0 1px 4px rgba(0,0,0,0.08)',
                border: active === opt.id ? 'none' : '1px solid #e2e8f0'
              }}
            >{opt.label}</button>
          ))}
        </div>

        {/* ─── FULL PAGE ─── */}
        {active === 'full' && <FullPageLoader />}

        {/* ─── SKELETON ─── */}
        {active === 'skeleton' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
              {[0, 1, 2].map(i => <SkeletonLoader key={i} type="hotel" />)}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Story Skeletons</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {[0, 1].map(i => <SkeletonStory key={i} />)}
            </div>
          </div>
        )}

        {/* ─── INLINE ─── */}
        {active === 'inline' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { label: 'Spinner', comp: <Spinner size={44} /> },
              { label: 'Pulse Dots', comp: <PulseLoader /> },
              { label: 'Bounce Bars', comp: <BounceLoader /> },
              { label: 'Wave Dots', comp: <DotsLoader /> }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 20, padding: 36, textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64, marginBottom: 20 }}>
                  {item.comp}
                </div>
                <div style={{ color: '#1e293b', fontSize: 15, fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ─── OVERLAY ─── */}
        {active === 'overlay' && <OverlayLoader />}

        {/* ─── PROGRESS ─── */}
        {active === 'progress' && <ProgressBarLoader />}
      </div>
    </div>
  );
};

export default LoadingComponents;