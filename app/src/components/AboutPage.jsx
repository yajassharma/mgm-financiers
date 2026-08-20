import { Link } from 'react-router-dom'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const MILESTONES = [
  { year: '1996', title: 'Foundation', desc: 'Established with a vision to make financial assistance accessible and honest.' },
  { year: '2005', title: 'Customer Growth', desc: 'Thousands of families and entrepreneurs trust us with their financial futures.' },
  { year: '2012', title: 'Regional Expansion', desc: 'Extended our reach across Punjab, Rajasthan, Haryana and Maharashtra.' },
  { year: '2013', title: 'Navi Mumbai Expansion', desc: 'Expanded operations to Navi Mumbai, strengthening our Maharashtra presence.' },
  { year: '2018', title: 'Branch Network', desc: 'Built a network of offices to serve customers with local, personal attention.' },
  { year: '2022', title: 'Digital Transformation', desc: 'Embraced technology to make processes faster while keeping the human touch.' },
  { year: '2025', title: 'Sri Ganganagar', desc: 'Expanded to Sri Ganganagar, Rajasthan.' },
  { year: '2026', title: 'Multi-City Expansion', desc: 'Expanded to Jaipur, Kota and Jhalawar in Rajasthan, and Gurugram in Haryana.' },
  { year: 'Today', title: 'Trusted Institution', desc: '3,000+ customers, 50+ employees, and a legacy built on relationships.' },
]

const PRINCIPLES = [
  { title: 'Customer First', desc: 'Every process, every product and every interaction begins with the customer. Their success defines ours.' },
  { title: 'Transparency', desc: 'No hidden charges. No confusing terms. We believe informed customers make better decisions.' },
  { title: 'Integrity', desc: 'We conduct business with unwavering ethical standards. Every decision reflects who we are.' },
  { title: 'Long-Term Relationships', desc: 'We build partnerships that grow stronger with every interaction, every year, every generation.' },
]

