import useInView from '../hooks/useInView'
import useCountUp from '../hooks/useCountUp'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function About() {
  const [contentRef, contentInView] = useInView({ threshold: 0.2 })
  const [statsRef, statsInView] = useInView({ threshold: 0.3 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const yearsCount = useCountUp(28, 900, statsInView)
  const clientsCount = useCountUp(3, 900, statsInView)
  const loansCount = useCountUp(25, 900, statsInView)
  const complianceCount = useCountUp(100, 900, statsInView)

  const values = [
    { title: "Accountability", desc: "We take responsibility for every decision and outcome." },
    { title: "Promptitude", desc: "Quick response and fast-tracked processing for every client." },
    { title: "Transparency", desc: "No hidden charges. Clear terms, honest communication." },
  ]

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background circle */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-mgm-gold/[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top: Who Are We */}
        <div ref={contentRef} className="mb-20">
          {/* Image — full bleed on mobile, large on desktop */}
          <div className={`-mx-4 sm:mx-0 mb-10 sm:mb-14 ${scrollAnim(contentInView, 0)}`}>
            <div className="relative overflow-hidden sm:rounded-2xl shadow-2xl shadow-mgm-dark/10">
              <img
                src="/aboutusheroimg.png"
                alt="MGM Financiers team"
                className="w-full h-auto object-cover max-h-[500px] lg:max-h-[600px]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="max-w-3xl">
            <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(contentInView, 80)}`}>
              Who Are We
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(contentInView, 160)}`}>
              28 Years of Trust,<br className="hidden sm:block" /> Built on Simple Values
            </h2>
            <p className={`text-mgm-dark/60 mb-4 font-body text-sm leading-relaxed ${scrollAnim(contentInView, 240)}`}>
              MGM Financiers Private Limited has been in the business of loan financing for over 28 years.
              As an RBI-registered Non-Banking Financial Company (NBFC), we pride ourselves in being able to provide quality solutions
              that best suit our customers' needs.
            </p>
            <p className={`text-mgm-dark/60 mb-4 font-body text-sm leading-relaxed ${scrollAnim(contentInView, 280)}`}>
              At MGM we aim to not only resolve crisis but to help our customers grow as we grow.
              We provide our clients with not only instant financial assistance but also financial advice
              to help them utilise their funds the best.
            </p>
            <p className={`text-mgm-dark/60 mb-8 font-body text-sm leading-relaxed ${scrollAnim(contentInView, 320)}`}>
              We believe in accountability, promptitude, and simple systems. We take extra care to
              spend time with our customers to make sure we can offer them the best possible solutions.
              We ask for minimum documents, levy no hidden charges, and are absolutely transparent
              about our charges and terms of service.
            </p>

            {/* Values chips */}
            <div className={`flex flex-wrap gap-3 ${scrollAnim(contentInView, 380)}`}>
              {values.map((v, i) => (
                <div key={i} className="bg-mgm-light rounded-xl px-5 py-3 border border-mgm-dark/5">
                  <span className="font-semibold text-mgm-dark font-heading text-sm">{v.title}</span>
                  <span className="text-mgm-dark/40 font-body text-xs ml-2 hidden sm:inline">, {v.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom — Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`bg-mgm-light p-6 sm:p-7 rounded-2xl text-center ${scrollAnim(statsInView, 0)}`}>
            <div className="text-3xl sm:text-4xl font-bold text-mgm-dark mb-1 font-heading">{yearsCount}+</div>
            <div className="text-mgm-dark/50 font-body text-xs">Years of Excellence</div>
          </div>
          <div className={`bg-mgm-dark p-6 sm:p-7 rounded-2xl text-center ${scrollAnim(statsInView, 80)}`}>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-heading">{clientsCount},000+</div>
            <div className="text-white/40 font-body text-xs">Happy Clients</div>
          </div>
          <div className={`bg-mgm-gold p-6 sm:p-7 rounded-2xl text-center ${scrollAnim(statsInView, 160)}`}>
            <div className="text-3xl sm:text-4xl font-bold text-mgm-dark mb-1 font-heading">₹{loansCount}Cr+</div>
            <div className="text-mgm-dark/60 font-body text-xs">Disbursed</div>
          </div>
          <div className={`bg-mgm-light p-6 sm:p-7 rounded-2xl text-center ${scrollAnim(statsInView, 240)}`}>
            <div className="text-3xl sm:text-4xl font-bold text-mgm-dark mb-1 font-heading">{complianceCount}%</div>
            <div className="text-mgm-dark/50 font-body text-xs">RBI-registered NBFC</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
