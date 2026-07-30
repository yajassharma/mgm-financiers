import { useRef, useEffect, useState } from 'react'
const STEPS = [
  { num: '01', title: 'Consultation', desc: 'Share your requirements with our relationship manager.' },
  { num: '02', title: 'Document Review', desc: 'We review your documentation with care and transparency.' },
  { num: '03', title: 'Eligibility Assessment', desc: 'Our team assesses your profile and loan eligibility.' },
  { num: '04', title: 'Verification', desc: 'Standard verification process for accuracy and compliance.' },
  { num: '05', title: 'Loan Processing', desc: 'Final approval and loan structuring based on your profile.' },
  { num: '06', title: 'Disbursement', desc: 'Funds disbursed directly to your account promptly.' },
]

export default function ProcessTimeline({ service }) {
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
    <section ref={ref} className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-mgm-light/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(0)}`}>
            {'Simple Process'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark font-heading tracking-tight ${a(0)}`} style={{ transitionDelay: '80ms' }}>
            {`How to get your ${service.name} in 6 easy steps`}
          </h2>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden sm:flex items-start justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex-1 text-center relative ${a(0)}`} style={{ transitionDelay: `${100 + i * 80}ms` }}>
              <div className="w-12 h-12 rounded-full bg-mgm-gold/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-mgm-gold font-heading font-bold text-sm">{step.num}</span>
              </div>
              <h3 className="font-heading font-semibold text-mgm-dark text-sm mb-1.5">{step.title}</h3>
              <p className="text-mgm-dark/40 font-body text-xs leading-relaxed px-2">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-mgm-gold/15" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="sm:hidden space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex gap-4 ${a(0)}`} style={{ transitionDelay: `${100 + i * 60}ms` }}>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-mgm-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-mgm-gold font-heading font-bold text-xs">{step.num}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-px flex-1 bg-mgm-gold/15 mt-2" />}
              </div>
              <div className="pb-2">
                <h3 className="font-heading font-semibold text-mgm-dark text-sm mb-1">{step.title}</h3>
                <p className="text-mgm-dark/40 font-body text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
