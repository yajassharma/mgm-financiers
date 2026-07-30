import { useState, useEffect, useRef, useCallback } from 'react'
const WHATSAPP_NUMBER = '919988881003'

const LOAN_TYPES = [
  'Personal Loan',
  'Loan Against Property',
  'Vehicle Loan',
  'Gold Loan',
  'Construction Loan',
  'Consumer Durable Loan',
]

const EMPLOYMENT_TYPES = [
  'Salaried',
  'Self-employed',
  'Business Owner',
  'Professional',
  'Other',
]

const PURPOSE_PLACEHOLDERS = [
  'Business Expansion',
  'Education',
  'Medical',
  'Vehicle Purchase',
  'Home Renovation',
  'Working Capital',
  'Other',
]

function formatCurrency(value) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  return num.toLocaleString('en-IN')
}

function parseCurrency(formatted) {
  return formatted.replace(/,/g, '')
}

function buildWhatsAppUrl(data) {
  const lines = [
    'Hello MGM Financiers,',
    '',
    'I would like to enquire about a loan.',
    '',
    '━━━━━━━━━━━━━━━━━━',
    '',
    `Full Name: ${data.name}`,
    `Mobile: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Loan Type: ${data.loanType}`,
    `Required Amount: ₹${data.amount}`,
    `Employment: ${data.employment}`,
    data.cibil === 'not-sure'
      ? 'CIBIL Score: I am not sure. Please guide me.'
      : `CIBIL Score: ${data.cibil}`,
    data.purpose ? `Purpose: ${data.purpose}` : null,
    '',
    '━━━━━━━━━━━━━━━━━━',
    '',
    'Kindly guide me through the next steps.',
    '',
    'Thank you.',
  ].filter(Boolean)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

async function submitLoanLead(data) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit lead')
  return res.json()
}

