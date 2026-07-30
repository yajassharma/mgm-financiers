import { Link } from 'react-router-dom'
import { useState, useCallback, useRef, useEffect } from 'react';
import SEO from './SEO'
;

const API = '/api';

const LOAN_TYPES = [
  'Personal Loan', 'Business Loan', 'Loan Against Property',
  'Vehicle Loan', 'Consumer Durable Loan', 'Gold Loan',
];

const CATEGORIES = [
  'Loan Processing', 'Interest Related', 'EMI Payment',
  'Loan Closure', 'Foreclosure', 'Customer Service',
  'Technical Issue', 'Document Related', 'Others',
];

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  ACKNOWLEDGED: 'bg-indigo-100 text-indigo-700',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
  INFO_REQUESTED: 'bg-orange-100 text-orange-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  SUBMITTED: 'Submitted',
  ACKNOWLEDGED: 'Acknowledged',
  UNDER_REVIEW: 'Under Review',
  INFO_REQUESTED: 'Information Requested',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

const STATUS_FLOW = [
  'SUBMITTED', 'ACKNOWLEDGED', 'UNDER_REVIEW',
  'INFO_REQUESTED', 'RESOLVED', 'CLOSED',
];

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        {/* Background glow */}
        <radialGradient id="gg-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.06" />
          <stop offset="60%" stopColor="#c9a227" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        {/* Document card glass */}
        <linearGradient id="gg-doc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f8f9fa" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gg-doc-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2e4e8" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        {/* Status card Submitted */}
        <linearGradient id="gg-submitted" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f9fafb" />
        </linearGradient>
        {/* Status card Review */}
        <linearGradient id="gg-review" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f9fafb" />
        </linearGradient>
        {/* Status card Resolved */}
        <linearGradient id="gg-resolved" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f9fafb" />
        </linearGradient>
        {/* Soft shadows */}
        <filter id="gg-shadow-sm" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#1a1a2e" floodOpacity="0.06" />
        </filter>
        <filter id="gg-shadow-md" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#1a1a2e" floodOpacity="0.08" />
        </filter>
        <filter id="gg-shadow-lg" x="-15%" y="-10%" width="130%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="20" floodColor="#1a1a2e" floodOpacity="0.1" />
        </filter>
        {/* Concentric ring pattern */}
        <pattern id="gg-rings" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="9" fill="none" stroke="#1a1a2e" strokeWidth="0.3" opacity="0.04" />
        </pattern>
      </defs>

      {/* === BACKGROUND LAYERS === */}
      {/* Warm glow */}
      <ellipse cx="260" cy="200" rx="220" ry="180" fill="url(#gg-glow)" />

      {/* Architectural concentric rings — very subtle */}
      <circle cx="260" cy="200" r="195" fill="none" stroke="#1a1a2e" strokeWidth="0.4" opacity="0.03" />
      <circle cx="260" cy="200" r="165" fill="none" stroke="#1a1a2e" strokeWidth="0.3" opacity="0.04" />
      <circle cx="260" cy="200" r="135" fill="none" stroke="#c9a227" strokeWidth="0.3" opacity="0.05" />
      <circle cx="260" cy="200" r="105" fill="none" stroke="#1a1a2e" strokeWidth="0.3" opacity="0.03" />

      {/* Soft fill ring */}
      <circle cx="260" cy="200" r="120" fill="#f8f9fa" opacity="0.5" />

      {/* === CONNECTING CURVED LINES === */}
      {/* Document to Submitted (top-left) */}
      <path d="M210 175 C180 175, 140 145, 118 120" stroke="#c9a227" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.35" fill="none" strokeLinecap="round" />
      {/* Document to Under Review (right) */}
      <path d="M310 195 C340 195, 370 175, 395 160" stroke="#1a1a2e" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.25" fill="none" strokeLinecap="round" />
      {/* Document to Resolved (bottom) */}
      <path d="M260 265 C260 290, 260 310, 260 325" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.3" fill="none" strokeLinecap="round" />

      {/* === FLOATING STATUS CARDS === */}

      {/* --- Submitted Card (top-left) --- */}
      <g filter="url(#gg-shadow-sm)" className="origin-center" style={{ animation: 'fadeInUp 0.8s 0.3s both' }}>
        <rect x="56" y="82" width="120" height="56" rx="14" fill="url(#gg-submitted)" stroke="#e5e7eb" strokeWidth="0.8" />
        {/* Status dot */}
        <circle cx="76" cy="102" r="4" fill="#3b82f6" />
        <text x="86" y="106" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#1a1a2e">Submitted</text>
        {/* Tiny document lines */}
        <rect x="76" y="116" width="48" height="2.5" rx="1.25" fill="#e5e7eb" />
        <rect x="76" y="122" width="32" height="2.5" rx="1.25" fill="#e5e7eb" opacity="0.6" />
      </g>

      {/* --- Under Review Card (right) --- */}
      <g filter="url(#gg-shadow-sm)" style={{ animation: 'fadeInUp 0.8s 0.6s both' }}>
        <rect x="348" y="130" width="130" height="56" rx="14" fill="url(#gg-review)" stroke="#e5e7eb" strokeWidth="0.8" />
        {/* Status dot */}
        <circle cx="368" cy="150" r="4" fill="#eab308" />
        <text x="378" y="154" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#1a1a2e">Under Review</text>
        {/* Tiny progress bar */}
        <rect x="368" y="164" width="56" height="3" rx="1.5" fill="#e5e7eb" />
        <rect x="368" y="164" width="32" height="3" rx="1.5" fill="#c9a227" opacity="0.7" />
      </g>

      {/* --- Resolved Card (bottom-center) --- */}
      <g filter="url(#gg-shadow-sm)" style={{ animation: 'fadeInUp 0.8s 0.9s both' }}>
        <rect x="195" y="328" width="130" height="56" rx="14" fill="url(#gg-resolved)" stroke="#e5e7eb" strokeWidth="0.8" />
        {/* Status dot */}
        <circle cx="215" cy="348" r="4" fill="#22c55e" />
        <text x="225" y="352" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#1a1a2e">Resolved</text>
        {/* Tiny checkmark */}
        <path d="M215 362 L221 368 L233 356" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* === CENTRAL DOCUMENT CARD === */}
      <g filter="url(#gg-shadow-lg)" style={{ animation: 'fadeInUp 0.7s 0.1s both' }}>
        {/* Main card */}
        <rect x="175" y="120" width="170" height="145" rx="18" fill="url(#gg-doc)" stroke="url(#gg-doc-stroke)" strokeWidth="1" />

        {/* MGM logo — very subtle, top-left of card */}
        <g opacity="0.12">
          <rect x="192" y="138" width="22" height="16" rx="3" fill="#1a1a2e" />
          <text x="197" y="149" fontFamily="system-ui, sans-serif" fontSize="7" fontWeight="700" fill="#ffffff">MGM</text>
        </g>

        {/* Document header line */}
        <rect x="222" y="140" width="80" height="4" rx="2" fill="#1a1a2e" opacity="0.12" />
        <rect x="222" y="150" width="50" height="3" rx="1.5" fill="#c9a227" opacity="0.4" />

        {/* Document body lines */}
        <rect x="195" y="170" width="130" height="3" rx="1.5" fill="#e5e7eb" />
        <rect x="195" y="179" width="110" height="3" rx="1.5" fill="#e5e7eb" opacity="0.7" />
        <rect x="195" y="188" width="125" height="3" rx="1.5" fill="#e5e7eb" opacity="0.5" />
        <rect x="195" y="197" width="90" height="3" rx="1.5" fill="#e5e7eb" opacity="0.4" />

        {/* Separator line */}
        <line x1="195" y1="210" x2="325" y2="210" stroke="#e5e7eb" strokeWidth="0.5" />

        {/* Verification checkmark — integrated into card */}
        <g>
          <circle cx="260" cy="236" r="14" fill="#1a1a2e" opacity="0.06" />
          <circle cx="260" cy="236" r="10" fill="#1a1a2e" />
          <path d="M254 236 L258 240 L267 231" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Subtle "Verified" label */}
        <text x="260" y="258" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="500" fill="#1a1a2e" opacity="0.3">VERIFIED</text>
      </g>

      {/* === DECORATIVE ACCENT DOTS === */}
      <circle cx="140" cy="180" r="2" fill="#c9a227" opacity="0.2" />
      <circle cx="380" cy="220" r="2" fill="#c9a227" opacity="0.15" />
      <circle cx="260" cy="310" r="1.5" fill="#1a1a2e" opacity="0.1" />
      <circle cx="160" cy="260" r="1.5" fill="#c9a227" opacity="0.15" />
      <circle cx="360" cy="290" r="1.5" fill="#1a1a2e" opacity="0.1" />
    </svg>
  );
}

function LoadingSpinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className={`${sizeClass} border-2 border-[#1a1a2e]/20 border-t-[#c9a227] rounded-full animate-spin`} />
  );
}

function SuccessAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-[scaleIn_0.5s_cubic-bezier(0.22,1,0.36,1)]">
          <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" className="animate-[drawCheck_0.6s_0.3s_cubic-bezier(0.22,1,0.36,1)_both]" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Timeline({ timeline, currentStatus }) {
;
  const statusLabels = {
    RECEIVED: 'Submitted',
    IN_REVIEW: 'Under Review',
    PENDING_CUSTOMER: 'Information Requested',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  };

  const statusOrder = ['RECEIVED', 'IN_REVIEW', 'PENDING_CUSTOMER', 'RESOLVED', 'CLOSED'];
  const currentIdx = statusOrder.indexOf(currentStatus);
  const entries = timeline || [];

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">No status updates yet.</p>;
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, idx) => {
        const entryIdx = statusOrder.indexOf(entry.status);
        const isLatest = idx === entries.length - 1;

        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-500 ${
                isLatest ? 'bg-[#c9a227] border-[#c9a227] scale-125' :
                'bg-[#1a1a2e] border-[#1a1a2e]'
              }`} />
              {idx < entries.length - 1 && (
                <div className="w-0.5 flex-1 min-h-[40px] bg-[#1a1a2e]" />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-semibold ${isLatest ? 'text-[#c9a227]' : 'text-[#1a1a2e]'}`}>
                {statusLabels[entry.status] || entry.status?.replace(/_/g, ' ')}
              </p>
              <div className="mt-1">
                <p className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubmitTab() {
;
  const [form, setForm] = useState({
    customerName: '', email: '', phone: '', loanAccountNumber: '',
    loanType: '', subject: '', category: '', description: '',
  });
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.loanType) e.loanType = 'Required';
    if (!form.subject.trim()) e.subject = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.description.trim() || form.description.length < 50) e.description = 'Minimum 50 characters required';
    if (!consent1) e.consent1 = 'Required';
    if (!consent2) e.consent2 = 'Required';
    return e;
  }, [form, consent1, consent2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setResult(data.data);
      }
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    }
    setSubmitting(false);
  };

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (result) {
    const translatedStatusLabels = {
      RECEIVED: 'Submitted',
      IN_REVIEW: 'Under Review',
      PENDING_CUSTOMER: 'Information Requested',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed',
    };
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <SuccessAnimation />
        <h3 className="text-2xl font-bold text-[#1a1a2e] mt-4">{'Grievance Submitted Successfully'}</h3>
        <p className="text-gray-500 mt-2">{'Your grievance has been registered. We will respond within 7 working days.'}</p>
        <div className="bg-[#f2f3f5] rounded-2xl p-6 mt-6 text-left space-y-3">
          <div className="flex justify-between"><span className="text-gray-500 text-sm">{'Grievance ID'}</span><span className="font-bold text-[#1a1a2e]">{result.grievanceId}</span></div>
          <div className="flex justify-between"><span className="text-gray-500 text-sm">{'Status'}</span><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{translatedStatusLabels[result.status] || result.status}</span></div>
          <div className="flex justify-between"><span className="text-gray-500 text-sm">{'Filed On'}</span><span className="text-sm text-[#1a1a2e]">{new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
          {result.customerUpdate && <div className="flex justify-between"><span className="text-gray-500 text-sm">{'Update'}</span><span className="text-sm text-[#1a1a2e]">{result.customerUpdate}</span></div>}
        </div>
        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={() => setResult(null)} className="px-6 py-3 bg-[#1a1a2e] text-white rounded-full text-sm font-semibold hover:bg-[#2d2d44] transition-all">{'Track Status'}</button>
          <Link to="/" className="px-6 py-3 border border-[#1a1a2e]/20 text-[#1a1a2e] rounded-full text-sm font-semibold hover:bg-[#1a1a2e]/5 transition-all">{'Back to Home'}</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Full Name', field: 'customerName', type: 'text', placeholder: 'Enter your full name', required: true },
          { label: 'Mobile Number', field: 'phone', type: 'tel', placeholder: 'Enter 10-digit mobile number', required: true },
          { label: 'Email Address', field: 'email', type: 'email', placeholder: 'Enter your email address', required: true },
          { label: 'Loan Account Number (if applicable)', field: 'loanAccountNumber', type: 'text', placeholder: 'Optional', required: false },
        ].map(({ label, field, type, placeholder, required }) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={type} placeholder={placeholder} value={form[field]}
              onChange={(e) => update(field, e.target.value)}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all ${
                errors[field] ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">{'Loan Type'} <span className="text-red-400">*</span></label>
          <select
            value={form.loanType} onChange={(e) => update('loanType', e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all appearance-none ${
              errors.loanType ? 'border-red-300' : 'border-gray-200'
            } ${!form.loanType ? 'text-gray-400' : ''}`}
          >
            <option value="">{'Select loan type'}</option>
            {LOAN_TYPES.map(loanType => <option key={loanType} value={loanType}>{loanType === 'Personal Loan' ? 'Personal Loan' : loanType === 'Business Loan' ? 'Business Loan' : loanType === 'Loan Against Property' ? 'Loan Against Property' : loanType === 'Vehicle Loan' ? 'Vehicle Loan' : loanType === 'Consumer Durable Loan' ? 'Consumer Durable Loan' : loanType === 'Gold Loan' ? 'Gold Loan' : loanType}</option>)}
          </select>
          {errors.loanType && <p className="text-xs text-red-500 mt-1">{errors.loanType}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">{'Grievance Category'} <span className="text-red-400">*</span></label>
          <select
            value={form.category} onChange={(e) => update('category', e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all appearance-none ${
              errors.category ? 'border-red-300' : 'border-gray-200'
            } ${!form.category ? 'text-gray-400' : ''}`}
          >
            <option value="">{'Select category'}</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'Loan Processing' ? 'Loan Processing' : cat === 'Interest Related' ? 'Interest Related' : cat === 'EMI Payment' ? 'EMI Payment' : cat === 'Loan Closure' ? 'Loan Closure' : cat === 'Foreclosure' ? 'Foreclosure' : cat === 'Customer Service' ? 'Customer Service' : cat === 'Technical Issue' ? 'Technical Issue' : cat === 'Document Related' ? 'Document Related' : cat === 'Others' ? 'Other' : cat}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">{'Subject'} <span className="text-red-400">*</span></label>
        <input
          type="text" placeholder={'Brief subject of your grievance'} value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all ${
            errors.subject ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">{'Description'} <span className="text-red-400">*</span></label>
        <textarea
          placeholder={'Describe your grievance in detail'}
          value={form.description} rows={5}
          onChange={(e) => update('description', e.target.value)}
          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all resize-none ${
            errors.description ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          <p className="text-xs text-gray-400 ml-auto">{form.description.length}/2000</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consent1} onChange={(e) => { setConsent1(e.target.checked); if (errors.consent1) setErrors(p => ({...p, consent1: undefined})); }}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]" />
          <span className="text-sm text-gray-600">I confirm that the information provided above is true and accurate. <span className="text-red-400">*</span></span>
        </label>
        {errors.consent1 && <p className="text-xs text-red-500">{errors.consent1}</p>}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consent2} onChange={(e) => { setConsent2(e.target.checked); if (errors.consent2) setErrors(p => ({...p, consent2: undefined})); }}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]" />
          <span className="text-sm text-gray-600">I consent to MGM Financiers contacting me regarding this grievance. <span className="text-red-400">*</span></span>
        </label>
        {errors.consent2 && <p className="text-xs text-red-500">{errors.consent2}</p>}
      </div>

      {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

      <button
        type="submit" disabled={submitting}
        className="w-full py-4 bg-[#c9a227] text-[#1a1a2e] rounded-full text-base font-bold hover:bg-[#b8922a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? <><LoadingSpinner size="sm" /> {'Submitting...'}</> : 'Submit Grievance'}
      </button>
    </form>
  );
}

