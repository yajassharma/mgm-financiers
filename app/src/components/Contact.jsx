import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const BRANCHES_DATA = [
  { name: 'Ludhiana', type: 'Main Branch' },
  { name: 'Jaipur', type: 'Branch Office' },
  { name: 'Navi Mumbai', type: 'Branch Office' },
  { name: 'Gurgaon', type: 'Branch Office' },
  { name: 'Kota', type: 'Branch Office' },
  { name: 'Jhalawar', type: 'Branch Office' },
]

const STATES_DATA = [
  {
    name: 'Punjab',
    cities: ['Ludhiana', 'Mohali', 'Fazilka', 'Malout', 'Kurali', 'Sirhind', 'Nabha', 'Khanna', 'Abohar', 'Jagraon', 'Sahnewal', 'Phagwara', 'Hoshiarpur', 'Jalandhar', 'Amritsar', 'Bathinda', 'Moga'],
  },
  {
    name: 'Rajasthan',
    cities: ['Jaipur', 'Kota', 'Jhalawar', 'Chomu', 'Sikar', 'Nawalgarh', 'Baran', 'Bundi', 'Chittorgarh', 'Bhilwara', 'Udaipur', 'Ajmer', 'Jodhpur', 'Alwar', 'Bharatpur', 'Kotputli', 'Mauzmabad', 'Bagru', 'Shahpura', 'Banswara', 'Rajsamand', 'Dungarpur'],
  },
  {
    name: 'Haryana',
    cities: ['Gurgaon', 'Faridabad', 'Palwal', 'Nuh', 'Rewari', 'Jhajjar', 'Rohtak', 'Sonipat', 'Panipat', 'Karnal', 'Hisar', 'Ambala', 'Yamunanagar', 'Kurukshetra'],
  },
  {
    name: 'Maharashtra',
    cities: ['Navi Mumbai', 'Thane', 'Kalyan', 'Dombivli', 'Panvel', 'Vashi', 'Nerul', 'Ulhasnagar', 'Ambernath', 'Ambivli', 'Shahad', 'Kalyan East'],
  },
]

const ENQUIRY_TYPES = ['Personal Loan', 'Business Loan', 'Loan Against Property', 'Gold Loan', 'Vehicle Loan', 'Consumer Durable Loan', 'General Enquiry', 'Grievance', 'Others']

