import { useState, useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const BRANCHES = [
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    type: 'Main Branch',
    address: 'Building No. 2566A, Mukt Ashram Street, Jagat Nagar, Basti Jodhewal, Ludhiana, Punjab – 141007',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    phone: '0161-5047087',
    phone2: '+91 97803 00161',
    x: 36, y: 14,
    operational: [
      'Ludhiana', 'Sahnewal', 'Jagraon', 'Mohali', 'Abohar', 'Fazilka',
      'Malout', 'Kurali', 'Sirhind', 'Nabha', 'Khanna', 'Mandi Dabwali',
      'Giddarbaha', 'Zirakpur', 'Phagwara', 'Hoshiarpur', 'Jalandhar',
    ],
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    type: 'Branch Office',
    address: 'Cyber Hub, DLF Phase 2, Gurgaon, Haryana – 122002',
    hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
    phone: '+91 124 4200000',
    phone2: '+91 99888 81003',
    x: 41, y: 19,
    operational: [
      'Gurgaon', 'Faridabad', 'Palwal', 'Nuh', 'Rewari', 'Jhajjar',
      'Rohtak', 'Sonipat', 'Panipat', 'Karnal', 'Hisar', 'Ambala',
      'Yamunanagar', 'Kurukshetra', 'Sirsa',
    ],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    type: 'Branch Office',
    address: 'Near Tonk Road, Jaipur, Rajasthan – 302015',
    hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
    phone: '+91 141 2650000',
    phone2: '+91 99888 81003',
    x: 38, y: 34,
    operational: [
      'Jaipur', 'Chomu', 'Reengus', 'Khatu', 'Sikar', 'Nawalgarh',
      'Bagru', 'Dudu', 'Phulera', 'Shahpura', 'Kotputli', 'Mauzmabad',
      'Ajmer', 'Kishangarh', 'Beawar',
    ],
  },
  {
    id: 'kota',
    name: 'Kota',
    type: 'Branch Office',
    address: 'Near Talwandi, Kota, Rajasthan – 324001',
    hours: 'Mon–Sat: 9:00 AM – 5:30 PM',
    phone: '+91 744 2320000',
    phone2: '+91 97803 00161',
    x: 38, y: 46,
    operational: [
      'Kota', 'Bundi', 'Baran', 'Jhalawar', 'Chittorgarh', 'Bhilwara',
      'Rajsamand', 'Udaipur', 'Dungarpur', 'Pratapgarh',
    ],
  },
  {
    id: 'jhalawar',
    name: 'Jhalawar',
    type: 'Branch Office',
    address: 'Main Road, Jhalawar, Rajasthan – 326001',
    hours: 'Mon–Sat: 9:30 AM – 5:00 PM',
    phone: '+91 7432 230000',
    phone2: '+91 99888 81003',
    x: 40, y: 48,
    operational: [
      'Jhalawar', 'Khanpur', 'Rawatbhata', 'Gangrar',
      'Mandsaur', 'Neemuch', 'Ratlam',
    ],
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    type: 'Branch Office',
    address: 'CBD Belapur, Navi Mumbai, Maharashtra – 400614',
    hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
    phone: '+91 22 2757 0000',
    phone2: '+91 97803 00161',
    x: 28, y: 66,
    operational: [
      'Navi Mumbai', 'Thane', 'Kalyan', 'Dombivli', 'Ulhasnagar',
      'Ambernath', 'Panvel', 'Kalamboli', 'Vashi', 'Sanpada', 'Nerul',
    ],
  },
]

const OPERATIONAL_OFFSETS = [
  { dx: -5, dy: -3 }, { dx: 4, dy: -2 }, { dx: -3, dy: 3 }, { dx: 5, dy: 2 },
  { dx: -6, dy: 1 }, { dx: 3, dy: -4 }, { dx: -2, dy: 4 }, { dx: 6, dy: -1 },
  { dx: -4, dy: -2 }, { dx: 2, dy: 3 }, { dx: -5, dy: 4 }, { dx: 4, dy: -3 },
  { dx: -3, dy: -4 }, { dx: 5, dy: 3 }, { dx: -6, dy: 2 }, { dx: 3, dy: 4 },
]

function getOperationalPos(branchIdx, cityIdx) {
  const offset = OPERATIONAL_OFFSETS[cityIdx % OPERATIONAL_OFFSETS.length]
  const spread = 2.5 + (cityIdx * 0.3)
  return {
    x: BRANCHES[branchIdx].x + offset.dx * (spread / 3),
    y: BRANCHES[branchIdx].y + offset.dy * (spread / 3),
  }
}

