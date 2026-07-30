import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function LegalPage({ title, lastUpdated, children }) {
  const prefersReduced = usePrefersReducedMotion()
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [contentRef, contentInView] = useInView({ threshold: 0.05 })

  const a = (inView, d = 0) => prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${d}`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section ref={heroRef} className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-mgm-dark/[0.04]">
        <div className="max-w-4xl mx-auto">
          <span className={`inline-block text-mgm-gold font-semibold text-[11px] tracking-[0.2em] uppercase font-body mb-4 ${a(heroInView, 0)}`}>Legal</span>
          <h1 className={`text-3xl sm:text-4xl lg:text-[2.8rem] font-bold text-mgm-dark font-heading tracking-tight mb-4 ${a(heroInView, 80)}`}>
            {title}
          </h1>
          {lastUpdated && (
            <p className={`text-mgm-dark/35 font-body text-sm ${a(heroInView, 160)}`}>Last updated: {lastUpdated}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto prose-mgm ${a(contentRef, 80)}`}>
          {children}
        </div>
      </section>
    </div>
  )
}
