import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import SEO from './SEO'
import useInView from '../hooks/useInView'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Header from './Header'
import Footer from './Footer'

// ── Utilities ──────────────────────────────────────────────
const formatINR = (num) => {
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000) return '₹' + (num / 100000).toFixed(2) + ' L'
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

const formatINRFull = (num) => '₹' + Math.round(num).toLocaleString('en-IN')

const formatINRDecimal = (num) => '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatPercent = (num) => num.toFixed(1) + '%'

const calcEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 }
  const r = annualRate / 12 / 100
  const n = tenureMonths
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const totalAmount = emi * n
  const totalInterest = totalAmount - principal
  return { emi, totalInterest, totalAmount }
}

const calcSchedule = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return []
  const r = annualRate / 12 / 100
  const n = tenureMonths
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const schedule = []
  let balance = principal
  for (let m = 1; m <= n; m++) {
    const interestPaid = balance * r
    const principalPaid = emi - interestPaid
    balance = Math.max(0, balance - principalPaid)
    schedule.push({ month: m, principalPaid, interestPaid, balance })
  }
  return schedule
}

const getLoanEndDate = (months) => {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

// ── Animated Counter Hook min 12 - 36 % interest ──────────────────────────────────
function useAnimatedValue(target, duration = 800) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(null)
  const prevRef = useRef(target)
  const startTimeRef = useRef(null)
  const targetRef = useRef(target)

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const from = prevRef.current
    startTimeRef.current = null
    targetRef.current = target

    const animate = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts
      const progress = Math.min((ts - startTimeRef.current) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const val = from + (targetRef.current - from) * ease
      setDisplay(val)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = targetRef.current
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target])

  return Math.round(display)
}

