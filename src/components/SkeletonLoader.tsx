import React from 'react';

const Shimmer = ({ w = '100%', h = 16, mb = 0, r = 8 }: { w?: string | number, h?: string | number, mb?: number, r?: number }) => (
  <div style={{
    width: w, height: h, borderRadius: r, marginBottom: mb,
    background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)',
    backgroundSize: '600px 100%',
    animation: 'shimmer 1.4s ease-in-out infinite'
  }} />
);

interface SkeletonLoaderProps {
  type?: 'hotel' | 'event';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'hotel' }) => (
  <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -600px 0; }
        100% { background-position: 600px 0; }
      }
    `}</style>
    <div style={{ height: 220, background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)', backgroundSize: '600px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Shimmer w="60%" h={22} />
        {type === 'hotel' && <Shimmer w={52} h={28} r={8} />}
      </div>
      <Shimmer w="40%" h={16} mb={10} />
      <Shimmer w="50%" h={16} mb={20} />
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Shimmer w={48} h={12} mb={6} /><Shimmer w={80} h={26} /></div>
        <Shimmer w={110} h={42} r={12} />
      </div>
    </div>
  </div>
);

export default SkeletonLoader;