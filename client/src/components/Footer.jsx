import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { useCms } from '../cms/store'

// break the tagline into two lines: short lines break before the last word,
// longer ones near the middle (mirrors the original "Ready to begin something / extraordinary?")
function splitTagline(s) {
  const words = (s || '').trim().split(/\s+/)
  if (words.length < 2) return [s || '', '']
  const cut = words.length <= 5 ? words.length - 1 : Math.ceil(words.length / 2)
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')]
}

const NAV_LINKS = [
  { href: '#collections', label: 'Collections' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

function NavLink({ href, children, style }) {
  return (
    <a
      href={href}
      className="font-label"
      style={{
        color: 'rgba(255,255,255,.5)',
        transition: 'color 300ms ease',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = style?.color ?? 'rgba(255,255,255,.5)')}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const topRowRef = useReveal()
  const detailsRef = useReveal()
  const { about, contact } = useCms()
  const [tagLine1, tagLine2] = splitTagline(contact.footerTagline)

  return (
    <footer
      id="contact"
      style={{
        background: '#060606',
        padding: 'clamp(50px,8vh,100px) clamp(20px,6vw,80px) clamp(40px,6vh,60px)',
        borderTop: '1px solid rgba(255,255,255,.04)',
      }}
    >
      <div
        ref={topRowRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'clamp(40px,6vw,72px)',
          gap: '20px',
          flexWrap: 'wrap',
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(36px,8vw,64px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.88)',
              lineHeight: 0.95,
              marginBottom: 'clamp(8px,1.5vw,16px)',
            }}
          >
            {about.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,12px)' }}>
            <div style={{ width: 'clamp(12px,2vw,18px)', height: '1px', background: '#d4af37', opacity: 0.6 }} />
            <span
              className="font-label"
              style={{
                fontSize: 'clamp(7px,1.5vw,9px)',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#d4af37',
              }}
            >
              {contact.role}
            </span>
          </div>
        </div>
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(14px,3vw,20px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,.35)',
            lineHeight: 1.75,
            textAlign: 'right',
          }}
        >
          {tagLine1}
          {tagLine2 && (
            <>
              <br />
              {tagLine2}
            </>
          )}
        </p>
      </div>

      <div
        ref={detailsRef}
        style={{
          display: 'flex',
          gap: 'clamp(20px,4vw,64px)',
          alignItems: 'flex-start',
          marginBottom: 'clamp(40px,6vw,72px)',
          flexWrap: 'wrap',
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'opacity 900ms 100ms cubic-bezier(0.16,1,0.3,1), transform 900ms 100ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div>
          <div
            className="font-label"
            style={{
              fontSize: 'clamp(6px,1.5vw,8px)',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#d4af37',
              marginBottom: 'clamp(6px,1.5vw,10px)',
            }}
          >
            Email
          </div>
          <NavLink
            href={`mailto:${contact.email}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(14px,3vw,18px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.65)',
              letterSpacing: '.03em',
            }}
          >
            {contact.email}
          </NavLink>
        </div>

        <div>
          <div
            className="font-label"
            style={{
              fontSize: 'clamp(6px,1.5vw,8px)',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#d4af37',
              marginBottom: 'clamp(6px,1.5vw,10px)',
            }}
          >
            Phone
          </div>
          <NavLink
            href={`tel:${(contact.phone || '').replace(/[^+\d]/g, '')}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(14px,3vw,18px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,.65)',
              letterSpacing: '.03em',
            }}
          >
            {contact.phone}
          </NavLink>
        </div>

        <div>
          <div
            className="font-label"
            style={{
              fontSize: 'clamp(6px,1.5vw,8px)',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#d4af37',
              marginBottom: 'clamp(8px,1.5vw,14px)',
            }}
          >
            Socials
          </div>
          <div style={{ display: 'flex', gap: 'clamp(12px,2vw,20px)', alignItems: 'center' }}>
            <NavLink
              href={contact.linkedin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(32px,6vw,40px)',
                height: 'clamp(32px,6vw,40px)',
                border: '1px solid rgba(255,255,255,.15)',
                color: 'rgba(255,255,255,.55)',
                transition: 'border-color 300ms ease, color 300ms ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 0 1-1.98-1.98c0-1.094.887-1.98 1.98-1.98 1.094 0 1.98.886 1.98 1.98 0 1.093-.886 1.98-1.98 1.98zm1.957 13.019H3.379V9h3.915v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </NavLink>
            <NavLink
              href={contact.instagram}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(32px,6vw,40px)',
                height: 'clamp(32px,6vw,40px)',
                border: '1px solid rgba(255,255,255,.15)',
                color: 'rgba(255,255,255,.55)',
                transition: 'border-color 300ms ease, color 300ms ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </NavLink>
          </div>
        </div>
      </div>

      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right,transparent,rgba(255,255,255,.07),transparent)',
          marginBottom: 'clamp(24px,4vw,40px)',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          fontSize: 'clamp(8px,1.5vw,10px)',
        }}
      >
        <div className="font-label" style={{ color: 'rgba(255,255,255,.20)', letterSpacing: '.08em' }}>
          © {new Date().getFullYear()} {about.name}. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)' }}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              style={{ letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.26)' }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="font-label" style={{ color: 'rgba(255,255,255,.20)', letterSpacing: '.1em' }}>
          {contact.locations.join(' · ')}
        </div>
        <Link
          to="/dashboard"
          className="font-label"
          style={{
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.26)',
            border: '1px solid rgba(255,255,255,.15)',
            padding: '8px 14px',
            transition: 'color 300ms ease, border-color 300ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,.26)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'
          }}
        >
          Dashboard (Demo)
        </Link>
      </div>
    </footer>
  )
}
