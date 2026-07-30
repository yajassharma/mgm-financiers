import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
export default function ServiceHero({ service }) {
const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const a = (delay) => visible ? `opacity-100 translate-y-0 transition-all duration-700 ease-out` : `opacity-0 translate-y-6`
  const d = (i) => ({ transitionDelay: `${i * 100}ms` })

  return (
    <section ref={ref} className="pt-28 sm:pt-36 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: 2-col grid. Mobile: stacked per exact hierarchy */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* 1. Brand — mobile only */}
          <span className={`order-1 lg:hidden inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body ${a(0)}`} style={d(0)}>
            MGM Financiers
          </span>

          {/* 2. Heading — mobile only */}
          <h1 className={`order-2 lg:hidden text-3xl font-bold text-mgm-dark font-heading tracking-tight leading-[1.1] mb-2 ${a(0)}`} style={d(1)}>
            {service.name}
            <br />
            <span className="text-mgm-gold">{service.tagline}</span>
          </h1>

          {/* 3. Description — mobile only */}
          <p className={`order-3 lg:hidden text-mgm-dark/50 font-body text-sm leading-relaxed max-w-lg mb-4 ${a(0)}`} style={d(2)}>
            {service.shortDesc}
          </p>

          {/* 4. Image — mobile only */}
          <div className={`relative order-4 lg:hidden w-full ${a(0)}`} style={d(3)}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img src={service.heroImage} alt={service.name} className="w-full h-[260px] object-cover" loading="eager" />
            </div>
          </div>

          {/* 5. Buttons — mobile only */}
          <div className={`order-5 lg:hidden flex flex-col sm:flex-row gap-3 w-full ${a(0)}`} style={d(4)}>
            <button
              onClick={() => window.dispatchEvent(new Event('open-apply'))}
              className="px-6 py-3 bg-mgm-dark text-white rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/90 transition-all shadow-lg shadow-mgm-dark/20"
            >
              {'Apply Now'}
            </button>
            <Link to="/contact" className="px-6 py-3 border border-mgm-dark/15 text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/5 transition-all text-center">
              {'Learn More'}
            </Link>
          </div>

          {/* Desktop: grouped text + buttons */}
          <div className="hidden lg:block order-1">
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(0)}`} style={d(0)}>
              MGM Financiers
            </span>
            <h1 className={`text-5xl lg:text-[3.5rem] font-bold text-mgm-dark font-heading tracking-tight leading-[1.1] mb-6 ${a(0)}`} style={d(1)}>
              {service.name}
              <br />
              <span className="text-mgm-gold">{service.tagline}</span>
            </h1>
            <p className={`text-mgm-dark/50 font-body text-lg leading-relaxed max-w-lg mb-8 ${a(0)}`} style={d(2)}>
              {service.shortDesc}
            </p>
            <div className={`flex flex-row gap-3 ${a(0)}`} style={d(3)}>
              <button
                onClick={() => window.dispatchEvent(new Event('open-apply'))}
                className="px-8 py-3.5 bg-mgm-dark text-white rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/90 transition-all shadow-lg shadow-mgm-dark/20"
              >
                {'Apply Now'}
              </button>
              <Link to="/contact" className="px-8 py-3.5 border border-mgm-dark/15 text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-dark/5 transition-all text-center">
                {'Learn More'}
              </Link>
            </div>
          </div>

          {/* Desktop: image */}
          <div className={`relative hidden lg:block order-2 ${a(0)}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img src={service.heroImage} alt={service.name} className="w-full h-[500px] object-cover" loading="eager" />
            </div>
            <div className="absolute -bottom-5 -left-5 w-24 h-24 border-b-2 border-l-2 border-mgm-gold/20 rounded-bl-3xl hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