export default function IndiaMap({ onSelectBranch, selectedBranch }) {
  const prefersReduced = usePrefersReducedMotion()
  const [hoveredBranch, setHoveredBranch] = useState(null)
  const [markersVisible, setMarkersVisible] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const svgRef = useRef(null)
  const activeBranch = selectedBranch || hoveredBranch

  useEffect(() => {
    const t1 = setTimeout(() => setMapLoaded(true), 100)
    const t2 = setTimeout(() => setMarkersVisible(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleSelect = (id) => {
    const branch = BRANCHES.find(b => b.id === id)
    if (onSelectBranch) onSelectBranch(branch)
    setHoveredBranch(id)
  }

  return (
    <div className="relative">
      <style>{`
        @keyframes markerPulse {
          0%, 100% { r: 3.5; opacity: 0.25; }
          50% { r: 5.5; opacity: 0; }
        }
        @keyframes markerAppear {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes lineGrow {
          from { stroke-dashoffset: 10; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 0.35; }
        }
        @keyframes dotAppear {
          from { r: 0; opacity: 0; }
          to { r: 1.2; opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .branch-marker-group { cursor: pointer; }
        .branch-marker-group:hover .marker-outer { opacity: 0.4 !important; }
        .branch-marker-group:hover .marker-label { opacity: 1 !important; font-weight: 600 !important; }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 100 95"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="indiaFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.025" />
            <stop offset="50%" stopColor="#c9a227" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.02" />
          </linearGradient>
          <filter id="mapSoftShadow" x="-3%" y="-3%" width="106%" height="106%">
            <feDropShadow dx="0" dy="0.8" stdDeviation="1.2" floodColor="#1a1a2e" floodOpacity="0.06" />
          </filter>
          <filter id="markerGlow">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotShadow">
            <feDropShadow dx="0" dy="0.2" stdDeviation="0.3" floodColor="#1a1a2e" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <ellipse cx="42" cy="40" rx="38" ry="35" fill="#c9a227" opacity="0.015" />
        <circle cx="36" cy="14" r="20" fill="#c9a227" opacity="0.01" />

        {/* ━━━ INDIA OUTLINE ━━━ */}
        <g
          opacity={mapLoaded ? 1 : 0}
          style={{ transition: prefersReduced ? 'none' : 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <path
            d={`
              M 33.5 3.5
              L 35 3.8 36.5 3.2 38 4 39.5 3.5 40.8 4.2 42 3.8
              L 43.5 4.5 45 4 46.5 4.8 48 4.2
              L 49.5 5 51 4.5 52.5 5.5
              L 54 5 55.5 6 57 5.5 58.5 6.5
              L 60 6 61.5 7 63 6.5 64.5 7.5
              L 66 7 67 8 68.5 7.5 70 8.5
              L 71.5 8 72.5 9 74 8.5 75.5 9.5
              L 77 9 78 10 79.5 9.5
              L 81 10.5 82 10 83 11
              L 84 10.5 85 11.5
              L 86 12 87 13
              L 88 14.5 88.5 16
              L 89 17.5 89.5 19
              L 90 20.5 89.5 22
              L 89 23.5 88.5 25
              L 88 26.5 87.5 28
              L 87 29.5 86 31
              L 85 32.5 84 34
              L 83 35.5 82 37
              L 81 38.5 80 40
              L 79 41.5 78 43
              L 77 44.5 76 46
              L 75 47.5 74 49
              L 73 50.5 72 52
              L 71 53.5 70 55
              L 69 56.5 68 58
              L 67 59.5 66 61
              L 65 62.5 64 64
              L 63 65.5 62 67
              L 61 68.5 60 70
              L 59 71.5 58 73
              L 57 74 56 74.5
              L 55 75 54 74.5
              L 53 73.5 52 72.5
              L 51 71.5 50 70
              L 49 69 48 67.5
              L 47 66 46 64.5
              L 45 63 44 61.5
              L 43 60 42 58.5
              L 41 57 40 55.5
              L 39 54 38 52.5
              L 37 51 36 49.5
              L 35 48 34 46.5
              L 33 45 32.5 43.5
              L 32 42 31.5 40.5
              L 31 39 30.5 37.5
              L 30 36 29.5 34.5
              L 29 33 28.5 31.5
              L 28 30 27.5 28.5
              L 27 27 26.8 25.5
              L 26.5 24 26.3 22.5
              L 26.2 21 26.5 19.5
              L 27 18 27.5 16.5
              L 28 15 29 13.5
              L 30 12 31 10.5
              L 32 9 33 7.5
              L 33.5 6 33.5 4.5
              Z
            `}
            fill="url(#indiaFill)"
            stroke="#d4d0c8"
            strokeWidth="0.35"
            strokeLinejoin="round"
            filter="url(#mapSoftShadow)"
          />

          {/* Sri Lanka hint */}
          <ellipse cx="58" cy="78" rx="1.5" ry="2.5" fill="none" stroke="#d4d0c8" strokeWidth="0.2" opacity="0.4" />
        </g>

        {/* ━━━ OPERATIONAL REGION LINES (when branch selected) ━━━ */}
        {activeBranch && BRANCHES.filter(b => b.id === activeBranch).map(branch => {
          const branchIdx = BRANCHES.indexOf(branch)
          return (
            <g key={`ops-${branch.id}`}>
              {branch.operational.slice(1).map((city, i) => {
                const pos = getOperationalPos(branchIdx, i)
                const delay = prefersReduced ? 0 : i * 0.04
                return (
                  <g key={city}>
                    <line
                      x1={branch.x}
                      y1={branch.y}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="#c9a227"
                      strokeWidth="0.15"
                      strokeDasharray="2 1"
                      opacity="0.3"
                      style={{
                        animation: prefersReduced ? 'none' : `lineGrow 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
                      }}
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="0"
                      fill="#c9a227"
                      opacity="0.5"
                      filter="url(#dotShadow)"
                      style={{
                        animation: prefersReduced ? 'none' : `dotAppear 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 0.15}s both`,
                      }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 1.8}
                      textAnchor="middle"
                      fill="#1a1a2e"
                      fontSize="1.5"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      opacity="0"
                      style={{
                        animation: prefersReduced ? 'none' : `fadeIn 0.3s ease ${delay + 0.3}s both`,
                      }}
                    >
                      {city}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* ━━━ BRANCH MARKERS ━━━ */}
        {BRANCHES.map((branch, i) => {
          const isActive = activeBranch === branch.id
          const appearDelay = prefersReduced ? 0 : 0.6 + i * 0.15
          return (
            <g
              key={branch.id}
              className="branch-marker-group"
              onMouseEnter={() => setHoveredBranch(branch.id)}
              onMouseLeave={() => setHoveredBranch(null)}
              onClick={() => handleSelect(branch.id)}
              style={{
                transformOrigin: `${branch.x}px ${branch.y}px`,
                animation: prefersReduced ? 'none' : `markerAppear 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${appearDelay}s both`,
              }}
            >
              {/* Pulse ring */}
              {!prefersReduced && (
                <circle
                  cx={branch.x}
                  cy={branch.y}
                  r="3.5"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="0.2"
                  opacity="0.25"
                  style={{ animation: `markerPulse 2.5s ease-out infinite ${appearDelay}s` }}
                />
              )}

              {/* Outer glow */}
              <circle
                className="marker-outer"
                cx={branch.x}
                cy={branch.y}
                r={isActive ? 3 : 2}
                fill="none"
                stroke="#c9a227"
                strokeWidth="0.2"
                opacity={isActive ? 0.35 : 0.12}
                style={{ transition: prefersReduced ? 'none' : 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

              {/* Main marker */}
              <circle
                cx={branch.x}
                cy={branch.y}
                r={isActive ? 1.3 : 0.9}
                fill={isActive ? '#c9a227' : '#1a1a2e'}
                stroke="white"
                strokeWidth="0.35"
                filter={isActive ? 'url(#markerGlow)' : 'url(#dotShadow)'}
                style={{ transition: prefersReduced ? 'none' : 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

              {/* Gold inner dot */}
              <circle
                cx={branch.x}
                cy={branch.y}
                r={isActive ? 0.5 : 0.35}
                fill={isActive ? 'white' : '#c9a227'}
                style={{ transition: prefersReduced ? 'none' : 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

              {/* Label */}
              <text
                className="marker-label"
                x={branch.x}
                y={branch.y - 2.5}
                textAnchor="middle"
                fill="#1a1a2e"
                fontSize="2"
                fontFamily="DM Sans, sans-serif"
                fontWeight={isActive ? '600' : '500'}
                opacity={isActive ? 1 : 0.65}
                style={{ transition: prefersReduced ? 'none' : 'all 0.3s ease' }}
              >
                {branch.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export { BRANCHES }
