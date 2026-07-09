import { useEffect, useRef, useState, useCallback } from 'react'
import { GalleryViewer } from './Work'
import { collectionToLook } from './lookData'
import { getDb, useCms } from '../cms/store'

// visual treatments cycled across the cards (pattern shows when a collection has no cover)
const CARD_STYLES = [
  {
    italic: true,
    bg: '#111',
    pattern: 'repeating-linear-gradient(155deg,transparent,transparent 38px,rgba(255,255,255,.018) 38px,rgba(255,255,255,.018) 39px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.1) 55%,transparent 100%)',
  },
  {
    italic: false,
    bg: '#131313',
    pattern: 'repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(255,255,255,.018) 22px,rgba(255,255,255,.018) 23px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 65%)',
  },
  {
    italic: true,
    bg: '#0e0e0e',
    pattern: 'repeating-linear-gradient(135deg,transparent,transparent 22px,rgba(255,255,255,.015) 22px,rgba(255,255,255,.015) 23px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 60%)',
  },
  {
    italic: false,
    bg: '#121212',
    pattern: 'repeating-linear-gradient(170deg,transparent,transparent 30px,rgba(255,255,255,.016) 30px,rgba(255,255,255,.016) 31px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 58%)',
  },
  {
    italic: true,
    bg: '#141414',
    pattern: 'repeating-linear-gradient(100deg,transparent,transparent 26px,rgba(255,255,255,.015) 26px,rgba(255,255,255,.015) 27px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 60%)',
  },
  {
    italic: true,
    bg: '#0f0f0f',
    pattern: 'repeating-linear-gradient(55deg,transparent,transparent 38px,rgba(255,255,255,.018) 38px,rgba(255,255,255,.018) 39px)',
    gradient: 'linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.08) 55%,transparent 100%)',
  },
]

function splitName(name) {
  const words = (name || 'Untitled').split(' ')
  if (words.length < 2) return [words[0], '']
  return [words[0], words.slice(1).join(' ')]
}

function toCard(c, i) {
  const style = CARD_STYLES[i % CARD_STYLES.length]
  return {
    slug: c.id,
    label: `${String(i + 1).padStart(2, '0')} / ${c.category || ''}`,
    name: splitName(c.name),
    italic: style.italic,
    meta: `${c.count || `${c.dresses.length} Looks`} · ${c.season || ''}`,
    thumb: c.thumb,
    bg: style.bg,
    pattern: style.pattern,
    gradient: style.gradient,
    badge: c.latest ? 'Latest' : undefined,
  }
}

const GAP = 28

export default function Collections() {
  const { collections } = useCms()
  const collCards = collections.map(toCard)
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const snapToRef = useRef(() => {})
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const [lbLook, setLbLook] = useState(null)
  const [lbIdx, setLbIdx] = useState(-1)

  const closeLb = useCallback(() => setLbIdx(-1), [])

  const navLb = useCallback(
    (dir) => {
      setLbIdx((prev) => {
        const n = prev + dir
        if (!lbLook || n < 0 || n >= lbLook.angles.length) return prev
        return n
      })
    },
    [lbLook],
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

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return

    let tx = 0
    let velX = 0
    let isDrag = false
    let startX = 0
    let startTx = 0
    let prevX = 0
    let raf = null
    let dragMoved = false

    const wrapW = () => wrap.getBoundingClientRect().width
    const cardW = () => cards[0].offsetWidth
    const step = () => cardW() + GAP
    const maxTx = () => (wrapW() - cardW()) / 2
    const minTx = () => maxTx() - (cards.length - 1) * step()
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

    const updateVisuals = () => {
      const center = wrapW() / 2
      cards.forEach((card) => {
        const r = card.getBoundingClientRect()
        const cc = r.left + r.width / 2
        const dist = Math.abs(cc - center)
        const t = clamp(dist / (wrapW() * 0.52), 0, 1)
        card.style.opacity = String(+(1 - t * 0.78).toFixed(3))
        card.style.transform = `scale(${+(1 - t * 0.06).toFixed(4)})`
      })
    }

    const setTx = (v) => {
      tx = v
      track.style.transform = `translateX(${tx}px)`
      updateVisuals()
    }

    const animateTo = (target, idx) => {
      if (raf) cancelAnimationFrame(raf)
      const go = () => {
        const diff = target - tx
        if (Math.abs(diff) < 0.35) {
          setTx(target)
          if (idx !== undefined) setActiveIdx(idx)
          return
        }
        setTx(tx + diff * 0.18)
        raf = requestAnimationFrame(go)
      }
      raf = requestAnimationFrame(go)
    }

    const snapToIdx = (i) => {
      const ci = clamp(i, 0, cards.length - 1)
      animateTo(maxTx() - ci * step(), ci)
    }

    setTx(maxTx())
    setActiveIdx(0)

    const onPointerDown = (e) => {
      if (e.button !== 0) return
      if (raf) {
        cancelAnimationFrame(raf)
        raf = null
      }
      isDrag = true
      dragMoved = false
      startX = e.clientX
      startTx = tx
      prevX = e.clientX
      velX = 0
      track.style.cursor = 'grabbing'
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endDrag)
      document.addEventListener('pointercancel', endDrag)
    }
    const onPointerMove = (e) => {
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5) dragMoved = true
      velX = e.clientX - prevX
      prevX = e.clientX
      setTx(clamp(startTx + dx, minTx() - 90, maxTx() + 90))
    }
    const endDrag = () => {
      if (!isDrag) return
      isDrag = false
      track.style.cursor = 'grab'
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endDrag)
      document.removeEventListener('pointercancel', endDrag)
      const momentum = () => {
        velX *= 0.82
        const next = clamp(tx + velX, minTx(), maxTx())
        setTx(next)
        if (Math.abs(velX) > 0.5) {
          raf = requestAnimationFrame(momentum)
        } else {
          const ni = clamp(Math.round((maxTx() - tx) / step()), 0, cards.length - 1)
          animateTo(maxTx() - ni * step(), ni)
        }
      }
      raf = requestAnimationFrame(momentum)
    }

    track.addEventListener('pointerdown', onPointerDown)

    cards.forEach((card) => {
      const handler = (e) => {
        if (dragMoved) {
          e.preventDefault()
          e.stopPropagation()
        } else {
          const slug = card.dataset.collSlug
          const found = collectionToLook(getDb().collections.find((c) => c.id === slug))
          if (found) {
            setLbLook(found)
            setLbIdx(0)
          }
        }
      }
      card.addEventListener('click', handler)
      card._clickHandler = handler
    })

    snapToRef.current = snapToIdx

    return () => {
      if (raf) cancelAnimationFrame(raf)
      track.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endDrag)
      document.removeEventListener('pointercancel', endDrag)
      cards.forEach((card) => {
        if (card._clickHandler) card.removeEventListener('click', card._clickHandler)
      })
    }
    // re-wire when the number of collections changes (added/removed in the CMS)
  }, [collections.length])

  const snapTo = (i) => snapToRef.current(i)

  return (
    <section
      id="collections"
      style={{
        background: '#0a0a0a',
        padding: 'clamp(60px,10vh,144px) clamp(16px,4vw,52px) clamp(60px,10vh,104px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(40px,8vw,72px)',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px,2vw,14px)',
              marginBottom: 'clamp(12px,2vw,18px)',
            }}
          >
            <div style={{ width: 'clamp(18px,3vw,26px)', height: '1px', background: '#d4af37', opacity: 0.65 }} />
            <span
              className="font-label"
              style={{
                fontSize: 'clamp(7px,1.5vw,9px)',
                letterSpacing: '.25em',
                textTransform: 'uppercase',
                color: '#d4af37',
              }}
            >
              03 / Collections
            </span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(28px,5vw,52px)',
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: '-.02em',
              color: 'rgba(255,255,255,.92)',
            }}
          >
            The Work
          </h2>
        </div>
      </div>

      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          marginTop: 'clamp(40px,8vw,72px)',
          marginLeft: 'clamp(-16px,-4vw,-52px)',
          marginRight: 'clamp(-16px,-4vw,-52px)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={trackRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            willChange: 'transform',
            cursor: 'grab',
            padding: '4px 0 24px',
            userSelect: 'none',
          }}
        >
          {collCards.map((coll, i) => (
            <div
              key={coll.slug}
              ref={(el) => (cardRefs.current[i] = el)}
              data-coll-slug={coll.slug}
              style={{
                flex: '0 0 clamp(280px,70vw,360px)',
                height: 'clamp(460px,72vh,680px)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'box-shadow 400ms ease',
                boxShadow: hoveredIdx === i ? 'inset 0 0 0 1px rgba(212,175,55,0.22)' : 'none',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: coll.bg,
                  backgroundImage: coll.thumb ? `url(${coll.thumb})` : coll.pattern,
                  backgroundSize: coll.thumb ? 'cover' : undefined,
                  backgroundPosition: coll.thumb ? 'center top' : undefined,
                  transition: 'transform 700ms ease',
                  transform: hoveredIdx === i ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {!coll.thumb && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'clamp(12px,2vw,20px)',
                      left: 'clamp(12px,2vw,20px)',
                      fontFamily: 'monospace',
                      fontSize: 'clamp(6px,1.5vw,8px)',
                      color: 'rgba(255,255,255,.13)',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    collection-{String(i + 1).padStart(2, '0')}.jpg
                  </div>
                )}
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: coll.gradient,
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: hoveredIdx === i ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
                  zIndex: 3,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 400ms ease',
                }}
              >
                <span
                  className="font-label"
                  style={{
                    fontSize: 'clamp(8px,2vw,10px)',
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    color: '#d4af37',
                    opacity: hoveredIdx === i ? 1 : 0,
                    transform: hoveredIdx === i ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 400ms ease, transform 400ms ease',
                  }}
                >
                  View Collection
                </span>
              </div>
              {coll.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'clamp(12px,2vw,20px)',
                    right: 'clamp(12px,2vw,20px)',
                    zIndex: 5,
                    background: 'rgba(212,175,55,.07)',
                    border: '1px solid rgba(212,175,55,.22)',
                    padding: 'clamp(3px,0.75vw,5px) clamp(8px,1.5vw,14px)',
                  }}
                >
                  <span
                    className="font-label"
                    style={{
                      fontSize: 'clamp(6px,1.5vw,8px)',
                      letterSpacing: '.22em',
                      textTransform: 'uppercase',
                      color: '#d4af37',
                    }}
                  >
                    {coll.badge}
                  </span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(20px,3vw,32px)', zIndex: 4 }}>
                <div
                  className="font-label"
                  style={{
                    fontSize: 'clamp(7px,1.5vw,9px)',
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    color: '#d4af37',
                    marginBottom: 'clamp(6px,1.5vw,10px)',
                  }}
                >
                  {coll.label}
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(28px,6vw,38px)',
                    fontWeight: 300,
                    fontStyle: coll.italic ? 'italic' : 'normal',
                    color: 'rgba(255,255,255,.92)',
                    lineHeight: 1.05,
                    marginBottom: 'clamp(6px,1.5vw,10px)',
                  }}
                >
                  {coll.name[0]}
                  <br />
                  {coll.name[1]}
                </h3>
                <p
                  className="font-label"
                  style={{
                    fontSize: 'clamp(8px,1.5vw,10px)',
                    color: 'rgba(255,255,255,.34)',
                    letterSpacing: '.08em',
                  }}
                >
                  {coll.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: '24px',
            width: 'clamp(80px,20vw,130px)',
            background: 'linear-gradient(to right,rgba(10,10,10,.92) 0%,transparent 100%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 'clamp(16px,3vw,32px)',
            cursor: 'pointer',
            opacity: activeIdx === 0 ? 0 : 1,
            pointerEvents: activeIdx === 0 ? 'none' : 'auto',
            transition: 'opacity 350ms ease',
          }}
          onClick={() => snapTo(activeIdx - 1)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="18" y1="11" x2="4" y2="11" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <polyline points="10,5 4,11 10,17" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: '24px',
            width: 'clamp(80px,20vw,130px)',
            background: 'linear-gradient(to left,rgba(10,10,10,.92) 0%,transparent 100%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 'clamp(16px,3vw,32px)',
            cursor: 'pointer',
            opacity: activeIdx === collCards.length - 1 ? 0 : 1,
            pointerEvents: activeIdx === collCards.length - 1 ? 'none' : 'auto',
            transition: 'opacity 350ms ease',
          }}
          onClick={() => snapTo(activeIdx + 1)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="4" y1="11" x2="18" y2="11" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <polyline points="12,5 18,11 12,17" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(20px,3vw,36px) 0 0',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {collCards.map((coll, i) => (
            <div
              key={coll.slug}
              onClick={() => snapTo(i)}
              style={{
                width: activeIdx === i ? '22px' : '6px',
                height: '2px',
                background: activeIdx === i ? '#d4af37' : 'rgba(255,255,255,.18)',
                borderRadius: '1px',
                cursor: 'pointer',
                transition: 'all 320ms ease',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,4vw,28px)' }}>
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(14px,4vw,20px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.25)',
              letterSpacing: '.06em',
              minWidth: '52px',
              textAlign: 'center',
            }}
          >
            {String(activeIdx + 1).padStart(2, '0')} / {String(collCards.length).padStart(2, '0')}
          </span>
        </div>
      </div>

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
        {lbIdx >= 0 && lbLook && (
          <GalleryViewer
            look={lbLook}
            idx={lbIdx}
            onClose={closeLb}
            onNav={navLb}
            onJump={setLbIdx}
            viewAllHref={'/work#' + lbLook.coll}
          />
        )}
      </div>
    </section>
  )
}
