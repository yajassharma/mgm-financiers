import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function ContactHome() {
  const [headingRef, headingInView] = useInView({ threshold: 0.3 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center">
          <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(headingInView, 0)}`}>
            Get In Touch
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-5 font-heading ${scrollAnim(headingInView, 80)}`}>
            Contact Us Today
          </h2>
          <p className={`text-mgm-dark/50 max-w-lg mx-auto font-body text-sm leading-relaxed mb-8 ${scrollAnim(headingInView, 160)}`}>
            Ready to take the next step? Get in touch with us today for a free consultation.
          </p>
          <div className={`flex flex-wrap justify-center gap-3 ${scrollAnim(headingInView, 240)}`}>
            <Link to="/contact"
              className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/90 transition-all duration-200 shadow-lg shadow-mgm-dark/15"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Our Team
            </Link>
            <Link to="/contact"
              className="btn-interactive inline-flex items-center gap-2 border border-mgm-dark/15 text-mgm-dark px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Locate Branches
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHome
