import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#collections', label: 'Collections' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      const sy = window.scrollY
      let current = 'home'
      document.querySelectorAll('section[id], footer[id]').forEach((sec) => {
        if (sy >= sec.offsetTop - 160) current = sec.id
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="main-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(20px,5vw,60px)',
        paddingTop: '16px',
        paddingBottom: '16px',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(212,175,55,0.15)' : 'transparent'}`,
        transition: 'background 600ms ease, border-color 600ms ease',
        flexWrap: 'wrap',
      }}
    >
      <a
        href="#home"
        className="font-display"
        style={{
          fontSize: 'clamp(18px,5vw,26px)',
          fontWeight: 300,
          letterSpacing: '.14em',
          color: 'rgba(255,255,255,.92)',
          textTransform: 'uppercase',
        }}
      >
        Kate
      </a>
      <div style={{ display: 'flex', gap: 'clamp(24px,8vw,48px)', alignItems: 'center' }}>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-label"
            style={{
              fontSize: 'clamp(9px,2.5vw,11px)',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color:
                active === link.href.slice(1)
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.5)',
              transition: 'color 300ms ease',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
