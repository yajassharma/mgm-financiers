import { useEffect, useRef } from 'react'

export default function PdfPlaceholder({ title, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const trigger = document.activeElement
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && ref.current) {
        const focusables = ref.current.querySelectorAll('a[href], button:not([disabled])')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement
        if (!ref.current.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (trigger && typeof trigger.focus === 'function') trigger.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 text-center outline-none"
      >
        <p className="font-body text-mgm-dark text-sm mb-4">{title}</p>
        <p className="text-mgm-dark/70 font-body text-xs mb-6">PDF to be uploaded</p>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-full bg-mgm-dark text-white font-body text-xs font-semibold hover:bg-mgm-dark/90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
