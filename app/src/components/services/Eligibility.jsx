import { useRef, useEffect, useState } from 'react'
export default function Eligibility({ service, eligibility }) {
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
    ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out'
    : 'opacity-0 translate-y-4'

  return (
    <section ref={ref} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(0)}`}>
              {'Eligibility Criteria'}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight mb-6 ${a(0)}`} style={{ transitionDelay: '80ms' }}>
              {`Check if you qualify for our ${service.name}`}
            </h2>
            <p className={`text-mgm-dark/45 font-body text-sm leading-relaxed mb-8 ${a(0)}`} style={{ transitionDelay: '120ms' }}>
              Our eligibility criteria are designed to be accessible while ensuring responsible lending. Speak with our relationship managers for a personalised assessment.
            </p>
          </div>
          <div className="space-y-4">
            {eligibility.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 ${a(0)}`} style={{ transitionDelay: `${150 + i * 60}ms` }}>
                <div className="w-6 h-6 rounded-full bg-mgm-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-mgm-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-mgm-dark/60 font-body text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