function TrackTab() {
;
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [grievances, setGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/grievances/track-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGrievances(data.data || []);
        setStep('list');
      } else {
        setError(data.message || 'Failed to fetch grievances');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const viewGrievance = async (grievanceId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/grievances/track/${grievanceId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setSelected(data.data);
        setStep('detail');
      }
    } catch (err) {}
    setLoading(false);
  };

  if (step === 'detail' && selected) {
    const detailStatusLabels = {
      RECEIVED: 'Submitted',
      IN_REVIEW: 'Under Review',
      PENDING_CUSTOMER: 'Information Requested',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed',
    };
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => { setStep('list'); setSelected(null); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] mb-6 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          {'Track Status'}
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-1">{selected.grievanceId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-600'}`}>
              {detailStatusLabels[selected.status] || selected.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-400">{'Category'}</span><p className="font-medium text-[#1a1a2e]">{selected.category}</p></div>
            <div><span className="text-gray-400">{'Loan Account'}</span><p className="font-medium text-[#1a1a2e]">{selected.loanAccountNumber || 'N/A'}</p></div>
            <div><span className="text-gray-400">{'Priority'}</span><p className={`font-medium ${PRIORITY_COLORS[selected.priority]?.split(' ')[1] || ''}`}>{selected.priority || 'MEDIUM'}</p></div>
            <div><span className="text-gray-400">{'Filed On'}</span><p className="font-medium text-[#1a1a2e]">{new Date(selected.createdAt).toLocaleDateString('en-IN')}</p></div>
          </div>
          <div className="mt-4 p-4 bg-[#f2f3f5] rounded-xl">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.description}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="text-base font-bold text-[#1a1a2e] mb-6">{'Track Your Grievance'}</h4>
          <Timeline timeline={selected.statusHistory} currentStatus={selected.status} />
        </div>
      </div>
    );
  }

  if (step === 'list') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => { setStep('email'); setEmail(''); setGrievances([]); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] mb-6 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          Use a different email
        </button>
        <h3 className="text-xl font-bold text-[#1a1a2e] mb-1">{'Track Your Grievance'}</h3>
        <p className="text-sm text-gray-500 mb-6">{'Enter your grievance ID to check status'}</p>
        {grievances.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            <p className="text-gray-500 font-medium">{'Enter your grievance ID to check status'}</p>
            <p className="text-gray-400 text-sm mt-1">{'Enter grievance ID'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grievances.map((g) => {
              const listStatusLabels = {
                RECEIVED: 'Submitted',
                IN_REVIEW: 'Under Review',
                PENDING_CUSTOMER: 'Information Requested',
                RESOLVED: 'Resolved',
                CLOSED: 'Closed',
              };
              return (
                <button key={g._id} onClick={() => viewGrievance(g.grievanceId)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#c9a227]/30 hover:shadow-md transition-all group">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#1a1a2e] truncate group-hover:text-[#c9a227] transition-colors">{g.subject}</h4>
                      </div>
                      <p className="text-xs text-gray-400">{g.grievanceId}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[g.status] || 'bg-gray-100 text-gray-600'}`}>
                      {listStatusLabels[g.status] || g.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span>{g.category}</span>
                    <span>{new Date(g.createdAt).toLocaleDateString('en-IN')}</span>
                    {g.priority && <span className={`px-1.5 py-0.5 rounded ${PRIORITY_COLORS[g.priority]}`}>{g.priority}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="max-w-md mx-auto text-center">
        <button onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] mb-6 transition-colors mx-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          Back
        </button>
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1a1a2e] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Verify Your Email</h3>
        <p className="text-sm text-gray-500 mb-8">We sent a 6-digit code to <span className="font-semibold text-[#1a1a2e]">{email}</span></p>
        <div className="flex gap-3 justify-center mb-4">
          {otp.map((digit, idx) => (
            <input key={idx} ref={el => otpRefs.current[idx] = el} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20 transition-all text-[#1a1a2e]"
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <button onClick={verifyOtp} disabled={loading}
          className="w-full py-3.5 bg-[#c9a227] text-[#1a1a2e] rounded-full text-sm font-bold hover:bg-[#b8922a] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><LoadingSpinner size="sm" /> Verifying...</> : 'Verify & Continue'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1a1a2e] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">{'Track Your Grievance'}</h3>
      <p className="text-sm text-gray-500 mb-8">{'Enter your grievance ID to check status'}</p>
      <div className="space-y-4">
        <input type="email" placeholder="your@email.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30 focus:border-[#c9a227] transition-all text-center" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button onClick={handleEmailSubmit} disabled={loading}
          className="w-full py-3.5 bg-[#c9a227] text-[#1a1a2e] rounded-full text-sm font-bold hover:bg-[#b8922a] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><LoadingSpinner size="sm" /> {'Tracking...'}</> : 'Track Status'}
        </button>
      </div>
    </div>
  );
}

function EscalationHierarchy() {
  const levels = [
    {
      level: 1,
      title: 'Level 1: Service Request',
      timeline: '10 working days',
      contact: 'Service Executive / Branch',
      phone: '0161-5047087',
      desc: 'Contact your relationship manager or visit your nearest branch with your grievance details. Most service requests are resolved at this level.',
    },
    {
      level: 2,
      title: 'Level 2: Grievance Redressal Officer',
      timeline: '10 working days',
      contact: 'Grievance Redressal Officer',
      phone: '+91 99888 81003',
      email: 'customer.redressal@mgmfinanciers.com',
      desc: 'If not satisfied with Level 1 resolution, escalate to our Grievance Redressal Officer who will investigate and respond within 10 working days.',
    },
    {
      level: 3,
      title: 'Level 3: Principal Nodal Officer',
      timeline: '10 working days',
      contact: 'Principal Nodal Officer',
      phone: '+91 98722 00161',
      email: 'pno@mgmfinanciers.com',
      desc: 'If still unresolved, escalate to the Principal Nodal Officer for an independent review and final internal resolution.',
    },
    {
      level: 4,
      title: 'Level 4: RBI Ombudsman',
      timeline: '30 working days from lodging complaint',
      contact: 'RBI Ombudsman',
      desc: 'If not satisfied with the resolution, you may approach the RBI Ombudsman within 30 working days of lodging your complaint with us.',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c9a227]/10 rounded-full mb-5">
            <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-[#c9a227] text-xs font-semibold tracking-wide">RBI Mandated</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">Escalation Hierarchy</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">As per RBI guidelines, our grievance redressal follows a structured 4-level escalation process to ensure fair and timely resolution.</p>
        </div>

        <div className="space-y-6">
          {levels.map((l) => (
            <div key={l.level} className="bg-[#f2f3f5] rounded-2xl p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center">
                    <span className="text-[#c9a227] font-bold text-lg font-heading">{l.level}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="text-lg font-bold text-[#1a1a2e]">{l.title}</h3>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a227]/10 rounded-full text-[#c9a227] text-xs font-semibold w-fit">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {l.timeline}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{l.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      <span className="text-sm font-semibold text-[#1a1a2e]">{l.contact}</span>
                    </div>
                    {l.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <span className="text-sm font-semibold text-[#c9a227]">{l.phone}</span>
                      </div>
                    )}
                    {l.email && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span className="text-sm font-semibold text-[#c9a227]">{l.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Grievance() {
;
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <main className="min-h-screen bg-[#f2f3f5]">
      <SEO
        title="Grievance Redressal | Submit & Track Complaints | MGM Financiers"
        description="Raise and track grievances with MGM Financiers' online grievance redressal portal. Quick resolution for all your concerns as per RBI guidelines."
        canonical="/grievance"
      />
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1a1a2e]/3 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c9a227]/10 rounded-full mb-6">
                <svg className="w-4 h-4 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="text-[#c9a227] text-xs font-semibold tracking-wide">{'Grievance Redressal'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] leading-tight mb-6">{'Grievance Redressal'}</h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">{'We value your feedback and are committed to resolving your concerns'}</p>
            </div>
            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Tab Navigation */}
          <div className="flex bg-white rounded-2xl p-1.5 mb-10 border border-gray-100 shadow-sm max-w-md mx-auto">
            {[
              { id: 'submit', label: 'Submit Grievance' },
              { id: 'track', label: 'Track Your Grievance' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1a1a2e] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#1a1a2e]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
            {activeTab === 'submit' ? <SubmitTab /> : <TrackTab />}
          </div>
        </div>
      </section>

      <EscalationHierarchy />

      {/* CTA */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Our support team is here to help. Reach out and we'll guide you through the process.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="px-8 py-4 bg-[#c9a227] text-[#1a1a2e] rounded-full text-sm font-bold hover:bg-[#b8922a] transition-all">Return to Home</Link>
            <Link to="/contact" className="px-8 py-4 border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
