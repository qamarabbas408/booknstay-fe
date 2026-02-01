
const PulseLoader = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.6; }
      }
    `}</style>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 12, height: 12, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
      }} />
    ))}
  </div>
);

export default PulseLoader;