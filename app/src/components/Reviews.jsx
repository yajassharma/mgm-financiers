import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const REVIEWS = [
  {
    name: 'Ramesh Verma',
    location: 'Jaipur, Rajasthan',
    text: 'We needed funds to expand our small shop into a proper store. The team at MGM made the entire process feel effortless. Within days, we had the money and within weeks, the new store was running.',
  },
  {
    name: 'Priya Nair',
    location: 'Navi Mumbai, Maharashtra',
    text: 'I was nervous about applying for a loan for the first time, but MGM walked me through everything. No hidden charges, no confusion. Just a straightforward process that got me the funds I needed for my daughter\'s education.',
  },
  {
    name: 'Sukhdev Singh',
    location: 'Ludhiana, Punjab',
    text: 'When my father fell ill, I needed money quickly. MGM Financiers didn\'t make me run around for documents. They understood the urgency and helped me get the loan approved without unnecessary delays.',
  },
  {
    name: 'Meena Devi',
    location: 'Kota, Rajasthan',
    text: 'I wanted to renovate our home before my son\'s wedding. MGM gave me a clear repayment plan that fit my budget. No surprises, no last-minute changes. The whole experience was smooth and respectful.',
  },
  {
    name: 'Anil Kapoor',
    location: 'Gurgaon, Haryana',
    text: 'I had been to a few banks before coming to MGM. The difference was night and day. They actually sat down with me, understood what I needed, and offered a solution that made sense. That kind of attention is rare.',
  },
  {
    name: 'Fatima Sheikh',
    location: 'Thane, Maharashtra',
    text: 'Getting a loan against my property felt overwhelming at first. But MGM\'s team explained every step clearly. They were patient with my questions and never made me feel rushed. I got the funds exactly when I needed them.',
  },
  {
    name: 'Gurpreet Kaur',
    location: 'Amritsar, Punjab',
    text: 'My husband and I wanted to buy a small piece of land near our village. MGM Financiers helped us understand our options and guided us through the entire process. Today, that land is ours and we couldn\'t be happier.',
  },
  {
    name: 'Vikram Joshi',
    location: 'Faridabad, Haryana',
    text: 'I run a small transport business and needed money for a new vehicle. MGM didn\'t ask for endless paperwork. They looked at my business honestly and gave me a loan that actually helped me grow. That\'s what real financial support looks like.',
  },
]

function ReviewCard({ review }) {
  return (
    <div className="flex-shrink-0 w-[340px] sm:w-[380px] bg-white p-6 rounded-2xl border border-mgm-dark/[0.04] mx-3 hover:shadow-lg hover:shadow-mgm-dark/[0.04] transition-shadow duration-300">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-mgm-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {/* Review text */}
      <p className="text-mgm-dark/60 font-body text-sm leading-relaxed mb-4">
        &ldquo;{review.text}&rdquo;
      </p>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-mgm-dark flex items-center justify-center flex-shrink-0">
          <span className="text-mgm-gold font-heading font-bold text-xs">
            {review.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-heading font-semibold text-mgm-dark text-sm">{review.name}</p>
          <p className="text-mgm-dark/35 font-body text-[11px]">{review.location}</p>
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="py-20 sm:py-28 bg-mgm-light/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div ref={headingRef} className="text-center">
          <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(headingInView, 0)}`}>
            Trusted by Thousands
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold text-mgm-dark mt-4 mb-4 font-heading ${scrollAnim(headingInView, 80)}`}>
            What Our Customers Say
          </h2>
          <p className={`text-mgm-dark/45 max-w-lg mx-auto font-body text-sm leading-relaxed ${scrollAnim(headingInView, 160)}`}>
            Real experiences from people who trusted MGM Financiers with their financial needs.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-mgm-light/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-mgm-light/30 to-transparent z-10 pointer-events-none" />

        <div className={`flex ${prefersReduced ? '' : 'animate-marquee'}`}>
          {doubled.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
