import React from 'react';

const Shimmer = ({ w = '100%', h = 16, mb = 0, r = 8 }: { w?: string | number, h?: string | number, mb?: number, r?: number }) => (
  <div style={{
    width: w, height: h, borderRadius: r, marginBottom: mb,
    background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 37%, #f1f5f9 63%)',
    backgroundSize: '600px 100%',
    animation: 'shimmer 1.4s ease-in-out infinite'
  }} />
);

const EventDetailsSkeleton = () => (
  <div>
    <style>{`
      @media (min-width: 1024px) {
        .lg-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .lg-col-span-2 {
          grid-column: span 2 / span 2;
        }
        .summary-skeleton {
          display: block;
        }
      }
    `}</style>
    {/* Hero Banner */}
    <div style={{ height: '24rem', marginBottom: '2rem' }}>
      <Shimmer h="100%" r={24} />
    </div>

    <div className="lg-grid" style={{ gap: '2rem' }}>
      {/* Main Content */}
      <div className="lg-col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* About Section */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #f1f5f9' }}>
          <Shimmer w="40%" h={28} mb={24} />
          <Shimmer w="100%" h={16} mb={8} />
          <Shimmer w="90%" h={16} mb={8} />
          <Shimmer w="70%" h={16} />
        </div>

        {/* Ticket Selection Section */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Shimmer w="50%" h={28} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map(i => (
              <div key={i} style={{ padding: '1.5rem', borderRadius: '1rem', border: '2px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ flex: '1', paddingRight: '1rem' }}>
                    <Shimmer w="60%" h={24} mb={12} />
                    <Shimmer w="80%" h={14} />
                  </div>
                  <div style={{ width: '6rem', textAlign: 'right' }}>
                    <Shimmer w="100%" h={28} mb={8} />
                    <Shimmer w="70%" h={12} />
                  </div>
                </div>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Shimmer w={40} h={40} r={12} />
                      <Shimmer w={48} h={32} />
                      <Shimmer w={40} h={40} r={12} />
                    </div>
                    <Shimmer w={100} h={36} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Summary */}
      <div className="summary-skeleton" style={{ gridColumn: 'span 1 / span 1', display: 'none' }}>
        <div style={{ position: 'sticky', top: '6rem', height: 'fit-content' }}>
          <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #f1f5f9' }}>
            <Shimmer w="70%" h={28} mb={24} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0' }}>
              <Shimmer w={80} h={80} r={40} mb={16} />
              <Shimmer w="80%" h={20} mb={8} />
              <Shimmer w="60%" h={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface SkeletonLoaderProps {
  type?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'hotel' }) => {
  if (type === 'event-details') {
    return <EventDetailsSkeleton />;
  }

  return (
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
};

export default SkeletonLoader;