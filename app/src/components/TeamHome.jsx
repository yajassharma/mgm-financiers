import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { EXECUTIVES } from '../data/team'

function TeamHome() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const featured = EXECUTIVES.slice(0, 3)

  return (
    <section id="team" className="py-24 bg-mgm-light/30 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.025] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headingRef} className="text-center mb-14">
          <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(headingInView, 0)}`}>
            Our Leadership
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-5 font-heading ${scrollAnim(headingInView, 80)}`}>
            The People Behind MGM
          </h2>
          <p className={`text-mgm-dark/50 max-w-lg mx-auto font-body text-sm leading-relaxed mb-8 ${scrollAnim(headingInView, 160)}`}>
            28 years of trust, built by experienced professionals committed to transparency and customer success.
          </p>
        </div>

        {/* Featured leaders — desktop 3-col, mobile scroll */}
        <div className={`hidden sm:grid sm:grid-cols-3 gap-5 mb-10 ${scrollAnim(headingInView, 200)}`}>
          {featured.map((member) => (
            <div key={member.name} className="bg-white p-5 rounded-2xl border border-mgm-dark/[0.04] text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-mgm-light border-2 border-mgm-dark/[0.04]">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <p className="font-heading font-semibold text-mgm-dark text-sm">{member.name}</p>
              <p className="text-mgm-gold font-body text-[11px] tracking-wide uppercase mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none mb-8">
          {featured.map((member) => (
            <div key={member.name} className="flex-shrink-0 w-[130px] bg-white p-3 rounded-2xl border border-mgm-dark/[0.04] text-center snap-start">
              <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden bg-mgm-light border-2 border-mgm-dark/[0.04]">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <p className="font-heading font-semibold text-mgm-dark text-xs leading-tight">{member.name}</p>
              <p className="text-mgm-gold font-body text-[9px] tracking-wide uppercase mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>

        <div className={`text-center ${scrollAnim(headingInView, 280)}`}>
          <Link to="/team"
            className="btn-interactive inline-flex items-center gap-2 bg-mgm-dark text-white px-6 py-3 rounded-full font-body font-semibold text-sm hover:bg-mgm-dark/90 transition-all duration-200 shadow-lg shadow-mgm-dark/15"
          >
            Meet the Full Team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TeamHome
