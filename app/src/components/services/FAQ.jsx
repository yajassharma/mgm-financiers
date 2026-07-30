import { useState, useRef, useEffect } from 'react'
export default function FAQ({ questions }) {
const [open, setOpen] = useState(null)
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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(0)}`}>
            {'Got questions? We have answers'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight ${a(0)}`} style={{ transitionDelay: '80ms' }}>
            {'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {questions.map((faq, i) => (
            <div key={i} className={`border border-mgm-dark/5 rounded-2xl overflow-hidden ${a(0)}`} style={{ transitionDelay: `${100 + i * 60}ms` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-mgm-light/30 transition-colors"
              >
                <span className="font-heading font-semibold text-mgm-dark text-sm pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-mgm-gold flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${open === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-5 text-mgm-dark/50 font-body text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
