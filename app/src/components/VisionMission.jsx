import { Link } from 'react-router-dom'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
const MISSION_BLOCKS = [
  { num: '01', title: 'Understand Every Customer', desc: 'We listen before we lend. Every customer\u2019s circumstances, goals and concerns shape the guidance we provide.' },
  { num: '02', title: 'Provide Responsible Lending', desc: 'Every loan we structure is sustainable. We ensure borrowing empowers rather than overwhelms.' },
  { num: '03', title: 'Maintain Complete Transparency', desc: 'No hidden charges, no confusing terms. We believe informed customers make stronger decisions.' },
  { num: '04', title: 'Support Long-Term Financial Growth', desc: 'Our relationship deepens over time. We remain a trusted partner through every financial milestone.' },
]

export default function VisionMission() {
const prefersReduced = usePrefersReducedMotion()
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [whyRef, whyInView] = useInView({ threshold: 0.1 })
  const [visionRef, visionInView] = useInView({ threshold: 0.12 })
  const [missionRef, missionInView] = useInView({ threshold: 0.1 })
  const [commitRef, commitInView] = useInView({ threshold: 0.15 })

  const a = (inView, d = 0) => prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${d}`

  return (
    <div className="min-h-screen bg-white relative">
      <SEO
        title="Vision & Mission | Our Purpose & Values | MGM Financiers"
        description="Discover MGM Financiers' vision to be India's most trusted financial partner and our mission to provide accessible, transparent financial solutions for every Indian."
        canonical="/vision-mission"
      />

      {/* ═══════ S1 — FULL-WIDTH EDITORIAL HERO ═══════ */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Full-width image on top for mobile, side for desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-5 ${a(heroInView, 0)}`}>Our Purpose</span>
              <h1 className={`text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-mgm-dark font-heading leading-[1.06] tracking-tight mb-7 ${a(heroInView, 80)}`}>
                Building Financial Confidence,<br />One Relationship at a Time.
              </h1>
              <p className={`text-mgm-dark/45 font-body text-[15px] leading-relaxed max-w-xl mb-10 ${a(heroInView, 160)}`}>
                Every loan we approve represents more than financial assistance. It represents trust placed in us by individuals, families and businesses who aspire to move forward with confidence. Our purpose is to make that journey transparent, responsible and meaningful.
              </p>
              <div className={`flex flex-wrap gap-3 ${a(heroInView, 240)}`}>
                <a href="#philosophy" onClick={e => { e.preventDefault(); document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-8 py-3.5 rounded-full font-body font-semibold text-sm shadow-lg shadow-mgm-dark/15">
                  Explore Our Philosophy
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <Link to="/team" className="btn-interactive inline-flex items-center gap-2 border border-mgm-dark/12 text-mgm-dark px-8 py-3.5 rounded-full font-body font-semibold text-sm">
                  Meet Our Leadership
                </Link>
              </div>
            </div>
            <div className={`lg:col-span-2 order-1 lg:order-2 ${a(heroInView, 120)}`}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=700&h=900&fit=crop&crop=center"
                  alt="Team collaboration discussion"
                  className="w-full h-[320px] sm:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Trust bar below hero */}
        <div className={`max-w-7xl mx-auto mt-12 sm:mt-16 pb-12 sm:pb-20 border-b border-mgm-dark/[0.04] ${a(heroInView, 320)}`}>
          <div className="flex flex-wrap gap-8 sm:gap-14">
            {[
              { value: '28+', label: 'Years of Trust' },
              { value: '3,000+', label: 'Customers Served' },
              { value: '6', label: 'Branch Offices' },
              { value: 'RBI-registered NBFC', label: '' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold text-mgm-dark font-heading tracking-tight">{s.value}</div>
                <div className="text-mgm-dark/35 font-body text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ S2 — WHY WE EXIST (Wide image + overlay text) ═══════ */}
      <section id="philosophy" ref={whyRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-10 ${a(whyInView, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">Why We Exist</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">Beyond Lending.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start">
            <div className={`lg:col-span-2 ${a(whyInView, 80)}`}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1000&h=550&fit=crop&crop=center"
                  alt="Professional discussion"
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={`${a(whyInView, 160)}`}>
              <div className="space-y-4 text-mgm-dark/45 font-body text-[15px] leading-relaxed">
                <p>MGM Financiers was not founded to simply process loans. It was founded on the belief that financial assistance, when delivered with integrity, can transform lives.</p>
                <p>We exist because families need a partner they can trust when purchasing their first home. Because entrepreneurs need honest guidance when expanding their businesses.</p>
                <p>Every decision we make is guided by a single question: does this serve our customer's long-term wellbeing? This philosophy has defined us for twenty-eight years.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S3 — OUR VISION (Full-width centered dramatic) ═══════ */}
      <section ref={visionRef} className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-mgm-light/30 relative overflow-hidden">
        {/* Subtle architectural lines */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.025]" viewBox="0 0 1200 800" fill="none">
            <line x1="300" y1="0" x2="300" y2="800" stroke="currentColor" strokeWidth="0.5" className="text-mgm-gold" />
            <line x1="600" y1="0" x2="600" y2="800" stroke="currentColor" strokeWidth="0.5" className="text-mgm-gold" />
            <line x1="900" y1="0" x2="900" y2="800" stroke="currentColor" strokeWidth="0.5" className="text-mgm-gold" />
            <path d="M0 400 Q300 350 600 400 Q900 450 1200 400" stroke="currentColor" strokeWidth="0.5" className="text-mgm-gold" fill="none" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className={a(visionRef, 0)}>
            <div className="w-14 h-px bg-mgm-gold/30 mx-auto mb-8" />
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-5">{'Our Vision'}</span>
          </div>
          <blockquote className={`text-[1.5rem] sm:text-3xl lg:text-[2.4rem] font-heading font-medium text-mgm-dark leading-snug tracking-tight mb-12 ${a(visionRef, 100)}`}>
            &ldquo;{'To be the most trusted and preferred financial partner for individuals and businesses across India, empowering them to achieve their financial dreams through innovative, accessible, and responsible lending solutions.'}&rdquo;
          </blockquote>
          <div className={`w-10 h-px bg-mgm-gold/25 mx-auto mb-12 ${a(visionRef, 200)}`} />
          <p className={`text-mgm-dark/40 font-body text-[15px] leading-relaxed max-w-2xl mx-auto ${a(visionRef, 300)}`}>
            MGM Financiers envisions a future where every individual and family has access to fair, transparent financial solutions. We aim to build sustainable opportunities that empower responsible borrowing, strengthen communities and create lasting financial wellbeing across generations.
          </p>
        </div>
      </section>

      {/* ═══════ S4 — OUR MISSION (Alternating editorial blocks) ═══════ */}
      <section ref={missionRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 ${a(missionRef, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">{'Our Mission'}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">What Drives Us Forward</h2>
          </div>

          {/* Mission statement + image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 sm:mb-24">
            <div className={`${a(missionRef, 60)}`}>
              <blockquote className="text-2xl sm:text-[1.7rem] font-heading font-medium text-mgm-dark leading-snug tracking-tight mb-6">
                &ldquo;{'To provide accessible, transparent, and customer-centric financial solutions while maintaining the highest standards of integrity and corporate governance.'}&rdquo;
              </blockquote>
              <div className="w-10 h-px bg-mgm-gold/30" />
            </div>
            <div className={`${a(missionRef, 120)}`}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=550&fit=crop&crop=center"
                  alt="Financial planning documents"
                  className="w-full h-[300px] sm:h-[380px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* 4 mission blocks — horizontal on desktop, vertical on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
            {MISSION_BLOCKS.map((block, i) => (
              <div key={block.num} className={`${a(missionRef, 180 + i * 80)}`}>
                <div className="flex items-start gap-5 py-7">
                  <span className="flex-shrink-0 text-mgm-gold/25 font-heading font-bold text-2xl leading-none mt-0.5">{block.num}</span>
                  <div>
                    <h3 className="font-heading font-bold text-mgm-dark text-[15px] mb-2">{block.title}</h3>
                    <p className="text-mgm-dark/40 font-body text-[13.5px] leading-relaxed">{block.desc}</p>
                  </div>
                </div>
                {i < MISSION_BLOCKS.length - 1 && !(i === 1) && <div className="h-px bg-mgm-dark/[0.04]" />}
                {i === 1 && <div className="h-px bg-mgm-dark/[0.04] sm:hidden" />}
                {i < 2 && <div className="hidden sm:block h-px bg-mgm-dark/[0.04]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ S5 — THE MGM COMMITMENT (Dark emotional closing) ═══════ */}
      <section ref={commitRef} className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-mgm-gold/[0.02]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className={a(commitRef, 0)}>
            <svg className="w-12 h-12 mx-auto mb-8 text-mgm-gold/20" viewBox="0 0 48 48" fill="currentColor">
              <path d="M12.5 21C12.5 16 15.5 12 20 10.5L21.5 14C18.5 14.8 17 17 16.7 19.5H20V30H12.5V21ZM29.5 21C29.5 16 32.5 12 37 10.5L38.5 14C35.5 14.8 34 17 33.7 19.5H37V30H29.5V21Z" />
            </svg>
            <blockquote className="text-xl sm:text-2xl lg:text-[1.7rem] font-heading font-medium text-white leading-relaxed tracking-tight mb-8">
              Trust is earned through every conversation, every commitment and every promise we keep.
            </blockquote>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-8 h-px bg-mgm-gold/30" />
              <span className="text-white/40 font-body text-sm font-medium tracking-wide">MGM Financiers</span>
              <div className="w-8 h-px bg-mgm-gold/30" />
            </div>
          </div>
          <div className={`w-16 h-px bg-mgm-gold/20 mx-auto mb-12 ${a(commitRef, 100)}`} />
          <p className={`text-white/35 font-body text-[15px] leading-relaxed max-w-xl mx-auto mb-14 ${a(commitRef, 160)}`}>
            For more than 28 years, our purpose has remained unchanged &mdash; to help people move forward with confidence through ethical lending and meaningful financial relationships.
          </p>
          <div className={`flex flex-wrap justify-center gap-3 ${a(commitRef, 240)}`}>
            <Link to="/services" className="btn-interactive inline-flex items-center gap-2 bg-mgm-gold text-mgm-dark px-8 py-3.5 rounded-full font-body font-semibold text-sm shadow-lg shadow-mgm-gold/20">
              Explore Our Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link to="/contact" className="btn-interactive inline-flex items-center gap-2 border border-white/15 text-white px-8 py-3.5 rounded-full font-body font-semibold text-sm">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
