import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Header from './Header'
import Footer from './Footer'

const API_BASE = '/api'

// ── Utilities ──────────────────────────────────────────────
const formatINRInput = (val) => {
  const digits = val.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-IN')
}

const formatINRDisplay = (num) => '₹' + Math.round(num).toLocaleString('en-IN')

const validatePhone = (p) => /^[6-9]\d{9}$/.test(p)
const validateEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const validateName = (n) => n.trim().length >= 2

const generateRef = () => 'MGM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()

const paymentTypes = ['EMI Payment', 'Part Payment', 'Loan Prepayment', 'Other']

// ── Load Cashfree SDK ─────────────────────────────────────
let cashfreeSDKLoaded = false
let cashfreeSDKPromise = null

function loadCashfreeSDK() {
  if (cashfreeSDKLoaded) return Promise.resolve()
  if (cashfreeSDKPromise) return cashfreeSDKPromise

  cashfreeSDKPromise = new Promise((resolve, reject) => {
    if (typeof window.Cashfree !== 'undefined') {
      cashfreeSDKLoaded = true
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.onload = () => {
      cashfreeSDKLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'))
    document.head.appendChild(script)
  })
  return cashfreeSDKPromise
}

// ── Floating Label Input ───────────────────────────────────
function FloatingInput({ label, value, onChange, type = 'text', icon, error, required, maxLength, pattern }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="relative mb-5">
      <div className={`relative flex items-center bg-white border rounded-xl transition-all duration-200 ${error ? 'border-red-400' : focused ? 'border-mgm-gold/40 ring-2 ring-mgm-gold/10' : 'border-mgm-dark/10 hover:border-mgm-dark/20'}`}>
        {icon && <div className="pl-4 text-mgm-dark/30">{icon}</div>}
        <div className="relative flex-1">
          <label className={`absolute left-${icon ? '3' : '4'} transition-all duration-200 pointer-events-none font-body ${active ? 'top-1.5 text-[10px] text-mgm-gold' : 'top-1/2 -translate-y-1/2 text-sm text-mgm-dark/30'}`}
            style={{ left: icon ? '3rem' : '1rem' }}>
            {label}{required && <span className="text-mgm-gold ml-0.5">*</span>}
          </label>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={maxLength}
            pattern={pattern}
            className={`w-full bg-transparent px-4 pt-${active ? '5' : '3.5'} pb-2 ${icon ? 'pl-3' : 'pl-4'} pr-4 font-body text-sm text-mgm-dark outline-none`}
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5 ml-1 font-body">{error}</p>}
    </div>
  )
}

function FloatingSelect({ label, value, onChange, options, icon }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="relative mb-5">
      <div className={`relative flex items-center bg-white border rounded-xl transition-all duration-200 ${focused ? 'border-mgm-gold/40 ring-2 ring-mgm-gold/10' : 'border-mgm-dark/10 hover:border-mgm-dark/20'}`}>
        {icon && <div className="pl-4 text-mgm-dark/30">{icon}</div>}
        <div className="relative flex-1">
          <label className={`absolute transition-all duration-200 pointer-events-none font-body ${active ? 'top-1.5 left-4 text-[10px] text-mgm-gold' : 'top-1/2 -translate-y-1/2 text-sm text-mgm-dark/30'}`}
            style={{ left: icon ? '3rem' : '1rem' }}>
            {label}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full appearance-none bg-transparent px-4 pt-5 pb-2 pl-4 pr-10 font-body text-sm text-mgm-dark outline-none cursor-pointer"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-dark/30 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Progress Indicator ─────────────────────────────────────
function ProgressIndicator({ currentStep }) {
  const steps = ['Borrower Details', 'Payment Details', 'Payment', 'Confirmation']
  return (
    <div className="flex items-center justify-between mb-10 px-2">
      {steps.map((s, i) => {
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all duration-300 ${done ? 'bg-mgm-gold text-mgm-dark' : active ? 'bg-mgm-dark text-white ring-4 ring-mgm-dark/10' : 'bg-mgm-dark/5 text-mgm-dark/30'}`}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                ) : i + 1}
              </div>
              <span className={`text-[10px] mt-2 font-body font-semibold whitespace-nowrap hidden sm:block ${active ? 'text-mgm-dark' : done ? 'text-mgm-gold' : 'text-mgm-dark/30'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${done ? 'bg-mgm-gold' : 'bg-mgm-dark/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── QR Code (placeholder SVG) ─────────────────────────────
function QRCodeSVG({ size = 200 }) {
  const modules = 21
  const cellSize = size / modules
  const pattern = useRef(null)

  if (!pattern.current) {
    const grid = Array.from({ length: modules }, () => Array(modules).fill(0))
    // Position detection patterns
    const drawFinder = (r, c) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) grid[r + i][c + j] = 1
        }
      }
    }
    drawFinder(0, 0)
    drawFinder(0, modules - 7)
    drawFinder(modules - 7, 0)
    // Timing patterns
    for (let i = 8; i < modules - 8; i++) { grid[6][i] = i % 2 === 0 ? 1 : 0; grid[i][6] = i % 2 === 0 ? 1 : 0 }
    // Random data
    for (let i = 0; i < modules; i++) for (let j = 0; j < modules; j++) {
      if (grid[i][j] === 0 && !(i < 9 && j < 9) && !(i < 9 && j > modules - 9) && !(i > modules - 9 && j < 9) && !(i === 6 || j === 6)) {
        grid[i][j] = Math.random() > 0.55 ? 1 : 0
      }
    }
    pattern.current = grid
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <rect width={size} height={size} fill="white" rx="8" />
      {pattern.current.map((row, i) => row.map((cell, j) => cell ? (
        <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="#1a1a2e" rx="0.5" />
      ) : null))}
    </svg>
  )
}

// ── Animated Success Check ─────────────────────────────────
function SuccessCheck({ size = 80 }) {
  const prefersReduced = usePrefersReducedMotion()
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className={`w-full h-full ${prefersReduced ? '' : 'animate-success-pop'}`}>
        <circle cx="40" cy="40" r="36" fill="none" stroke="#c9a227" strokeWidth="3" opacity="0.2" />
        <circle cx="40" cy="40" r="36" fill="none" stroke="#c9a227" strokeWidth="3"
          strokeDasharray="226" strokeDashoffset="226"
          style={{ animation: prefersReduced ? 'none' : 'successRing 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) forwards' }} />
        <path d="M24 40L35 51L56 30" fill="none" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="50" strokeDashoffset="50"
          style={{ animation: prefersReduced ? 'none' : 'successCheck 0.5s 0.7s cubic-bezier(0.22,1,0.36,1) forwards' }} />
      </svg>
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────
function Spinner({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="animate-spin mx-auto">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-mgm-dark/10" />
      <path d="M44 24c0-11.046-8.954-20-20-20" fill="none" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ── Countdown Timer ────────────────────────────────────────
function CountdownTimer({ seconds: initial, onExpire }) {
  const [remaining, setRemaining] = useState(initial)
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return (
    <span className="font-heading font-bold text-mgm-dark tabular-nums">
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function PayEMI() {
const prefersReduced = usePrefersReducedMotion()
  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const [heroRef, heroInView] = useInView({ threshold: 0.2 })
  const [guidesRef, guidesInView] = useInView({ threshold: 0.2 })
  const [assistRef, assistInView] = useInView({ threshold: 0.2 })
  const [secRef, secInView] = useInView({ threshold: 0.2 })
  const [split1Ref, split1InView] = useInView({ threshold: 0.2 })
  const [split2Ref, split2InView] = useInView({ threshold: 0.2 })
  const [timelineRef, timelineInView] = useInView({ threshold: 0.2 })

  // Wizard state
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1=forward, -1=backward

  // Track payment
  const [trackPhone, setTrackPhone] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackError, setTrackError] = useState('')

  // Step 1: Borrower
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loanAcc, setLoanAcc] = useState('')

  // Step 2: Payment
  const [payType, setPayType] = useState('EMI Payment')
  const [amount, setAmount] = useState('')
  const [amountRaw, setAmountRaw] = useState('0')

  // Step 3: Payment
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, calling, loading_sdk, processing, success, failed, expired
  const [countdownExpired, setCountdownExpired] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentError, setPaymentError] = useState('')

  // Receipt
  const [receiptData, setReceiptData] = useState({
    ref: generateRef(),
    txnId: '',
    date: new Date().toLocaleDateString('en-IN'),
    time: new Date().toLocaleTimeString('en-IN'),
    method: '',
  })

  const goNext = () => { setDirection(1); setStep(s => Math.min(3, s + 1)) }
  const goBack = () => { setDirection(-1); setStep(s => Math.max(0, s - 1)) }

  const step1Valid = validateName(name) && validatePhone(phone)
  const step2Valid = parseInt(amountRaw) >= 1

  const handleAmountChange = (val) => {
    const raw = val.replace(/[^\d]/g, '')
    setAmountRaw(raw || '0')
    setAmount(formatINRInput(raw))
  }

  // Create order on backend and open Cashfree checkout
  const startPayment = useCallback(async () => {
    setPaymentStatus('calling')
    setPaymentError('')

    try {
      const response = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: name,
          phone,
          email,
          loanNumber: loanAcc,
          paymentType: payType,
          amount: parseInt(amountRaw),
        }),
      })

      const result = await response.json()

      if (result.status !== 'success') {
        setPaymentStatus('failed')
        setPaymentError(result.message || 'Failed to create payment order')
        return
      }

      const { orderId: oid, paymentSessionId } = result.data
      setOrderId(oid)

      if (!paymentSessionId) {
        setPaymentStatus('failed')
        setPaymentError('No payment session received. Please try again.')
        return
      }

      // Load Cashfree SDK
      setPaymentStatus('loading_sdk')
      try {
        await loadCashfreeSDK()
      } catch {
        setPaymentStatus('failed')
        setPaymentError('Failed to load payment gateway. Please check your internet connection.')
        return
      }

      console.log('[PayEMI] SDK loaded')

      if (typeof window.Cashfree !== 'function') {
        setPaymentStatus('failed')
        setPaymentError('Payment gateway failed to initialize.')
        return
      }

      const cashfree = window.Cashfree({ mode: 'production' })

      setPaymentStatus('processing')

      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self',
      })
    } catch (err) {
      setPaymentStatus('failed')
      setPaymentError(err.message || 'Network error. Please try again.')
    }
  }, [name, phone, email, loanAcc, payType, amountRaw])

  // Verify payment status from backend
  const verifyPayment = useCallback(async (oid) => {
    try {
      const response = await fetch(`${API_BASE}/payments/verify/${oid}`)
      const result = await response.json()

      if (result.status === 'success' && result.data) {
        const { status, cfPaymentId, paymentMethod, amount: amt } = result.data
        setReceiptData(prev => ({
          ...prev,
          txnId: cfPaymentId || prev.txnId,
          method: paymentMethod || 'Online Payment',
        }))
        if (amt && (!amountRaw || amountRaw === '0')) {
          setAmount(formatINRInput(String(amt)))
          setAmountRaw(String(amt))
        }
        if (status === 'SUCCESS') {
          setPaymentStatus('success')
          return true
        } else if (status === 'FAILED') {
          setPaymentStatus('failed')
          setPaymentError('Payment was not completed. No amount was deducted.')
          return true
        } else if (status === 'EXPIRED') {
          setPaymentStatus('expired')
          return true
        } else if (status === 'REFUNDED') {
          setPaymentStatus('failed')
          setPaymentError('Payment was refunded. Please contact support.')
          return true
        } else {
          setPaymentStatus('processing')
          return false
        }
      }
    } catch {
      // verify failed
    }
    return false
  }, [amountRaw])

  // Poll for payment status while processing
  useEffect(() => {
    if (paymentStatus !== 'processing' || !orderId) return

    let attempts = 0
    const maxAttempts = 30
    const poll = setInterval(async () => {
      attempts++
      const done = await verifyPayment(orderId)
      if (done || attempts >= maxAttempts) {
        clearInterval(poll)
        if (!done) setPaymentStatus('expired')
      }
    }, 3000)

    return () => clearInterval(poll)
  }, [paymentStatus, orderId, verifyPayment])

  // Check for orderId in URL on mount (return from Cashfree)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlOrderId = params.get('orderId')
    if (urlOrderId) {
      setOrderId(urlOrderId)
      setStep(2)
      // Immediately verify payment status
      verifyPayment(urlOrderId).then(() => {
        // Clear URL params after verification
        window.history.replaceState({}, '', '/pay-emi')
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleQRExpire = () => setCountdownExpired(true)

  const handleTrackPayment = useCallback(async () => {
    const digits = trackPhone.replace(/\D/g, '')
    if (digits.length < 10) {
      setTrackError('Please enter a valid 10-digit phone number')
      return
    }
    setTrackError('')
    setTrackLoading(true)
    setTrackResult(null)
    try {
      const response = await fetch(`${API_BASE}/payments/track/${digits}`)
      const result = await response.json()
      if (result.status === 'success' && result.data) {
        setTrackResult(result.data)
      } else {
        setTrackError(result.message || 'No payment found for this number')
      }
    } catch (err) {
      setTrackError('Network error. Please try again.')
    }
    setTrackLoading(false)
  }, [trackPhone])

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Pay EMI Online | Secure Loan Payment | MGM Financiers"
        description="Pay your loan EMI online securely through MGM Financiers. UPI, credit/debit cards, and net banking supported via Cashfree Payments."
        canonical="/pay-emi"
      />
      <Header />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-mgm-gold/[0.03] pointer-events-none" />
          <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-mgm-dark/[0.02] pointer-events-none" />

          <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(heroInView, 0)}`}>Pay EMI</span>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(heroInView, 80)}`}>
                  {'Pay Your EMI'}<br />Securely
                </h1>
                <p className={`text-mgm-dark/50 font-body text-sm sm:text-base leading-relaxed mb-8 max-w-lg ${scrollAnim(heroInView, 160)}`}>
                  {'Quick and secure online EMI payment'}
                </p>

                {/* Trust badges */}
                <div className={`grid grid-cols-2 gap-2 sm:gap-3 mb-8 ${scrollAnim(heroInView, 240)}`}>
                  {[
                    { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', text: 'RBI-registered NBFC' },
                    { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', text: 'Secure Payment Gateway' },
                    { icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'SSL Encrypted' },
                    { icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Instant Confirmation' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-mgm-light/60 border border-mgm-dark/5 rounded-xl px-4 py-2.5">
                      <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                      </svg>
                      <span className="text-xs font-body font-semibold text-mgm-dark/70">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Secure Payment illustration */}
              <div className={`w-full lg:w-1/2 flex justify-center ${scrollAnim(heroInView, 160)}`}>
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-mgm-dark/[0.03] to-mgm-gold/[0.04] border border-mgm-dark/5" />
                  <div className="absolute inset-6 sm:inset-8 rounded-2xl bg-white border border-mgm-dark/5 shadow-xl shadow-mgm-dark/5 p-5 sm:p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-mgm-gold" />
                        <div className="w-2 h-2 rounded-full bg-mgm-dark/20" />
                        <div className="w-2 h-2 rounded-full bg-mgm-dark/10" />
                      </div>
                      <div className="flex items-center gap-1.5 bg-mgm-gold/10 rounded-lg px-2.5 py-1">
                        <svg className="w-3 h-3 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <span className="text-[9px] font-body font-semibold text-mgm-gold">SECURE</span>
                      </div>
                    </div>
                    <div className="bg-mgm-light/60 rounded-xl p-3 border border-mgm-dark/5 mb-4 flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-16 h-16 sm:w-20 sm:h-20">
                        <rect width="80" height="80" fill="white" rx="4"/>
                        <rect x="4" y="4" width="20" height="20" fill="none" stroke="#1a1a2e" strokeWidth="2.5" rx="2"/>
                        <rect x="9" y="9" width="10" height="10" fill="#1a1a2e" rx="1"/>
                        <rect x="56" y="4" width="20" height="20" fill="none" stroke="#1a1a2e" strokeWidth="2.5" rx="2"/>
                        <rect x="61" y="9" width="10" height="10" fill="#1a1a2e" rx="1"/>
                        <rect x="4" y="56" width="20" height="20" fill="none" stroke="#1a1a2e" strokeWidth="2.5" rx="2"/>
                        <rect x="9" y="61" width="10" height="10" fill="#1a1a2e" rx="1"/>
                        <rect x="30" y="30" width="20" height="20" fill="none" stroke="#c9a227" strokeWidth="2" rx="2"/>
                        <circle cx="40" cy="40" r="4" fill="#c9a227"/>
                        <rect x="28" y="28" width="3" height="3" fill="#1a1a2e" rx="0.5"/><rect x="34" y="28" width="3" height="3" fill="#1a1a2e" rx="0.5" opacity="0.3"/>
                        <rect x="44" y="28" width="3" height="3" fill="#1a1a2e" rx="0.5"/><rect x="50" y="28" width="3" height="3" fill="#1a1a2e" rx="0.5" opacity="0.4"/>
                        <rect x="28" y="44" width="3" height="3" fill="#1a1a2e" rx="0.5" opacity="0.3"/><rect x="34" y="44" width="3" height="3" fill="#1a1a2e" rx="0.5"/>
                        <rect x="44" y="44" width="3" height="3" fill="#1a1a2e" rx="0.5" opacity="0.5"/><rect x="50" y="44" width="3" height="3" fill="#1a1a2e" rx="0.5"/>
                        <rect x="28" y="50" width="3" height="3" fill="#1a1a2e" rx="0.5"/><rect x="44" y="50" width="3" height="3" fill="#1a1a2e" rx="0.5" opacity="0.3"/>
                      </svg>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-mgm-dark/40 font-body">Merchant</span>
                        <span className="text-[10px] font-heading font-bold text-mgm-dark">MGM Financiers</span>
                      </div>
                      <div className="h-px bg-mgm-dark/5" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-mgm-dark/40 font-body">Amount</span>
                        <span className="text-sm font-heading font-bold text-mgm-gold">₹18,500</span>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-mgm-dark/5 overflow-hidden">
                      <div className="h-full rounded-full bg-mgm-gold/40 w-full" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-mgm-dark/5 shadow-lg shadow-mgm-dark/5 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-mgm-gold border border-mgm-gold shadow-lg shadow-mgm-gold/20 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-mgm-dark" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PAYMENT WIZARD ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-light/50 relative overflow-hidden">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ProgressIndicator currentStep={step} />

            {/* ═══ STEP 1: BORROWER DETAILS ═══ */}
            {step === 0 && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10 ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-mgm-dark font-heading mb-2">{'EMI Payment'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm mb-8">{'Pay your monthly EMI online'}</p>

                <FloatingInput
                  label={'Borrower Name'}
                  value={name}
                  onChange={setName}
                  required
                  error={name.length > 0 && !validateName(name) ? 'Please enter your full name' : ''}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                />
                <FloatingInput
                  label={'Mobile Number'}
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/[^\d]/g, '').slice(0, 10))}
                  type="tel"
                  required
                  maxLength={10}
                  error={phone.length > 0 && !validatePhone(phone) ? 'Enter a valid 10-digit Indian mobile number' : ''}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
                />
                <FloatingInput
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  error={email.length > 0 && !validateEmail(email) ? 'Enter a valid email address' : ''}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                />
                <FloatingInput
                  label={'Loan Account Number'}
                  value={loanAcc}
                  onChange={setLoanAcc}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
                />

                <button
                  onClick={goNext}
                  disabled={!step1Valid}
                  className="btn-interactive w-full bg-mgm-dark text-white py-3.5 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ═══ STEP 2: PAYMENT DETAILS ═══ */}
            {step === 1 && (
              <div className={`flex flex-col lg:flex-row gap-6 ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-mgm-dark font-heading mb-2">{'EMI Payment'}</h2>
                  <p className="text-mgm-dark/40 font-body text-sm mb-8">{'Pay your monthly EMI online'}</p>

                  <FloatingSelect
                    label={'Payment Type'}
                    value={payType}
                    onChange={setPayType}
                    options={paymentTypes}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
                  />

                  <div className="relative mb-5">
                    <div className="relative flex items-center bg-white border border-mgm-dark/10 rounded-xl hover:border-mgm-dark/20 transition-all">
                      <div className="pl-4 text-mgm-dark/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="relative flex-1">
                        <label className={`absolute left-3 transition-all duration-200 pointer-events-none font-body ${amount.length > 0 ? 'top-1.5 text-[10px] text-mgm-gold' : 'top-1/2 -translate-y-1/2 text-sm text-mgm-dark/30'}`}>
                          Amount <span className="text-mgm-gold">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className="w-full bg-transparent pl-3 pr-4 pt-5 pb-2 font-heading font-bold text-lg text-mgm-dark outline-none"
                        />
                      </div>
                    </div>
                    {parseInt(amountRaw) > 0 && parseInt(amountRaw) < 1 && (
                      <p className="text-red-400 text-xs mt-1.5 ml-1 font-body">Minimum amount is ₹1</p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={goBack} className="btn-interactive flex-1 border-2 border-mgm-dark/10 text-mgm-dark py-3.5 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                      Back
                    </button>
                    <button onClick={goNext} disabled={!step2Valid} className="btn-interactive flex-1 bg-mgm-dark text-white py-3.5 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                      Continue
                    </button>
                  </div>
                </div>

                {/* Summary card */}
                <div className="w-full lg:w-80 bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-8 h-fit">
                  <h3 className="font-heading font-bold text-mgm-dark text-sm mb-6">Payment Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-mgm-dark/50 font-body text-sm">Payment Type</span><span className="font-heading font-semibold text-mgm-dark text-sm">{payType.replace(' Payment', '')}</span></div>
                    <div className="border-t border-mgm-dark/5" />
                    <div className="flex justify-between items-center"><span className="text-mgm-dark/50 font-body text-sm">Amount</span><span className="font-heading font-bold text-mgm-dark text-lg">{parseInt(amountRaw) > 0 ? formatINRDisplay(parseInt(amountRaw)) : '₹0'}</span></div>
                    <div className="flex justify-between items-center"><span className="text-mgm-dark/50 font-body text-sm">Convenience Charges</span><span className="font-heading font-semibold text-mgm-gold text-sm">Nil</span></div>
                    <div className="border-t border-mgm-dark/5" />
                    <div className="flex justify-between items-center"><span className="text-mgm-dark/50 font-body text-sm">Total</span><span className="font-heading font-bold text-mgm-dark text-xl">{parseInt(amountRaw) > 0 ? formatINRDisplay(parseInt(amountRaw)) : '₹0'}</span></div>
                  </div>
                  <div className="mt-6 bg-mgm-light/60 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-4 h-4 text-mgm-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    <p className="text-mgm-dark/40 font-body text-xs leading-relaxed">No convenience charges for EMI payments</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: PAYMENT GATEWAY ═══ */}
            {step === 2 && paymentStatus === 'idle' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10 ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                  {/* Payment illustration */}
                  <div className="flex-1 text-center">
                    <div className="inline-block bg-mgm-light/60 rounded-2xl p-8 border border-mgm-dark/5">
                      <div className="w-48 h-48 mx-auto relative">
                        {/* Shield */}
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <defs>
                            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.15"/>
                              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.05"/>
                            </linearGradient>
                          </defs>
                          <path d="M100 20 L170 50 L170 100 Q170 150 100 180 Q30 150 30 100 L30 50 Z" fill="url(#shieldGrad)" stroke="#c9a227" strokeWidth="1.5"/>
                          <path d="M100 40 L155 63 L155 98 Q155 140 100 162 Q45 140 45 98 L45 63 Z" fill="white" stroke="#c9a227" strokeWidth="0.5" opacity="0.5"/>
                          {/* Lock icon */}
                          <rect x="82" y="95" width="36" height="28" rx="4" fill="none" stroke="#c9a227" strokeWidth="2"/>
                          <path d="M90 95 V85 Q90 75 100 75 Q110 75 110 85 V95" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="100" cy="108" r="3" fill="#c9a227"/>
                          <line x1="100" y1="111" x2="100" y2="116" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
                          {/* Checkmark */}
                          <path d="M88 140 L96 148 L115 128" fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-mgm-dark font-heading font-bold mt-4">Secure Payment Gateway</p>
                    <p className="text-mgm-dark/30 font-body text-xs mt-1">256-bit SSL Encrypted</p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    <div className="text-center lg:text-left mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-mgm-dark font-heading mb-2">{'Pay Now'}</h2>
                      <p className="text-mgm-dark/40 font-body text-sm">You will be redirected to our secure payment partner</p>
                    </div>

                    <div className="bg-mgm-light/60 rounded-2xl p-5 border border-mgm-dark/5 space-y-3 mb-6">
                      <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Amount</span><span className="font-heading font-bold text-mgm-dark">{formatINRDisplay(parseInt(amountRaw))}</span></div>
                      <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Payment Type</span><span className="font-heading font-semibold text-mgm-dark text-sm">{payType}</span></div>
                      <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Merchant</span><span className="font-heading font-semibold text-mgm-dark text-sm">MGM Financiers Pvt. Ltd.</span></div>
                      <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Reference</span><span className="font-body text-mgm-dark/70 text-sm">{receiptData.ref}</span></div>
                    </div>

                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-600 font-body text-sm">{paymentError}</p>
                      </div>
                    )}

                    <button
                      onClick={startPayment}
                      className="btn-interactive w-full bg-mgm-gold text-mgm-dark py-3.5 rounded-xl font-semibold hover:bg-mgm-gold/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-gold/20 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      Proceed to Secure Payment
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <svg className="w-3.5 h-3.5 text-mgm-dark/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      <span className="text-mgm-dark/30 font-body text-xs">Powered by Cashfree Payments</span>
                    </div>

                    <button onClick={goBack} className="mt-6 w-full text-center text-mgm-dark/40 hover:text-mgm-gold font-body text-sm transition-colors">
                      ← Go Back
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ PAYMENT CALLING API ═══ */}
            {step === 2 && paymentStatus === 'calling' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-10 sm:p-16 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <Spinner size={56} />
                <h2 className="text-xl font-bold text-mgm-dark font-heading mt-6 mb-2">{'Processing your payment...'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm">Please wait while we set up your payment</p>
              </div>
            )}

            {/* ═══ PAYMENT LOADING SDK ═══ */}
            {step === 2 && paymentStatus === 'loading_sdk' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-10 sm:p-16 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <Spinner size={56} />
                <h2 className="text-xl font-bold text-mgm-dark font-heading mt-6 mb-2">{'Processing your payment...'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm">Please wait while we connect to Cashfree</p>
              </div>
            )}

            {/* ═══ PAYMENT POLLING ═══ */}
            {step === 2 && paymentStatus === 'processing' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-10 sm:p-16 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <Spinner size={56} />
                <h2 className="text-xl font-bold text-mgm-dark font-heading mt-6 mb-2">{'Processing your payment...'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm mb-6">Please complete the payment on your device</p>
                <div className="bg-mgm-light/60 rounded-2xl p-5 border border-mgm-dark/5 max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Amount</span><span className="font-heading font-bold text-mgm-dark">{formatINRDisplay(parseInt(amountRaw))}</span></div>
                  <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Order ID</span><span className="font-body text-mgm-dark/70 text-sm">{orderId}</span></div>
                  <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Status</span><span className="font-heading font-semibold text-amber-500 text-sm">Processing</span></div>
                </div>
                <p className="text-mgm-dark/30 font-body text-xs mt-6">Automatically checking payment status every 3 seconds...</p>
              </div>
            )}

            {/* ═══ STEP 4: SUCCESS ═══ */}
            {step === 2 && paymentStatus === 'success' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <SuccessCheck size={80} />
                <h2 className="text-2xl sm:text-3xl font-bold text-mgm-dark font-heading mt-6 mb-2">{'Payment Successful!'}</h2>
                <p className="text-mgm-gold font-heading font-bold text-3xl sm:text-4xl mt-4 mb-8">{formatINRDisplay(parseInt(amountRaw))}</p>

                <div className="bg-mgm-light/60 rounded-2xl p-6 border border-mgm-dark/5 max-w-md mx-auto text-left space-y-3">
                  {[
                    ['Reference Number', receiptData.ref],
                    ['Order ID', orderId],
                    ['Transaction ID', receiptData.txnId || 'Pending'],
                    ['Payment Date', receiptData.date],
                    ['Payment Time', receiptData.time],
                    ['Payment Method', receiptData.method || 'Online Payment'],
                    ['Status', 'Paid'],
                    ['Paid To', 'MGM Financiers Pvt. Ltd.'],
                  ].map(([l, v], i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-mgm-dark/50 font-body text-sm">{l}</span>
                      <span className={`font-heading font-semibold text-sm ${l === 'Status' ? 'text-mgm-gold' : 'text-mgm-dark'}`}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-mgm-gold/5 border border-mgm-gold/10 rounded-xl p-4 max-w-md mx-auto mt-6">
                  <p className="text-mgm-dark/50 font-body text-xs leading-relaxed">Our Relationship Manager will verify and reconcile your payment shortly. If you have any queries, please contact us with the reference number above.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
                  <button className="btn-interactive flex-1 bg-mgm-dark text-white py-3 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    {'Download Receipt'}
                  </button>
                  <button onClick={() => { setStep(0); setPaymentStatus('idle'); setAmount(''); setAmountRaw('0'); setName(''); setPhone(''); setEmail(''); setLoanAcc(''); setOrderId(''); setPaymentError(''); }} className="btn-interactive flex-1 border-2 border-mgm-dark/10 text-mgm-dark py-3 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                    Pay Another EMI
                  </button>
                </div>
              </div>
            )}

            {/* ═══ FAILURE ═══ */}
            {step === 2 && paymentStatus === 'failed' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-mgm-dark font-heading mb-2">{'Payment Failed'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm mb-2">The payment could not be processed. No amount has been deducted.</p>
                {paymentError && <p className="text-red-400 font-body text-xs mb-6">{paymentError}</p>}

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button onClick={() => { setPaymentStatus('idle'); setPaymentError(''); }} className="btn-interactive flex-1 bg-mgm-dark text-white py-3 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20">
                    Retry Payment
                  </button>
                  <a href="#contact" className="btn-interactive flex-1 border-2 border-mgm-dark/10 text-mgm-dark py-3 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm text-center">
                    Contact Support
                  </a>
                  <button onClick={goBack} className="btn-interactive flex-1 border-2 border-mgm-dark/10 text-mgm-dark py-3 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {/* ═══ EXPIRED ═══ */}
            {step === 2 && paymentStatus === 'expired' && (
              <div className={`bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-6 sm:p-10 text-center ${prefersReduced ? '' : 'anim-scroll-fade is-visible'}`}>
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-mgm-dark font-heading mb-2">{'Payment Pending'}</h2>
                <p className="text-mgm-dark/40 font-body text-sm mb-8">The payment session has expired. Please try again.</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button onClick={() => { setPaymentStatus('idle'); setPaymentError(''); }} className="btn-interactive flex-1 bg-mgm-dark text-white py-3 rounded-xl font-semibold hover:bg-mgm-dark/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-dark/20">
                    {'Try Again'}
                  </button>
                  <button onClick={goBack} className="btn-interactive flex-1 border-2 border-mgm-dark/10 text-mgm-dark py-3 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ PAYMENT TIMELINE ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mgm-gold/[0.02] pointer-events-none" />
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={timelineRef} className="text-center mb-14">
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(timelineInView, 0)}`}>How It Works</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 font-heading ${scrollAnim(timelineInView, 80)}`}>
                Simple 4-Step Process
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {[
                { step: '01', title: 'Initiate Payment', desc: 'Enter your details and payment amount', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
                { step: '02', title: 'Scan QR / Gateway', desc: 'Scan the QR code or proceed to payment gateway', icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z' },
                { step: '03', title: 'Verification', desc: 'Payment is verified through our secure gateway', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                { step: '04', title: 'Instant Confirmation', desc: 'Receive payment acknowledgement immediately', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((item, i) => (
                <div key={i} className={`text-center relative ${scrollAnim(timelineInView, 80 + i * 100)}`}>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-mgm-light border border-mgm-dark/5 flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                  </div>
                  <span className="text-[10px] font-body font-bold text-mgm-gold tracking-wider">{item.step}</span>
                  <h3 className="font-heading font-bold text-mgm-dark text-sm mt-1 mb-2">{item.title}</h3>
                  <p className="text-mgm-dark/40 font-body text-xs leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-px">
                      <div className="w-full h-full border-t border-dashed border-mgm-dark/10" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SPLIT SECTION 1: Security ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-light/50 relative overflow-hidden">
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.03] pointer-events-none" />
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={split1Ref} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className={`w-full lg:w-1/2 ${scrollAnim(split1InView, 0)}`}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-mgm-gold/[0.06] to-transparent pointer-events-none" />
                  <div className="relative bg-white rounded-2xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-8 sm:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-mgm-gold/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-mgm-dark text-sm">256-bit SSL Encrypted</h4>
                        <p className="text-mgm-dark/40 font-body text-xs">End-to-end protection</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['PCI DSS Level 1 Compliant', 'Real-time fraud monitoring', 'Zero data storage on servers', 'Instant refund processing'].map((f, i) => (
                        <div key={i} className="flex items-center gap-3 bg-mgm-light/60 rounded-xl px-4 py-3">
                          <svg className="w-4 h-4 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          <span className="text-mgm-dark/60 font-body text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-mgm-dark/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      <span className="font-body text-xs">Powered by Cashfree Payments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(split1InView, 80)}`}>Security</span>
                <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(split1InView, 160)}`}>
                  Secure Payments.<br />Complete Transparency.
                </h2>
                <p className={`text-mgm-dark/50 mb-4 font-body text-sm leading-relaxed ${scrollAnim(split1InView, 240)}`}>
                  Every payment is processed through Cashfree Payments, a PCI DSS Level 1 compliant payment gateway. Your financial data is encrypted end-to-end and never stored on our servers.
                </p>
                <p className={`text-mgm-dark/50 mb-6 font-body text-sm leading-relaxed ${scrollAnim(split1InView, 280)}`}>
                  You receive instant acknowledgement for every transaction. Our relationship managers verify and reconcile each payment promptly, ensuring complete transparency throughout the process.
                </p>
                <div className={`flex items-center gap-3 ${scrollAnim(split1InView, 320)}`}>
                  <div className="w-10 h-10 rounded-xl bg-mgm-gold/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-mgm-dark/60 font-body text-sm">RBI-registered NBFC · 28+ Years · 100% Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SPLIT SECTION 2: Convenience ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-mgm-dark/[0.015] pointer-events-none" />
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={split2Ref} className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className={`w-full lg:w-1/2 ${scrollAnim(split2InView, 0)}`}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-bl from-mgm-gold/[0.06] to-transparent pointer-events-none" />
                  <div className="relative bg-white rounded-2xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 p-8 sm:p-10">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'EMI Payment', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
                        { label: 'Part Payment', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'Prepayment', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                      ].map((item, i) => (
                        <div key={i} className="bg-mgm-light/60 rounded-xl p-4 text-center border border-mgm-dark/5">
                          <svg className="w-6 h-6 text-mgm-gold mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                          <span className="text-[10px] font-body font-semibold text-mgm-dark/60">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-mgm-light/40 rounded-xl p-5 border border-mgm-dark/5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-mgm-gold" />
                        <span className="text-xs font-heading font-bold text-mgm-dark">Available 24/7</span>
                      </div>
                      <div className="space-y-2">
                        {['No branch visit required', 'Instant payment processing', 'Download receipt instantly', 'Track payment history'].map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-mgm-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            <span className="text-mgm-dark/50 font-body text-xs">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(split2InView, 80)}`}>Convenience</span>
                <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(split2InView, 160)}`}>
                  Designed Around<br />Your Convenience
                </h2>
                <p className={`text-mgm-dark/50 mb-4 font-body text-sm leading-relaxed ${scrollAnim(split2InView, 240)}`}>
                  Pay your EMI, make part-payments and prepayments securely online without visiting a branch. Our digital payment portal is available 24/7 for your convenience.
                </p>
                <p className={`text-mgm-dark/50 mb-6 font-body text-sm leading-relaxed ${scrollAnim(split2InView, 280)}`}>
                  Choose from multiple payment options , scan a QR code, use UIM, or proceed through our secure payment gateway. Every transaction is instant and comes with a digital acknowledgement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SAFE PAYMENT GUIDELINES ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={guidesRef} className="text-center mb-12">
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(guidesInView, 0)}`}>Stay Safe</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 font-heading ${scrollAnim(guidesInView, 80)}`}>
                Safe Payment Guidelines
              </h2>
            </div>
            <div className="divide-y divide-mgm-dark/[0.06]">
              {[
                { icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016A11.959 11.959 0 0112 2.714z', title: 'Never share OTP', desc: 'MGM will never ask for your OTP or banking password.' },
                { icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', title: 'Verify payment amount', desc: 'Always check the amount before confirming the payment.' },
                { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: 'Use official portal only', desc: 'Only pay through this official MGM Financiers payment page.' },
                { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', title: 'Retain acknowledgement', desc: 'Save or screenshot your payment confirmation for records.' },
                { icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z', title: 'Contact RM if not reflected', desc: 'If payment is not reflected, contact your Relationship Manager.' },
                { icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Check SSL certificate', desc: 'Ensure the URL shows a padlock icon and starts with https://.' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 sm:gap-5 py-5 first:pt-0 last:pb-0 ${scrollAnim(guidesInView, 80 + i * 60)}`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-mgm-gold/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-mgm-dark text-sm">{item.title}</h3>
                    <p className="text-mgm-dark/40 font-body text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PAYMENT TIMELINE ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={assistRef}>
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(assistInView, 0)}`}>Support</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 mb-10 font-heading ${scrollAnim(assistInView, 80)}`}>
                Need Assistance?
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', title: 'Relationship Manager', detail: 'Contact your assigned RM for personalized support', action: 'View Details' },
                  { icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z', title: 'Customer Care', detail: '+91 98765 43210', action: 'Call Now' },
                  { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', title: 'Email Support', detail: 'support@mgmfinanciers.com', action: 'Send Email' },
                ].map((item, i) => (
                  <div key={i} className={`group bg-mgm-light/50 rounded-2xl p-7 border border-mgm-dark/5 hover:shadow-lg hover:shadow-mgm-dark/5 hover:-translate-y-1 transition-all duration-300 ${scrollAnim(assistInView, 120 + i * 80)}`}>
                    <div className="w-12 h-12 rounded-xl bg-mgm-gold/10 flex items-center justify-center mb-5 group-hover:bg-mgm-gold/20 transition-colors">
                      <svg className="w-6 h-6 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                    </div>
                    <h3 className="font-heading font-bold text-mgm-dark text-base mb-2">{item.title}</h3>
                    <p className="text-mgm-dark/40 font-body text-sm mb-4">{item.detail}</p>
                    <span className="text-mgm-gold font-body text-sm font-semibold cursor-pointer hover:underline">{item.action} →</span>
                  </div>
                ))}
              </div>
              <div className={`mt-8 bg-mgm-light/50 rounded-2xl p-6 border border-mgm-dark/5 ${scrollAnim(assistInView, 400)}`}>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-mgm-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <h4 className="font-heading font-bold text-mgm-dark text-sm mb-1">Office Hours</h4>
                    <p className="text-mgm-dark/40 font-body text-sm">Monday – Saturday: 9:00 AM – 6:00 PM | Sunday: Closed</p>
                    <p className="text-mgm-dark/30 font-body text-xs mt-1">Emergency: Available 24/7 via email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TRACK PAYMENT ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-light/30 relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <span className="text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body">Payment Status</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 font-heading">
                Track Your Payment
              </h2>
              <p className="text-mgm-dark/40 font-body text-sm mt-3">Enter your registered phone number to check the status of your latest payment.</p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl shadow-mgm-dark/5 border border-mgm-dark/5 p-8 sm:p-10">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="tel"
                    value={trackPhone}
                    onChange={(e) => { setTrackPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10)); setTrackResult(null); setTrackError(''); }}
                    placeholder="Enter 10-digit phone number"
                    className="w-full bg-mgm-light/40 border border-mgm-dark/10 rounded-xl px-4 py-3 font-body text-sm text-mgm-dark outline-none focus:border-mgm-gold/40 focus:ring-2 focus:ring-mgm-gold/10 transition-all"
                  />
                </div>
                <button
                  onClick={handleTrackPayment}
                  disabled={trackLoading || trackPhone.replace(/\D/g, '').length < 10}
                  className="btn-interactive bg-mgm-gold text-mgm-dark px-6 py-3 rounded-xl font-semibold text-sm hover:bg-mgm-gold/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {trackLoading ? (
                    <div className="w-4 h-4 border-2 border-mgm-dark/20 border-t-mgm-dark rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  )}
                  Track
                </button>
              </div>
              {trackError && (
                <p className="text-red-400 font-body text-xs mt-3">{trackError}</p>
              )}
              {trackResult && (
                <div className="mt-6 bg-mgm-light/60 rounded-2xl p-5 border border-mgm-dark/5 space-y-3">
                  {trackResult.length > 0 ? trackResult.map((p, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-mgm-dark/5 mb-3 last:mb-0">
                      <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Name</span><span className="font-heading font-semibold text-mgm-dark text-sm">{p.customerName}</span></div>
                      <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Order ID</span><span className="font-body text-mgm-dark/70 text-sm">{p.orderId}</span></div>
                      <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Amount</span><span className="font-heading font-bold text-mgm-dark">{formatINRDisplay(parseInt(String(p.amount)))}</span></div>
                      <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Type</span><span className="font-heading font-semibold text-mgm-dark text-sm">{p.paymentType}</span></div>
                      <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Status</span>
                        <span className={`font-heading font-semibold text-sm ${
                          p.status === 'SUCCESS' || p.status === 'COMPLETED' ? 'text-green-600' :
                          p.status === 'FAILED' || p.status === 'EXPIRED' ? 'text-red-500' :
                          p.status === 'PROCESSING' ? 'text-amber-500' :
                          p.status === 'REFUNDED' ? 'text-purple-500' : 'text-mgm-dark'
                        }`}>{p.status}</span>
                      </div>
                      {p.paidAt && (
                        <div className="flex justify-between mb-2"><span className="text-mgm-dark/50 font-body text-sm">Paid At</span><span className="font-body text-mgm-dark/70 text-sm">{new Date(p.paidAt).toLocaleString('en-IN')}</span></div>
                      )}
                      <div className="flex justify-between"><span className="text-mgm-dark/50 font-body text-sm">Date</span><span className="font-body text-mgm-dark/70 text-sm">{new Date(p.createdAt).toLocaleString('en-IN')}</span></div>
                    </div>
                  )) : (
                    <div className="text-center py-4">
                      <p className="text-mgm-dark/40 font-body text-sm">No payment records found</p>
                    </div>
                  )}
                  </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