export default function ApplyNow({ isOpen, onClose }) {
const [section, setSection] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [cibilKnown, setCibilKnown] = useState(null)
  const [amount, setAmount] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const modalRef = useRef(null)
  const firstInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    loanType: '',
    cibil: '',
    employment: '',
    purpose: '',
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setSection(0)
      setErrors({})
      setCibilKnown(null)
      setAmount('')
      setForm({ name: '', phone: '', email: '', loanType: '', cibil: '', employment: '', purpose: '' })
      setLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 400)
    }
  }, [isOpen, section])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  const validateSection = () => {
    const errs = {}
    if (section === 0) {
      if (!form.name.trim()) errs.name = 'Please enter your name'
      if (!form.phone.trim()) errs.phone = 'Please enter your mobile number'
      else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter a valid 10-digit Indian mobile number'
    }
    if (section === 1) {
      if (!form.loanType) errs.loanType = 'Please select a loan type'
      if (!amount.trim()) errs.amount = 'Please enter the loan amount'
      else if (parseCurrency(amount) < 1000) errs.amount = 'Minimum amount is ₹1,000'
    }
    if (section === 2) {
      if (cibilKnown === null) errs.cibil = 'Please select an option'
      if (cibilKnown === 'yes') {
        const score = parseInt(form.cibil, 10)
        if (!form.cibil || isNaN(score) || score < 300 || score > 900) errs.cibil = 'Enter a valid CIBIL score (300–900)'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextSection = () => {
    if (validateSection()) setSection((s) => s + 1)
  }

  const prevSection = () => setSection((s) => Math.max(0, s - 1))

  const handleSubmit = async () => {
    if (!validateSection()) return
    setLoading(true)
    const leadData = {
      ...form,
      amount: parseCurrency(amount),
      cibil: cibilKnown === 'not-sure' ? 'not-sure' : form.cibil,
    }
    await submitLoanLead(leadData)
    await new Promise((r) => setTimeout(r, 800))
    window.open(buildWhatsAppUrl(leadData), '_blank', 'noopener,noreferrer')
    setLoading(false)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const sectionTitles = ['Your Details', 'Loan Requirement', 'Credit Profile', 'Optional Details']

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Apply for a loan"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm anim-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col ${
          isMobile ? 'max-h-[85vh]' : 'max-h-[88vh]'
        } anim-modal-enter`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-mgm-dark font-heading tracking-tight">{'Loan Application Form'}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-mgm-dark/45 font-body text-xs sm:text-sm leading-relaxed">
            {'Fill in your details below'}
          </p>
          <div className="flex items-center gap-3 sm:gap-4 mt-2.5 sm:mt-3">
            {['RBI Registered NBFC', 'Secure Information', 'No Hidden Charges'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-mgm-dark/40 text-[10px] sm:text-[11px] font-body">
                <svg className="w-3 h-3 text-mgm-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pt-3 flex-shrink-0 sm:px-6 sm:pt-4">
          <div className="flex gap-1.5">
            {sectionTitles.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < section ? 'bg-mgm-gold w-full' : i === section ? 'bg-mgm-gold w-1/2' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-mgm-dark/30 text-[11px] font-body mt-1.5 sm:mt-2">
            Step {section + 1} of 4 &mdash; {sectionTitles[section]}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {/* Section 0: Your Details */}
          {section === 0 && (
            <div className="space-y-5 anim-section-enter">
              <InputField
                ref={firstInputRef}
                label={'Full Name'}
                required
                value={form.name}
                onChange={(v) => update('name', v)}
                error={errors.name}
                placeholder={'Enter your full name'}
              />
              <InputField
                label={'Mobile Number'}
                required
                value={form.phone}
                onChange={(v) => {
                  const digits = v.replace(/\D/g, '').slice(0, 10)
                  update('phone', digits)
                }}
                error={errors.phone}
                placeholder={'Enter 10-digit mobile number'}
                type="tel"
                prefix="+91"
              />
              <InputField
                label={'Email Address'}
                value={form.email}
                onChange={(v) => update('email', v)}
                error={errors.email}
                placeholder={'Enter your email'}
                type="email"
              />
              <p className="text-mgm-dark/25 text-[11px] font-body">Email is optional but helps us send you loan details.</p>
            </div>
          )}

          {/* Section 1: Loan Requirement */}
          {section === 1 && (
            <div className="space-y-5 anim-section-enter">
              <SelectField
                label={'Loan Type'}
                required
                value={form.loanType}
                onChange={(v) => update('loanType', v)}
                options={LOAN_TYPES}
                placeholder={'Select loan type'}
                error={errors.loanType}
              />
              <div>
                <label className="block text-mgm-dark/50 text-xs font-body font-medium mb-2">
                  {'Loan Amount'} <span className="text-mgm-gold">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mgm-dark/40 font-body text-sm font-medium">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(formatCurrency(e.target.value))}
                    placeholder={'Enter desired loan amount'}
                    className={`w-full pl-8 pr-4 py-3.5 bg-gray-50 border ${
                      errors.amount ? 'border-red-300' : 'border-gray-200'
                    } rounded-2xl text-mgm-dark font-body text-sm focus:outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-all placeholder:text-gray-300`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1.5 font-body">{errors.amount}</p>}
                {amount && parseCurrency(amount) >= 1000 && (
                  <p className="text-mgm-dark/30 text-[11px] font-body mt-1.5">
                    Estimated Requirement: ₹{formatCurrency(amount)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Credit Profile */}
          {section === 2 && (
            <div className="space-y-5 anim-section-enter">
              <label className="block text-mgm-dark/50 text-xs font-body font-medium">
                Do you know your CIBIL Score?
              </label>
              <div className="flex gap-3">
                {[
                  { val: 'yes', label: 'Yes' },
                  { val: 'not-sure', label: "I'm Not Sure" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setCibilKnown(opt.val)
                      if (errors.cibil) setErrors((e) => ({ ...e, cibil: null }))
                    }}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-body font-medium border transition-all duration-300 ${
                      cibilKnown === opt.val
                        ? 'bg-mgm-gold text-white border-mgm-gold shadow-md shadow-mgm-gold/20'
                        : 'bg-gray-50 text-mgm-dark/60 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.cibil && <p className="text-red-500 text-xs font-body">{errors.cibil}</p>}

              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  cibilKnown === 'yes' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <InputField
                  label={'CIBIL Score'}
                  required
                  value={form.cibil}
                  onChange={(v) => {
                    const digits = v.replace(/\D/g, '').slice(0, 3)
                    update('cibil', digits)
                  }}
                  placeholder={'Select CIBIL score range'}
                  type="tel"
                />
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  cibilKnown === 'not-sure' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-mgm-gold/5 border border-mgm-gold/15 rounded-2xl p-4">
                  <p className="text-mgm-dark/50 font-body text-sm leading-relaxed">
                    Our loan advisor can help you understand your eligibility and guide you through the next steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Optional Details */}
          {section === 3 && (
            <div className="space-y-5 anim-section-enter">
              <SelectField
                label={'Employment Type'}
                value={form.employment}
                onChange={(v) => update('employment', v)}
                options={EMPLOYMENT_TYPES}
                placeholder={'Select employment type'}
              />
              <div>
                <label className="block text-mgm-dark/50 text-xs font-body font-medium mb-2">{'Purpose of Loan'}</label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => update('purpose', e.target.value)}
                  rows={3}
                  placeholder={PURPOSE_PLACEHOLDERS.join(' · ')}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-mgm-dark font-body text-sm focus:outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-all resize-none placeholder:text-gray-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0 sm:px-6 sm:pb-6 sm:pt-4">
          {/* Privacy note */}
          <div className="flex items-start gap-2 mb-4">
            <svg className="w-3.5 h-3.5 text-mgm-dark/25 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
            </svg>
            <p className="text-mgm-dark/30 text-[11px] font-body leading-relaxed">
              Your information is used only for processing your enquiry. No spam. No unnecessary communication.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {section > 0 && (
              <button
                onClick={prevSection}
                className="px-5 py-3.5 rounded-2xl border border-gray-200 text-mgm-dark/60 text-sm font-body font-medium hover:bg-gray-50 transition-colors"
              >
                {'Previous'}
              </button>
            )}
            {section < 3 ? (
              <button
                onClick={nextSection}
                className="flex-1 py-3.5 rounded-2xl bg-mgm-dark text-white text-sm font-body font-semibold hover:bg-mgm-dark/90 transition-all btn-interactive"
              >
                {'Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl bg-mgm-gold text-white text-sm font-body font-semibold hover:bg-mgm-gold/90 transition-all btn-interactive flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {'Submitting...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {'Submit Application'}
                  </>
                )}
              </button>
            )}
          </div>
          {section === 3 && !loading && (
            <p className="text-mgm-dark/25 text-[11px] font-body text-center mt-3">
              No payment required. No obligation. Our advisor will guide you personally.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */

import { forwardRef } from 'react'

const InputField = forwardRef(function InputField({ label, required, value, onChange, error, placeholder, type = 'text', prefix }, ref) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-mgm-dark/50 text-xs font-body font-medium mb-2">
        {label} {required && <span className="text-mgm-gold">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mgm-dark/40 font-body text-sm font-medium">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          inputMode={type === 'tel' ? 'numeric' : type === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`w-full ${prefix ? 'pl-14' : 'pl-4'} pr-4 py-3.5 bg-gray-50 border ${
            error ? 'border-red-300' : focused ? 'border-mgm-gold ring-2 ring-mgm-gold/10' : 'border-gray-200'
          } rounded-2xl text-mgm-dark font-body text-sm focus:outline-none transition-all placeholder:text-gray-300`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-body">{error}</p>}
    </div>
  )
})

function SelectField({ label, required, value, onChange, options, placeholder, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-mgm-dark/50 text-xs font-body font-medium mb-2">
        {label} {required && <span className="text-mgm-gold">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full appearance-none px-4 py-3.5 bg-gray-50 border ${
            error ? 'border-red-300' : focused ? 'border-mgm-gold ring-2 ring-mgm-gold/10' : 'border-gray-200'
          } rounded-2xl text-mgm-dark font-body text-sm focus:outline-none transition-all ${
            value ? '' : 'text-gray-300'
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-dark/30 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-body">{error}</p>}
    </div>
  )
}
