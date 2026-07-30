import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
export default function ServiceCTA({ service }) {
const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const a = (i) => visible
    ? 'opacity-100 translate-y-0 transition-all duration-600 ease-out'
    : 'opacity-0 translate-y-4'

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-mgm-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.03]" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative">
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading tracking-tight mb-4 ${a(0)}`}>
          {'Ready to Get Started?'}
        </h2>
        <p className={`text-white/40 font-body text-base sm:text-lg mb-10 ${a(0)}`} style={{ transitionDelay: '80ms' }}>
          {`Apply for our ${service.name} today and achieve your financial goals`}
        </p>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${a(0)}`} style={{ transitionDelay: '160ms' }}>
          <button
            onClick={() => window.dispatchEvent(new Event('open-apply'))}
            className="px-8 py-3.5 bg-mgm-gold text-mgm-dark rounded-full font-semibold text-sm font-body hover:bg-mgm-gold/90 transition-all shadow-lg shadow-mgm-gold/20"
          >
            {'Apply Now'}
          </button>
          <Link to="/contact" className="px-8 py-3.5 border border-white/15 text-white rounded-full font-semibold text-sm font-body hover:bg-white/5 transition-all">
            {'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  )
}
