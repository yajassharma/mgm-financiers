import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useCountUp from '../hooks/useCountUp'
import useSiteSettings from '../hooks/useSiteSettings'
import { EXECUTIVES, LEADERS } from '../data/team'

function LeadershipSVG({ prefersReduced }) {
  return (
    <svg viewBox="0 0 480 480" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="lsGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.02" />
        </linearGradient>
        <filter id="lsShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#1a1a2e" floodOpacity="0.06" />
        </filter>
      </defs>
      <g opacity="0.03">
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={`v${i}`} x1={40 + i * 48} y1="0" x2={40 + i * 48} y2="480" stroke="#1a1a2e" strokeWidth="0.5" />
        ))}
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={`h${i}`} x1="0" y1={40 + i * 48} x2="480" y2={40 + i * 48} stroke="#1a1a2e" strokeWidth="0.5" />
        ))}
      </g>
      <circle cx="360" cy="120" r="160" fill="#c9a227" opacity="0.018" />
      <g filter="url(#lsShadow)">
        <rect x="160" y="80" width="180" height="240" rx="8" fill="white" opacity="0.65" />
        <rect x="160" y="80" width="180" height="240" rx="8" fill="url(#lsGrad1)" />
        <path d="M190 280 L220 240 L250 255 L280 200 L310 170" fill="none" stroke="#c9a227" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <circle cx="190" cy="280" r="3" fill="#c9a227" opacity="0.4" />
        <circle cx="220" cy="240" r="3" fill="#c9a227" opacity="0.4" />
        <circle cx="250" cy="255" r="3" fill="#c9a227" opacity="0.4" />
        <circle cx="280" cy="200" r="3" fill="#c9a227" opacity="0.4" />
        <circle cx="310" cy="170" r="3.5" fill="#c9a227" opacity="0.5" />
        <rect x="185" y="110" width="40" height="3" rx="1.5" fill="#c9a227" opacity="0.4" />
        {[0,1,2].map(i => (
          <rect key={`d${i}`} x="185" y={128 + i * 18} width={80 + i * 10} height="3" rx="1.5" fill="#1a1a2e" opacity={0.05 + i * 0.005} />
        ))}
      </g>
      <g filter="url(#lsShadow)" style={{ animation: prefersReduced ? 'none' : 'lsFloat1 5s ease-in-out infinite' }}>
        <rect x="40" y="140" width="100" height="75" rx="6" fill="white" opacity="0.8" />
        <rect x="40" y="140" width="100" height="75" rx="6" fill="url(#lsGrad2)" />
        <path d="M90 158 L102 164 L102 178 Q102 186 90 190 Q78 186 78 178 L78 164 Z" fill="none" stroke="#c9a227" strokeWidth="1.2" opacity="0.4" />
        <path d="M85 174 L88 178 L96 168" fill="none" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </g>
      <g filter="url(#lsShadow)" style={{ animation: prefersReduced ? 'none' : 'lsFloat2 4.5s ease-in-out infinite' }}>
        <rect x="350" y="60" width="95" height="70" rx="6" fill="white" opacity="0.8" />
        <rect x="350" y="60" width="95" height="70" rx="6" fill="url(#lsGrad2)" />
        <circle cx="375" cy="88" r="4" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.4" />
        <circle cx="410" cy="78" r="3" fill="none" stroke="#1a1a2e" strokeWidth="0.8" opacity="0.2" />
        <circle cx="420" cy="100" r="3.5" fill="none" stroke="#c9a227" strokeWidth="0.8" opacity="0.35" />
        <line x1="375" y1="88" x2="410" y2="78" stroke="#c9a227" strokeWidth="0.6" opacity="0.25" />
        <line x1="375" y1="88" x2="420" y2="100" stroke="#c9a227" strokeWidth="0.6" opacity="0.25" />
        <line x1="410" y1="78" x2="420" y2="100" stroke="#1a1a2e" strokeWidth="0.5" opacity="0.12" />
      </g>
      <g filter="url(#lsShadow)" style={{ animation: prefersReduced ? 'none' : 'lsFloat3 5.5s ease-in-out infinite' }}>
        <rect x="50" y="320" width="90" height="65" rx="6" fill="white" opacity="0.8" />
        <rect x="50" y="320" width="90" height="65" rx="6" fill="url(#lsGrad1)" />
        {[0,1,2,3].map(i => (
          <rect key={`dl${i}`} x="68" y={338 + i * 11} width={50 + (i % 2) * 15} height="2.5" rx="1.25" fill="#1a1a2e" opacity={0.06 + i * 0.005} />
        ))}
        <rect x="68" y="330" width="25" height="2.5" rx="1.25" fill="#c9a227" opacity="0.35" />
      </g>
      <path d="M340 320 Q360 280 390 130" fill="none" stroke="#c9a227" strokeWidth="0.6" opacity="0.12" strokeDasharray="4 3" />
      <path d="M160 200 Q100 190 90 175" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />
      <path d="M240 80 Q150 100 60 145" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />
      {[
        { cx: 350, cy: 150, r: 3, o: 0.15 },
        { cx: 420, cy: 200, r: 2.5, o: 0.1 },
        { cx: 130, cy: 230, r: 2, o: 0.12 },
        { cx: 240, cy: 380, r: 2.5, o: 0.1 },
        { cx: 440, cy: 350, r: 2, o: 0.08 },
        { cx: 50, cy: 260, r: 2, o: 0.1 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#c9a227" opacity={dot.o}
          style={{ animation: prefersReduced ? 'none' : `lsPulse ${2 + i * 0.3}s ease-in-out infinite ${i * 0.4}s` }}
        />
      ))}
      <circle cx="420" cy="400" r="35" fill="none" stroke="#c9a227" strokeWidth="0.4" opacity="0.07" />
      <circle cx="420" cy="400" r="22" fill="none" stroke="#1a1a2e" strokeWidth="0.3" opacity="0.04" />
      <circle cx="80" cy="80" r="28" fill="none" stroke="#c9a227" strokeWidth="0.4" opacity="0.06" />
      <style>{`
        @keyframes lsFloat1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes lsFloat2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes lsFloat3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes lsPulse { 0%,100% { opacity: var(--o, 0.12); } 50% { opacity: calc(var(--o, 0.12) * 2); } }
      `}</style>
    </svg>
  )
}

