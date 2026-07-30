import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useParams } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import ContactHome from './components/ContactHome'
import ContactPage from './components/Contact'
import Footer from './components/Footer'
import EMICalculator from './components/EMICalculator'
import PayEMI from './components/PayEMI'
import Grievance from './components/Grievance'
import ServicesAll from './components/ServicesAll'
import ServiceLayout from './components/services/ServiceLayout'
import { getServiceById } from './data/services'
import TeamPage from './components/Team'
import Reviews from './components/Reviews'
import AboutPage from './components/AboutPage'
import VisionMission from './components/VisionMission'
import PrivacyPage from './components/Privacy'
import TermsPage from './components/Terms'
import CustomerAdvisory from './components/CustomerAdvisory'
import WhatsAppButton from './components/WhatsAppButton'
import ApplyNow from './components/ApplyNow'
import ScrollToTop from './components/ScrollToTop'
import SEO from './components/SEO'

const ADVISORY_KEY = 'mgm-advisory-dismissed'
const ADVISORY_DAYS = 30

function isAdvisoryDismissed() {
  try {
    const raw = localStorage.getItem(ADVISORY_KEY)
    if (!raw) return false
    const ts = JSON.parse(raw)
    return (Date.now() - ts) / (1000 * 60 * 60 * 24) < ADVISORY_DAYS
  } catch {
    return false
  }
}

function HomePage({ showAdvisory, setShowAdvisory, showApply, setShowApply }) {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MGM Financiers | Personal Loan, Vehicle Loan, Gold Loan | Ludhiana, Punjab"
        description="MGM Financiers is a premier financial institution in Ludhiana, Punjab with 28+ years of excellence. We offer Personal Loan, Vehicle Loan, Gold Loan, Loan Against Property, Construction Loan, and Consumer Durable Loan at competitive interest rates."
        canonical="/"
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Reviews />
        <ContactHome />
      </main>
      <Footer />
      <WhatsAppButton />
      <CustomerAdvisory
        isOpen={showAdvisory}
        onClose={() => setShowAdvisory(false)}
      />
      <ApplyNow isOpen={showApply} onClose={() => setShowApply(false)} />
    </div>
  )
}

function PageLayout({ children, showApply, setShowApply }) {
  return (
    <>
      <div className="min-h-screen bg-white">{children}</div>
      <ApplyNow isOpen={showApply} onClose={() => setShowApply(false)} />
    </>
  )
}

function RBIHandler() {
  useEffect(() => {
    window.open('https://rbi.org.in/SCRIPTs/BS_ViewNBFCNotification.aspx', '_blank', 'noopener,noreferrer')
    window.history.back()
  }, [])
  return null
}

function ServiceRoute({ serviceId, showApply, setShowApply }) {
  const serviceData = getServiceById(serviceId)
  if (!serviceData) {
    return (
      <PageLayout showApply={showApply} setShowApply={setShowApply}>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-mgm-dark mb-4">Service Not Found</h1>
            <a href="/services" className="text-mgm-gold hover:underline">View All Services</a>
          </div>
        </div>
        <Footer />
      </PageLayout>
    )
  }
  return (
    <ServiceLayout service={serviceData} />
  )
}

function App() {
  const location = useLocation()
  const [showAdvisory, setShowAdvisory] = useState(false)
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    const open = () => setShowApply(true)
    window.addEventListener('open-apply', open)
    return () => window.removeEventListener('open-apply', open)
  }, [])

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome || isAdvisoryDismissed()) {
      setShowAdvisory(false)
      return
    }
    const delay = 500 + Math.random() * 200
    const timer = setTimeout(() => setShowAdvisory(true), delay)
    return () => clearTimeout(timer)
  }, [isHome])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <HomePage
            showAdvisory={showAdvisory}
            setShowAdvisory={setShowAdvisory}
            showApply={showApply}
            setShowApply={setShowApply}
          />
        } />
        <Route path="/emi-calculator" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <EMICalculator />
          </PageLayout>
        } />
        <Route path="/pay-emi" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <PayEMI />
          </PageLayout>
        } />
        <Route path="/grievance" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <Grievance />
            <Footer />
          </PageLayout>
        } />
        <Route path="/services" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <ServicesAll />
          </PageLayout>
        } />
        <Route path="/services/:serviceId" element={
          <ServiceRouteWrapper showApply={showApply} setShowApply={setShowApply} />
        } />
        <Route path="/contact" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <ContactPage />
            <Footer />
          </PageLayout>
        } />
        <Route path="/team" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <TeamPage />
            <Footer />
          </PageLayout>
        } />
        <Route path="/about" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <AboutPage />
            <Footer />
          </PageLayout>
        } />
        <Route path="/vision-mission" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <VisionMission />
            <Footer />
          </PageLayout>
        } />
        <Route path="/privacy-policy" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <PrivacyPage />
            <Footer />
          </PageLayout>
        } />
        <Route path="/terms-conditions" element={
          <PageLayout showApply={showApply} setShowApply={setShowApply}>
            <Header />
            <TermsPage />
            <Footer />
          </PageLayout>
        } />
        <Route path="/rbi-guidelines" element={<RBIHandler />} />
      </Routes>
    </>
  )
}

function ServiceRouteWrapper({ showApply, setShowApply }) {
  const { serviceId } = useParams()
  return (
    <PageLayout showApply={showApply} setShowApply={setShowApply}>
      <ServiceRoute serviceId={serviceId} showApply={showApply} setShowApply={setShowApply} />
    </PageLayout>
  )
}

export default App
