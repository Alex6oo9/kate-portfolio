import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GOLD, reset, storageKb, useCms, useSaveState } from '../cms/store'
import Overview from './sections/Overview'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import WorkSection from './sections/WorkSection'
import ContactSection from './sections/ContactSection'

const NAV = [
  { id: 'overview', num: '00', label: 'Overview' },
  { id: 'hero', num: '01', label: 'Hero' },
  { id: 'about', num: '02', label: 'About' },
  { id: 'work', num: '03', label: 'The Work' },
  { id: 'contact', num: '04', label: 'Contact' },
]

const DASH_CSS = `
  #cms-main::-webkit-scrollbar{width:10px}
  #cms-main::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:0}
  #cms-main::-webkit-scrollbar-track{background:transparent}
  #cms-root input:focus,#cms-root textarea:focus{outline:none;border-color:${GOLD} !important}
  #cms-root input::placeholder,#cms-root textarea::placeholder{color:rgba(255,255,255,.22)}
  @keyframes cmsToastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cmsRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @media(max-width:1024px){#cms-sidebar{width:200px !important;flex-basis:200px !important}#cms-main{padding:28px 26px !important}}
  @media(max-width:760px){
    #cms-root{flex-direction:column !important}
    #cms-sidebar{width:100% !important;flex-basis:auto !important;height:auto !important;position:relative !important}
    #cms-nav{flex-direction:row !important;overflow-x:auto;gap:4px !important}
    #cms-nav button{flex:0 0 auto !important;white-space:nowrap}
    #cms-side-foot{display:none !important}
    #cms-main{padding:24px 18px !important}
  }
`

function NavButton({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 12px',
        borderRadius: '2px',
        transition: 'background .2s ease',
        background: active ? `${GOLD}14` : hovered ? 'rgba(255,255,255,.03)' : 'transparent',
        boxShadow: active ? `inset 2px 0 0 ${GOLD}` : 'none',
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          color: active ? GOLD : 'rgba(255,255,255,.28)',
        }}
      >
        {item.num}
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          letterSpacing: '.05em',
          color: active ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.5)',
        }}
      >
        {item.label}
      </span>
    </button>
  )
}

export default function Dashboard() {
  const db = useCms()
  const saveState = useSaveState()
  const [section, setSection] = useState('overview')
  const [toastMsg, setToastMsg] = useState(null)
  const toastTimer = useRef(null)
  const mainRef = useRef(null)
  // crumb parts pushed up by sections that have sub-navigation (The Work drill-in)
  const [crumb, setCrumb] = useState(null)

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const go = useCallback((sec) => {
    setSection(sec)
    setCrumb(null)
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const sectionProps = { db, toast, go, setCrumb, mainRef }
  const active = NAV.find((n) => n.id === section)

  return (
    <div
      id="cms-root"
      style={{
        display: 'flex',
        minHeight: '100vh',
        height: '100vh',
        background: '#0a0a0b',
        fontFamily: "'DM Sans', sans-serif",
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <style>{DASH_CSS}</style>

      {/* ── Sidebar ── */}
      <aside
        id="cms-sidebar"
        style={{
          flex: '0 0 244px',
          width: '244px',
          background: '#0d0d0f',
          borderRight: '1px solid rgba(255,255,255,.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 18px 18px',
        }}
      >
        <div style={{ padding: '0 8px 26px', borderBottom: '1px solid rgba(255,255,255,.05)', marginBottom: '20px' }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              fontWeight: 400,
              letterSpacing: '.28em',
              color: 'rgba(255,255,255,.92)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Kate
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '9px' }}>
            <div style={{ width: '14px', height: '1px', background: GOLD, opacity: 0.7 }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                letterSpacing: '.24em',
                textTransform: 'uppercase',
                color: 'rgba(212,175,55,.7)',
              }}
            >
              Studio CMS
            </span>
          </div>
        </div>

        <nav id="cms-nav" style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} active={section === item.id} onClick={() => go(item.id)} />
          ))}
        </nav>

        <div
          id="cms-side-foot"
          style={{
            borderTop: '1px solid rgba(255,255,255,.05)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '.06em',
              color: 'rgba(255,255,255,.24)',
              lineHeight: 1.5,
            }}
          >
            Saved locally · {storageKb()} KB
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all content to the original portfolio defaults? This clears your saved edits.')) {
                reset()
                go('overview')
                toast('Content reset to defaults')
              }
            }}
            style={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.3)',
              transition: 'color .2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(200,90,70,.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.3)')}
          >
            Reset content
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            flex: '0 0 auto',
            height: '66px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(20px,4vw,40px)',
            borderBottom: '1px solid rgba(255,255,255,.06)',
            background: '#0a0a0b',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '22px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,.85)',
            }}
          >
            {crumb || active?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.4)',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: saveState === 'saving' ? GOLD : '#4a9e6a',
                  display: 'inline-block',
                }}
              />
              {saveState === 'saving' ? 'Saving…' : 'Saved'}
            </span>
            <Link
              to="/"
              target="_blank"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.75)',
                textDecoration: 'none',
                border: '1px solid rgba(212,175,55,.4)',
                padding: '10px 18px',
                borderRadius: '2px',
                transition: '.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,.08)'
                e.currentTarget.style.borderColor = GOLD
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,.4)'
              }}
            >
              View live site ↗
            </Link>
          </div>
        </header>
        <main id="cms-main" ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '36px clamp(20px,4vw,48px) 80px' }}>
          {section === 'overview' && <Overview {...sectionProps} />}
          {section === 'hero' && <HeroSection {...sectionProps} />}
          {section === 'about' && <AboutSection {...sectionProps} />}
          {section === 'work' && <WorkSection {...sectionProps} />}
          {section === 'contact' && <ContactSection {...sectionProps} />}
        </main>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '26px',
            right: '26px',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#161618',
            border: '1px solid rgba(212,175,55,.3)',
            borderLeft: `2px solid ${GOLD}`,
            padding: '13px 18px',
            borderRadius: '2px',
            boxShadow: '0 20px 50px rgba(0,0,0,.6)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '.05em',
            color: 'rgba(255,255,255,.85)',
            animation: 'cmsToastIn .3s ease',
          }}
        >
          <span style={{ color: GOLD }}>✓</span> {toastMsg}
        </div>
      )}
    </div>
  )
}
