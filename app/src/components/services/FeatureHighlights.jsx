import { useRef, useEffect, useState } from 'react'
export default function FeatureHighlights({ service }) {
const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const a = (i) => visible
    ? 'opacity-100 translate-y-0 transition-all duration-600 ease-out'
    : 'opacity-0 translate-y-6'

  return (
    <section ref={ref} className="py-12 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: text first, image below. Desktop: image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-start">
          {/* Text — first on mobile, first on desktop */}
          <div className="order-1 lg:order-1">
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-3 sm:mb-4 ${a(0)}`} style={{ transitionDelay: '100ms' }}>
              {'Key Features'}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-4 sm:mb-6 ${a(0)}`} style={{ transitionDelay: '150ms' }}>
              {`Why choose our ${service.name}`}
            </h2>
            <p className={`text-mgm-dark/45 font-body text-sm sm:text-sm leading-relaxed mb-6 sm:mb-10 ${a(0)}`} style={{ transitionDelay: '180ms' }}>
              {service.overviewDesc}
            </p>
            <div className="space-y-6 sm:space-y-8">
              {service.featureDetails.map((f, i) => (
                <div key={i} className={`flex gap-4 sm:gap-5 ${a(0)}`} style={{ transitionDelay: `${200 + i * 80}ms` }}>
                  <span className="text-mgm-gold/30 font-heading font-bold text-xl sm:text-2xl leading-none mt-1 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-mgm-dark text-sm sm:text-base mb-1 sm:mb-1.5">{f.title}</h3>
                    <p className="text-mgm-dark/45 font-body text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image — second on mobile, second on desktop */}
          <div className={`relative order-2 lg:order-2 ${a(0)}`} style={{ transitionDelay: '0ms' }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img src={service.overviewImage} alt={`${service.name} overview`} className="w-full h-[220px] sm:h-[450px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