// ── Doughnut Chart ─────────────────────────────────────────
function DoughnutChart({ principal, interest, prefersReduced }) {
  const total = principal + interest
  const pPct = total > 0 ? principal / total : 0
  const r = 70
  const circumference = 2 * Math.PI * r
  const principalDash = circumference * pPct
  const animDuration = prefersReduced ? '0ms' : '1200ms'

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#1a1a2e" strokeWidth="18" opacity="0.15" />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="#1a1a2e" strokeWidth="18"
          strokeDasharray={`${principalDash} ${circumference - principalDash}`}
          strokeLinecap="round"
          style={{ transition: `stroke-dasharray ${animDuration} cubic-bezier(0.22,1,0.36,1)` }}
        />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="#c9a227" strokeWidth="18"
          strokeDasharray={`${circumference - principalDash} ${principalDash}`}
          strokeDashoffset={-principalDash}
          strokeLinecap="round"
          style={{ transition: `stroke-dasharray ${animDuration} cubic-bezier(0.22,1,0.36,1)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-mgm-dark/40 font-body">Total</span>
        <span className="text-lg sm:text-xl font-bold text-mgm-dark font-heading">{formatINR(total)}</span>
      </div>
    </div>
  )
}

// ── Slider Component ───────────────────────────────────────
function Slider({ label, value, onChange, min, max, step, format, suffix, prefix }) {
  const pct = ((value - min) / (max - min)) * 100
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')

  const handleStart = () => {
    setEditing(true)
    setInputVal(String(Math.round(value)))
  }
  const handleEnd = () => {
    setEditing(false)
    const v = parseFloat(inputVal)
    if (!isNaN(v)) onChange(Math.max(min, Math.min(max, step < 1 ? v : Math.round(v / step) * step)))
  }

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs font-semibold text-mgm-dark/60 font-body uppercase tracking-wider">{label}</span>
        {editing ? (
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={handleEnd}
            onKeyDown={(e) => e.key === 'Enter' && handleEnd()}
            className="text-right font-bold text-mgm-dark font-heading text-base sm:text-lg bg-mgm-light/60 rounded-lg px-2 py-0.5 w-32 outline-none focus:ring-2 focus:ring-mgm-gold/30"
            autoFocus
          />
        ) : (
          <button
            onClick={handleStart}
            className="font-bold text-mgm-dark font-heading text-base sm:text-lg hover:text-mgm-gold transition-colors cursor-text"
          >
            {prefix || ''}{format ? format(value) : value}{suffix || ''}
          </button>
        )}
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full bg-mgm-dark/5">
          <div
            className="absolute h-full rounded-full bg-mgm-gold/30"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-input absolute w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
          aria-label={label}
        />
        <div
          className="absolute w-5 h-5 bg-mgm-gold rounded-full shadow-lg shadow-mgm-gold/30 pointer-events-none z-20 transition-transform hover:scale-125"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-mgm-dark/30 font-body">{prefix || ''}{format ? format(min) : min}{suffix || ''}</span>
        <span className="text-[10px] text-mgm-dark/30 font-body">{prefix || ''}{format ? format(max) : max}{suffix || ''}</span>
      </div>
    </div>
  )
}

// ── Repayment Table ────────────────────────────────────────
function RepaymentTable({ schedule }) {
  const [page, setPage] = useState(0)
  const perPage = 12
  const totalPages = Math.ceil(schedule.length / perPage)
  const visible = schedule.slice(page * perPage, (page + 1) * perPage)

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF('p', 'mm', 'a4')
    doc.setFontSize(16)
    doc.text('MGM Financiers , Repayment Schedule', 14, 20)
    doc.setFontSize(9)
    doc.text('Month    Principal       Interest       Balance', 14, 30)
    doc.setFontSize(8)
    schedule.forEach((row, i) => {
      const y = 36 + i * 5
      if (y > 270) { doc.addPage(); }
      const yPos = y > 270 ? 20 : y
      doc.text(
        `${String(row.month).padStart(5)}   ${formatINRDecimal(row.principalPaid).padStart(14)}   ${formatINRDecimal(row.interestPaid).padStart(14)}   ${formatINRDecimal(row.balance).padStart(14)}`,
        14, yPos > 270 ? 20 : yPos
      )
    })
    doc.save('MGM_Repayment_Schedule.pdf')
  }

  const downloadExcel = () => {
    let csv = 'Month,Principal Paid,Interest Paid,Remaining Balance\n'
    schedule.forEach(r => {
      csv += `${r.month},${r.principalPaid.toFixed(2)},${r.interestPaid.toFixed(2)},${r.balance.toFixed(2)}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'MGM_Repayment_Schedule.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mgm-dark/10">
              <th className="text-left py-3 px-4 font-heading font-semibold text-mgm-dark/60 text-xs uppercase tracking-wider">Month</th>
              <th className="text-right py-3 px-4 font-heading font-semibold text-mgm-dark/60 text-xs uppercase tracking-wider">Principal</th>
              <th className="text-right py-3 px-4 font-heading font-semibold text-mgm-dark/60 text-xs uppercase tracking-wider">Interest</th>
              <th className="text-right py-3 px-4 font-heading font-semibold text-mgm-dark/60 text-xs uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={row.month} className={`border-b border-mgm-dark/[0.03] ${i % 2 === 0 ? 'bg-mgm-light/30' : ''}`}>
                <td className="py-3 px-4 font-body text-mgm-dark/70">{row.month}</td>
                <td className="py-3 px-4 text-right font-body text-mgm-dark">{formatINRDecimal(row.principalPaid)}</td>
                <td className="py-3 px-4 text-right font-body text-mgm-dark">{formatINRDecimal(row.interestPaid)}</td>
                <td className="py-3 px-4 text-right font-body text-mgm-dark/70">{formatINRDecimal(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 sm:px-0">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-interactive text-xs font-body font-semibold text-mgm-dark/50 hover:text-mgm-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-mgm-dark/40 font-body">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-interactive text-xs font-body font-semibold text-mgm-dark/50 hover:text-mgm-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      <div className="flex gap-3 mt-5 px-4 sm:px-0">
        <button onClick={downloadPDF} className="btn-interactive flex items-center gap-2 text-xs font-body font-semibold text-mgm-dark/50 hover:text-mgm-gold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          Download PDF
        </button>
        <button onClick={downloadExcel} className="btn-interactive flex items-center gap-2 text-xs font-body font-semibold text-mgm-dark/50 hover:text-mgm-gold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Download Excel
        </button>
      </div>
    </div>
  )
}

// ── EMI Tips Accordion ─────────────────────────────────────
const tipsData = [
  {
    q: "What is EMI?",
    a: "EMI stands for Equated Monthly Installment. It is a fixed monthly payment made by a borrower to a lender on a specified date each month. The EMI comprises both the principal amount and the interest component, spread over the loan tenure. Initially, the interest portion is higher, but as the loan progresses, more of the EMI goes toward repaying the principal."
  },
  {
    q: "How is EMI calculated?",
    a: "EMI is calculated using the reducing balance formula: EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the loan tenure in months. This formula ensures that each EMI includes both interest on the outstanding balance and a portion of the principal."
  },
  {
    q: "How can I reduce my EMI?",
    a: "You can reduce your EMI by: (1) Opting for a longer tenure , this spreads payments over more months, (2) Negotiating a lower interest rate , especially if you have a strong credit profile, (3) Making a larger down payment , reducing the principal borrowed, (4) Choosing a loan with a lower processing fee structure. However, a longer tenure means you pay more total interest over the life of the loan."
  },
  {
    q: "Reducing balance vs flat interest , what's the difference?",
    a: "Under the reducing balance method, interest is charged only on the outstanding principal, so as you repay, the interest component decreases each month. Under the flat interest method, interest is calculated on the original principal for the entire tenure, making the effective cost significantly higher. Always prefer reducing balance loans for a fairer deal."
  },
  {
    q: "What are the benefits of prepayment?",
    a: "Prepaying your loan reduces the outstanding principal, which means less interest is charged going forward. Benefits include: (1) Significant interest savings, (2) Faster loan closure, (3) Improved debt-to-income ratio. Some lenders charge a prepayment penalty (typically 2-5% of the outstanding amount), so factor this into your decision."
  },
  {
    q: "How does my credit score affect my loan?",
    a: "A higher credit score (750+) qualifies you for lower interest rates, higher loan amounts, and faster approval. Lenders use your CIBIL score to assess repayment risk. A score below 650 may result in higher rates or rejection. Maintain your score by paying EMIs on time, keeping credit utilization low, and avoiding multiple loan applications simultaneously."
  },
]

function TipsAccordion() {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {tipsData.map((tip, i) => (
        <div key={i} className="bg-white rounded-2xl border border-mgm-dark/5 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="btn-interactive w-full flex items-center justify-between p-5 sm:p-6 text-left group"
            aria-expanded={open === i}
          >
            <span className="font-heading font-semibold text-mgm-dark text-sm sm:text-base pr-4 group-hover:text-mgm-gold transition-colors">{tip.q}</span>
            <svg
              className={`w-5 h-5 text-mgm-dark/30 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? '400px' : '0px' }}
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-mgm-dark/50 font-body text-sm leading-relaxed">{tip.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
const loanTypes = [
  'Personal Loan', 'Loan Against Property', 'Business Loan',
  'Vehicle Loan', 'Consumer Durable Loan', 'Gold Loan'
]

const defaultRanges = {
  'Personal Loan':         { min: 100000,   max: 5000000,   rate: 14 },
  'Loan Against Property': { min: 100000,   max: 50000000,  rate: 12 },
  'Business Loan':         { min: 100000,   max: 20000000,  rate: 14 },
  'Vehicle Loan':          { min: 100000,   max: 15000000,  rate: 12 },
  'Consumer Durable Loan': { min: 100000,   max: 500000,    rate: 16 },
  'Gold Loan':             { min: 100000,   max: 10000000,  rate: 12 },
}

export default function EMICalculator() {
const prefersReduced = usePrefersReducedMotion()
  const scrollAnim = (inView, delay = 0) =>
    prefersReduced ? '' : `anim-scroll-fade ${inView ? 'is-visible' : ''} anim-delay-${delay}`

  const [heroRef, heroInView] = useInView({ threshold: 0.2 })
  const [calcRef, calcInView] = useInView({ threshold: 0.1 })
  const [scheduleRef, scheduleInView] = useInView({ threshold: 0.1 })
  const [insightsRef, insightsInView] = useInView({ threshold: 0.2 })
  const [whyRef, whyInView] = useInView({ threshold: 0.2 })
  const [tipsRef, tipsInView] = useInView({ threshold: 0.1 })
  const [imgRef, imgInView] = useInView({ threshold: 0.2 })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3 })

  const [loanType, setLoanType] = useState('Personal Loan')
  const ranges = defaultRanges[loanType]
  const [amount, setAmount] = useState(500000)
  const [rate, setRate] = useState(ranges.rate)
  const [tenure, setTenure] = useState(60)

  const handleTypeChange = (type) => {
    setLoanType(type)
    const r = defaultRanges[type]
    setAmount(Math.max(r.min, Math.min(r.max, amount)))
    setRate(r.rate)
  }

  const { emi, totalInterest, totalAmount } = useMemo(() => calcEMI(amount, rate, tenure), [amount, rate, tenure])
  const schedule = useMemo(() => calcSchedule(amount, rate, tenure), [amount, rate, tenure])

  const principalPct = totalAmount > 0 ? (amount / totalAmount * 100) : 0
  const interestPct = totalAmount > 0 ? (totalInterest / totalAmount * 100) : 0

  const animEmi = useAnimatedValue(Math.round(emi))
  const animInterest = useAnimatedValue(Math.round(totalInterest))
  const animTotal = useAnimatedValue(Math.round(totalAmount))

  // Dynamic insights
  const insights = useMemo(() => {
    const list = []
    if (totalInterest > 0) {
      const l = totalInterest >= 100000 ? (totalInterest / 100000).toFixed(1) + ' lakh' : formatINRFull(totalInterest)
      list.push(`This loan will cost approximately ${l} in total interest over ${tenure} months.`)
    }
    if (tenure > 36) {
      const short = tenure - 36
      const shortTotal = calcEMI(amount, rate, 36).totalInterest
      const saving = totalInterest - shortTotal
      if (saving > 0) list.push(`Choosing a 3-year tenure instead of ${Math.round(tenure / 12)} years saves approximately ${formatINR(saving)}.`)
    }
    if (emi > 0) {
      const extra = Math.round(emi * 0.1)
      const increasedEmi = emi + extra
      const r = rate / 12 / 100
      let balance = amount
      let monthsSaved = 0
      let newTotalInterest = 0
      for (let m = 1; m <= tenure; m++) {
        const intPart = balance * r
        const princPart = increasedEmi - intPart
        if (princPart <= 0) break
        newTotalInterest += intPart
        balance = Math.max(0, balance - princPart)
        if (balance <= 0) { monthsSaved = tenure - m; break }
      }
      const interestSaved = totalInterest - newTotalInterest
      if (monthsSaved > 0) {
        const y = Math.floor(monthsSaved / 12)
        const mo = monthsSaved % 12
        const timeStr = y > 0 ? `${y} year${y > 1 ? 's' : ''}${mo > 0 ? ` ${mo} month${mo > 1 ? 's' : ''}` : ''}` : `${mo} month${mo > 1 ? 's' : ''}`
        list.push(`Increasing your EMI by just ${formatINRFull(extra)}/month would close your loan ${timeStr} earlier and save approximately ${formatINR(interestSaved)} in interest.`)
      }
    }
    if (rate > 10) list.push(`A credit score above 750 could help you negotiate a lower interest rate.`)
    return list
  }, [amount, rate, tenure, emi, totalInterest, totalAmount])

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="EMI Calculator | Calculate Loan EMI Online | MGM Financiers"
        description="Use our free online EMI Calculator to calculate your monthly loan payments for Personal Loan, Vehicle Loan, Gold Loan, and more. Get instant results with detailed repayment schedule."
        canonical="/emi-calculator"
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
                <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(heroInView, 0)}`}>{'EMI Calculator'}</span>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(heroInView, 80)}`}>
                  Calculate Your EMI<br />with Confidence
                </h1>
                <p className={`text-mgm-dark/50 font-body text-sm sm:text-base leading-relaxed mb-8 max-w-lg ${scrollAnim(heroInView, 160)}`}>
                  {'Calculate your monthly EMI instantly'}
                </p>
                <div className={`flex flex-col sm:flex-row gap-3 ${scrollAnim(heroInView, 240)}`}>
                  <a href="#calculator" className="btn-interactive inline-flex items-center justify-center gap-2 bg-mgm-gold text-mgm-dark px-7 py-3 rounded-xl font-semibold hover:bg-mgm-gold/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-gold/20">
                    {'Calculate EMI'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </a>
                  <button onClick={() => window.dispatchEvent(new Event('open-apply'))} className="btn-interactive inline-flex items-center justify-center gap-2 border-2 border-mgm-dark/10 text-mgm-dark px-7 py-3 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                    Apply for Loan
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>

              {/* Right: SVG Illustration */}
              <div className={`w-full lg:w-1/2 flex justify-center ${scrollAnim(heroInView, 160)}`}>
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                  {/* Glass dashboard */}
                  <div className="absolute inset-4 sm:inset-6 rounded-3xl bg-gradient-to-br from-mgm-dark/[0.03] to-mgm-gold/[0.03] border border-mgm-dark/5 backdrop-blur-sm" />
                  <div className="absolute inset-8 sm:inset-12 rounded-2xl bg-white border border-mgm-dark/5 shadow-xl shadow-mgm-dark/5 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-mgm-gold" />
                      <div className="w-2 h-2 rounded-full bg-mgm-dark/20" />
                      <div className="w-2 h-2 rounded-full bg-mgm-dark/10" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-mgm-dark/5 rounded-full w-3/4" />
                      <div className="h-3 bg-mgm-gold/20 rounded-full w-1/2" />
                      <div className="h-8 bg-mgm-dark/[0.03] rounded-lg mt-4" />
                      <div className="flex gap-2 mt-3">
                        <div className="h-20 flex-1 bg-mgm-gold/10 rounded-lg" />
                        <div className="h-20 flex-1 bg-mgm-dark/5 rounded-lg" />
                        <div className="h-20 flex-1 bg-mgm-dark/[0.03] rounded-lg" />
                      </div>
                    </div>
                  </div>
                  {/* Floating accent */}
                  <div className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-mgm-gold/10 border border-mgm-gold/20 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CALCULATOR ═══ */}
        <section id="calculator" className="py-16 sm:py-24 bg-mgm-light/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.03] pointer-events-none" />

          <div ref={calcRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl shadow-mgm-dark/5 border border-mgm-dark/5 overflow-hidden">
              <div className="flex flex-col lg:flex-row">

                {/* LEFT: Controls */}
                <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-12">
                  <h2 className={`text-xl sm:text-2xl font-bold text-mgm-dark font-heading mb-8 ${scrollAnim(calcInView, 0)}`}>
                    Loan Details
                  </h2>

                  {/* Loan Type */}
                  <div className={`mb-8 ${scrollAnim(calcInView, 40)}`}>
                    <label className="block text-xs font-semibold text-mgm-dark/60 font-body uppercase tracking-wider mb-3">Loan Type</label>
                    <div className="relative">
                      <select
                        value={loanType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full appearance-none bg-mgm-light/60 border border-mgm-dark/5 rounded-xl px-5 py-3.5 text-sm font-body text-mgm-dark focus:outline-none focus:ring-2 focus:ring-mgm-gold/30 cursor-pointer"
                      >
                        {loanTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-dark/30 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className={`space-y-2 ${scrollAnim(calcInView, 80)}`}>
                    <Slider
                      label={'Loan Amount'}
                      value={amount}
                      onChange={setAmount}
                      min={ranges.min}
                      max={ranges.max}
                      step={ranges.max > 5000000 ? 50000 : 10000}
                      format={formatINR}
                    />
                    <Slider
                      label={'Interest Rate'}
                      value={rate}
                      onChange={setRate}
                      min={12}
                      max={48}
                      step={0.1}
                      format={formatPercent}
                    />
                    <Slider
                      label={'Loan Tenure'}
                      value={tenure}
                      onChange={setTenure}
                      min={12}
                      max={360}
                      step={1}
                      format={(v) => `${v} mo (${Math.floor(v / 12)}y ${v % 12}m)`}
                    />
                  </div>

                  {/* Live Calculations */}
                  <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 ${scrollAnim(calcInView, 160)}`}>
                    {[
                      { label: 'Monthly EMI', value: formatINRFull(animEmi), accent: true },
                      { label: 'Total Interest', value: formatINR(animInterest) },
                      { label: 'Total Payment', value: formatINR(animTotal) },
                      { label: 'Principal %', value: formatPercent(principalPct) },
                      { label: 'Interest %', value: formatPercent(interestPct) },
                      { label: 'Loan Ends', value: getLoanEndDate(tenure) },
                    ].map((item, i) => (
                      <div key={i} className={`rounded-xl p-3.5 ${item.accent ? 'bg-mgm-gold/10 border border-mgm-gold/20' : 'bg-mgm-light/60 border border-mgm-dark/[0.03]'}`}>
                        <div className="text-[10px] text-mgm-dark/40 font-body uppercase tracking-wider mb-1">{item.label}</div>
                        <div className={`font-heading font-bold text-sm ${item.accent ? 'text-mgm-dark' : 'text-mgm-dark/80'}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Visualization */}
                <div className="w-full lg:w-[45%] bg-mgm-light/30 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-mgm-dark/5">
                  <h3 className={`text-sm font-semibold text-mgm-dark/50 font-body uppercase tracking-wider mb-8 ${scrollAnim(calcInView, 80)}`}>{'EMI Breakdown'}</h3>

                  <DoughnutChart principal={amount} interest={totalInterest} prefersReduced={prefersReduced} />

                  <div className={`grid grid-cols-3 gap-4 mt-8 w-full max-w-sm ${scrollAnim(calcInView, 160)}`}>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-mgm-dark" />
                        <span className="text-[10px] text-mgm-dark/40 font-body">{'Principal Amount'}</span>
                      </div>
                      <div className="font-heading font-bold text-mgm-dark text-sm">{formatINR(animTotal > 0 ? amount : 0)}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-mgm-gold" />
                        <span className="text-[10px] text-mgm-dark/40 font-body">{'Interest Amount'}</span>
                      </div>
                      <div className="font-heading font-bold text-mgm-gold text-sm">{formatINR(animInterest)}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-mgm-dark/20" />
                        <span className="text-[10px] text-mgm-dark/40 font-body">{'Total Payment'}</span>
                      </div>
                      <div className="font-heading font-bold text-mgm-dark text-sm">{formatINR(animTotal)}</div>
                    </div>
                  </div>

                  <div className={`mt-8 text-center ${scrollAnim(calcInView, 200)}`}>
                    <div className="text-[10px] text-mgm-dark/30 font-body mb-1">Effective Monthly Rate</div>
                    <div className="font-heading font-bold text-mgm-dark text-lg">{(rate / 12).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ DISCLAIMER ═══ */}
        <section className="py-8 sm:py-12 bg-mgm-light/50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-mgm-dark/5 flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 rounded-xl bg-mgm-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-mgm-dark font-heading mb-1">Disclaimer</h4>
                <p className="text-mgm-dark/50 font-body text-xs leading-relaxed">
                  The EMI calculations shown above are rough estimates based on mathematical formulas and are for informational purposes only. They do not include any processing fees, prepayment charges, or other applicable fees. Actual EMI may vary based on your profile, credit assessment, and final loan terms. Please contact our advisors for exact figures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ REPAYMENT SCHEDULE ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={scheduleRef}>
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(scheduleInView, 0)}`}>{'Amortization Schedule'}</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 mb-10 font-heading ${scrollAnim(scheduleInView, 80)}`}>
                Month-by-Month Breakdown
              </h2>
              <div className={`bg-mgm-light/30 rounded-2xl border border-mgm-dark/5 p-4 sm:p-8 ${scrollAnim(scheduleInView, 120)}`}>
                <RepaymentTable schedule={schedule} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ KEY INSIGHTS ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-light/50 relative overflow-hidden">
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.03] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={insightsRef}>
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(insightsInView, 0)}`}>Key Insights</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 mb-8 font-heading ${scrollAnim(insightsInView, 80)}`}>
                Smart Observations
              </h2>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className={`flex items-start gap-4 bg-white rounded-2xl p-5 sm:p-6 border border-mgm-dark/5 ${scrollAnim(insightsInView, 120 + i * 60)}`}>
                    <div className="w-8 h-8 rounded-xl bg-mgm-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <p className="text-mgm-dark/60 font-body text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ WHY USE MGM ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-mgm-dark/[0.015] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={whyRef} className="text-center mb-12">
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(whyRef, 0)}`}>Why MGM</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 font-heading ${scrollAnim(whyRef, 80)}`}>
                Why Customers Trust Us
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { title: 'Fast Processing', desc: 'Quick approvals and disbursals. Most loans processed within 48 hours of document verification.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
                { title: 'Minimal Documentation', desc: 'We ask for only what is necessary. Simple paperwork, faster onboarding.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                { title: 'Transparent Charges', desc: 'No hidden fees. Complete clarity on charges, terms, and conditions before you sign.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
              ].map((item, i) => (
                <div key={i} className={`group bg-mgm-light/50 rounded-2xl p-7 sm:p-8 border border-mgm-dark/5 hover:shadow-xl hover:shadow-mgm-dark/5 hover:-translate-y-1 transition-all duration-300 ${scrollAnim(whyInView, 80 + i * 80)}`}>
                  <div className="w-12 h-12 rounded-xl bg-mgm-gold/10 flex items-center justify-center mb-5 group-hover:bg-mgm-gold/20 transition-colors">
                    <svg className="w-6 h-6 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-mgm-dark text-base mb-3">{item.title}</h3>
                  <p className="text-mgm-dark/50 font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ EMI TIPS ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-light/50 relative overflow-hidden">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={tipsRef} className="text-center mb-10">
              <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(tipsRef, 0)}`}>Learn</span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-3 font-heading ${scrollAnim(tipsRef, 80)}`}>
                EMI Tips & Insights
              </h2>
            </div>
            <div className={scrollAnim(tipsRef, 120)}>
              <TipsAccordion />
            </div>
          </div>
        </section>

        {/* ═══ IMAGE SECTION ═══ */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={imgRef} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className={`w-full lg:w-1/2 ${scrollAnim(imgInView, 0)}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-mgm-dark/10">
                  <img src="/emicalculatormgm.png" alt="MGM Financiers advisors" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className={`text-mgm-gold font-semibold text-xs tracking-widest uppercase font-body ${scrollAnim(imgInView, 80)}`}>Responsible Borrowing</span>
                <h2 className={`text-2xl sm:text-3xl font-bold text-mgm-dark mt-4 mb-6 font-heading leading-tight ${scrollAnim(imgInView, 160)}`}>
                  Borrow Smart,<br />Repay Smarter
                </h2>
                <p className={`text-mgm-dark/50 mb-4 font-body text-sm leading-relaxed ${scrollAnim(imgInView, 240)}`}>
                  At MGM Financiers, we believe in responsible lending. Before taking a loan, understand your repayment capacity and choose terms that align with your financial goals.
                </p>
                <p className={`text-mgm-dark/50 mb-6 font-body text-sm leading-relaxed ${scrollAnim(imgInView, 280)}`}>
                  Our advisors take the time to walk you through every option, explain the costs clearly, and help you make an informed decision. We don't just process loans , we build financial relationships.
                </p>
                <div className={`flex items-center gap-3 ${scrollAnim(imgInView, 320)}`}>
                  <div className="w-10 h-10 rounded-xl bg-mgm-gold/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-mgm-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-mgm-dark/60 font-body text-sm">RBI Approved · 28+ Years · 100% Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-16 sm:py-24 bg-mgm-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-mgm-gold/[0.05] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full bg-white/[0.02] pointer-events-none" />

          <div ref={ctaRef} className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className={`text-3xl sm:text-4xl font-bold text-white mb-4 font-heading ${scrollAnim(ctaInView, 0)}`}>
              Ready to Apply?
            </h2>
            <p className={`text-white/50 font-body text-sm sm:text-base mb-10 max-w-lg mx-auto ${scrollAnim(ctaInView, 80)}`}>
              Our financial advisors are here to help you choose the right loan. Get started today.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${scrollAnim(ctaInView, 160)}`}>
              <button onClick={() => window.dispatchEvent(new Event('open-apply'))} className="btn-interactive inline-flex items-center justify-center gap-2 bg-mgm-gold text-mgm-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-mgm-gold/90 transition-all duration-200 font-body text-sm shadow-lg shadow-mgm-gold/20">
                Apply for Loan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <a href="#contact" className="btn-interactive inline-flex items-center justify-center gap-2 border-2 border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:border-mgm-gold/30 hover:text-mgm-gold transition-all duration-200 font-body text-sm">
                Contact Our Team
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
