import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import PdfPlaceholder from './PdfPlaceholder'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [grievanceOpen, setGrievanceOpen] = useState(false)
  const [mobileGrievanceOpen, setMobileGrievanceOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [governanceOpen, setGovernanceOpen] = useState(false)
  const [mobileGovernanceOpen, setMobileGovernanceOpen] = useState(false)
  const [pdfTitle, setPdfTitle] = useState(null)
  const grievanceRef = useRef(null)
  const servicesRef = useRef(null)
  const governanceRef = useRef(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (grievanceRef.current && !grievanceRef.current.contains(e.target)) {
        setGrievanceOpen(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
      if (governanceRef.current && !governanceRef.current.contains(e.target)) {
        setGovernanceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const navLinks = [
    { name: 'About Us', to: '/about' },
    { name: 'Vision & Mission', to: '/vision-mission' },
    { name: 'EMI Calculator', to: '/emi-calculator' },
    { name: 'Our Team', to: '/team' },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto relative">
          <header className={`rounded-full transition-all duration-300 border ${
          !prefersReduced ? 'anim-nav-enter' : ''
        } ${
          scrolled
            ? 'bg-mgm-dark/10 backdrop-blur-2xl shadow-2xl shadow-black/20 border-white/10'
            : 'bg-mgm-dark/10 backdrop-blur-xl border-white/5'
        }`}>
          <div className="px-5 lg:px-8">
            <div className="flex justify-between items-center h-14 lg:h-16">
              <div className="flex-shrink-0">
                <Link to="/" className="logo-hover inline-block">
                  <img src="/mgm logo.png" alt="MGM Financiers" className="h-10 w-auto" />
                </Link>
              </div>

              <nav className="hidden xl:flex items-center gap-0.5">
                {/* Services Mega Menu */}
                <div className="relative" ref={servicesRef} onMouseLeave={() => setServicesOpen(false)}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    onMouseEnter={() => setServicesOpen(true)}
                    className="nav-link-underline relative px-3.5 py-2 text-[13px] font-medium text-black/60 hover:text-black rounded-full hover:bg-white/10 transition-all duration-200 font-body flex items-center gap-1"
                  >
                    {'Services'}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                  </button>
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] p-5 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl shadow-black/10 transition-all duration-200 origin-top ${
                      servicesOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {[
                        { id: 'personal-loan', name: 'Personal Loan', desc: 'Quick unsecured loans', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        { id: 'vehicle-loan', name: 'Vehicle Loan', desc: 'Finance your dream car', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1h2m10 1l2-1V8a1 1 0 00-1-1h-4' },
                        { id: 'gold-loan', name: 'Gold Loan', desc: 'Unlock your gold value', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                        { id: 'loan-against-property', name: 'Loan Against Property', desc: 'Leverage your property', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'construction-loan', name: 'Construction Loan', desc: 'Finance your construction', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'consumer-durable-loan', name: 'Consumer Durable Loan', desc: 'EMI on electronics & more', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                      ].map((s) => (
                        <Link key={s.id} to={`/services/${s.id}`} onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors group">
                          <div className="w-9 h-9 rounded-xl bg-[#f2f3f5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a227]/10 transition-colors">
                            <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium font-body">{s.name}</div>
                            <div className="text-xs text-gray-400 font-body">{s.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <Link to="/services" onClick={() => setServicesOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#c9a227] hover:text-[#b8911f] transition-colors font-body rounded-xl hover:bg-[#c9a227]/5">
                        {'View All Services'}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Regular Nav Links */}
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.to}
                    className="nav-link-underline relative px-3.5 py-2 text-[13px] font-medium text-black/60 hover:text-black rounded-full hover:bg-white/10 transition-all duration-200 font-body">
                    {link.name}
                  </Link>
                ))}
                {/* Governance Dropdown */}
                <div className="relative" ref={governanceRef} onMouseLeave={() => setGovernanceOpen(false)}>
                  <button
                    onClick={() => setGovernanceOpen(!governanceOpen)}
                    onMouseEnter={() => setGovernanceOpen(true)}
                    className="nav-link-underline relative px-3.5 py-2 text-[13px] font-medium text-black/60 hover:text-black rounded-full hover:bg-white/10 transition-all duration-200 font-body flex items-center gap-1"
                  >
                    {'Governance'}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${governanceOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                  </button>
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 py-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl shadow-black/10 transition-all duration-200 origin-top ${
                      governanceOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    {/* Page links */}
                    <Link to="/terms-conditions" onClick={() => setGovernanceOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                      {'Terms & Conditions'}
                    </Link>
                    <Link to="/privacy-policy" onClick={() => setGovernanceOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                      {'Privacy Policy'}
                    </Link>
                    <Link to="/rbi-guidelines" onClick={() => setGovernanceOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                      {'RBI Guidelines'}
                    </Link>
                    <Link to="/grievance" onClick={() => setGovernanceOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                      {'Grievance Redressal'}
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    {/* PDF placeholders */}
                    {[
                      { label: 'Fair Practice Code', pdf: true },
                      { label: 'Refund Policy', pdf: true },
                      { label: 'Information Booklet', pdf: true },
                      { label: 'User Consent Form', href: '/User-Consent-Form.pdf' },
                      { label: 'NACH Cancellation', pdf: true },
                      { label: 'ESG Policy', pdf: true },
                      { label: 'List of Charges', pdf: true },
                      { label: 'Co-lending Policy', pdf: true },
                      { label: 'Regulatory Disclosure', pdf: true },
                    ].map((item) => item.href ? (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                        onClick={() => setGovernanceOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                        {item.label}
                      </a>
                    ) : (
                      <button key={item.label} onClick={() => { setGovernanceOpen(false); setPdfTitle(item.label) }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors font-body">
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Grievance Dropdown */}
                <div className="relative" ref={grievanceRef} onMouseLeave={() => setGrievanceOpen(false)}>
                  <button
                    onClick={() => setGrievanceOpen(!grievanceOpen)}
                    onMouseEnter={() => setGrievanceOpen(true)}
                    className="nav-link-underline relative px-3.5 py-2 text-[13px] font-medium text-black/60 hover:text-black rounded-full hover:bg-white/10 transition-all duration-200 font-body flex items-center gap-1"
                  >
                    {'Grievance'}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${grievanceOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                  </button>
                  <div
                    className={`absolute top-full left-0 mt-1 w-56 py-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl shadow-black/10 transition-all duration-200 origin-top-left ${
                      grievanceOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <Link to="/grievance" onClick={() => setGrievanceOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors">
                      <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      {'Submit Grievance'}
                    </Link>
                    <Link to="/grievance" onClick={() => { setGrievanceOpen(false); setTimeout(() => { window.dispatchEvent(new CustomEvent('grievance-track')) }, 100) }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f2f3f5] hover:text-[#1a1a2e] transition-colors">
                      <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      {'Track Your Grievance'}
                    </Link>
                  </div>
                </div>
                <Link to="/contact"
                  className="nav-link-underline relative px-3.5 py-2 text-[13px] font-medium text-black/60 hover:text-black rounded-full hover:bg-white/10 transition-all duration-200 font-body">
                  {'Contact Us'}
                </Link>
              </nav>

              <div className="hidden xl:flex items-center gap-2.5">
                <Link to="/pay-emi"
                  className="btn-interactive px-5 py-2 text-[13px] font-medium text-black/80 border border-black/15 rounded-full hover:bg-black/10 hover:text-black transition-all duration-200 font-body">
                  {'Pay EMI'}
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-apply'))}
                  className="btn-interactive px-5 py-2 text-[13px] font-semibold text-mgm-dark bg-mgm-gold rounded-full hover:bg-mgm-gold/90 transition-all duration-200 font-body">
                  {'Apply Now'}
                </button>
              </div>

              <button
                className="xl:hidden text-white/80 p-2 hover:bg-white/10 rounded-xl transition-colors relative z-[60]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </header>
        </div>

      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-[55] transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        <div className="absolute inset-0 bg-mgm-dark/60 backdrop-blur-sm" />

        <div
          className={`absolute inset-0 flex flex-col bg-mgm-light/98 backdrop-blur-xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end p-5">
            <button
              onClick={closeMenu}
              className="p-2 -m-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
            <div className="flex flex-col gap-1">
              {/* Mobile Services */}
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="py-4 text-2xl font-heading font-semibold text-white/80 hover:text-white border-b border-mgm-dark/5 transition-colors flex items-center gap-2 w-full"
                >
                  {'Services'}
                  <svg className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/services" onClick={closeMenu}
                    className="pl-6 py-3 text-lg font-body text-mgm-gold hover:text-white transition-colors block font-medium">
                    {'View All Services'}
                  </Link>
                  {['personal-loan', 'vehicle-loan', 'gold-loan', 'loan-against-property', 'construction-loan', 'consumer-durable-loan'].map((id) => {
                    const names = { 'personal-loan': 'Personal Loan', 'vehicle-loan': 'Vehicle Loan', 'gold-loan': 'Gold Loan', 'loan-against-property': 'Loan Against Property', 'construction-loan': 'Construction Loan', 'consumer-durable-loan': 'Consumer Durable Loan' }
                    return (
                      <Link key={id} to={`/services/${id}`} onClick={closeMenu}
                        className="pl-6 py-3 text-lg font-body text-white/60 hover:text-white transition-colors block">
                        {names[id]}
                      </Link>
                    )
                  })}
                </div>
              </div>
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={closeMenu}
                  className="py-4 text-2xl font-heading font-semibold text-white/80 hover:text-white border-b border-mgm-dark/5 transition-colors"
                  style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={closeMenu}
                className="py-4 text-2xl font-heading font-semibold text-white/80 hover:text-white border-b border-mgm-dark/5 transition-colors">
                {'Contact Us'}
              </Link>
              {/* Mobile Governance */}
              <div>
                <button
                  onClick={() => setMobileGovernanceOpen(!mobileGovernanceOpen)}
                  className="py-4 text-2xl font-heading font-semibold text-white/80 hover:text-white border-b border-mgm-dark/5 transition-colors flex items-center gap-2 w-full"
                >
                  {'Governance'}
                  <svg className={`w-5 h-5 transition-transform duration-200 ${mobileGovernanceOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileGovernanceOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/terms-conditions" onClick={closeMenu}
                    className="pl-6 py-2.5 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'Terms & Conditions'}
                  </Link>
                  <Link to="/privacy-policy" onClick={closeMenu}
                    className="pl-6 py-2.5 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'Privacy Policy'}
                  </Link>
                  <Link to="/rbi-guidelines" onClick={closeMenu}
                    className="pl-6 py-2.5 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'RBI Guidelines'}
                  </Link>
                  <Link to="/grievance" onClick={closeMenu}
                    className="pl-6 py-2.5 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'Grievance Redressal'}
                  </Link>
                  <div className="border-t border-white/5 mx-6 my-1" />
                  {[
                    { label: 'Fair Practice Code', pdf: true },
                    { label: 'Refund Policy', pdf: true },
                    { label: 'Information Booklet', pdf: true },
                    { label: 'User Consent Form', href: '/User-Consent-Form.pdf' },
                    { label: 'NACH Cancellation', pdf: true },
                    { label: 'ESG Policy', pdf: true },
                    { label: 'List of Charges', pdf: true },
                    { label: 'Co-lending Policy', pdf: true },
                    { label: 'Regulatory Disclosure', pdf: true },
                  ].map((item) => item.href ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="pl-6 py-2.5 text-lg font-body text-white/40 hover:text-white transition-colors block">
                      {item.label}
                    </a>
                  ) : (
                    <button key={item.label} onClick={() => { closeMenu(); setPdfTitle(item.label) }}
                      className="pl-6 py-2.5 text-lg font-body text-white/40 hover:text-white transition-colors block w-full text-left">
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Mobile Grievance */}
              <div>
                <button
                  onClick={() => setMobileGrievanceOpen(!mobileGrievanceOpen)}
                  className="py-4 text-2xl font-heading font-semibold text-white/80 hover:text-white border-b border-mgm-dark/5 transition-colors flex items-center gap-2 w-full"
                >
                  {'Grievance'}
                  <svg className={`w-5 h-5 transition-transform duration-200 ${mobileGrievanceOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileGrievanceOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/grievance" onClick={closeMenu}
                    className="pl-6 py-3 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'Submit Grievance'}
                  </Link>
                  <Link to="/grievance" onClick={closeMenu}
                    className="pl-6 py-3 text-lg font-body text-white/60 hover:text-white transition-colors block">
                    {'Track Your Grievance'}
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="px-8 pb-10 pt-6 border-t border-mgm-dark/5 flex flex-col gap-3">
            <Link to="/pay-emi"
              onClick={closeMenu}
              className="btn-interactive py-4 text-center text-sm font-medium text-white border border-white/15 rounded-2xl font-body hover:bg-white/5 transition-all"
            >
              {'Pay EMI'}
            </Link>
            <button
              onClick={() => { closeMenu(); window.dispatchEvent(new Event('open-apply')) }}
              className="btn-interactive py-4 text-center text-sm font-semibold text-mgm-dark bg-mgm-gold rounded-2xl font-body hover:bg-mgm-gold/90 transition-all w-full"
            >
              {'Apply Now'}
            </button>
          </div>
        </div>
      </div>

      {pdfTitle && <PdfPlaceholder title={pdfTitle} onClose={() => setPdfTitle(null)} />}
    </>
  )
}

export default Header