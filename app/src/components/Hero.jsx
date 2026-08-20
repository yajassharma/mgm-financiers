import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function Hero() {
const prefersReduced = usePrefersReducedMotion()
  const [phoneChecks, setPhoneChecks] = useState([false, false, false, false])
  const [notifVisible, setNotifVisible] = useState(false)
  const [highlightRow, setHighlightRow] = useState(-1)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (prefersReduced || hasAnimated.current) return
    hasAnimated.current = true

    const timers = []

    // Step 1: Loan Request Submitted — check after 800ms
    timers.push(setTimeout(() => {
      setPhoneChecks(prev => { const n = [...prev]; n[0] = true; return n })
      setHighlightRow(0)
    }, 800))

    // Step 2: CIBIL Retrieved — 350ms later
    timers.push(setTimeout(() => {
      setPhoneChecks(prev => { const n = [...prev]; n[1] = true; return n })
      setHighlightRow(1)
    }, 1150))

    // Step 3: Eligibility Verified — 350ms later
    timers.push(setTimeout(() => {
      setPhoneChecks(prev => { const n = [...prev]; n[2] = true; return n })
      setHighlightRow(2)
    }, 1500))

    // Step 4: Loan Approved — 350ms later
    timers.push(setTimeout(() => {
      setPhoneChecks(prev => { const n = [...prev]; n[3] = true; return n })
      setHighlightRow(3)
    }, 1850))

    // Step 5: Money Credited notification — 350ms later
    timers.push(setTimeout(() => {
      setNotifVisible(true)
    }, 2200))

    return () => timers.forEach(clearTimeout)
  }, [prefersReduced])

  const headingClass = prefersReduced ? '' : 'anim-heading-enter'
  const paraClass = prefersReduced ? '' : 'anim-para-enter'
  const btnClass = prefersReduced ? '' : 'anim-btn-enter'
  const phoneClass = prefersReduced ? '' : 'anim-phone-settle'
  const cardClass = prefersReduced ? '' : 'anim-card-enter'
  const circlesClass = prefersReduced ? '' : 'anim-circles-settle'

  return (
    <div className="relative">
      <section id="home" className="relative bg-mgm-light overflow-hidden">

        {/* ==================== MOBILE LAYOUT ==================== */}
        <div className="md:hidden relative">
          {/* Background dots — always visible */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <svg className="absolute top-0 left-0 w-[300px] h-[300px] opacity-[0.1]" viewBox="0 0 300 300">
              <defs>
                <radialGradient id="dotFadeM" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0,0) scale(300,300)">
                  <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#1a1a2e" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {[...Array(8)].map((_, row) =>
                [...Array(10)].map((_, col) => (
                  <circle key={`m-${row}-${col}`} cx={col * 30 + 10} cy={row * 30 + 10} r="1" fill="url(#dotFadeM)"/>
                ))
              )}
            </svg>
          </div>


          {/* Concentric circles — visible, subtle scale settle */}
          <div className={`absolute left-1/2 top-[570px] -translate-x-1/2 pointer-events-none z-[1] scale-[0.55] ${circlesClass}`}>
            <div className="absolute w-[700px] h-[700px] -left-[350px] -top-[350px] rounded-full bg-mgm-gold/[0.03]"></div>
            <div className="absolute w-[630px] h-[630px] -left-[315px] -top-[315px] rounded-full bg-mgm-dark/[0.025]"></div>
            <div className="absolute w-[560px] h-[560px] -left-[280px] -top-[280px] rounded-full bg-mgm-gold/[0.04]"></div>
            <div className="absolute w-[480px] h-[480px] -left-[240px] -top-[240px] rounded-full bg-mgm-dark/[0.03]"></div>
            <div className="absolute w-[400px] h-[400px] -left-[200px] -top-[200px] rounded-full bg-mgm-gold/[0.05]"></div>
            <div className="absolute w-[320px] h-[320px] -left-[160px] -top-[160px] rounded-full bg-mgm-dark/[0.04]"></div>
            <div className="absolute w-[220px] h-[220px] -left-[110px] -top-[110px] rounded-full bg-mgm-gold/[0.06]"></div>
            <div className="absolute w-[100px] h-[100px] -left-[50px] -top-[50px] rounded-full bg-mgm-gold/[0.08]"></div>
          </div>

          {/* Mobile content — normal flow, all visible */}
          <div className="relative z-10 px-5 pt-28 pb-8">
            <h1 className={`text-[2rem] font-bold text-mgm-dark mb-3 leading-[1.1] font-heading tracking-tight ${headingClass}`}>
              {'Building Trust, Delivering Growth'}
            </h1>

            <p className={`text-base text-mgm-dark/80 mb-2 font-heading font-medium ${paraClass}`}>
              {'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation'}
            </p>

            <p className={`text-[13px] text-mgm-dark/45 mb-6 font-body leading-relaxed max-w-sm ${paraClass}`}>
              Loan Against Property, Personal Loans, Vehicle Loans & more. Competitive rates, fast processing, flexible repayment.
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/vision-mission"
                className={`btn-interactive bg-mgm-gold text-mgm-dark py-3.5 rounded-xl font-semibold hover:bg-mgm-gold/90 transition-all duration-200 text-center font-body text-sm shadow-lg shadow-mgm-gold/20 ${btnClass}`}>
                {'Why Choose Us?'}
              </Link>
              <button
                onClick={() => window.dispatchEvent(new Event('open-apply'))}
                className={`btn-interactive bg-mgm-dark text-white py-3.5 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 text-center font-body text-sm shadow-lg shadow-mgm-dark/20 ${btnClass}`}>
                {'Apply Now'}
              </button>
            </div>
          </div>

          {/* Phone image — visible, subtle settle */}
          <div className={`relative z-10 flex justify-center px-5 pb-8 ${phoneClass}`}>
            <div className="relative">
              <img
                src="/Hero Image Mgm.png"
                alt="MGM Financiers - Quick Loans"
                className="w-[110%] max-w-[580px] h-auto mx-auto"
              />
              {/* Instant Approval badge */}
              <div className="absolute -top-2 -right-30 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg shadow-black/5 border border-black/[0.04] flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-semibold text-mgm-dark font-heading leading-tight">Instant Approval</div>
                  <div className="text-[9px] text-mgm-dark/50 font-body">24/7 Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile statistics — visible */}
          <div className="relative z-10 px-5 pb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-mgm-dark font-heading">24hr</div>
                <div className="text-[10px] text-mgm-dark/50 font-body mt-0.5">Loan Approval</div>
              </div>
              <div>
                <div className="text-xl font-bold text-mgm-dark font-heading">100%</div>
                <div className="text-[10px] text-mgm-dark/50 font-body mt-0.5">RBI-registered NBFC</div>
              </div>
              <div>
                <div className="text-xl font-bold text-mgm-dark font-heading">3,000+</div>
                <div className="text-[10px] text-mgm-dark/50 font-body mt-0.5">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Mobile curved divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-[10px]">
              <path d="M0,25 C360,50 720,0 1080,25 C1260,35 1380,40 1440,32 L1440,60 L0,60 Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Mobile Trusted By — visible */}
        <div className="md:hidden bg-white relative z-20">
          <div className="px-5 py-10 text-center">
            <p className="text-[10px] text-mgm-dark/40 mb-4 font-body uppercase tracking-wider">Trusted by leading institutions</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-30">
              {['Kotak Mahindra Bank', 'Union Bank of India'].map((name) => (
                <div key={name} className="text-base font-bold text-mgm-dark font-heading trust-logo-hover">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== DESKTOP LAYOUT ==================== */}
        <div className="hidden md:block relative pt-40 pb-52 lg:pb-80">
          {/* L1: Background dots — always visible */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <svg className="absolute top-0 left-0 w-[700px] h-[600px] opacity-[0.3]" viewBox="0 0 700 600">
              <defs>
                <radialGradient id="dotFade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0,0) scale(700,600)">
                  <stop offset="0%" stopColor="#1a1a2e" stopOpacity="1"/>
                  <stop offset="60%" stopColor="#1a1a2e" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {[...Array(24)].map((_, row) =>
                [...Array(28)].map((_, col) => (
                  <circle key={`${row}-${col}`} cx={col * 25 + 12} cy={row * 25 + 12} r="1.5" fill="url(#dotFade)"/>
                ))
              )}
            </svg>
            <svg className="absolute top-1/3 left-1/4 w-4 h-4 opacity-20" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="8" fill="#c9a227"/>
            </svg>
            <svg className="absolute top-1/2 left-16 w-2 h-2 opacity-30" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" fill="#1e3a5f"/>
            </svg>
            <svg className="absolute top-40 right-1/3 w-6 h-6 opacity-10" viewBox="0 0 24 24">
              <path d="M12 2v20M2 12h20" stroke="#1a1a2e" strokeWidth="2"/>
            </svg>
            <svg className="absolute top-1/4 right-16 w-24 h-24 opacity-[0.04]" viewBox="0 0 100 100">
              <path d="M0,100 L100,0" stroke="#1a1a2e" strokeWidth="1"/>
              <path d="M20,100 L100,20" stroke="#1a1a2e" strokeWidth="1"/>
              <path d="M40,100 L100,40" stroke="#1a1a2e" strokeWidth="1"/>
            </svg>
          </div>

          {/* L2: Concentric circles — visible, subtle scale settle */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10`} style={{ transform: 'translate(22%, 10%)' }}>
            <div className="absolute w-[700px] h-[700px] rounded-full bg-mgm-gold/[0.04]"></div>
            <div className="absolute w-[630px] h-[630px] rounded-full bg-mgm-dark/[0.035]"></div>
            <div className="absolute w-[560px] h-[560px] rounded-full bg-mgm-gold/[0.06]"></div>
            <div className="absolute w-[480px] h-[480px] rounded-full bg-mgm-dark/[0.05]"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.08]"></div>
            <div className="absolute w-[320px] h-[320px] rounded-full bg-mgm-dark/[0.06]"></div>
            <div className="absolute w-[220px] h-[220px] rounded-full bg-mgm-gold/[0.1]"></div>
            <div className="absolute w-[100px] h-[100px] rounded-full bg-mgm-gold/[0.15]"></div>
          </div>

          {/* L4: Phone — visible, subtle settle */}
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className={`absolute right-0 lg:right-[10%] bottom-20 flex justify-end ${phoneClass}`} style={{ transform: 'translateX(4%)' }}>
              <img
                src="/Hero Image Mgm.png"
                alt="MGM Financiers - Quick Loans"
                className="w-full max-w-xl lg:max-w-2xl h-auto"
              />
            </div>
          </div>

          {/* L5: Floating cards — visible, subtle settle then occasional nudge */}
          <DesktopCards prefersReduced={prefersReduced} cardClass={cardClass} />

          {/* L6: Hero text — all visible, polish animations */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-30">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 lg:pt-12">
              <div className="w-full lg:w-[48%] lg:pr-4">
                <h1 className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-mgm-dark mb-4 leading-[1.1] font-heading tracking-tight ${headingClass}`}>
                  {'Building Trust, Delivering Growth'}
                </h1>

                <p className={`text-lg sm:text-xl text-mgm-dark/80 mb-3 max-w-md font-heading font-medium ${paraClass}`}>
                  {'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation'}
                </p>

                <p className={`text-[13px] text-mgm-dark/45 mb-8 max-w-sm font-body leading-relaxed ${paraClass}`}>
                  Loan Against Property, Personal Loans, Vehicle Loans & more. Competitive rates, fast processing, flexible repayment.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/vision-mission"
                    className={`btn-interactive bg-mgm-gold text-mgm-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-mgm-gold/90 transition-all duration-200 text-center font-body text-sm shadow-lg shadow-mgm-gold/20 ${btnClass}`}>
                    {'Why Choose Us?'}
                  </Link>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-apply'))}
                    className={`btn-interactive bg-mgm-dark text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 text-center font-body text-sm shadow-lg shadow-mgm-dark/20 ${btnClass}`}>
                    {'Apply Now'}
                  </button>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 mt-12 pt-8 border-t border-mgm-dark/5">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-mgm-dark font-heading">24hr</div>
                    <div className="text-xs text-mgm-dark/50 font-body">Loan Approval</div>
                  </div>
                  <div className="w-px h-10 bg-mgm-dark/10"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-mgm-dark font-heading">100%</div>
                    <div className="text-xs text-mgm-dark/50 font-body">RBI-registered NBFC</div>
                  </div>
                  <div className="w-px h-10 bg-mgm-dark/10"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-mgm-dark font-heading">3,000+</div>
                    <div className="text-xs text-mgm-dark/50 font-body">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* L7: Curved divider */}
          <div className="absolute bottom-0 left-0 right-0 z-[30] pointer-events-none">
            <svg viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none" className="w-full h-[140px] lg:h-[180px]">
              <path d="M0,60 C360,120 720,0 1080,60 C1260,85 1380,95 1440,80 L1440,160 L0,160 Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Desktop Trusted By — visible */}
        <div className="hidden md:block bg-white relative z-[30]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <p className="text-xs text-mgm-dark/40 mb-6 font-body uppercase tracking-wider">Trusted by leading institutions</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-30">
              {['Kotak Mahindra Bank', 'Union Bank of India'].map((name) => (
                <div key={name} className="text-xl font-bold text-mgm-dark font-heading trust-logo-hover">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}

/* Desktop floating cards , extracted for periodic nudge logic*/
function DesktopCards({ prefersReduced, cardClass }) {
  const [nudge, setNudge] = useState([false, false, false])
  const timersRef = useRef([])

  useEffect(() => {
    if (prefersReduced) return

    const scheduleNudge = (index, interval) => {
      const timer = setInterval(() => {
        setNudge(prev => {
          const n = [...prev]
          n[index] = true
          return n
        })
        setTimeout(() => {
          setNudge(prev => {
            const n = [...prev]
            n[index] = false
            return n
          })
        }, 400)
      }, interval)
      timersRef.current.push(timer)
    }

    // Each card nudges at different intervals: 12s, 14s, 13s
    // Stagger initial nudge so they don't all fire at once
    const t1 = setTimeout(() => scheduleNudge(0, 12000), 8000)
    const t2 = setTimeout(() => scheduleNudge(1, 14000), 10000)
    const t3 = setTimeout(() => scheduleNudge(2, 13000), 9000)
    timersRef.current.push(t1, t2, t3)

    return () => {
      timersRef.current.forEach(t => clearInterval(t))
      timersRef.current = []
    }
  }, [prefersReduced])

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <div className={`absolute hidden sm:block ${cardClass}`}
        style={{ right: 'calc(4% + 130px)', top: '50%' }}>
        <div className={`bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-black/5 border border-black/[0.04] flex items-center gap-3 ${nudge[0] ? 'anim-card-nudge' : ''}`}>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-mgm-dark font-heading leading-tight">Instant Approval</div>
            <div className="text-[11px] text-mgm-dark/50 font-body">24/7 Available</div>
          </div>
        </div>
      </div>

      <div className={`absolute hidden sm:block ${cardClass}`}
        style={{ left: '50%', bottom: '26%' }}>
        <div className={`bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-black/5 border border-black/[0.04] flex items-center gap-3 ${nudge[1] ? 'anim-card-nudge' : ''}`}>
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-mgm-dark font-heading leading-tight">RBI-registered NBFC</div>
            <div className="text-[11px] text-mgm-dark/50 font-body">100% Safe &amp; Secure</div>
          </div>
        </div>
      </div>

      <div className={`absolute hidden lg:block ${cardClass}`}
        style={{ left: '49%', top: '22%' }}>
        <div className={`bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-black/5 border border-black/[0.04] flex items-center gap-3 ${nudge[2] ? 'anim-card-nudge' : ''}`}>
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V3h4l5 8 5-8h4v18h-4V10l-5 8-5-8v11H3z" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-mgm-dark font-heading leading-tight">Made in India</div>
            <div className="text-[11px] text-mgm-dark/50 font-body">Trusted by 3,000+ Indians</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero