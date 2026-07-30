import { useEffect, useRef } from 'react'

export default function PdfPlaceholder({ title, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
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
        <p className="text-mgm-dark/40 font-body text-xs mb-6">PDF to be uploaded</p>
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
