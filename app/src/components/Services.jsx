import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function Services() {
const [headingRef, headingInView] = useInView({ threshold: 0.3 })
  const [gridRef, gridInView] = useInView({ threshold: 0.05 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const serviceIds = ['loan-against-property', 'personal-loan', 'vehicle-loan', 'gold-loan', 'construction-loan', 'consumer-durable-loan']

  const services = [
    {
      title: "Loan Against Property",
      description: "Loans against residential, commercial, and industrial properties. Funding up to 60% LTV with additional enhancement up to 10% on approval basis. Tenure up to 7 years + extension.",
      highlights: ["Up to 60% LTV", "Tenure up to 7 years", "Competitive rates"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <path d="M6 22L24 8L42 22" stroke="#1a1a2e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
          <path d="M10 20V40H38V20" stroke="#1a1a2e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
          <rect x="19" y="28" width="10" height="12" rx="1" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M19 34H29" stroke="#1a1a2e" strokeWidth="1"/>
          <circle cx="27" cy="31" r="1" stroke="#1a1a2e" strokeWidth="1"/>
          <path d="M14 20V16H20" stroke="#1a1a2e" strokeLinecap="round" strokeWidth="1" opacity="0.5"/>
          <path d="M28 16H34V20" stroke="#1a1a2e" strokeLinecap="round" strokeWidth="1" opacity="0.5"/>
        </svg>
      )
    },
    {
      title: "Personal Loans",
      description: "Designed for salaried and self-employed individuals. Quick approvals, minimal documentation, and CIBIL-based underwriting for fast processing.",
      highlights: ["Quick approvals", "Minimal documentation", "CIBIL-based"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <circle cx="24" cy="16" r="7" stroke="#1a1a2e" strokeWidth="1.5"/>
          <path d="M14 40C14 34.477 18.477 30 24 30C29.523 30 34 34.477 34 40" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M32 18L36 14L40 18" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          <path d="M36 14V22" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      )
    },
    {
      title: "Vehicle Loans",
      description: "New and used vehicle financing. Funding for new cars and commercial vehicles, plus simplified documentation for pre-owned vehicles.",
      highlights: ["New & used vehicles", "Commercial vehicles", "Simplified docs"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <path d="M8 30H40V34C40 35.657 38.657 37 37 37H11C9.343 37 8 35.657 8 34V30Z" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 30L14 22H34L38 30" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="15" cy="37" r="3" stroke="#1a1a2e" strokeWidth="1.5"/>
          <circle cx="33" cy="37" r="3" stroke="#1a1a2e" strokeWidth="1.5"/>
          <circle cx="15" cy="37" r="1" stroke="#1a1a2e" strokeWidth="1"/>
          <circle cx="33" cy="37" r="1" stroke="#1a1a2e" strokeWidth="1"/>
          <path d="M18 26H30" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        </svg>
      )
    },
    {
      title: "Gold Loans",
      description: "Quick loans against household gold ornaments. Fast disbursement, safe custody, and transparent valuation process.",
      highlights: ["Fast disbursement", "Safe custody", "Transparent valuation"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <rect x="10" y="30" width="28" height="8" rx="2" stroke="#1a1a2e" strokeWidth="1.5"/>
          <rect x="14" y="22" width="20" height="8" rx="2" stroke="#1a1a2e" strokeWidth="1.5"/>
          <rect x="18" y="14" width="12" height="8" rx="2" stroke="#1a1a2e" strokeWidth="1.5"/>
          <path d="M14 34H34" stroke="#1a1a2e" strokeWidth="0.75" opacity="0.3"/>
          <path d="M18 26H30" stroke="#1a1a2e" strokeWidth="0.75" opacity="0.3"/>
          <path d="M22 18H26" stroke="#1a1a2e" strokeWidth="0.75" opacity="0.3"/>
        </svg>
      )
    },
    {
      title: "Construction Loans",
      description: "Financing for construction of residential or commercial properties on your own land. Stage-wise disbursal with flexible loan options.",
      highlights: ["Residential plots", "Flexible options", "Quick approval"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <rect x="10" y="18" width="28" height="20" rx="2" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 18L24 8L38 18" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="18" y="28" width="12" height="10" rx="1" stroke="#1a1a2e" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M18 34H30" stroke="#1a1a2e" strokeWidth="1"/>
          <circle cx="26" cy="31" r="1" stroke="#1a1a2e" strokeWidth="1"/>
          <path d="M14 18V14H20" stroke="#1a1a2e" strokeLinecap="round" strokeWidth="1" opacity="0.5"/>
          <path d="M28 14H34V18" stroke="#1a1a2e" strokeLinecap="round" strokeWidth="1" opacity="0.5"/>
        </svg>
      )
    },
    {
      title: "Consumer Durable Loans",
      description: "Easy financing for essential household products and consumer durables. Helping families access appliances through affordable repayment plans.",
      highlights: ["Household products", "Affordable EMI", "Easy approval"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="service-icon">
          <rect x="6" y="12" width="36" height="22" rx="3" stroke="#1a1a2e" strokeWidth="1.5"/>
          <rect x="9" y="15" width="30" height="16" rx="1.5" stroke="#1a1a2e" strokeWidth="1"/>
          <path d="M20 38H28" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 34V38" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="23" r="4" stroke="#1a1a2e" strokeWidth="1" opacity="0.4"/>
          <path d="M22 23L23.5 24.5L26.5 21.5" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
        </svg>
      )
    }
  ]

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(headingInView, 0)}`}>
            What We Offer
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-5 font-heading ${scrollAnim(headingInView, 100)}`}>
            {'Our Comprehensive Financial Services'}
          </h2>
          <p className={`text-mgm-dark/50 max-w-lg mx-auto font-body text-sm leading-relaxed ${scrollAnim(headingInView, 200)}`}>
            {'Discover our tailored financial solutions designed to meet your specific needs'}
          </p>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {services.map((service, index) => (
            <Link
              key={index}
              to={`/services/${serviceIds[index]}`}
              className={`group relative bg-mgm-light border border-mgm-dark/5 p-4 sm:p-7 rounded-xl sm:rounded-2xl hover:bg-mgm-dark hover:border-mgm-dark transition-all duration-300 cursor-pointer block ${scrollAnim(gridInView, (index % 3) * 80 + 100)}`}
            >
              <div className="relative z-10 text-center">
                <div className="mb-3 sm:mb-5 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75 sm:scale-100">{service.icon}</div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-mgm-dark mb-1.5 sm:mb-2.5 font-heading group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-mgm-dark/50 font-body text-[11px] leading-relaxed group-hover:text-white/60 transition-colors mb-3">
                  {service.description}
                </p>
                {service.highlights && (
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                    {service.highlights.map((h, i) => (
                      <span key={i} className="text-[9px] sm:text-[11px] font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-mgm-gold/15 text-mgm-dark/70 border border-mgm-gold/20 group-hover:bg-white/15 group-hover:text-white/80 group-hover:border-white/20 transition-colors font-body">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        
        <div className={`text-center mt-12 ${scrollAnim(gridInView, 400)}`}>
          <Link to="/services" 
            className="inline-flex items-center gap-2 text-mgm-dark font-semibold text-sm hover:text-mgm-gold transition-colors font-body group"
          >
            {'View All Services'}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services