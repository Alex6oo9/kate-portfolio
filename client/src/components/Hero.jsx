import { useEffect, useRef, useState } from 'react'
import { useCms } from '../cms/store'

export default function Hero() {
  const { hero } = useCms()
  const scrollRef = useRef(null)
  const heroRef = useRef(null)
  const panelRefs = useRef([])
  const [panelsVisible, setPanelsVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [portraitVisible, setPortraitVisible] = useState(false)

  useEffect(() => {
    const isMobile = window.innerWidth < 768

    const panelTimer = setTimeout(() => setPanelsVisible(true), 80)
    const textTimer = setTimeout(() => setTextVisible(true), 640)
    const portraitTimer = setTimeout(() => setPortraitVisible(true), 180)

    if (isMobile && scrollRef.current) {
      const heroScroll = scrollRef.current
      const t = setTimeout(() => {
        const panels = [...heroScroll.querySelectorAll('[data-hero-panel]')]
        if (panels.length >= 2) {
          const panelW = panels[0].offsetWidth
          const gap = 4
          const viewW = heroScroll.offsetWidth
          heroScroll.scrollLeft = panelW + gap - (viewW - panelW) / 2
        }
      }, 150)
      return () => {
        clearTimeout(panelTimer)
        clearTimeout(textTimer)
        clearTimeout(portraitTimer)
        clearTimeout(t)
      }
    }

    return () => {
      clearTimeout(panelTimer)
      clearTimeout(textTimer)
      clearTimeout(portraitTimer)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const handleMove = (e) => {
      const r = hero.getBoundingClientRect()
      const xR = (e.clientX - r.width / 2) / r.width
      const yR = (e.clientY - r.height * 0.4) / r.height
      panelRefs.current.forEach((p, i) => {
        if (!p) return
        p.style.transition = ''
        const xM = (i === 0 ? -1 : i === 2 ? 1 : 0) * 7
        p.style.transform = `translate(${xR * xM}px, ${yR * 3}px)`
      })
    }
    const handleLeave = () => {
      panelRefs.current.forEach((p) => {
        if (!p) return
        p.style.transition = 'transform 900ms ease'
        p.style.transform = ''
      })
    }
    hero.addEventListener('mousemove', handleMove)
    hero.addEventListener('mouseleave', handleLeave)
    return () => {
      hero.removeEventListener('mousemove', handleMove)
      hero.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const panels = hero.models.map((img, i) => ({ img, gradientSoft: i !== 1 }))

  return (
    <section
      id="home"
      ref={heroRef}
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}
    >
      {/* Background gold glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(400px,90vw,900px)',
          height: 'clamp(250px,50vh,500px)',
          background: 'rgba(212,175,55,.04)',
          borderRadius: '9999px',
          filter: 'blur(140px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Model panels row */}
      <div
        id="hero-panels-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'clamp(45vh,58vh,58vh)',
          paddingTop: 'clamp(60px,12vh,72px)',
          paddingLeft: 'clamp(2px,1vw,4px)',
          paddingRight: 'clamp(2px,1vw,4px)',
          boxSizing: 'border-box',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          id="hero-panels-scroll"
          ref={scrollRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 'clamp(2px,0.5vw,4px)',
            height: '100%',
            width: '100%',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            alignItems: 'flex-end',
            scrollSnapType: 'x mandatory',
          }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              data-hero-panel
              ref={(el) => (panelRefs.current[i] = el)}
              style={{
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                opacity: panelsVisible ? 1 : 0,
                transition: `opacity 1100ms ease ${80 + i * 120}ms`,
                zIndex: i === 1 ? 3 : 1,
                scrollSnapAlign: 'center',
                flex: '0 0 72vw',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#111',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: panel.img ? `url(${panel.img})` : undefined,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 'clamp(8px,1.5vw,14px)',
                  transition: 'transform 700ms ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: panel.gradientSoft
                    ? 'linear-gradient(to bottom,transparent 0%,transparent 50%,rgba(0,0,0,.65) 100%)'
                    : 'linear-gradient(to bottom,transparent 0%,transparent 40%,rgba(0,0,0,.82) 100%)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              {i !== 1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,.10)',
                    pointerEvents: 'none',
                    zIndex: 3,
                    transition: 'background 700ms ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div
        id="hero-tagline"
        style={{
          position: 'absolute',
          left: 'clamp(20px,5vw,60px)',
          bottom: 'clamp(20vh,21%,21%)',
          zIndex: 25,
          maxWidth: 'clamp(140px,35vw,210px)',
          textAlign: 'left',
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1000ms ease, transform 1000ms ease',
        }}
      >
        <div
          style={{
            width: 'clamp(18px,3vw,26px)',
            height: '1px',
            background: '#d4af37',
            marginBottom: 'clamp(8px,1.5vw,14px)',
            opacity: 0.65,
          }}
        />
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(13px,3vw,17px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.85,
            color: 'rgba(255,255,255,.65)',
            letterSpacing: '.02em',
          }}
        >
          {hero.taglineLine1}
          <br />
          {hero.taglineLine2}
          <br />
          <span style={{ color: '#d4af37', fontSize: 'clamp(16px,3.5vw,20px)', fontStyle: 'italic' }}>
            {hero.emphasis}.
          </span>
        </p>
      </div>

      {/* Explore Work link — hidden on mobile */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: 'clamp(16px,5%,5.5%)',
          bottom: 'clamp(10vh,13%,13%)',
          zIndex: 25,
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1000ms ease 190ms, transform 1000ms ease 190ms',
        }}
      >
        <a
          href="#collections"
          className="font-label"
          style={{
            fontSize: 'clamp(8px,2vw,9px)',
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.38)',
            borderBottom: '1px solid rgba(212,175,55,.25)',
            paddingBottom: '5px',
            transition: 'color 300ms ease',
          }}
        >
          Explore Work ↓
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        id="hero-scroll-indicator"
        style={{
          position: 'absolute',
          right: 'clamp(20px,5%,44px)',
          bottom: 'clamp(24px,8vh,38px)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1000ms ease 380ms, transform 1000ms ease 380ms',
        }}
      >
        <div
          className="font-label"
          style={{
            fontSize: 'clamp(6px,1.5vw,8px)',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.18)',
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
          }}
        >
          Scroll
        </div>
        <div
          className="animate-scrollDrop"
          style={{
            width: '1px',
            height: 'clamp(24px,6vh,38px)',
            background: 'linear-gradient(to bottom,rgba(212,175,55,.6),transparent)',
          }}
        />
      </div>

      {/* Center zone — portrait + KATE overlay as a unit */}
      <div
        id="hero-center-zone"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(220px,32vw,440px)',
          height: 'clamp(42vh,52vh,58vh)',
          zIndex: 30,
        }}
      >
        {/* Portrait card */}
        <div
          id="portrait-wrap"
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'drop-shadow(0 -20px 60px rgba(212,175,55,.18)) drop-shadow(0 30px 40px rgba(0,0,0,.8))',
            background: '#0a0a0a',
            border: '1px solid rgba(212,175,55,.22)',
            padding: '6px',
            boxSizing: 'border-box',
            opacity: portraitVisible ? 1 : 0,
            transform: portraitVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1400ms ease 180ms, transform 1400ms ease 180ms',
            overflow: 'hidden',
          }}
        >
          {hero.portrait && (
            <img
              src={hero.portrait}
              alt="Designer portrait"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          )}
        </div>

        {/* Ghost "KATE" — overlays the portrait */}
        <div
          className="font-wordmark animate-goldPulse"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
            fontSize: 'clamp(80px,28vw,380px)',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: '-.05em',
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: 'clamp(0.5px,0.12vw,1.5px) rgba(255,255,255,.22)',
          }}
        >
          KATE
        </div>
      </div>

      {/* Divider line at base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '1px',
          background: 'linear-gradient(to right,transparent,rgba(212,175,55,.30),transparent)',
          zIndex: 10,
        }}
      />
    </section>
  )
}
