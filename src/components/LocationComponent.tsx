import React, { useState } from 'react';
import {
  MapPin, Navigation, ExternalLink, Copy, Train,
  Car, Plane, Globe, ChevronRight, Check, Compass
} from 'lucide-react';

interface LocationDetails {
  address: string;
  city: string;
  country: string;
  lat: number|string;
  lng: number|string;
}

interface LocationComponentProps {
  location: LocationDetails;
}

const LocationComponent: React.FC<LocationComponentProps> = ({ location }) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeTransport, setActiveTransport] = useState<string>('transit');

  const coords = `${location.lat}, ${location.lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coords);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${location.lat},${location.lng}`,
      '_blank'
    );
  };

  const openDirections = (mode: string) => {
    const modeMap: Record<string, string> = {
      transit: 'r',
      drive: 'd',
      walk: 'w',
    };
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=${mode}`,
      '_blank'
    );
  };

  const transport = [
    {
      id: 'transit',
      icon: Train,
      label: 'Transit',
      detail: '~12 min',
      tip: 'U-Bahn U2/U8 — Alexanderplatz station, 2-min walk',
    },
    {
      id: 'drive',
      icon: Car,
      label: 'Drive',
      detail: '~18 min',
      tip: 'Parking: Alexa Shopping Center P1, €3/hr',
    },
    {
      id: 'walk',
      icon: Navigation,
      label: 'Walk',
      detail: '~28 min',
      tip: 'Scenic route through Mitte, past the TV Tower',
    },
    {
      id: 'fly',
      icon: Plane,
      label: 'Fly in',
      detail: 'BER Airport',
      tip: '45 min via Airport Express RE7 train',
    },
  ];

  // Generate a pseudo-map grid for visual effect
  const gridLines = Array.from({ length: 8 });
  const dots = [
    { x: 50, y: 50, label: 'Venue', primary: true },
    { x: 22, y: 35, label: 'Hotel Zone', primary: false },
    { x: 70, y: 68, label: 'Transport Hub', primary: false },
    { x: 35, y: 72, label: 'Parking', primary: false },
  ];

  return (
    <section className="location-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .location-root {
          font-family: 'Space Grotesk', sans-serif;
        }

        .mono {
          font-family: 'Space Mono', monospace;
        }

        /* ── Scanline overlay for the map ── */
        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0, 0, 0, 0.04) 3px,
            rgba(0, 0, 0, 0.04) 4px
          );
          pointer-events: none;
          border-radius: inherit;
        }

        /* ── Animated grid pulse ── */
        @keyframes gridPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.35; }
        }

        @keyframes pingVenue {
          0%   { transform: scale(1); opacity: 1; }
          70%  { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes rotateDash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -40; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmerCoord {
          0%, 100% { background-position: -200% center; }
          50%       { background-position: 200% center; }
        }

        .animate-fadeSlideUp { animation: fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.06s; }
        .delay-2 { animation-delay: 0.12s; }
        .delay-3 { animation-delay: 0.18s; }
        .delay-4 { animation-delay: 0.24s; }

        .ping-venue {
          animation: pingVenue 2s cubic-bezier(0,0,0.2,1) infinite;
        }

        .grid-pulse {
          animation: gridPulse 3s ease-in-out infinite;
        }

        .rotate-dash {
          animation: rotateDash 4s linear infinite;
        }

        .coord-shimmer {
          background: linear-gradient(
            90deg,
            #1e293b 0%, #1e293b 35%,
            #94a3b8 50%,
            #1e293b 65%, #1e293b 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerCoord 4s linear infinite;
        }

        /* ── Transport tab ── */
        .transport-tab {
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }

        .transport-tab:hover {
          transform: translateY(-3px);
        }

        .transport-tab.active {
          transform: translateY(-3px);
        }

        /* ── Map dot hover ── */
        .map-dot {
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .map-dot:hover { transform: scale(1.4); }

        /* ── Copy flash ── */
        .copy-flash {
          transition: all 0.2s ease;
        }
      `}</style>

      <div className="space-y-5 animate-fadeSlideUp">

        {/* ── Section label ── */}
        <div className="flex items-center space-x-3 animate-fadeSlideUp delay-1">
          <div className="flex items-center space-x-2">
            <Compass size={20} className="text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Venue & Getting There
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
        </div>

        {/* ── MAIN CARD (dark) ── */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-slate-900/40 animate-fadeSlideUp delay-2">

          {/* ── Pseudo-map visualization ── */}
          <div className="relative h-64 overflow-hidden scanlines bg-slate-950">

            {/* Background grid */}
            <svg className="absolute inset-0 w-full h-full grid-pulse" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid" width="96" height="96" patternUnits="userSpaceOnUse">
                  <rect width="96" height="96" fill="url(#smallGrid)" />
                  <path d="M 96 0 L 0 0 0 96" fill="none" stroke="#475569" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Radial glow at venue center */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: '50%', top: '50%',
                width: 220, height: 220,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
              }}
            />

            {/* Dashed "route" ring around venue */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="50%"
                cy="50%"
                r="72"
                fill="none"
                stroke="#6d28d9"
                strokeWidth="1"
                strokeDasharray="6 4"
                opacity="0.4"
                className="rotate-dash"
                style={{ transformOrigin: '50% 50%' }}
              />
              <circle
                cx="50%"
                cy="50%"
                r="110"
                fill="none"
                stroke="#334155"
                strokeWidth="0.5"
                strokeDasharray="3 6"
                opacity="0.35"
              />
            </svg>

            {/* Secondary map dots */}
            {dots.filter(d => !d.primary).map((dot, i) => (
              <div
                key={i}
                className="map-dot absolute"
                style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-400" />
                <div className="absolute left-3.5 top-0 whitespace-nowrap text-xs text-slate-500 font-mono">
                  {dot.label}
                </div>
              </div>
            ))}

            {/* Primary venue pin */}
            <div
              className="absolute"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {/* Ping ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-violet-500 opacity-40 ping-venue" />
              </div>

              {/* Core dot */}
              <div className="relative w-6 h-6 rounded-full bg-violet-500 border-2 border-white shadow-lg shadow-violet-500/60 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Venue label chip */}
            <div
              className="absolute bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-xl px-3 py-2 pointer-events-none"
              style={{ left: 'calc(50% + 20px)', top: 'calc(50% - 38px)' }}
            >
              <div className="text-xs font-bold text-white mono">{location.address}</div>
              <div className="text-xs text-slate-400">{location.city}</div>
            </div>

            {/* ── Corner HUD: Coordinates ── */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-slate-700 rounded-xl px-4 py-2.5">
              <div className="text-xs text-slate-500 mono mb-1 uppercase tracking-widest">Coordinates</div>
              <button
                onClick={handleCopyCoords}
                className="flex items-center space-x-2 group copy-flash"
              >
                <span className="mono text-sm coord-shimmer font-bold">
                  {location.lat.toFixed(4)}°N  {Math.abs(location.lng).toFixed(4)}°E
                </span>
                <span className="text-slate-600 group-hover:text-slate-300 transition-colors">
                  {copiedCoords
                    ? <Check size={14} className="text-green-400" />
                    : <Copy size={14} />
                  }
                </span>
              </button>
            </div>

            {/* ── Corner HUD: Country flag-ish badge ── */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/70 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-2">
              <Globe size={14} className="text-slate-400" />
              <span className="text-sm font-bold text-white mono">{location.country}</span>
            </div>
          </div>

          {/* ── Address row ── */}
          <div className="px-6 py-5 border-b border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">{location.address}</div>
                  <div className="text-slate-400 text-sm mt-1">
                    {location.city} · {location.country}
                  </div>
                </div>
              </div>

              <button
                onClick={openGoogleMaps}
                className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-bold"
              >
                <span>Open Maps</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* ── Transport tabs ── */}
          <div className="px-6 py-5">
            <div className="text-xs text-slate-500 mono uppercase tracking-widest mb-4">
              Get there by
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {transport.map((t) => {
                const Icon = t.icon;
                const isActive = activeTransport === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTransport(t.id)}
                    className={`transport-tab ${isActive ? 'active' : ''} flex flex-col items-center p-3 rounded-xl border text-center transition-colors ${
                      isActive
                        ? 'bg-violet-600/20 border-violet-500/60 text-violet-300'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon size={20} className="mb-1.5" />
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className={`text-xs mono mt-0.5 ${isActive ? 'text-violet-400' : 'text-slate-600'}`}>
                      {t.detail}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active transport tip */}
            {transport.filter(t => t.id === activeTransport).map(t => (
              <div key={t.id} className="flex items-start space-x-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                <p className="text-slate-300 text-sm leading-relaxed">{t.tip}</p>
                <button
                  onClick={() => openDirections(t.id === 'transit' ? 'transit' : t.id === 'drive' ? 'driving' : 'walking')}
                  className="flex-shrink-0 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM ROW: 2 utility cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeSlideUp delay-3">

          {/* Nearby card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-violet-50 transition-colors flex items-center justify-center">
                <Navigation size={18} className="text-slate-600 group-hover:text-violet-600 transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Nearby Landmarks</div>
                <div className="text-xs text-slate-500">Within walking distance</div>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'Berlin TV Tower', dist: '0.2 km', icon: '🗼' },
                { name: 'Neptune Fountain', dist: '0.4 km', icon: '⛲' },
                { name: 'Berlin Cathedral', dist: '0.8 km', icon: '⛪' },
                { name: 'Museum Island', dist: '1.1 km', icon: '🏛️' },
              ].map((place, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{place.icon}</span>
                    <span className="text-sm text-slate-700 font-medium">{place.name}</span>
                  </div>
                  <span className="mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {place.dist}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick info card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-violet-50 transition-colors flex items-center justify-center">
                <Globe size={18} className="text-slate-600 group-hover:text-violet-600 transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Arrival Tips</div>
                <div className="text-xs text-slate-500">Local knowledge</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Time Zone', value: 'CET (UTC+1)', icon: '🕐' },
                { label: 'Language', value: 'German / English OK', icon: '🗣️' },
                { label: 'Currency', value: 'Euro (€)', icon: '💶' },
                { label: 'Best by transit', value: 'S-Bahn S3 / S5 / S7', icon: '🚆' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Full-width directions CTA ── */}
        <button
          onClick={openGoogleMaps}
          className="w-full flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-violet-500/30 group animate-fadeSlideUp delay-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">Get Full Directions</div>
              <div className="text-violet-200 text-xs font-normal">
                {location.address}, {location.city}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-violet-200">Open in Google Maps</span>
            <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default LocationComponent;


// ─── USAGE ──────────────────────────────────────────────────────────────────
//
// <LocationComponent
  // location={{
  //   address: "Alexanderplatz, Berlin",
  //   city: "Berlin",
  //   country: "Germany",
  //   lat: 52.5219,
  //   lng: 13.4132
  // }}
// />
//
// ─── API SUGGESTIONS ─────────────────────────────────────────────────────────
//
// Your current schema only has: address, city, country, lat, lng
//
// RECOMMENDED additions to the location_details object:
//
//  "location_details": {
//    "address": "Alexanderplatz, Berlin",
//    "city": "Berlin",
//    "country": "Germany",
//    "lat": 52.5219,
//    "lng": 13.4132,
//
//    // 🆕 High-value additions:
//    "state": "Berlin",                    // for filtering and display
//    "zip_code": "10178",                  // needed for map providers
//    "timezone": "Europe/Berlin",          // show correct event time to user's TZ
//    "venue_name": "Alexanderplatz Arena", // separate from address string
//    "google_place_id": "ChIJAVkDPzdO...", // enables Places API photos + reviews
//    "what3words": "///slurs.salads.blind",// ultra-precise location sharing
//    "nearest_transit": "U2/U8 Alexanderplatz, 2min walk",
//    "parking_info": "Alexa P1 - €3/hr",
//    "accessibility": true                 // wheelchair access flag
//  }
//
// REAL MAP ALTERNATIVES (instead of static grid):
//
//  1. Mapbox GL JS   — best visual quality, free 50k loads/mo
//     npm install mapbox-gl
//     Use: <Map mapboxAccessToken="..." initialViewState={{ longitude: lng, latitude: lat, zoom: 15 }} />
//
//  2. Leaflet + OpenStreetMap — fully free, no API key
//     npm install react-leaflet leaflet
//     Use: <MapContainer center={[lat, lng]} zoom={15}><TileLayer .../></MapContainer>
//
//  3. Google Maps Embed API — dead simple, no npm
//     <iframe src="https://maps.google.com/maps?q={lat},{lng}&z=15&output=embed" />
//     No API key needed for basic embed.
//
//  4. Static Mapbox image  — zero JS, just an <img>
//     src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${lng},${lat},15,0/600x300@2x?access_token=YOUR_TOKEN`}
//
// RECOMMENDED: Start with option 3 (Google Embed — zero setup), graduate to
// Mapbox GL when you want custom styling to match your brand.