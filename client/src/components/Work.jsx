import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCms } from '../cms/store'
import { COLL_BACKGROUNDS, DEFAULT_BG, collectionToLook } from './lookData'

const ACCENT = '#d4af37'

function AngleCard({ angle, angleIdx, coll, cardW, cardH, corners, onOpen, dragMovedRef }) {
  const [hovered, setHovered] = useState(false)
  const bgStyle = angle.img
    ? { backgroundImage: `url(${angle.img})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
    : COLL_BACKGROUNDS[coll] || DEFAULT_BG

  return (
    <div
      style={{
        flex: `0 0 ${cardW}px`,
        width: `${cardW}px`,
        height: `${cardH}px`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        transformOrigin: 'center center',
        borderRadius: `${corners}px`,
        transition: 'box-shadow 300ms ease',
        boxShadow: hovered ? 'inset 0 0 0 1px rgba(212,175,55,.18)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!dragMovedRef.current) onOpen(angleIdx) }}
    >
      {/* Accent top line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: ACCENT,
          opacity: hovered ? 1 : 0,
          zIndex: 6,
          pointerEvents: 'none',
          transition: 'opacity 320ms ease',
        }}
      />

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'transform 700ms ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          ...bgStyle,
        }}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top,rgba(0,0,0,.86) 0%,rgba(0,0,0,.03) 52%,transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(0,0,0,.22)' : 'rgba(0,0,0,0)',
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 320ms ease',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: ACCENT,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 320ms ease, transform 320ms ease',
          }}
        >
          View
        </span>
      </div>

      {/* Angle number badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '18px',
          fontFamily: 'monospace',
          fontSize: '8px',
          color: 'rgba(255,255,255,.18)',
          letterSpacing: '.1em',
          zIndex: 5,
        }}
      >
        {String(angleIdx + 1).padStart(2, '0')}
      </div>

      {/* Info footer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 22px', zIndex: 4 }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(17px,2vw,25px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,.92)',
            lineHeight: 1.1,
          }}
        >
          {angle.label}
        </h3>
      </div>
    </div>
  )
}

export function GalleryViewer({ look, idx, onClose, onNav, onJump, viewAllHref }) {
  const angle = look?.angles[idx]
  const [imgVisible, setImgVisible] = useState(true)

  useEffect(() => {
    setImgVisible(false)
    const t = setTimeout(() => setImgVisible(true), 60)
    return () => clearTimeout(t)
  }, [idx])

  if (!look || !angle) return null

  const displayImg = (idx === 0 && look.thumb) || angle.img

  const bgStyle = displayImg
    ? { backgroundImage: `url(${displayImg})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
    : COLL_BACKGROUNDS[look.coll] || DEFAULT_BG

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Image panel */}
      <div style={{ flex: '0 0 58%', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#0d0d10',
            ...bgStyle,
            opacity: imgVisible ? 1 : 0,
            transition: 'opacity 320ms ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right,transparent 62%,rgba(7,7,8,.88) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Detail panel */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(40px,6vh,64px) clamp(28px,4vw,52px) clamp(36px,5vh,48px)',
          overflow: 'hidden',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '28px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,.35)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 0,
            zIndex: 10,
            transition: 'color 280ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.9)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
        >
          Close{' '}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1" />
            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '8px',
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: '13px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {look.collName} · {look.cat} · {look.season}
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px,4vw,54px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,.92)',
            lineHeight: 0.95,
            marginBottom: '11px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {look.name}
        </h2>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.34)',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {look.fabric}
        </div>
        <div
          style={{
            width: '32px',
            height: '1px',
            background: 'rgba(212,175,55,.36)',
            marginBottom: '18px',
            position: 'relative',
            zIndex: 1,
          }}
        />
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(11px,1.4vw,13px)',
            fontWeight: 300,
            lineHeight: 1.9,
            color: 'rgba(255,255,255,.42)',
            maxWidth: '360px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {look.desc}
        </p>

        {/* Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginTop: '30px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            onClick={() => onNav(-1)}
            disabled={idx === 0}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: idx === 0 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.38)',
              cursor: idx === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: 0,
              opacity: idx === 0 ? 0.18 : 1,
              transition: 'color 280ms ease, opacity 280ms ease',
            }}
            onMouseEnter={(e) => { if (idx > 0) e.currentTarget.style.color = 'rgba(255,255,255,.9)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = idx === 0 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.38)' }}
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <line x1="16" y1="5" x2="2" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="7,1 2,5 7,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            Prev
          </button>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px',
              fontWeight: 300,
              color: 'rgba(255,255,255,.2)',
              letterSpacing: '.06em',
              minWidth: '40px',
              textAlign: 'center',
            }}
          >
            {idx + 1} / {look.angles.length}
          </span>
          <button
            onClick={() => onNav(1)}
            disabled={idx === look.angles.length - 1}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: idx === look.angles.length - 1 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.38)',
              cursor: idx === look.angles.length - 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: 0,
              opacity: idx === look.angles.length - 1 ? 0.18 : 1,
              transition: 'color 280ms ease, opacity 280ms ease',
            }}
            onMouseEnter={(e) => { if (idx < look.angles.length - 1) e.currentTarget.style.color = 'rgba(255,255,255,.9)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = idx === look.angles.length - 1 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.38)' }}
          >
            Next
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="11,1 16,5 11,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </button>
        </div>

        {/* Thumbnail row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '18px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {look.angles.map((a, i) => {
            const thumbBg = a.img
              ? { backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
              : COLL_BACKGROUNDS[look.coll] || DEFAULT_BG
            return (
              <button
                key={i}
                onClick={() => onJump(i)}
                style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '52px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: i === idx ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,.12)',
                  background: '#0d0d10',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: i === idx ? 1 : 0.5,
                  transition: 'opacity 280ms ease, border-color 280ms ease',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, ...thumbBg }} />
              </button>
            )
          })}
        </div>

        {viewAllHref && (
          <a
            href={viewAllHref}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: ACCENT,
              opacity: 0.75,
              marginTop: '22px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              position: 'relative',
              zIndex: 1,
              width: 'fit-content',
              transition: 'opacity 280ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
          >
            View All Looks
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <line x1="1" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="7,1 12,5 7,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

// Full-image dress showcase — used for individual cards inside a collection.
// Whole image centered (contain, never cropped), blurred version of the same
// image as the backdrop, no side info panel, arrows + thumbnail navigation.
export function DressViewer({ look, idx, onClose, onNav, onJump }) {
  const angle = look?.angles[idx]
  const [imgVisible, setImgVisible] = useState(true)

  useEffect(() => {
    setImgVisible(false)
    const t = setTimeout(() => setImgVisible(true), 60)
    return () => clearTimeout(t)
  }, [idx])

  if (!look || !angle) return null

  const fallbackBg = COLL_BACKGROUNDS[look.coll] || DEFAULT_BG
  const backdropStyle = angle.img
    ? { backgroundImage: `url(${angle.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : fallbackBg

  const arrowBtn = (dir) => {
    const isPrev = dir < 0
    const disabled = isPrev ? idx === 0 : idx === look.angles.length - 1
    return (
      <button
        onClick={() => onNav(dir)}
        disabled={disabled}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          [isPrev ? 'left' : 'right']: 'clamp(14px,3vw,42px)',
          zIndex: 4,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,.14)',
          background: 'rgba(12,12,16,.4)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,.6)',
          cursor: disabled ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.2 : 1,
          transition: 'color 280ms ease, border-color 280ms ease, background 280ms ease',
        }}
        onMouseEnter={(e) => {
          if (disabled) return
          e.currentTarget.style.color = 'rgba(255,255,255,.95)'
          e.currentTarget.style.borderColor = 'rgba(212,175,55,.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,.6)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)'
        }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          {isPrev ? (
            <>
              <line x1="16" y1="5" x2="2" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="7,1 2,5 7,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </>
          ) : (
            <>
              <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="11,1 16,5 11,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </>
          )}
        </svg>
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Blurred backdrop — the same dress image, filling the screen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0d0d10',
          ...backdropStyle,
          filter: 'blur(40px) brightness(.5)',
          transform: 'scale(1.15)',
          zIndex: 0,
        }}
      />
      {/* Dark scrim for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7,7,8,.55)',
          zIndex: 1,
        }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          zIndex: 5,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,.45)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px',
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: 0,
          transition: 'color 280ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.95)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.45)')}
      >
        Close{' '}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1" />
          <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {/* Centered whole image */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: imgVisible ? 1 : 0,
          transition: 'opacity 320ms ease',
          maxWidth: '90vw',
          maxHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {angle.img ? (
          <img
            src={angle.img}
            alt=""
            style={{
              maxWidth: '90vw',
              maxHeight: '88vh',
              objectFit: 'contain',
              borderRadius: '3px',
              boxShadow: '0 30px 90px rgba(0,0,0,.6)',
              display: 'block',
            }}
          />
        ) : (
          // Graceful placeholder when no real image exists yet
          <div
            style={{
              width: 'min(56vh, 88vw)',
              height: '80vh',
              maxHeight: '88vh',
              ...fallbackBg,
              borderRadius: '3px',
              boxShadow: '0 30px 90px rgba(0,0,0,.6)',
            }}
          />
        )}
      </div>

      {/* Prev / Next arrows */}
      {look.angles.length > 1 && arrowBtn(-1)}
      {look.angles.length > 1 && arrowBtn(1)}

      {/* Thumbnail strip */}
      {look.angles.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(20px,4vh,40px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'rgba(12,12,16,.4)',
            backdropFilter: 'blur(10px)',
            maxWidth: '90vw',
            overflowX: 'auto',
          }}
          className="no-scrollbar"
        >
          {look.angles.map((a, i) => {
            const thumbBg = a.img
              ? { backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
              : COLL_BACKGROUNDS[look.coll] || DEFAULT_BG
            return (
              <button
                key={i}
                onClick={() => onJump(i)}
                style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '52px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: i === idx ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,.12)',
                  background: '#0d0d10',
                  cursor: 'pointer',
                  padding: 0,
                  borderRadius: '2px',
                  opacity: i === idx ? 1 : 0.5,
                  transition: 'opacity 280ms ease, border-color 280ms ease',
                }}
                onMouseEnter={(e) => { if (i !== idx) e.currentTarget.style.opacity = '0.8' }}
                onMouseLeave={(e) => { if (i !== idx) e.currentTarget.style.opacity = '0.5' }}
              >
                <div style={{ position: 'absolute', inset: 0, ...thumbBg }} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Work() {
  const navigate = useNavigate()
  const { collections } = useCms()

  const knownSlugs = collections.map((c) => c.id)
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  const initialFilter = knownSlugs.includes(hash) ? hash : knownSlugs[0]

  const [activeFilter] = useState(initialFilter)
  const look = collectionToLook(collections.find((c) => c.id === activeFilter) || collections[0])
  const looks = look ? look.angles : []

  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ tx: 0, velX: 0, isDrag: false, startX: 0, startTx: 0, prevX: 0, activeIdx: 0 })
  const dragMovedRef = useRef(false)

  const [activeIdx, setActiveIdx] = useState(0)
  const [leftVisible, setLeftVisible] = useState(false)
  const [rightVisible, setRightVisible] = useState(true)
  const [counter, setCounter] = useState(`01 / ${String(looks.length).padStart(2, '0')}`)

  const [lbIdx, setLbIdx] = useState(-1)

  const [cardDims, setCardDims] = useState({ w: 0, h: 0 })
  const GAP = 18

  const computeCardDims = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return { w: 0, h: 0 }
    const availH = wrap.offsetHeight
    const cardH = Math.min(Math.max(availH * 0.97, 420), 920)
    const cardW = Math.round(cardH * 0.70)
    return { w: cardW, h: cardH }
  }, [])

  useEffect(() => {
    const update = () => setCardDims(computeCardDims())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [computeCardDims])

  const updateNav = useCallback(
    (i) => {
      stateRef.current.activeIdx = i
      setActiveIdx(i)
      setCounter(`${String(i + 1).padStart(2, '0')} / ${String(looks.length).padStart(2, '0')}`)
      setLeftVisible(i > 0)
      setRightVisible(i < looks.length - 1)
    },
    [looks.length],
  )

  const snapToRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track || cardDims.w === 0) return

    const st = stateRef.current
    const cards = [...track.children]
    if (!cards.length) return

    const step = () => cardDims.w + GAP
    const maxTx = () => (wrap.offsetWidth - cardDims.w) / 2
    const minTx = () => maxTx() - (cards.length - 1) * step()
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

    const updateVisuals = () => {
      const cx = wrap.offsetWidth / 2
      cards.forEach((c) => {
        const r = c.getBoundingClientRect()
        const ccx = r.left + r.width / 2
        const dist = Math.abs(ccx - cx)
        const t = clamp(dist / (wrap.offsetWidth * 0.5), 0, 1)
        c.style.transform = `scale(${(1 - t * 0.1).toFixed(4)})`
        c.style.opacity = (1 - t * 0.72).toFixed(3)
      })
    }

    const setTx = (v) => {
      st.tx = v
      track.style.transform = `translateX(${v}px)`
      updateVisuals()
    }

    const animTo = (target, idx) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const go = () => {
        const d = target - st.tx
        if (Math.abs(d) < 0.5) {
          setTx(target)
          if (idx !== undefined) updateNav(idx)
          return
        }
        setTx(st.tx + d * 0.15)
        rafRef.current = requestAnimationFrame(go)
      }
      rafRef.current = requestAnimationFrame(go)
    }

    const snapTo = (i) => {
      const ci = clamp(i, 0, cards.length - 1)
      animTo(maxTx() - ci * step(), ci)
    }

    snapToRef.current = snapTo

    setTx(maxTx())
    updateNav(0)

    const onPointerDown = (e) => {
      if (e.button !== 0) return
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
      st.isDrag = true
      dragMovedRef.current = false
      st.startX = e.clientX
      st.startTx = st.tx
      st.prevX = e.clientX
      st.velX = 0
      track.style.cursor = 'grabbing'
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endDrag)
      document.addEventListener('pointercancel', endDrag)
    }

    const onPointerMove = (e) => {
      const dx = e.clientX - st.startX
      if (Math.abs(dx) > 4) dragMovedRef.current = true
      st.velX = e.clientX - st.prevX
      st.prevX = e.clientX
      setTx(clamp(st.startTx + dx, minTx() - 80, maxTx() + 80))
    }

    const endDrag = () => {
      if (!st.isDrag) return
      st.isDrag = false
      track.style.cursor = 'grab'
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endDrag)
      document.removeEventListener('pointercancel', endDrag)
      const go = () => {
        st.velX *= 0.82
        setTx(clamp(st.tx + st.velX, minTx(), maxTx()))
        if (Math.abs(st.velX) > 0.4) {
          rafRef.current = requestAnimationFrame(go)
        } else {
          const ni = clamp(Math.round((maxTx() - st.tx) / step()), 0, cards.length - 1)
          animTo(maxTx() - ni * step(), ni)
        }
      }
      rafRef.current = requestAnimationFrame(go)
    }

    wrap.addEventListener('pointerdown', onPointerDown)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      wrap.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endDrag)
      document.removeEventListener('pointercancel', endDrag)
    }
  }, [cardDims, looks.length, updateNav])

  const openLb = useCallback((angleIdx) => setLbIdx(angleIdx), [])

  const closeLb = useCallback(() => setLbIdx(-1), [])

  const navLb = useCallback(
    (dir) => {
      setLbIdx((prev) => {
        const n = prev + dir
        if (n < 0 || n >= looks.length) return prev
        return n
      })
    },
    [looks.length],
  )

  useEffect(() => {
    const handler = (e) => {
      if (lbIdx === -1) return
      if (e.key === 'Escape') closeLb()
      if (e.key === 'ArrowLeft') navLb(-1)
      if (e.key === 'ArrowRight') navLb(1)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [lbIdx, closeLb, navLb])

  const collectionName = look?.collName

  return (
    <>
      {/* Full-page fixed layout */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        {/* Nav */}
        <nav
          style={{
            flexShrink: 0,
            height: '62px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(20px,4vw,48px)',
            background: 'rgba(8,8,8,.98)',
            backdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(255,255,255,.05)',
            zIndex: 20,
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '8.5px',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.26)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'color 280ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.26)')}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <line x1="14" y1="5" x2="2" y2="5" stroke="currentColor" strokeWidth="1" />
              <polyline points="6,1 2,5 6,9" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            Portfolio
          </button>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '22px',
              fontWeight: 300,
              letterSpacing: '.24em',
              color: 'rgba(255,255,255,.65)',
              textTransform: 'uppercase',
              fontStyle: 'italic',
            }}
          >
            Kate
          </div>
          <div style={{ width: '80px' }} />
        </nav>

        {/* Page title */}
        <div
          style={{
            flexShrink: 0,
            padding: 'clamp(16px,2.2vh,26px) clamp(20px,4vw,48px)',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(28px,3.2vw,46px)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,.88)',
                letterSpacing: '.02em',
                lineHeight: 1,
              }}
            >
              {collectionName || 'The Work'}
            </h1>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '7.5px',
                letterSpacing: '.28em',
                textTransform: 'uppercase',
                color: 'rgba(212,175,55,.5)',
              }}
            >
              03 · Collections
            </span>
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '8px',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.2)',
            }}
          >
            {looks.length} Angles
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={wrapRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', minHeight: 0 }}
        >
          {/* Left fade + arrow */}
          <div
            onClick={() => snapToRef.current?.(activeIdx - 1)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 'clamp(80px,14vw,120px)',
              background: 'linear-gradient(to right,rgba(10,10,10,.92) 0%,transparent 100%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 'clamp(16px,3vw,28px)',
              cursor: 'pointer',
              opacity: leftVisible ? 1 : 0,
              pointerEvents: leftVisible ? 'auto' : 'none',
              transition: 'opacity 320ms ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="18" y1="11" x2="4" y2="11" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <polyline points="10,5 4,11 10,17" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Drag track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${GAP}px`,
              willChange: 'transform',
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              alignItems: 'center',
              padding: '0 2px',
            }}
          >
            {cardDims.w > 0 &&
              looks.map((angle, angleIdx) => (
                <AngleCard
                  key={angleIdx}
                  angle={angle}
                  angleIdx={angleIdx}
                  coll={look?.coll}
                  cardW={cardDims.w}
                  cardH={cardDims.h}
                  corners={2}
                  onOpen={openLb}
                  dragMovedRef={dragMovedRef}
                />
              ))}
          </div>

          {/* Right fade + arrow */}
          <div
            onClick={() => snapToRef.current?.(activeIdx + 1)}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 'clamp(80px,14vw,120px)',
              background: 'linear-gradient(to left,rgba(10,10,10,.92) 0%,transparent 100%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 'clamp(16px,3vw,28px)',
              cursor: 'pointer',
              opacity: rightVisible ? 1 : 0,
              pointerEvents: rightVisible ? 'auto' : 'none',
              transition: 'opacity 320ms ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="4" y1="11" x2="18" y2="11" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <polyline points="12,5 18,11 12,17" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            flexShrink: 0,
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px,5vw,40px)',
            borderTop: '1px solid rgba(255,255,255,.04)',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '8px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.15)',
            }}
          >
            Drag to explore
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '17px',
              fontWeight: 300,
              color: 'rgba(255,255,255,.28)',
              letterSpacing: '.08em',
              minWidth: '48px',
              textAlign: 'center',
            }}
          >
            {counter}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '8px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.15)',
            }}
          >
            Click to view
          </span>
        </div>
      </div>

      {/* Gallery viewer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(7,7,8,.97)',
          opacity: lbIdx >= 0 ? 1 : 0,
          pointerEvents: lbIdx >= 0 ? 'auto' : 'none',
          transition: 'opacity 360ms ease',
          display: 'flex',
        }}
      >
        {lbIdx >= 0 && (
          <DressViewer look={look} idx={lbIdx} onClose={closeLb} onNav={navLb} onJump={setLbIdx} />
        )}
      </div>
    </>
  )
}