export default function AboutPage() {
const prefersReduced = usePrefersReducedMotion()
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [storyRef, storyInView] = useInView({ threshold: 0.1 })
  const [ceoRef, ceoInView] = useInView({ threshold: 0.15 })
  const [prinRef, prinInView] = useInView({ threshold: 0.08 })
  const [timeRef, timeInView] = useInView({ threshold: 0.1 })
  const [relRef, relInView] = useInView({ threshold: 0.1 })
  const [promiseRef, promiseInView] = useInView({ threshold: 0.15 })

  const a = (inView, d = 0) => prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${d}`

  return (
    <div className="min-h-screen bg-white relative">
      <SEO
        title="About Us | Our Story, Values & Journey | MGM Financiers"
        description="Learn about MGM Financiers' 28-year journey of financial excellence. Discover our mission, values, and commitment to serving India's financial needs since 1996."
        canonical="/about"
      />
      {/* ═══════ S1 — HERO ═══════ */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-5 ${a(heroInView, 0)}`}>{'About MGM Financiers'}</span>
              <h1 className={`text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-mgm-dark font-heading leading-[1.08] tracking-tight mb-6 ${a(heroInView, 80)}`}>
                Built on Trust.<br />Growing Through Relationships.
              </h1>
              <p className={`text-mgm-dark/45 font-body text-[15px] leading-relaxed max-w-lg mb-9 ${a(heroInView, 160)}`}>
                {'28 years of trust, growth, and unwavering commitment to our customers\' financial success'}
              </p>
              <div className={`flex flex-wrap gap-3 mb-10 ${a(heroInView, 240)}`}>
                <a href="#our-story" onClick={e => { e.preventDefault(); document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm shadow-lg shadow-mgm-dark/15">
                  Explore Our Story
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <Link to="/team" className="btn-interactive inline-flex items-center gap-2 border border-mgm-dark/12 text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm">
                  Meet Our Leadership
                </Link>
              </div>
              <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 ${a(heroInView, 320)}`}>
                {['28+ Years', 'RBI-registered NBFC', 'Customer-First Philosophy'].map((t, i) => (
                  <div key={t} className={`flex items-center gap-2 ${a(heroInView, 320 + i * 80)}`}>
                    <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-mgm-dark/50 font-body text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`relative ${a(heroInView, 200)}`}>
              <div className="relative overflow-hidden rounded-2xl">
                <img src="/mgmbuild.png" alt="Modern financial headquarters" className="w-full h-[400px] sm:h-[500px] object-cover" loading="lazy" style={{ filter: 'grayscale(200%)' }} />
              </div>
              {/* Subtle accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-mgm-gold/20 rounded-br-2xl hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S2 — OUR STORY ═══════ */}
      <section id="our-story" ref={storyRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`order-2 lg:order-1 ${a(storyInView, 100)}`}>
              <div className="relative overflow-hidden rounded-2xl">
                <img src="/mgmbuild2.png" alt="Financial planning and review" className="w-full h-[350px] sm:h-[420px] object-cover" loading="lazy" /
                >
              </div>
            </div>
            <div className={`order-1 lg:order-2 ${a(storyInView, 0)}`}>
              <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4">{'Our Journey'}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-6">Where We Started,<br />Where We Stand</h2>
              <div className="space-y-4 text-mgm-dark/45 font-body text-[15px] leading-relaxed">
                <p>MGM Financiers began with a simple belief: that financial assistance should be accessible, honest and built on genuine relationships. What started as a small lending institution has grown into a trusted name serving communities across multiple states.</p>
                <p>Over twenty-eight years, we have walked alongside families buying their first homes, entrepreneurs expanding their businesses, and individuals navigating life's unexpected moments. Every loan we process carries a promise &mdash; that we are invested in our customers' success, not just their repayment.</p>
                <p>Our growth has been deliberate. We expanded when we could maintain quality. We added branches where we could offer personal attention. And we embraced technology where it helped us serve customers faster without losing the human touch that defines us.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S3 — CEO PORTRAIT ═══════ */}
      <section ref={ceoRef} className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-mgm-light/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text first on mobile, image first on desktop */}
            <div className={`order-1 lg:order-1 ${a(ceoRef, 100)}`}>
              <svg className="w-14 h-14 text-mgm-gold/25 mb-6" viewBox="0 0 56 56" fill="currentColor">
                <path d="M14.5 24.5C14.5 18.5 18 14 23 12L25 16.5C21 17.5 19 20 18.7 22.5H23V35H14.5V24.5ZM33.5 24.5C33.5 18.5 37 14 42 12L44 16.5C40 17.5 38 20 37.7 22.5H42V35H33.5V24.5Z" />
              </svg>
              <blockquote className="text-2xl sm:text-3xl lg:text-[2rem] font-heading font-medium text-mgm-dark leading-snug tracking-tight mb-8">
                We believe we're in the business of catapulting people to a better life. Every loan we write is a promise to someone's future.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-mgm-gold/40" />
                <div>
                  <p className="font-heading font-bold text-mgm-dark text-sm">Kushinder Paul Mohindra</p>
                  <p className="text-mgm-gold font-body text-xs tracking-wide uppercase mt-0.5">Chief Executive Officer</p>
                </div>
              </div>
            </div>
            {/* Image second on mobile, second on desktop */}
            <div className={`order-2 lg:order-2 ${a(ceoRef, 0)}`}>
              <div className="relative">
                <img
                  src="/Team members mgm/Kushinder Paul Mohindra.png"
                  alt="Kushinder Paul Mohindra, CEO"
                  className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0 aspect-[3/4] object-cover object-top rounded-sm"
                  style={{ filter: 'grayscale(100%)' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S5 — WHAT WE STAND FOR ═══════ */}
      <section ref={prinRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-12 ${a(prinRef, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">{'Our Guiding Principles'}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">The Principles That Guide<br className="hidden sm:block" /> Every Decision</h2>
          </div>
          {/* Editorial layout: 2x2 with generous spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className={`${a(prinRef, 60 + i * 80)}`}>
                <div className="flex items-start gap-4">
                  <span className="text-mgm-gold/30 font-heading font-bold text-3xl leading-none mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-heading font-bold text-mgm-dark text-lg mb-2">{p.title}</h3>
                    <p className="text-mgm-dark/40 font-body text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ S6 — OUR HERITAGE ═══════ */}
      <section ref={timeRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-mgm-light/30">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 ${a(timeInView, 0)}`}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3">{'Key milestones in our growth story'}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight">Milestones That Define Us</h2>
          </div>
          {/* Desktop: horizontal */}
          <div className="hidden sm:block">
            <div className="relative">
              <div className="absolute top-[28px] left-0 right-0 h-px bg-mgm-gold/15" />
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
                {MILESTONES.map((m, i) => (
                  <div key={m.year} className={`relative text-center ${a(timeInView, 40 + i * 80)}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-mgm-gold mx-auto mb-5 relative z-10" />
                    <span className="text-mgm-gold font-heading font-bold text-sm">{m.year}</span>
                    <h3 className="font-heading font-semibold text-mgm-dark text-sm mt-1 mb-2">{m.title}</h3>
                    <p className="text-mgm-dark/35 font-body text-xs leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Mobile: vertical */}
          <div className="sm:hidden space-y-6">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`flex gap-4 ${a(timeInView, 40 + i * 60)}`}>
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-mgm-gold flex-shrink-0" />
                  {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-mgm-gold/15 mt-1" />}
                </div>
                <div className="pb-2">
                  <span className="text-mgm-gold font-heading font-bold text-xs">{m.year}</span>
                  <h3 className="font-heading font-semibold text-mgm-dark text-sm mt-0.5">{m.title}</h3>
                  <p className="text-mgm-dark/35 font-body text-xs leading-relaxed mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ S7 — HOW WE WORK ═══════ */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4">Our Approach</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-8">
                Built Around<br />Your Needs
              </h2>
              <div className="space-y-6">
                {[
                  { num: '01', title: 'Listen First', desc: 'Every engagement begins with understanding. We take the time to hear your story, your goals and your concerns before suggesting anything.' },
                  { num: '02', title: 'Tailor the Solution', desc: 'No two customers are alike. We structure every loan and service around your specific circumstances, not a generic template.' },
                  { num: '03', title: 'Stay Connected', desc: 'Our relationship does not end at disbursal. We remain a call away for guidance, support and the next chapter of your financial journey.' },
                ].map((item, i) => (
                  <div key={item.num} className="flex gap-5">
                    <span className="text-mgm-gold/30 font-heading font-bold text-2xl leading-none mt-1">{item.num}</span>
                    <div>
                      <h3 className="font-heading font-bold text-mgm-dark text-base mb-1">{item.title}</h3>
                      <p className="text-mgm-dark/40 font-body text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/mgmoff.png"
                  alt="Team collaboration"
                  className="w-full h-[350px] sm:h-[480px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S8 — RELATIONSHIPS THAT LAST ═══════ */}
      <section ref={relRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={a(relRef, 0)}>
            <span className="inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4">Our Culture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-6">Relationships That Last</h2>
            <div className="space-y-4 text-mgm-dark/45 font-body text-[15px] leading-relaxed">
              <p>Every customer who walks through our doors receives more than a loan. They receive a relationship &mdash; one built on personal guidance, complete transparency and genuine care for their financial wellbeing.</p>
              <p>We don't believe in one-size-fits-all solutions. Our relationship managers take the time to understand each customer's unique circumstances, goals and concerns before recommending a path forward.</p>
              <p>This philosophy is why customers return to us generation after generation. It's why families refer their neighbours. It's why businesses trust us with their growth. The relationship doesn't end when the loan is disbursed &mdash; it deepens.</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {[
                { num: '01', label: 'Personal Guidance' },
                { num: '02', label: 'Transparent Process' },
                { num: '03', label: 'Responsible Borrowing' },
              ].map((item) => (
                <div key={item.num} className="flex items-center gap-3">
                  <span className="text-mgm-gold/40 font-heading font-bold text-xs">{item.num}</span>
                  <span className="text-mgm-dark/60 font-body text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ S9 — THE MGM PROMISE ═══════ */}
      <section ref={promiseRef} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-mgm-gold/[0.03]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className={a(promiseRef, 0)}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-3">
              Our commitment doesn't end with loan approval.
            </h2>
            <p className="text-mgm-gold font-heading text-xl sm:text-2xl font-medium italic mb-12">It begins there.</p>
          </div>
          <div className={`w-16 h-px bg-mgm-gold/25 mx-auto mb-12 ${a(promiseRef, 80)}`} />
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14 ${a(promiseRef, 120)}`}>
            {[
              { title: 'Transparent Processes', desc: 'Every step, every charge, every timeline clearly communicated from day one.' },
              { title: 'Responsible Lending', desc: 'We ensure every loan is sustainable, protecting both customer and relationship.' },
              { title: 'Long-Term Relationships', desc: 'Our partnership continues long after the loan is disbursed.' },
            ].map((p, i) => (
              <div key={p.title}>
                <span className="text-mgm-gold/30 font-heading font-bold text-2xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-heading font-bold text-white text-sm mt-2 mb-2">{p.title}</h3>
                <p className="text-white/30 font-body text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className={`flex flex-wrap justify-center gap-3 ${a(promiseRef, 200)}`}>
            <Link to="/contact" className="btn-interactive inline-flex items-center gap-2 bg-mgm-gold text-mgm-dark px-7 py-3.5 rounded-full font-body font-semibold text-sm shadow-lg shadow-mgm-gold/20">
              Contact Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link to="/services" className="btn-interactive inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-full font-body font-semibold text-sm">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
