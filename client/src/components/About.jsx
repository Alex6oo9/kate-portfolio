import useReveal from '../hooks/useReveal'
import { useCms } from '../cms/store'

function Reveal({ delay = 0, style, children, ...props }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      data-delay={delay}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: `opacity 900ms ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 900ms ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default function About() {
  const { about } = useCms()
  return (
    <section
      id="about"
      style={{
        background: '#0a0a0a',
        padding: 'clamp(60px,10vh,144px) clamp(20px,6vw,80px) clamp(60px,10vh,144px)',
        display: 'flex',
        gap: 'clamp(24px,8vw,96px)',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        flexWrap: 'wrap',
      }}
    >
      {/* Ghost "02" */}
      <div
        className="font-display"
        style={{
          position: 'absolute',
          right: 'clamp(-5%,-3vw,-3%)',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(80px,28vw,280px)',
          fontWeight: 300,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,.03)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        02
      </div>

      {/* Image column */}
      <Reveal
        id="about-img-col"
        style={{
          flex: '0 0 38%',
          maxWidth: '38%',
          position: 'sticky',
          top: 'clamp(80px,12vh,120px)',
          alignSelf: 'flex-start',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '0.75',
            background: '#111',
            backgroundImage: about.image
              ? `url(${about.image})`
              : 'repeating-linear-gradient(135deg,transparent,transparent 32px,rgba(255,255,255,.018) 32px,rgba(255,255,255,.018) 33px)',
            backgroundSize: about.image ? 'cover' : undefined,
            backgroundPosition: about.image ? 'center top' : undefined,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {!about.image && (
            <div
              style={{
                position: 'absolute',
                top: '38%',
                left: '50%',
                transform: 'translate(-50%,-50%) rotate(45deg)',
                width: '52px',
                height: '52px',
                border: '1px solid rgba(212,175,55,.11)',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'clamp(12px,2vw,20px) clamp(12px,2vw,24px)',
              background: 'linear-gradient(to top,rgba(10,10,10,.85),transparent)',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 'clamp(7px,1.5vw,9px)',
                color: 'rgba(255,255,255,.22)',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
              }}
            >
              {about.image ? about.caption : 'designer — lifestyle photo'}
            </div>
          </div>
        </div>
        <div
          style={{
            width: '55%',
            height: '2px',
            background: 'linear-gradient(to right,#d4af37,transparent)',
            marginTop: 'clamp(12px,2vw,20px)',
          }}
        />
        <div
          className="font-label"
          style={{
            marginTop: 'clamp(8px,1.5vw,12px)',
            fontSize: 'clamp(8px,1.5vw,10px)',
            color: 'rgba(255,255,255,.24)',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
          }}
        >
          {about.caption}
        </div>
      </Reveal>

      {/* Text column */}
      <div style={{ flex: 1, zIndex: 1, minWidth: '280px' }}>
        <Reveal
          delay={80}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px,2vw,16px)',
            marginBottom: 'clamp(32px,6vw,52px)',
          }}
        >
          <div
            style={{
              width: '1px',
              height: 'clamp(24px,5vw,40px)',
              background: 'linear-gradient(to bottom,transparent,rgba(212,175,55,.65))',
            }}
          />
          <div>
            <div
              className="font-label"
              style={{
                fontSize: 'clamp(7px,1.5vw,9px)',
                letterSpacing: '.25em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: '5px',
              }}
            >
              02
            </div>
            <div
              className="font-label"
              style={{
                fontSize: 'clamp(7px,1.5vw,9px)',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.28)',
              }}
            >
              {about.credit}
            </div>
          </div>
        </Reveal>

        <Reveal
          delay={160}
          className="font-display"
          style={{
            fontSize: 'clamp(36px,8vw,72px)',
            fontWeight: 300,
            lineHeight: 0.92,
            color: 'rgba(255,255,255,.92)',
            marginBottom: '6px',
          }}
        >
          <h2>{about.name}</h2>
        </Reveal>

        <Reveal
          delay={220}
          className="font-display"
          style={{
            fontSize: 'clamp(14px,4vw,20px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#d4af37',
            marginBottom: 'clamp(24px,4vw,50px)',
            letterSpacing: '.04em',
          }}
        >
          {about.knownAs}
        </Reveal>

        {about.bio.map((paragraph, i) => (
          <Reveal
            key={i}
            delay={280 + i * 60}
            className="font-label"
            style={{
              fontSize: 'clamp(12px,2vw,14px)',
              fontWeight: 300,
              lineHeight: 1.95,
              color: 'rgba(255,255,255,.50)',
              marginBottom: i < about.bio.length - 1 ? 'clamp(12px,2vw,22px)' : undefined,
              maxWidth: '500px',
            }}
          >
            {paragraph}
          </Reveal>
        ))}

        <Reveal
          delay={520}
          style={{
            display: 'flex',
            gap: 'clamp(12px,3vw,24px)',
            alignItems: 'center',
            marginTop: 'clamp(24px,4vw,48px)',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#collections"
            data-btn-gold
            className="font-label"
            style={{
              fontSize: 'clamp(9px,2vw,10px)',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.88)',
              border: '1px solid rgba(212,175,55,.4)',
              padding: 'clamp(10px,2vw,13px) clamp(20px,4vw,30px)',
              display: 'inline-block',
              transition: 'background 300ms ease, border-color 300ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.09)'
              e.currentTarget.style.borderColor = '#d4af37'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(212,175,55,.4)'
            }}
          >
            View Collections
          </a>
          <a
            href="#contact"
            className="font-label"
            style={{
              fontSize: 'clamp(9px,2vw,10px)',
              fontWeight: 300,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.34)',
              borderBottom: '1px solid rgba(255,255,255,.12)',
              paddingBottom: '3px',
              transition: 'color 300ms ease',
            }}
          >
            Contact Kate →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
