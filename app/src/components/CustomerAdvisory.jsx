import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const STORAGE_KEY = 'mgm-advisory-dismissed'
const STORAGE_DAYS = 30

function setAdvisoryDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Date.now()))
  } catch {}
}

const ADVISORIES = [
  {
    en: {
      title: 'Never Share Your OTP',
      points: [
        'MGM Financiers will never ask you to disclose your One-Time Password (OTP), banking PIN, UPI PIN, debit card CVV, internet banking credentials, passwords or any confidential financial information.',
        'This applies to phone calls, SMS, email, WhatsApp or any social media platform.',
        'If anyone requests such information claiming to represent MGM Financiers, do not share it and immediately report the incident to us.',
      ],
    },
    hi: {
      title: 'अपना OTP कभी साझा न करें',
      points: [
        'MGM Financiers कभी भी आपसे आपका One-Time Password (OTP), बैंकिंग PIN, UPI PIN, डेबिट कार्ड CVV, इंटरनेट बैंकिंग क्रेडेंशियल्स या कोई भी गोपनीय वित्तीय जानकारी नहीं मांगेगा।',
        'यह फ़ोन कॉल, SMS, ईमेल, WhatsApp या किसी भी सोशल मीडिया प्लेटफ़ॉर्म पर लागू होता है।',
        'यदि कोई MGM Financiers का प्रतिनिधि होने का दावा करते हुए ऐसी जानकारी माँगता है, तो उसे साझा न करें और तुरंत हमसे संपर्क करें।',
      ],
    },
  },
  {
    en: {
      title: 'Verify Official Communication',
      points: [
        'Always ensure you are communicating through MGM Financiers\' official contact numbers, official email addresses and verified communication channels listed on this website.',
        'Exercise caution when receiving calls or messages from unknown numbers claiming to represent MGM.',
        'When in doubt, call us directly on our publicly listed number to verify the identity of any representative.',
      ],
    },
    hi: {
      title: 'आधिकारिक संचार की पुष्टि करें',
      points: [
        'हमेशा सुनिश्चित करें कि आप इस वेबसाइट पर सूचीबद्ध MGM Financiers के आधिकारिक संपर्क नंबरों, आधिकारिक ईमेल पतों और सत्यापित संचार चैनलों के माध्यम से संवाद कर रहे हैं।',
        'MGM का प्रतिनिधि होने का दावा करने वाले अज्ञात नंबरों से कॉल या संदेश प्राप्त होने पर सावधानी बरतें।',
        'संदेह होने पर, किसी भी प्रतिनिधि की पहचान सत्यापित करने के लिए सीधे हमारे सार्वजनिक रूप से सूचीबद्ध नंबर पर कॉल करें।',
      ],
    },
  },
  {
    en: {
      title: 'Payments & Receipts',
      points: [
        'Make all payments only through MGM Financiers\' officially authorised payment channels.',
        'Never hand over cash or transfer funds directly to any individual representative without obtaining an official payment acknowledgement or receipt.',
        'In case of any discrepancy, only officially acknowledged transactions can be verified by the company.',
      ],
    },
    hi: {
      title: 'भुगतान और रसीद',
      points: [
        'सभी भुगतान केवल MGM Financiers के आधिकारिक रूप से अधिकृत भुगतान चैनलों के माध्यम से करें।',
        'आधिकारिक भुगतान पावती या रसीद प्राप्त किए बिना किसी भी व्यक्तिगत प्रतिनिधि को सीधे नकद या धन हस्तांतरित न करें।',
        'किसी भी विसंगति की स्थिति में, केवल आधिकारिक रूप से स्वीकृत लेनदेन ही कंपनी द्वारा सत्यापित किए जा सकते हैं।',
      ],
    },
  },
  {
    en: {
      title: 'Digital Safety',
      points: [
        'MGM Financiers does not request confidential customer information through unofficial mobile applications, messaging platforms or social media accounts.',
        'Always verify the authenticity of any application, payment link or communication before proceeding.',
        'Do not click on suspicious links or download applications from unverified sources.',
      ],
    },
    hi: {
      title: 'डिजिटल सुरक्षा',
      points: [
        'MGM Financiers अनौपचारिक मोबाइल एप्लिकेशन, मैसेजिंग प्लेटफ़ॉर्म या सोशल मीडिया अकाउंट के माध्यम से गोपनीय ग्राहक जानकारी नहीं माँगता।',
        'आगे बढ़ने से पहले हमेशा किसी भी एप्लिकेशन, भुगतान लिंक या संचार की प्रामाणिकता सत्यापित करें।',
        'संदिग्ध लिंक पर क्लिक न करें या असत्यापित स्रोतों से एप्लिकेशन डाउनलोड न करें।',
      ],
    },
  },
  {
    en: {
      title: 'Need Assistance?',
      points: [
        'If you have any concerns regarding fraudulent communication, suspicious payment requests or impersonation, please contact MGM Financiers immediately.',
        'You can reach us through our official support channels or visit your nearest branch.',
        'Your safety is our priority. Do not hesitate to reach out.',
      ],
    },
    hi: {
      title: 'सहायता चाहिए?',
      points: [
        'यदि आपको धोखाधड़ी वाले संचार, संदिग्ध भुगतान अनुरोधों या प्रतिरूपण के बारे में कोई चिंता है, तो कृपया तुरंत MGM Financiers से संपर्क करें।',
        'आप हमसे हमारे आधिकारिक सहायता चैनलों के माध्यम से संपर्क कर सकते हैं या अपनी निकटतम शाखा में जा सकते हैं।',
        'आपकी सुरक्षा हमारी प्राथमिकता है। बेझिझक संपर्क करें।',
      ],
    },
  },
]

