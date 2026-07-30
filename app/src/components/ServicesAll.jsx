import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import SEO from './SEO'
import Header from './Header'
import Footer from './Footer'
import { SERVICES } from '../data/services'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function a(visible, delay = 0) {
  return visible
    ? `opacity-100 translate-y-0 transition-all duration-600 ease-out`
    : `opacity-0 translate-y-5`
}

/* ═══════ S1 , HERO ═══════ */
function HeroSection() {
const [ref, visible] = useInView(0.15)
  return (
    <section ref={ref} className="pt-28 sm:pt-36 pb-8 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-20 items-center">
          {/* Mobile: ordered text items */}
          <span className={`order-1 lg:hidden inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body ${a(visible, 0)}`} style={{ transitionDelay: '0ms' }}>
            Our Services
          </span>
          <h1 className={`order-2 lg:hidden text-3xl font-bold text-mgm-dark font-heading tracking-tight leading-[1.1] mb-2 ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
            {'Our Comprehensive Financial Services'}
          </h1>
          <p className={`order-3 lg:hidden text-mgm-dark/50 font-body text-sm leading-relaxed max-w-lg mb-4 ${a(visible, 0)}`} style={{ transitionDelay: '120ms' }}>
            {'Discover our wide range of financial solutions designed to meet your every need. From personal loans to business financing, we\'ve got you covered.'}
          </p>

          {/* Desktop: grouped text */}
          <div className="hidden lg:block order-1">
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(visible, 0)}`} style={{ transitionDelay: '0ms' }}>
              Our Services
            </span>
            <h1 className={`text-5xl font-bold text-mgm-dark font-heading tracking-tight leading-[1.1] mb-6 ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
              {'Our Comprehensive Financial Services'}
            </h1>
            <p className={`text-mgm-dark/50 font-body text-lg leading-relaxed max-w-lg mb-8 ${a(visible, 0)}`} style={{ transitionDelay: '120ms' }}>
              {'Discover our wide range of financial solutions designed to meet your every need. From personal loans to business financing, we\'ve got you covered.'}
            </p>
            <div className={`flex flex-row gap-3 ${a(visible, 0)}`} style={{ transitionDelay: '200ms' }}>
              <Link to="/contact" className="px-8 py-3.5 bg-mgm-dark text-white rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/90 transition-all shadow-lg shadow-mgm-dark/20 text-center">
                {'Contact Us'}
              </Link>
              <button
                onClick={() => window.dispatchEvent(new Event('open-apply'))}
                className="px-8 py-3.5 border border-mgm-dark/15 text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/5 transition-all"
              >
                {'Apply Now'}
              </button>
            </div>
          </div>

          {/* Image */}
          <div className={`relative order-4 lg:order-2 w-full ${a(visible, 0)}`} style={{ transitionDelay: '160ms' }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img src="https://imgs.search.brave.com/7Mq4Wm18IdIbdMR_P5F_DSD7xmUWl4OTK6DSXqA2Dug/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/dGh1bWJfYmFjay9m/aDI2MC9iYWNrZ3Jv/dW5kLzIwMjQxMjEw/L3BuZ3RyZWUtYS1o/YW5kLXB1dHRpbmct/Y29pbi1pbnRvLXN0/YWNrLW9mLWNvaW5z/LXJlcHJlc2VudGlu/Zy1maW5hbmNpYWwt/Z3Jvd3RoLWltYWdl/XzE2NzM2NDI3Lmpw/Zw?w=800&h=1000&fit=crop&crop=center" alt="Financial consultation" className="w-full h-[220px] sm:h-[500px] object-cover" loading="eager" />
            </div>
          </div>

          {/* Mobile buttons */}
          <div className={`order-5 lg:hidden flex flex-col sm:flex-row gap-3 w-full ${a(visible, 0)}`} style={{ transitionDelay: '200ms' }}>
            <Link to="/contact" className="px-6 py-3 bg-mgm-dark text-white rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/90 transition-all shadow-lg shadow-mgm-dark/20 text-center">
              {'Contact Us'}
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('open-apply'))}
              className="px-6 py-3 border border-mgm-dark/15 text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/5 transition-all"
            >
              {'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════ S2 , SERVICE COLLECTION ═══════ */
function ServiceBlock({ service, index }) {
const [ref, visible] = useInView(0.1)
  const isReversed = index % 2 !== 0

  return (
    <div ref={ref} className="py-10 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-20 items-start">
          {/* Text group — mobile: stacked items; desktop: single left/right cell */}
          <div className={`order-1 ${isReversed ? 'lg:order-2' : 'lg:order-1'} w-full`}>
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-2 sm:mb-3 ${a(visible, 0)}`} style={{ transitionDelay: '0ms' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-3 sm:mb-4 ${a(visible, 0)}`} style={{ transitionDelay: '40ms' }}>
              {service.name}
            </h2>
            <p className={`text-mgm-dark/50 font-body text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-w-md ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
              {service.shortDesc}
            </p>
            <div className={`flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 ${a(visible, 0)}`} style={{ transitionDelay: '120ms' }}>
              {service.features.map((f) => (
                <span key={f} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-mgm-light/60 text-mgm-dark/60 text-[11px] sm:text-xs font-body font-medium rounded-full border border-mgm-dark/5">
                  {f}
                </span>
              ))}
            </div>
            <p className={`text-mgm-dark/40 font-body text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-md ${a(visible, 0)}`} style={{ transitionDelay: '160ms' }}>
              {service.overviewDesc.slice(0, 140)}...
            </p>
            <Link to={`/services/${service.id}`} className={`inline-flex items-center gap-2 text-mgm-gold font-body text-sm font-semibold hover:gap-3 transition-all ${a(visible, 0)}`} style={{ transitionDelay: '200ms' }}>
              {'Learn More'}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Image — second on mobile, alternates on desktop */}
          <div className={`relative order-2 ${isReversed ? 'lg:order-1' : 'lg:order-2'} w-full ${a(visible, 0)}`} style={{ transitionDelay: '0ms' }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img src={service.heroImage} alt={service.name} className="w-full h-[220px] sm:h-[420px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceCollection() {
  return (
    <section>
      {SERVICES.map((service, i) => (
        <ServiceBlock key={service.id} service={service} index={i} />
      ))}
    </section>
  )
}

/* ═══════ S3 , WHY MGM ═══════ */
function WhyMGM() {
const [ref, visible] = useInView(0.1)
  const rows = [
    { title: 'RBI Regulated', desc: 'Fully compliant with RBI regulations for your financial safety' },
    { title: 'Quick Approval', desc: 'Get loan approval within 48 hours of application' },
    { title: 'Competitive Rates', desc: 'Some of the best interest rates in the market' },
    { title: 'Transparent Process', desc: 'No hidden charges, clear terms and conditions' },
    { title: 'Customer First', desc: 'Dedicated relationship manager for every customer' },
    { title: 'Pan India Presence', desc: 'Serving customers across multiple states' },
  ]

  return (
    <section ref={ref} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-mgm-light/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(visible, 0)}`}>
            Why Choose Us
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
            {'Why Choose MGM Financiers'}
          </h2>
        </div>

        <div className="space-y-0">
          {rows.map((row, i) => (
            <div key={i} className={`py-8 border-b border-mgm-dark/5 last:border-0 text-center ${a(visible, 0)}`} style={{ transitionDelay: `${120 + i * 80}ms` }}>
              <div className="flex items-center justify-center gap-5">
                <div className="w-2 h-2 rounded-full bg-mgm-gold flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-mgm-dark text-lg sm:text-xl mb-2">{row.title}</h3>
                  <p className="text-mgm-dark/45 font-body text-sm leading-relaxed max-w-xl mx-auto">{row.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════ S4 , OUR APPROACH ═══════ */
function OurApproach() {
const [ref, visible] = useInView(0.1)
  return (
    <section ref={ref} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`relative ${a(visible, 0)}`}>
            <div className="relative overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center" alt="MGM consultation approach" className="w-full h-[350px] sm:h-[420px] object-cover" loading="lazy" />
            </div>
          </div>
          <div>
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
              Our Approach
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-6 ${a(visible, 0)}`} style={{ transitionDelay: '120ms' }}>
              Every Loan Begins<br />With Understanding.
            </h2>
            <div className={`space-y-4 text-mgm-dark/45 font-body text-sm leading-relaxed ${a(visible, 0)}`} style={{ transitionDelay: '160ms' }}>
              <p>Before we recommend any financial product, we take the time to understand your story , your goals, your concerns, your current financial landscape.</p>
              <p>This consultation-first approach means every solution we propose is tailored to your specific circumstances, not a generic template. It's why our customers trust us with their most important financial decisions.</p>
              <p>Clear communication, personal guidance, and responsible lending , that's how we've built relationships that last generation after generation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════ S5 , CTA ═══════ */
function CTASection() {
const [ref, visible] = useInView(0.15)
  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.03]" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative">
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading tracking-tight mb-4 ${a(visible, 0)}`}>
          {'Ready to Start Your Financial Journey?'}
        </h2>
        <p className={`text-white/40 font-body text-base sm:text-lg mb-10 ${a(visible, 0)}`} style={{ transitionDelay: '80ms' }}>
          {'Let us help you find the perfect financial solution'}
        </p>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${a(visible, 0)}`} style={{ transitionDelay: '160ms' }}>
          <Link to="/contact" className="px-8 py-3.5 bg-mgm-gold text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-gold/90 transition-all shadow-lg shadow-mgm-gold/20">
            {'Contact Us'}
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event('open-apply'))}
            className="px-8 py-3.5 border border-white/15 text-white rounded-full font-semibold text-sm font-body hover:bg-white/5 transition-all"
          >
            {'Apply Now'}
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══════ MAIN ═══════ */
export default function ServicesAll() {
return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Our Services | Personal Loan, Vehicle Loan, Gold Loan | MGM Financiers"
        description="Explore MGM Financiers loan products: Personal Loan, Vehicle Loan, Gold Loan, Loan Against Property, Construction Loan, and Consumer Durable Loan. Competitive rates, quick approval."
        canonical="/services"
      />
      <Header />
      <main>
        <HeroSection />
        <ServiceCollection />
        <WhyMGM />
        <OurApproach />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
