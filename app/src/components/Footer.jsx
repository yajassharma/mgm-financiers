import { Link } from 'react-router-dom'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function Footer() {
const [footerRef, footerInView] = useInView({ threshold: 0.1 })
  const prefersReduced = usePrefersReducedMotion()

  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  return (
    <footer ref={footerRef} className="bg-mgm-dark text-white py-16 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 400">
          <circle cx="400" cy="400" r="400" fill="white"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className={`lg:col-span-1 ${scrollAnim(footerInView, 0)}`}>
            <Link to="/" className="inline-block mb-5 logo-hover">
              <img 
                src="/mgm logo.png" 
                alt="MGM Financiers" 
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-white/40 mb-5 font-body text-xs leading-relaxed">
              {'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation.'}
            </p>
            <div className="flex space-x-3">
              {[
                "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03z"
              ].map((path, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-mgm-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className={scrollAnim(footerInView, 80)}>
            <h4 className="font-semibold mb-5 font-heading text-sm">{'Quick Links'}</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Vision & Mission', to: '/vision-mission' },
                { label: 'Our Team', to: '/team' },
                { label: 'EMI Calculator', to: '/emi-calculator' },
                { label: 'Contact Us', to: '/contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/40 hover:text-mgm-gold transition-colors font-body text-xs">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div className={scrollAnim(footerInView, 160)}>
            <h4 className="font-semibold mb-5 font-heading text-sm">{'Services'}</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Personal Loan', to: '/services/personal-loan' },
                { label: 'Vehicle Loan', to: '/services/vehicle-loan' },
                { label: 'Gold Loan', to: '/services/gold-loan' },
                { label: 'Loan Against Property', to: '/services/loan-against-property' },
                { label: 'Construction Loan', to: '/services/construction-loan' },
                { label: 'Consumer Durable Loan', to: '/services/consumer-durable-loan' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/40 hover:text-mgm-gold transition-colors font-body text-xs">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className={scrollAnim(footerInView, 240)}>
            <h4 className="font-semibold mb-5 font-heading text-sm">Contact Info</h4>
            <ul className="space-y-3 text-white/40 font-body text-xs">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{'Building No. 2566A, Mukt Ashram Street, Jagat Nagar, Basti Jodhewal, Ludhiana, Punjab 141007'}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{'0161 5047087'}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{'customer.redressal@mgmfinanciers.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center ${scrollAnim(footerInView, 320)}`}>
          <p className="text-white/30 text-xs font-body">
            © {new Date().getFullYear()} MGM Financiers. {'All rights reserved.'}
          </p>
          <p className="text-white/25 text-xs font-body mt-3 md:mt-0">
            Made with{' '}
            <svg className="w-3 h-3 inline-block text-mgm-gold/50 -mt-px" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
            {' '}by{' '}
            <a href="https://webchainit.com" target="_blank" rel="noopener noreferrer" className="text-mgm-gold/50 hover:text-mgm-gold transition-colors underline underline-offset-2">WebChain IT</a>
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-4 md:mt-0">
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms & Conditions', to: '/terms-conditions' },
              { label: 'RBI Guidelines', href: 'https://rbi.org.in/SCRIPTs/BS_ViewNBFCNotification.aspx', external: true },
            ].map((item) => item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-mgm-gold text-xs transition-colors font-body">
                {item.label}
              </a>
            ) : (
              <Link key={item.to} to={item.to} className="text-white/30 hover:text-mgm-gold text-xs transition-colors font-body">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