export default function CustomerAdvisory({ isOpen, onClose }) {
  const prefersReduced = usePrefersReducedMotion()
  const navigate = useNavigate()
const [lang, setLang] = useState('en')
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      closeRef.current?.focus()
    } else if (mounted) {
      setVisible(false)
      const timer = setTimeout(() => {
        setMounted(false)
        previousFocus.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, mounted])

  useEffect(() => {
    if (!mounted) return
    const modal = modalRef.current
    if (!modal) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mounted])

  const handleClose = useCallback(() => {
    if (dontShowAgain) setAdvisoryDismissed()
    onClose()
  }, [dontShowAgain, onClose])

  const handleContactSupport = useCallback(() => {
    if (dontShowAgain) setAdvisoryDismissed()
    onClose()
    navigate('/contact')
  }, [dontShowAgain, onClose])

  if (!mounted) return null

  const anim = (delay) => {
    if (prefersReduced) return {}
    return {
      transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
    }
  }

  const langT = (obj) => obj[lang]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advisory-heading"
    >
      <div
        className="absolute inset-0 bg-mgm-dark/60 backdrop-blur-sm"
        style={prefersReduced ? {} : {
          transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1)',
          opacity: visible ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="advisory-modal-desktop relative bg-white rounded-[28px] shadow-[0_25px_80px_rgba(0,0,0,0.18)] w-full max-w-[900px] max-h-[80vh] sm:rounded-[28px] rounded-t-[20px] flex flex-col overflow-hidden"
        style={prefersReduced ? {} : anim(0)}
      >
        {/* ── HEADER (fixed) ── */}
        <div className="flex-shrink-0 px-6 sm:px-10 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-mgm-dark/[0.04] bg-white">
          <div className="flex items-center justify-between mb-6">
            <img src="/mgm logo.png" alt="MGM Financiers" className="h-10 w-auto" />
            <button
              ref={closeRef}
              onClick={handleClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-mgm-dark/30 hover:text-mgm-dark hover:bg-mgm-dark/[0.04] transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block text-mgm-gold font-semibold text-[10px] tracking-[0.25em] uppercase font-body bg-mgm-gold/[0.07] px-3 py-1.5 rounded-full">
              {'Customer Advisory'}
            </span>
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1.5 text-mgm-dark/40 font-body text-[11px] font-medium hover:text-mgm-dark/70 transition-colors px-2.5 py-1 rounded-full border border-mgm-dark/[0.06] hover:border-mgm-dark/10"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>

          <h1 id="advisory-heading" className="text-2xl sm:text-[1.7rem] font-bold text-mgm-dark font-heading tracking-tight mb-2.5">
            {lang === 'en' ? 'Important Information for All Customers' : 'सभी ग्राहकों के लिए महत्वपूर्ण जानकारी'}
          </h1>
          <p className="text-mgm-dark/40 font-body text-[13.5px] leading-relaxed max-w-2xl">
            {lang === 'en'
              ? 'At MGM Financiers, transparency and customer protection are at the core of everything we do. Please read the following important information before interacting with our representatives or making any payment.'
              : 'MGM Financiers में, पारदर्शिता और ग्राहक सुरक्षा हमारे हर कार्य का केंद्र है। कृपया हमारे प्रतिनिधियों से बातचीत करने या कोई भुगतान करने से पहले निम्नलिखित महत्वपूर्ण जानकारी पढ़ें।'}
          </p>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 min-h-0 advisory-scrollbar">
          <div className="space-y-0">
            {ADVISORIES.map((item, i) => (
              <div
                key={i}
                style={prefersReduced ? {} : {
                  transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${200 + i * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${200 + i * 80}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                <div className="py-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-mgm-dark/[0.04] flex items-center justify-center text-mgm-dark/30 font-heading font-bold text-xs mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-mgm-dark text-[15px] mb-2.5">
                        {langT(item).title}
                      </h3>
                      <ul className="space-y-1.5">
                        {langT(item).points.map((pt, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-mgm-gold/40 mt-[7px]" />
                            <span className="text-mgm-dark/45 font-body text-[13px] leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {i < ADVISORIES.length - 1 && <div className="h-px bg-mgm-dark/[0.04]" />}
              </div>
            ))}
          </div>

          {/* Notice box */}
          <div
            className="mt-6 bg-mgm-gold/[0.05] border border-mgm-gold/[0.10] rounded-2xl px-6 py-5"
            style={prefersReduced ? {} : {
              transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) 700ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 700ms`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            <h3 className="font-heading font-bold text-mgm-dark text-sm mb-2">
              {lang === 'en' ? 'Stay Alert. Stay Protected.' : 'सतर्क रहें। सुरक्षित रहें।'}
            </h3>
            <p className="text-mgm-dark/50 font-body text-[13px] leading-relaxed">
              {lang === 'en'
                ? 'If you receive any suspicious call, message or payment request claiming to represent MGM Financiers, discontinue the conversation immediately and contact us through our official channels listed on this website.'
                : 'यदि आपको MGM Financiers का प्रतिनिधि होने का दावा करने वाली कोई संदिग्ध कॉल, संदेश या भुगतान अनुरोध प्राप्त होता है, तो तुरंत बातचीत बंद करें और इस वेबसाइट पर सूचीबद्ध हमारे आधिकारिक चैनलों के माध्यम से हमसे संपर्क करें।'}
            </p>
          </div>
        </div>

        {/* ── FOOTER (fixed) ── */}
        <div className="flex-shrink-0 border-t border-mgm-dark/[0.04] px-6 sm:px-10 py-5 sm:py-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 text-mgm-dark/40 font-body text-xs">
            <span>Customer Care: <strong className="text-mgm-dark/60 font-semibold">0161 5047087</strong></span>
            <span className="hidden sm:inline text-mgm-dark/15">|</span>
            <span><strong className="text-mgm-dark/60 font-semibold">customer.redressal@mgmfinanciers.com</strong></span>
          </div>

          <p className="text-mgm-dark/25 font-body text-[11px] leading-relaxed mb-5">
            {lang === 'en'
              ? 'This advisory is issued in the interest of customer safety and responsible financial practices.'
              : 'यह सलाह ग्राहक सुरक्षा और जिम्मेदार वित्तीय प्रथाओं के हित में जारी की गई है।'}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-[18px] h-[18px] rounded border border-mgm-dark/15 bg-white peer-checked:bg-mgm-gold peer-checked:border-mgm-gold transition-colors duration-200 flex items-center justify-center">
                  {dontShowAgain && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-mgm-dark/40 font-body text-xs group-hover:text-mgm-dark/60 transition-colors">
                {lang === 'en' ? "Don't show this message again" : 'इस संदेश को फिर से न दिखाएँ'}
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <button
                onClick={handleContactSupport}
                className="btn-interactive px-6 py-3 sm:py-2.5 rounded-full border border-mgm-dark/10 text-mgm-dark/60 font-body font-semibold text-sm hover:border-mgm-dark/20 hover:text-mgm-dark transition-all duration-200 text-center w-full sm:w-auto"
              >
                {lang === 'en' ? 'Contact Support' : 'सहायता से संपर्क करें'}
              </button>
              <button
                onClick={handleClose}
                className="btn-interactive px-6 py-3 sm:py-2.5 rounded-full bg-mgm-dark text-white font-body font-semibold text-sm shadow-lg shadow-mgm-dark/15 hover:bg-mgm-dark/90 transition-all duration-200 text-center w-full sm:w-auto"
              >
                {lang === 'en' ? 'I Understand' : 'मैं समझ गया/गई'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
