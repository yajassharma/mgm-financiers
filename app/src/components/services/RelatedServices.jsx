import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRelatedServices } from '../../data/services'

export default function RelatedServices({ service }) {
const related = getRelatedServices(service)
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
    : 'opacity-0 translate-y-4'

  if (!related.length) return null

  return (
    <section ref={ref} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-mgm-light/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(0)}`}>
            {'Explore our other financial solutions'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight ${a(0)}`} style={{ transitionDelay: '80ms' }}>
            {'Related Services'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {related.map((rel, i) => (
            <Link
              key={rel.id}
              to={`/services/${rel.id}`}
              className={`group relative overflow-hidden rounded-3xl h-64 sm:h-72 ${a(0)}`}
              style={{ transitionDelay: `${120 + i * 100}ms` }}
            >
              <img src={rel.heroImage} alt={rel.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-white font-heading font-bold text-xl sm:text-2xl mb-2">{rel.name}</h3>
                <p className="text-white/60 font-body text-sm mb-4 max-w-xs">{rel.shortDesc}</p>
                <span className="inline-flex items-center gap-2 text-mgm-gold font-body text-sm font-medium group-hover:gap-3 transition-all">
                  {'Learn More'}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