function HeroSVG({ prefersReduced }) {
  return (
    <svg viewBox="0 0 480 420" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="hGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.02" />
        </linearGradient>
        <filter id="hShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#1a1a2e" floodOpacity="0.06" />
        </filter>
        <filter id="hGlow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Architectural grid */}
      <g opacity="0.04">
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <line key={`v${i}`} x1={50 + i * 50} y1="0" x2={50 + i * 50} y2="420" stroke="#1a1a2e" strokeWidth="0.5" />
        ))}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <line key={`h${i}`} x1="0" y1={50 + i * 50} x2="480" y2={50 + i * 50} stroke="#1a1a2e" strokeWidth="0.5" />
        ))}
      </g>

      {/* Ambient glow */}
      <circle cx="320" cy="180" r="140" fill="#c9a227" opacity="0.025" />

      {/* Main document card — frosted glass */}
      <g filter="url(#hShadow)">
        <rect x="140" y="60" width="200" height="260" rx="8" fill="white" opacity="0.7" />
        <rect x="140" y="60" width="200" height="260" rx="8" fill="url(#hGrad1)" />
        {/* Document lines */}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={`line${i}`} x="165" y={95 + i * 28} width={i === 0 ? 120 : i % 3 === 0 ? 100 : 140 - i * 8} height="4" rx="2" fill="#1a1a2e" opacity={0.06 + i * 0.008} />
        ))}
        {/* Gold accent line */}
        <rect x="165" y="80" width="40" height="3" rx="1.5" fill="#c9a227" opacity="0.5" />
      </g>

      {/* Floating card — communication */}
      <g filter="url(#hShadow)" style={{ animation: prefersReduced ? 'none' : 'float1 4s ease-in-out infinite' }}>
        <rect x="360" y="80" width="100" height="70" rx="6" fill="white" opacity="0.85" />
        <rect x="360" y="80" width="100" height="70" rx="6" fill="url(#hGrad2)" />
        {/* Envelope icon */}
        <rect x="385" y="100" width="50" height="30" rx="3" fill="none" stroke="#c9a227" strokeWidth="1.2" opacity="0.4" />
        <path d="M385 100 L410 118 L435 100" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Floating card — support node */}
      <g filter="url(#hShadow)" style={{ animation: prefersReduced ? 'none' : 'float2 5s ease-in-out infinite' }}>
        <rect x="40" y="120" width="90" height="65" rx="6" fill="white" opacity="0.85" />
        <rect x="40" y="120" width="90" height="65" rx="6" fill="url(#hGrad2)" />
        {/* Headset abstraction */}
        <circle cx="85" cy="148" r="12" fill="none" stroke="#1a1a2e" strokeWidth="1" opacity="0.15" />
        <path d="M73 148 Q73 135 85 135 Q97 135 97 148" fill="none" stroke="#c9a227" strokeWidth="1.2" opacity="0.4" />
        <rect x="72" y="145" width="5" height="10" rx="2" fill="#c9a227" opacity="0.3" />
        <rect x="93" y="145" width="5" height="10" rx="2" fill="#c9a227" opacity="0.3" />
      </g>

      {/* Floating card — shield / trust */}
      <g filter="url(#hShadow)" style={{ animation: prefersReduced ? 'none' : 'float3 4.5s ease-in-out infinite' }}>
        <rect x="60" y="300" width="85" height="60" rx="6" fill="white" opacity="0.85" />
        <rect x="60" y="300" width="85" height="60" rx="6" fill="url(#hGrad1)" />
        <path d="M102 315 L112 320 L112 332 Q112 340 102 344 Q92 340 92 332 L92 320 Z" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.4" />
        <path d="M97 328 L100 332 L107 323" fill="none" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Connection lines */}
      <path d="M240 320 Q280 340 360 150" fill="none" stroke="#c9a227" strokeWidth="0.6" opacity="0.12" strokeDasharray="4 3" />
      <path d="M140 150 Q90 170 85 152" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />
      <path d="M200 60 Q120 80 60 120" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />

      {/* Communication nodes — dots */}
      {[
        { cx: 360, cy: 170, r: 3, o: 0.15 },
        { cx: 410, cy: 220, r: 2.5, o: 0.1 },
        { cx: 130, cy: 200, r: 2, o: 0.12 },
        { cx: 240, cy: 350, r: 2.5, o: 0.1 },
        { cx: 440, cy: 310, r: 2, o: 0.08 },
        { cx: 50, cy: 240, r: 2, o: 0.1 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#c9a227" opacity={dot.o}
          style={{ animation: prefersReduced ? 'none' : `pulse ${2 + i * 0.3}s ease-in-out infinite ${i * 0.4}s` }}
        />
      ))}

      {/* Geometric circles */}
      <circle cx="400" cy="350" r="30" fill="none" stroke="#c9a227" strokeWidth="0.4" opacity="0.08" />
      <circle cx="400" cy="350" r="20" fill="none" stroke="#1a1a2e" strokeWidth="0.3" opacity="0.05" />
      <circle cx="80" cy="80" r="25" fill="none" stroke="#c9a227" strokeWidth="0.4" opacity="0.06" />

      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes float3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pulse { 0%,100% { opacity: var(--o, 0.12); } 50% { opacity: calc(var(--o, 0.12) * 2); } }
      `}</style>
    </svg>
  )
}

function StateChip({ state, isOpen, onToggle, prefersReduced }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 font-body text-sm ${
          isOpen
            ? 'bg-mgm-dark text-white border-mgm-dark shadow-lg shadow-mgm-dark/10'
            : 'bg-white text-mgm-dark border-mgm-dark/8 hover:border-mgm-dark/15 hover:shadow-md hover:shadow-mgm-dark/5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-mgm-gold' : 'bg-mgm-gold/40'}`} />
          <span className="font-medium">{state.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isOpen ? 'text-white/50' : 'text-mgm-dark/35'}`}>{state.cities.length} locations</span>
          <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-400"
        style={{
          maxHeight: isOpen ? `${Math.ceil(state.cities.length / 3) * 36 + 16}px` : '0',
          opacity: isOpen ? 1 : 0,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex flex-wrap gap-1.5 pt-3 pb-1 px-1">
          {state.cities.map((city) => (
            <span key={city} className="px-2.5 py-1 rounded-full bg-mgm-gold/10 text-mgm-dark/70 font-body text-[11px] border border-mgm-gold/15">
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Contact() {

const [formState, setFormState] = useState({ name: '', phone: '', email: '', department: '', subject: '', message: '' })
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [openState, setOpenState] = useState(null)
  const prefersReduced = usePrefersReducedMotion()

  const [heroRef, heroInView] = useInView({ threshold: 0.15 })
  const [presenceRef, presenceInView] = useInView({ threshold: 0.1 })
  const [connectRef, connectInView] = useInView({ threshold: 0.1 })
  const [quoteRef, quoteInView] = useInView({ threshold: 0.2 })
  const [helpRef, helpInView] = useInView({ threshold: 0.15 })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2 })

  const anim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const validateForm = () => {
    const e = {}
    if (!formState.name.trim()) e.name = 'Required'
    if (!formState.phone.trim()) e.phone = 'Required'
    else if (!/^\+?[\d\s-]{10,}$/.test(formState.phone.trim())) e.phone = 'Invalid'
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) e.email = 'Invalid'
    if (!formState.message.trim()) e.message = 'Required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validateForm()) return
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setFormState({ name: '', phone: '', email: '', department: '', subject: '', message: '' })
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <SEO
        title="Contact Us | Reach Out to MGM Financiers | Ludhiana, Punjab"
        description="Get in touch with MGM Financiers. Visit us at Building No. 2566A, Mukt Ashram Street, Jagat Nagar, Basti Jodhewal, Ludhiana, Punjab 141007. Call 0161 5047087 or email customer.redressal@mgmfinanciers.com"
        canonical="/contact"
      />
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-mgm-gold/[0.025] to-transparent" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-mgm-dark/[0.015] to-transparent" />
        <svg className="absolute top-40 right-20 w-48 h-48 opacity-[0.03]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#c9a227" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#1a1a2e" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        </svg>
      </div>

      {/* ━━━ SECTION 1 — HERO ━━━ */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Content */}
            <div>
              <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-5 ${anim(heroInView, 0)}`}>
                Connect With Us
              </span>
              <h1 className={`text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-mgm-dark font-heading leading-[1.08] tracking-tight mb-6 ${anim(heroInView, 80)}`}>
                {'Connect With Us'}
              </h1>
              <p className={`text-mgm-dark/45 font-body text-[15px] leading-relaxed max-w-lg mb-9 ${anim(heroInView, 160)}`}>
                {'Get in touch with our team for personalized assistance'}
              </p>
              <div className={`flex flex-wrap gap-3 mb-10 ${anim(heroInView, 240)}`}>
                <a
                  href="#connect"
                  onClick={(e) => { e.preventDefault(); document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/90 transition-all duration-200 shadow-lg shadow-mgm-dark/15"
                >
                  Contact Our Team
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#presence"
                  onClick={(e) => { e.preventDefault(); document.getElementById('presence')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-interactive inline-flex items-center gap-2 border border-mgm-dark/12 text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/[0.03] transition-all duration-200"
                >
                  Locate Our Branches
                </a>
              </div>
              {/* Trust indicators */}
              <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 ${anim(heroInView, 320)}`}>
                {[
                  'RBI Registered NBFC',
                  '28+ Years of Experience',
                  'Transparent & Customer-First',
                ].map((text, i) => (
                  <div key={text} className={`flex items-center gap-2 ${anim(heroInView, 320 + i * 80)}`}>
                    <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-mgm-dark/50 font-body text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Custom SVG Illustration */}
            <div className={`relative ${anim(heroInView, 200)}`}>
              <HeroSVG prefersReduced={prefersReduced} />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 2 — OUR PRESENCE ━━━ */}
      <section id="presence" ref={presenceRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-mgm-light/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — Image */}
            <div className={`relative ${anim(presenceInView, 0)}`}>
              <img
                src="/Contact Hero.png"
                alt="MGM Financiers presence across India"
                className="w-full h-auto max-w-lg mx-auto lg:mx-0"
                loading="lazy"
              />
            </div>

            {/* Right — Info Panel */}
            <div className={`${anim(presenceInView, 80)}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-4">
                Get in Touch
              </h2>
              <p className="text-mgm-dark/45 font-body text-sm leading-relaxed max-w-md mb-8">
                MGM Financiers has built a strong regional presence across North and Western India, serving communities in Punjab, Rajasthan, Haryana and Maharashtra with trusted financial solutions.
              </p>

              {/* Branch Network */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-mgm-dark/40 font-body font-semibold mb-3">Our Branch Network</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BRANCHES_DATA.map((b) => (
                    <div key={b.name} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-mgm-dark/5">
                      <div className="w-8 h-8 rounded-lg bg-mgm-dark flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-mgm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-mgm-dark text-sm leading-tight">{b.name}</p>
                        <p className="text-mgm-dark/35 font-body text-[11px]">{b.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Presence — State Chips */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-mgm-dark/40 font-body font-semibold mb-3">Operational Presence</h3>
                <div className="space-y-2">
                  {STATES_DATA.map((state) => (
                    <StateChip
                      key={state.name}
                      state={state}
                      isOpen={openState === state.name}
                      onToggle={() => setOpenState(openState === state.name ? null : state.name)}
                      prefersReduced={prefersReduced}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 3 — CONNECT WITH US ━━━ */}
      <section id="connect" ref={connectRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Form */}
            <div className={`${anim(connectInView, 0)}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-2">{'Send Us a Message'}</h2>
              <p className="text-mgm-dark/40 font-body text-sm mb-8">{'Fill out the form below and we\'ll get back to you shortly'}</p>

              {formSubmitted ? (
                <div className="bg-mgm-light/50 p-12 rounded-2xl border border-mgm-dark/5 text-center">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-mgm-dark font-heading mb-1">{'Message sent successfully! We\'ll get back to you soon.'}</h3>
                  <p className="text-mgm-dark/50 font-body text-sm">{'Sending...'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Full Name'} *</label>
                      <input type="text" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 bg-white font-body text-sm text-mgm-dark placeholder:text-mgm-dark/25 ${formErrors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : 'border-mgm-dark/10 focus:border-mgm-gold focus:ring-mgm-gold/15'}`}
                        placeholder="Your name" />
                      {formErrors.name && <p className="text-red-500 text-[11px] font-body mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Phone Number'} *</label>
                      <input type="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 bg-white font-body text-sm text-mgm-dark placeholder:text-mgm-dark/25 ${formErrors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : 'border-mgm-dark/10 focus:border-mgm-gold focus:ring-mgm-gold/15'}`}
                        placeholder="+91 98765 43210" />
                      {formErrors.phone && <p className="text-red-500 text-[11px] font-body mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Email Address'}</label>
                      <input type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 bg-white font-body text-sm text-mgm-dark placeholder:text-mgm-dark/25 ${formErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : 'border-mgm-dark/10 focus:border-mgm-gold focus:ring-mgm-gold/15'}`}
                        placeholder="you@example.com" />
                      {formErrors.email && <p className="text-red-500 text-[11px] font-body mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Enquiry Type'}</label>
                      <select value={formState.department} onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 bg-white font-body text-sm ${!formState.department ? 'text-mgm-dark/30' : 'text-mgm-dark'} border-mgm-dark/10 focus:border-mgm-gold focus:ring-mgm-gold/15`}>
                        <option value="">Select department</option>
                        {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Subject'}</label>
                    <input type="text" value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-mgm-dark/10 rounded-xl focus:outline-none focus:border-mgm-gold focus:ring-1 focus:ring-mgm-gold/15 transition-all duration-200 bg-white font-body text-sm text-mgm-dark placeholder:text-mgm-dark/25"
                      placeholder="Brief subject" />
                  </div>
                  <div>
                    <label className="block text-mgm-dark/60 mb-1.5 font-medium text-xs font-body">{'Your Message'} *</label>
                    <textarea rows="4" value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 bg-white font-body text-sm text-mgm-dark placeholder:text-mgm-dark/25 resize-none ${formErrors.message ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : 'border-mgm-dark/10 focus:border-mgm-gold focus:ring-mgm-gold/15'}`}
                      placeholder="How can we help you?" />
                    {formErrors.message && <p className="text-red-500 text-[11px] font-body mt-1">{formErrors.message}</p>}
                  </div>
                  <button type="submit" className="btn-interactive w-full bg-mgm-dark text-white py-3.5 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20 mt-2">
                    {'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Right — Info Cards */}
            <div className="space-y-4">
              {[
                {
                  title: 'Call Us',
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  content: (
                    <div className="space-y-1.5">
                      {['0161-5047087', '+91 97803 00161', '+91 99888 81003'].map((p) => (
                        <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block font-body text-sm text-mgm-dark hover:text-mgm-gold transition-colors">{p}</a>
                      ))}
                    </div>
                  ),
                },
                {
                  title: 'Email',
                  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  content: (
                    <a href="mailto:customer.redressal@mgmfinanciers.com" className="font-body text-sm text-mgm-dark hover:text-mgm-gold transition-colors break-all">
                      customer.redressal@mgmfinanciers.com
                    </a>
                  ),
                },
                {
                  title: 'Main Office',
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  content: (
                    <p className="font-body text-sm text-mgm-dark/60 leading-relaxed">
                      Building No. 2566A, Mukt Ashram Street,<br />
                      Jagat Nagar, Basti Jodhewal,<br />
                      Ludhiana, Punjab – 141007
                    </p>
                  ),
                },
                {
                  title: 'Working Hours',
                  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                  content: (
                    <div className="space-y-1 font-body text-sm">
                      <div className="flex justify-between">
                        <span className="text-mgm-dark/60">Monday – Saturday</span>
                        <span className="text-mgm-dark">9:30 AM – 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mgm-dark/60">Sunday</span>
                        <span className="text-mgm-gold font-medium">Closed</span>
                      </div>
                    </div>
                  ),
                },
              ].map((card, i) => (
                <div
                  key={card.title}
                  className={`bg-white p-5 rounded-2xl border border-mgm-dark/5 hover:shadow-lg hover:shadow-mgm-dark/[0.04] hover:-translate-y-0.5 transition-all duration-300 ${anim(connectInView, 80 + i * 80)}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-mgm-dark flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-mgm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-mgm-dark text-sm">{card.title}</h3>
                  </div>
                  {card.content}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className={`mt-8 rounded-2xl overflow-hidden shadow-lg shadow-mgm-dark/[0.06] border border-mgm-dark/5 mx-16 sm:mx-28 lg:mx-40 ${anim(connectInView, 400)}`}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d213.90838297367694!2d75.86635064632476!3d30.92764362342236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a495bc981147%3A0x56fa8a79e56c20d9!2sMGM%20FINANCIERS%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1784250343322!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="MGM Financiers Main Branch Location"
          />
        </div>
      </section>
      <section ref={quoteRef} className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-mgm-light/20 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className={anim(quoteInView, 0)}>
            <svg className="w-10 h-10 mx-auto mb-6 text-mgm-gold/25" viewBox="0 0 40 40" fill="currentColor">
              <path d="M10.5 17.5C10.5 13.5 13 10.5 17 9.5L18 12C15.5 12.8 14.5 14.5 14.2 16.5H17V25H10.5V17.5ZM24.5 17.5C24.5 13.5 27 10.5 31 9.5L32 12C29.5 12.8 28.5 14.5 28.2 16.5H31V25H24.5V17.5Z" />
            </svg>
            <blockquote className="text-xl sm:text-2xl lg:text-[1.7rem] font-heading font-medium text-mgm-dark leading-relaxed tracking-tight mb-6">
              Great financial relationships are built on trust, transparency, and accessibility. Every conversation begins with understanding, and every solution begins with listening.
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-mgm-gold/30" />
              <span className="text-mgm-dark/40 font-body text-sm font-medium tracking-wide">MGM Financiers</span>
              <div className="w-8 h-px bg-mgm-gold/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 5 — QUICK HELP ━━━ */}
      <section ref={helpRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark font-heading tracking-tight mb-8 ${anim(helpInView, 0)}`}>{'Our Branches'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Apply for Loan', desc: 'Start your application online', to: '/services', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { title: 'EMI Calculator', desc: 'Calculate your monthly payments', to: '/emi-calculator', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
              { title: 'Pay EMI', desc: 'Make a secure online payment', to: '/pay-emi', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { title: 'Raise a Grievance', desc: 'Submit your concern securely', to: '/grievance', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
            ].map((card, i) => (
              <Link
                key={card.title}
                to={card.to}
                onClick={(e) => {
                  if (card.title === 'Apply for Loan') {
                    e.preventDefault()
                    window.dispatchEvent(new Event('open-apply'))
                  }
                }}
                className={`group bg-mgm-light/60 p-5 rounded-2xl border border-mgm-dark/5 hover:bg-mgm-dark hover:border-mgm-dark transition-all duration-300 hover:shadow-xl hover:shadow-mgm-dark/10 hover:-translate-y-0.5 ${anim(helpInView, (i + 1) * 80)}`}
              >
                <svg className="w-5 h-5 text-mgm-gold mb-3 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
                <h3 className="font-heading font-semibold text-mgm-dark text-sm mb-1 group-hover:text-white transition-colors duration-300">{card.title}</h3>
                <p className="text-mgm-dark/40 font-body text-xs group-hover:text-white/50 transition-colors duration-300 mb-3">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-mgm-gold font-body text-xs font-medium group-hover:text-mgm-gold transition-colors duration-300">
                  Learn more
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 6 — FINAL CTA ━━━ */}
      <section ref={ctaRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
        {/* Radial lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.04]" />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-white/[0.04]" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border border-mgm-gold/[0.05]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className={anim(ctaInView, 0)}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-4">
              Reach Out to Us
            </h2>
            <p className="text-white/40 font-body text-sm mb-8 max-w-md mx-auto">
              Have questions? We're here to help
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+919988881003" className="btn-interactive inline-flex items-center gap-2 bg-mgm-gold text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-gold/90 transition-all duration-200 shadow-lg shadow-mgm-gold/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a href="mailto:customer.redressal@mgmfinanciers.com" className="btn-interactive inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-white/[0.06] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a href="#presence" onClick={(e) => { e.preventDefault(); document.getElementById('presence')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-interactive inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-white/[0.06] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Locate Branch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
