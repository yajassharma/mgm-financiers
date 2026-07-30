import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import SERVICES from '../data/services'
import Header from './Header'
import Footer from './Footer'

const OTHER_SERVICES_BG = [
  'from-blue-50 to-indigo-50',
  'from-slate-50 to-gray-50',
  'from-amber-50 to-yellow-50',
  'from-emerald-50 to-teal-50',
  'from-green-50 to-emerald-50',
  'from-violet-50 to-purple-50',
]

function IndividualService({ serviceId }) {
  const prefersReduced = usePrefersReducedMotion()
  const [openFaq, setOpenFaq] = useState(null)
  const [openDoc, setOpenDoc] = useState(0)

  const service = SERVICES.find(s => s.id === serviceId)
  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-mgm-dark font-heading mb-4">Service Not Found</h1>
          <Link to="/services" className="text-mgm-gold font-semibold font-body hover:underline">View All Services</Link>
        </div>
      </div>
    )
  }

  const relatedServices = (service.relatedServices || [])
    .map(id => SERVICES.find(s => s.id === id))
    .filter(Boolean)

  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [overviewRef, overviewInView] = useInView({ threshold: 0.1 })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1 })
  const [eligRef, eligInView] = useInView({ threshold: 0.1 })
  const [docsRef, docsInView] = useInView({ threshold: 0.1 })
  const [stepsRef, stepsInView] = useInView({ threshold: 0.1 })
  const [highlightsRef, highlightsInView] = useInView({ threshold: 0.1 })
  const [faqsRef, faqsInView] = useInView({ threshold: 0.1 })
  const [relatedRef, relatedInView] = useInView({ threshold: 0.1 })

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section ref={heroRef} className={`relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden bg-gradient-to-br ${service.heroGradient}`}>
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 right-[5%] w-[600px] h-[600px] rounded-full border border-mgm-dark/3 opacity-30" />
          <div className="absolute top-32 right-[8%] w-[400px] h-[400px] rounded-full border border-mgm-dark/3 opacity-20" />
          <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full border border-mgm-dark/3 opacity-15" />
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: `${service.accentColor}08` }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-mgm-dark/10 mb-6 ${scrollAnim(heroInView, 0)}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={service.iconPath} />
                </svg>
                <span className="text-xs font-semibold tracking-wide uppercase font-body" style={{ color: service.accentColor }}>{service.name}</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-mgm-dark font-heading leading-[1.1] mb-6 ${scrollAnim(heroInView, 100)}`}>
                {service.tagline}
              </h1>

              <p className={`text-mgm-dark/50 text-lg font-body leading-relaxed mb-8 max-w-lg ${scrollAnim(heroInView, 200)}`}>
                {service.description}
              </p>

              <div className={`flex flex-col sm:flex-row items-start gap-4 ${scrollAnim(heroInView, 300)}`}>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-apply'))}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm transition-all duration-200 font-body shadow-lg"
                  style={{ backgroundColor: service.accentColor, boxShadow: `0 10px 30px ${service.accentColor}30` }}>
                  Apply Now
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <Link to="/emi-calculator"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-mgm-dark/15 text-mgm-dark rounded-full font-semibold text-sm hover:bg-mgm-dark/5 transition-all duration-200 font-body">
                  EMI Calculator
                </Link>
              </div>

              {/* Feature chips */}
              <div className={`flex flex-wrap gap-2 mt-8 ${scrollAnim(heroInView, 350)}`}>
                {service.features.map((f, i) => (
                  <span key={i} className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/80 border border-mgm-dark/10 text-mgm-dark/70 font-body">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Illustration */}
            <div className={`relative hidden lg:flex items-center justify-center ${scrollAnim(heroInView, 200)}`}>
              <div className="relative w-[420px] h-[420px]">
                {/* Main illustration circle */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: `${service.accentColor}08` }}>
                  <svg className="w-32 h-32 opacity-30" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={service.iconPath} />
                  </svg>
                </div>

                {/* Floating feature cards */}
                {service.features.map((feat, i) => {
                  const positions = [
                    { top: '5%', left: '10%' },
                    { top: '15%', right: '0%' },
                    { bottom: '25%', left: '0%' },
                    { bottom: '10%', right: '10%' },
                  ]
                  return (
                    <div key={i}
                      className="absolute bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg shadow-black/5 border border-mgm-dark/5"
                      style={positions[i] || positions[0]}>
                      <span className="text-xs font-semibold text-mgm-dark font-body">{feat}</span>
                    </div>
                  )
                })}

                {/* Concentric decorative rings */}
                <div className="absolute inset-8 rounded-full border border-mgm-dark/3" />
                <div className="absolute inset-16 rounded-full border border-mgm-dark/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview with Image */}
      <section ref={overviewRef} className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className={`relative ${scrollAnim(overviewInView, 0)}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-mgm-dark/20 to-transparent" />
              </div>
              {/* Accent corner */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10" style={{ backgroundColor: `${service.accentColor}15` }} />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl -z-10" style={{ backgroundColor: `${service.accentColor}10` }} />
            </div>

            {/* Text */}
            <div className={scrollAnim(overviewInView, 100)}>
              <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">About This Loan</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-6 font-heading">
                {service.name} Overview
              </h2>
              <p className="text-mgm-dark/50 font-body leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-4">
                {service.highlights.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl bg-mgm-light/50 border border-mgm-dark/5">
                    <div className="text-xl font-bold font-heading" style={{ color: service.accentColor }}>{h.value}</div>
                    <div className="text-xs text-mgm-dark/50 font-body mt-1">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="py-20 sm:py-24 bg-mgm-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${scrollAnim(benefitsInView, 0)}`}>
            <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Benefits</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 font-heading">
              Why {service.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.benefits.map((benefit, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-white border border-mgm-dark/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 ${scrollAnim(benefitsInView, i * 80 + 100)}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${service.accentColor}10` }}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={benefit.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-mgm-dark font-heading mb-2">{benefit.title}</h3>
                <p className="text-mgm-dark/50 font-body text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section ref={eligRef} className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={scrollAnim(eligInView, 0)}>
              <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Eligibility</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-6 font-heading">
                Am I Eligible?
              </h2>
              <p className="text-mgm-dark/50 font-body leading-relaxed mb-8">
                Check if you meet the basic eligibility criteria for our {service.name.toLowerCase()}. Final approval is subject to document verification and credit assessment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.eligibility.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-mgm-light/50 border border-mgm-dark/5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${service.accentColor}10` }}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-mgm-dark/40 font-body">{item.label}</div>
                      <div className="text-sm font-semibold text-mgm-dark font-body">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative eligibility visual */}
            <div className={`relative hidden lg:flex items-center justify-center ${scrollAnim(eligInView, 100)}`}>
              <div className="relative w-[380px] h-[380px]">
                <div className="absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: `${service.accentColor}20` }}>
                  <div className="absolute inset-6 rounded-full border" style={{ borderColor: `${service.accentColor}10` }} />
                  <div className="absolute inset-12 rounded-full border border-dashed" style={{ borderColor: `${service.accentColor}15` }} />
                </div>
                {/* Checkmark icons */}
                {service.eligibility.map((_, i) => {
                  const angle = (i * (360 / service.eligibility.length)) - 90
                  const rad = (angle * Math.PI) / 180
                  const x = 50 + 42 * Math.cos(rad)
                  const y = 50 + 42 * Math.sin(rad)
                  return (
                    <div key={i} className="absolute w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section ref={docsRef} className="py-20 sm:py-24 bg-mgm-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className={scrollAnim(docsInView, 0)}>
              <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Documents</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-6 font-heading">
                Required Documents
              </h2>
              <p className="text-mgm-dark/50 font-body leading-relaxed mb-8">
                Keep these documents handy for a smooth application process. Originals will be verified and returned.
              </p>

              <div className="space-y-3">
                {service.documents.map((doc, i) => (
                  <div key={i} className="rounded-xl bg-white border border-mgm-dark/5 overflow-hidden">
                    <button
                      onClick={() => setOpenDoc(openDoc === i ? -1 : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-mgm-light/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${service.accentColor}10` }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-mgm-dark font-body">{doc.category}</span>
                      </div>
                      <svg className={`w-5 h-5 text-mgm-dark/30 transition-transform duration-200 ${openDoc === i ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openDoc === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 pb-4 pl-16">
                        <ul className="space-y-2">
                          {doc.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-mgm-dark/60 font-body">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={service.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second image */}
            <div className={`relative ${scrollAnim(docsInView, 100)}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sticky top-28">
                <img src={service.images[1]} alt={`${service.name} documents`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-mgm-dark/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl -z-10" style={{ backgroundColor: `${service.accentColor}15` }} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${scrollAnim(stepsInView, 0)}`}>
            <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 font-heading">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { num: '01', title: 'Apply Online', desc: 'Fill out our simple application form or visit a branch.' },
              { num: '02', title: 'Submit Documents', desc: 'Upload or submit required documents for verification.' },
              { num: '03', title: 'Get Approved', desc: 'Quick credit assessment and approval within 24-72 hours.' },
              { num: '04', title: 'Receive Funds', desc: 'Loan amount disbursed directly to your bank account.' },
            ].map((step, i) => (
              <div key={i} className={`text-center relative ${scrollAnim(stepsInView, i * 100 + 100)}`}>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[55%] w-[90%] h-px" style={{ backgroundColor: `${service.accentColor}15` }} />
                )}
                <div className="w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading relative z-10"
                  style={{ backgroundColor: service.accentColor }}>
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-mgm-dark font-heading mb-2">{step.title}</h3>
                <p className="text-mgm-dark/50 font-body text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Highlights */}
      <section ref={highlightsRef} className="py-20 sm:py-24" style={{ backgroundColor: `${service.accentColor}05` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${scrollAnim(highlightsInView, 0)}`}>
            <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">At a Glance</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 font-heading">
              {service.name} Highlights
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {service.highlights.map((h, i) => (
              <div key={i} className={`text-center p-6 rounded-2xl bg-white border border-mgm-dark/5 shadow-sm ${scrollAnim(highlightsInView, i * 80 + 100)}`}>
                <div className="text-3xl sm:text-4xl font-bold font-heading mb-2" style={{ color: service.accentColor }}>
                  {h.value}
                </div>
                <div className="text-sm text-mgm-dark/50 font-body">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section ref={faqsRef} className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${scrollAnim(faqsInView, 0)}`}>
            <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 font-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <div key={i} className={`rounded-xl border border-mgm-dark/5 overflow-hidden transition-all duration-200 ${openFaq === i ? 'bg-mgm-light/30 shadow-sm' : 'bg-white'} ${scrollAnim(faqsInView, i * 80 + 100)}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-mgm-dark font-body pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 text-mgm-dark/30 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-5 pb-5 text-sm text-mgm-dark/50 font-body leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Lending */}
      <section className="py-16 bg-mgm-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-6 h-6 text-mgm-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-semibold text-mgm-dark font-heading">Responsible Lending</span>
          </div>
          <p className="text-mgm-dark/50 font-body text-sm leading-relaxed max-w-2xl mx-auto">
            At MGM Financiers, we believe in responsible lending. We assess your repayment capacity to ensure the loan fits your financial situation.
            Please borrow responsibly and only what you can repay. If you face financial difficulties, contact us immediately.
          </p>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section ref={relatedRef} className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-14 ${scrollAnim(relatedInView, 0)}`}>
              <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Explore More</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 font-heading">
                Related Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {relatedServices.map((rel, i) => (
                <Link key={rel.id} to={`/services/${rel.id}`}
                  className={`group p-6 rounded-2xl border border-mgm-dark/5 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 ${scrollAnim(relatedInView, i * 100 + 100)}`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${rel.accentColor}10` }}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={rel.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={rel.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-mgm-dark font-heading mb-2 group-hover:text-mgm-gold transition-colors">{rel.name}</h3>
                  <p className="text-mgm-dark/50 font-body text-sm leading-relaxed mb-4">{rel.shortDesc}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold font-body" style={{ color: rel.accentColor }}>
                    Learn More
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-mgm-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-mgm-gold/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-6">
            Ready to Apply for a {service.name}?
          </h2>
          <p className="text-white/60 text-lg font-body mb-10 max-w-2xl mx-auto">
            Our relationship managers are ready to help you get started. Apply now or call us for a quick consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new Event('open-apply'))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-mgm-gold text-mgm-dark rounded-full font-semibold text-sm hover:bg-mgm-gold/90 transition-all duration-200 font-body shadow-lg shadow-mgm-gold/20">
              Apply Now
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="tel:+919876543210"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/15 text-white rounded-full font-semibold text-sm hover:bg-white/5 transition-all duration-200 font-body">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default IndividualService