function StatCounter({ value, suffix, label, startCounting, inView, delay }) {
  const count = useCountUp(value, 1200, startCounting)
  return (
    <div className={`text-center ${inView ? `anim-scroll-fade is-visible anim-delay-${delay}` : 'anim-scroll-fade'}`}>
      <div className="text-4xl sm:text-5xl font-bold text-mgm-dark font-heading tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-mgm-dark/40 font-body text-sm mt-1.5">{label}</div>
    </div>
  )
}

export default function Team() {
const prefersReduced = usePrefersReducedMotion()
  const { settings } = useSiteSettings()
  const STATS = [
    { value: settings.stats.yearsOfLending, suffix: '+', label: 'Years of Lending' },
    { value: settings.stats.customersServed, suffix: '+', label: 'Customers Served' },
    { value: settings.stats.employees, suffix: '+', label: 'Employees' },
    { value: settings.stats.operationalLocations, suffix: '+', label: 'Operational Locations' },
  ]

  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [execRef, execInView] = useInView({ threshold: 0.06 })
  const [leadersRef, leadersInView] = useInView({ threshold: 0.08 })
  const [statsRef, statsInView] = useInView({ threshold: 0.2 })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.15 })

  const anim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <SEO
        title="Our Team | Leadership & Experts | MGM Financiers"
        description="Meet the leadership team and experts behind MGM Financiers' 28 years of financial excellence. Our experienced professionals are committed to your financial growth."
        canonical="/team"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-mgm-gold/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-mgm-dark/[0.012] to-transparent" />
      </div>

      {/* ═══════ SECTION 1 — HERO ═══════ */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-5 ${anim(heroInView, 0)}`}>
                {'Our Esteemed Leaders'}
              </span>
              <h1 className={`text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-mgm-dark font-heading leading-[1.08] tracking-tight mb-6 ${anim(heroInView, 80)}`}>
                {'Guided by experience, driven by vision'}
              </h1>
              <p className={`text-mgm-dark/45 font-body text-[15px] leading-relaxed max-w-lg mb-9 ${anim(heroInView, 160)}`}>
                {'Meet the visionaries who have shaped MGM Financiers into a trusted financial institution over the past 28 years.'}
              </p>
              <div className={`flex flex-wrap gap-3 mb-10 ${anim(heroInView, 240)}`}>
                <a href="#leadership" onClick={(e) => { e.preventDefault(); document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/90 transition-all duration-200 shadow-lg shadow-mgm-dark/15">
                  Meet the Team
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <Link to="/contact" className="btn-interactive inline-flex items-center gap-2 border border-mgm-dark/12 text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/[0.03] transition-all duration-200">
                  Contact Our Team
                </Link>
              </div>
              <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 ${anim(heroInView, 320)}`}>
                {['28+ Years Experience', settings.rbiWording, '50+ Employees'].map((text, i) => (
                  <div key={text} className={`flex items-center gap-2 ${anim(heroInView, 320 + i * 80)}`}>
                    <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-mgm-dark/50 font-body text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className={`relative ${anim(heroInView, 200)}`}>
              <div className="relative">
                <div className="absolute -inset-5 rounded-3xl bg-mgm-gold/[0.03] -rotate-1" />
                <div className="absolute -inset-3 rounded-3xl bg-mgm-dark/[0.015] rotate-0.5" />
                <div className="absolute -inset-1 rounded-2xl border border-mgm-gold/[0.08]" />
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl shadow-mgm-dark/[0.08] border border-mgm-dark/[0.04]">
                  <img
                    src="/aboutusheroimg1.png"
                    alt="MGM Financiers Leadership"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-mgm-gold/30 rounded-br-xl" />
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-mgm-gold/30 rounded-tl-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2 — LEADERSHIP TEAM (6 people, 3+3) ═══════ */}
      <section id="leadership" ref={execRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-mgm-light/30">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-10 ${anim(execInView, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">
              {'Our Executive Team'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">
              {'Experienced professionals driving our success'}
            </h2>
          </div>

          {/* 3 per row desktop, 2 per row mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {EXECUTIVES.map((exec, i) => (
              <div
                key={exec.name}
                className={`group bg-white rounded-2xl border border-mgm-dark/[0.04] overflow-hidden hover:shadow-xl hover:shadow-mgm-dark/[0.06] hover:-translate-y-0.5 transition-all duration-500 ${anim(execInView, 40 + i * 60)}`}
              >
                <div className="relative overflow-hidden bg-mgm-light/50">
                  <img
                    src={exec.image}
                    alt={exec.name}
                    className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-heading font-bold text-mgm-dark text-sm sm:text-base">{exec.name}</h3>
                  <p className="text-mgm-gold font-body text-[11px] sm:text-xs tracking-wide uppercase mt-0.5">{exec.role}</p>
                  <p className="text-mgm-dark/35 font-body text-xs sm:text-sm leading-relaxed mt-2 italic">
                    &ldquo;{exec.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 3 — TEAM LEADERS (large cards, 3+2) ═══════ */}
      <section ref={leadersRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-10 ${anim(leadersInView, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">
              {'Our Leadership Team'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-3">
              {'Meet the visionaries driving MGM Financiers forward'}
            </h2>
            <p className="text-mgm-dark/40 font-body text-sm max-w-lg leading-relaxed">
              The strength of MGM is built through every relationship our team creates with customers across India.
            </p>
          </div>

          {/* Desktop: 3 per row, second row centered 2 */}
          <div className="hidden sm:block">
            {/* First row: 3 */}
            <div className="grid grid-cols-3 gap-5 mb-5">
              {LEADERS.slice(0, 3).map((leader, i) => (
                <div
                  key={leader.name}
                  className={`group bg-white rounded-2xl border border-mgm-dark/[0.04] overflow-hidden hover:shadow-xl hover:shadow-mgm-dark/[0.06] hover:-translate-y-0.5 transition-all duration-400 ${anim(leadersInView, 40 + i * 60)}`}
                >
                  <div className="relative overflow-hidden bg-mgm-light/50">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full aspect-[4/5] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-heading font-bold text-mgm-dark text-base">{leader.name}</h3>
                    <p className="text-mgm-dark/40 font-body text-xs mt-0.5">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Second row: 2 centered using flex */}
            <div className="flex justify-center gap-5">
              {LEADERS.slice(3, 5).map((leader, i) => (
                <div
                  key={leader.name}
                  className={`group bg-white rounded-2xl border border-mgm-dark/[0.04] overflow-hidden hover:shadow-xl hover:shadow-mgm-dark/[0.06] hover:-translate-y-0.5 transition-all duration-400 w-[calc(33.333%-10px)] ${anim(leadersInView, 220 + i * 60)}`}
                >
                  <div className="relative overflow-hidden bg-mgm-light/50">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full aspect-[4/5] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-heading font-bold text-mgm-dark text-base">{leader.name}</h3>
                    <p className="text-mgm-dark/40 font-body text-xs mt-0.5">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: 2 per row, last one centered */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              {LEADERS.slice(0, 4).map((leader) => (
                <div
                  key={leader.name}
                  className="bg-white rounded-2xl border border-mgm-dark/[0.04] overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-mgm-light/50">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full aspect-[3/4] object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-heading font-semibold text-mgm-dark text-xs leading-tight">{leader.name}</h3>
                    <p className="text-mgm-dark/40 font-body text-[10px] mt-0.5 leading-tight">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile: 5th centered */}
            <div className="flex justify-center mt-3">
              <div className="bg-white rounded-2xl border border-mgm-dark/[0.04] overflow-hidden w-[calc(50%-6px)]">
                <div className="relative overflow-hidden bg-mgm-light/50">
                  <img
                    src={LEADERS[4].image}
                    alt={LEADERS[4].name}
                    className="w-full aspect-[3/4] object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-heading font-semibold text-mgm-dark text-xs leading-tight">{LEADERS[4].name}</h3>
                  <p className="text-mgm-dark/40 font-body text-[10px] mt-0.5 leading-tight">{LEADERS[4].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 3B — OUR WIDER TEAM ═══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.04]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className={`inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 mb-5 ${anim(leadersInView, 280)}`}>
            <svg className="w-3.5 h-3.5 text-mgm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white/60 font-body text-xs">50+ Trusted Employees</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight mb-3 ${anim(leadersInView, 320)}`}>
            These are a few faces of MGM.
          </h3>
          <p className={`text-white/35 font-body text-sm max-w-lg mx-auto leading-relaxed ${anim(leadersInView, 360)}`}>
            Behind every loan we process, every customer we serve, and every branch we operate &mdash; there is a dedicated team working together to make MGM Financiers a name trusted across India.
          </p>
        </div>
      </section>

      {/* ═══════ SECTION 5 — MGM IN NUMBERS ═══════ */}
      <section ref={statsRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 ${anim(statsInView, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">
              Our Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">
              MGM in Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            {STATS.map((stat, i) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                startCounting={statsInView}
                inView={statsInView}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 6 — JOIN OUR JOURNEY ═══════ */}
      <section ref={ctaRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.04]" />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-white/[0.04]" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border border-mgm-gold/[0.05]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className={anim(ctaInView, 0)}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-4">
              The greatest institutions<br />are built by great people.
            </h2>
            <p className="text-white/40 font-body text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Every customer interaction, every financial solution and every relationship reflects the people behind MGM Financiers.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-interactive inline-flex items-center gap-2 bg-mgm-gold text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-mgm-gold/90 transition-all duration-200 shadow-lg shadow-mgm-gold/20">
                Contact Our Team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/services" className="btn-interactive inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm hover:bg-white/[0.06] transition-all duration-200">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
