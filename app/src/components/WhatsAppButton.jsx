import { useState, useRef, useCallback, useEffect } from 'react'

const WHATSAPP_NUMBER = '919988881003'
const PAD = 32

function getClosestEdge(cx, cy, vw, vh) {
  const edges = [
    { x: PAD, y: cy },
    { x: vw - PAD, y: cy },
    { x: cx, y: PAD },
    { x: cx, y: vh - PAD },
  ]
  const dists = [
    cx - PAD,
    vw - PAD - cx,
    cy - PAD,
    vh - PAD - cy,
  ]
  let best = 0
  for (let i = 1; i < 4; i++) {
    if (dists[i] < dists[best]) best = i
  }
  return edges[best]
}

export default function WhatsAppButton() {
  const [pos, setPos] = useState(null)
  const [snapping, setSnapping] = useState(false)
  const [size, setSize] = useState(48)
  const dragRef = useRef(null)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  useEffect(() => {
    const update = () => setSize(window.innerWidth >= 640 ? 56 : 48)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const snapToEdge = useCallback((cx, cy) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const target = getClosestEdge(cx, cy, vw, vh)
    setSnapping(true)
    setPos(target)
    setTimeout(() => setSnapping(false), 300)
  }, [])

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    setPos({ x: vw - PAD, y: vh - PAD })
  }, [])

  const handlePointerDown = useCallback((e) => {
    if (!pos) return
    dragging.current = true
    moved.current = false
    const rect = dragRef.current.getBoundingClientRect()
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [pos])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    moved.current = true
    const half = size / 2
    const x = e.clientX - offset.current.x + half
    const y = e.clientY - offset.current.y + half
    setPos({ x, y })
  }, [size])

  const handleClick = useCallback(() => {
    if (moved.current) return
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20MGM%20Financiers`, '_blank', 'noopener,noreferrer')
  }, [])

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current) return
    dragging.current = false
    if (!moved.current) return
    const half = size / 2
    const x = e.clientX - offset.current.x + half
    const y = e.clientY - offset.current.y + half
    snapToEdge(x, y)
  }, [snapToEdge, size])

  if (!pos) return null

  const half = size / 2

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: pos.x - half,
        top: pos.y - half,
        width: size,
        height: size,
        zIndex: 9999,
        touchAction: 'none',
        transition: snapping ? 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1)' : 'none',
        cursor: 'grab',
      }}
      className="rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group select-none"
      aria-label="Chat on WhatsApp"
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20MGM%20Financiers`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: size, height: size }}
        className="rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group pointer-events-auto"
        draggable="false"
      >
        <svg style={{ width: size * 0.5, height: size * 0.5 }} className="text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}
