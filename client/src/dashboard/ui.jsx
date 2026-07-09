import { useRef, useState } from 'react'
import { GOLD } from '../cms/store'
import { INP_CSS, LBL_CSS, PANEL_CSS } from './styles'

export function Panel({ style, children }) {
  return <div style={{ ...PANEL_CSS, ...style }}>{children}</div>
}

export function Field({ label, value, onChange, textarea, rows = 3, mono, placeholder, grow, inputRef }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...(grow ? { flex: 1 } : {}) }}>
      <label style={LBL_CSS}>{label}</label>
      <Tag
        ref={inputRef}
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...INP_CSS,
          ...(textarea ? { minHeight: `${rows * 24}px`, resize: 'vertical', lineHeight: 1.65 } : {}),
          ...(mono ? { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' } : {}),
        }}
      />
    </div>
  )
}

export function Btn({ children, variant, onClick, style }) {
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '10px',
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '11px 20px',
    transition: '.2s ease',
    background: 'transparent',
  }
  const variants = {
    danger: {
      rest: { border: '1px solid rgba(200,90,70,.35)', color: 'rgba(200,110,90,.85)' },
      hover: { background: 'rgba(200,90,70,.1)', borderColor: 'rgba(200,90,70,.6)' },
    },
    ghost: {
      rest: { border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.6)' },
      hover: { background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.9)' },
    },
    default: {
      rest: { border: `1px solid ${GOLD}66`, color: 'rgba(255,255,255,.88)' },
      hover: { background: `${GOLD}14`, borderColor: GOLD },
    },
  }
  const v = variants[variant] || variants.default
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...v.rest, ...style }}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, v.hover)}
      onMouseLeave={(e) =>
        Object.assign(e.currentTarget.style, {
          background: 'transparent',
          borderColor: v.rest.border.split('solid ')[1],
          color: v.rest.color,
        })
      }
    >
      {children}
    </button>
  )
}

export function Eyebrow({ num, title, desc }) {
  return (
    <div style={{ marginBottom: '26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: desc ? '10px' : 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.2em', color: GOLD }}>
          {num}
        </span>
        <span style={{ width: '22px', height: '1px', background: GOLD, opacity: 0.5 }} />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '30px',
            fontWeight: 300,
            color: 'rgba(255,255,255,.92)',
            letterSpacing: '.01em',
          }}
        >
          {title}
        </h2>
      </div>
      {desc && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,.4)',
            maxWidth: '560px',
            paddingLeft: '22px',
          }}
        >
          {desc}
        </p>
      )}
    </div>
  )
}

export function AddTile({ label, onClick, minHeight }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        minHeight: minHeight ? `${minHeight}px` : undefined,
        background: hovered ? `${GOLD}0a` : 'transparent',
        border: `1px dashed ${hovered ? `${GOLD}80` : 'rgba(255,255,255,.16)'}`,
        borderRadius: '3px',
        cursor: 'pointer',
        transition: 'border-color .2s ease, background .2s ease, color .2s ease',
        color: hovered ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: `1px solid ${hovered ? GOLD : 'rgba(255,255,255,.18)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '17px',
          lineHeight: 1,
          transition: '.2s ease',
          color: 'inherit',
        }}
      >
        +
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

/** Drag-drop / click image upload slot storing a data-URL. */
export function ImageSlot({ value, onChange, ratio = '3/4', hint }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const r = new FileReader()
    r.onload = () => onChange(r.result)
    r.readAsDataURL(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        readFile(e.dataTransfer.files[0])
      }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        background: dragging ? `${GOLD}0d` : '#0c0c0e',
        border: `1px ${value || dragging ? 'solid' : 'dashed'} ${
          dragging ? GOLD : value ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.14)'
        }`,
        borderRadius: '3px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color .2s ease, background .2s ease',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files[0]) readFile(e.target.files[0])
          e.target.value = ''
        }}
      />
      {value ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${value}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: hovered ? 1 : 0,
              transition: 'opacity .2s',
              background: 'linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.1) 55%)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              padding: '12px',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.25)',
                padding: '7px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Replace
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,190,180,.95)',
                background: 'rgba(200,90,70,.18)',
                border: '1px solid rgba(200,90,70,.4)',
                padding: '7px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '11px',
            textAlign: 'center',
            padding: '12px',
            backgroundImage:
              'repeating-linear-gradient(135deg,transparent,transparent 9px,rgba(255,255,255,.018) 9px,rgba(255,255,255,.018) 10px)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={GOLD} strokeOpacity=".55" strokeWidth="1" />
            <line x1="12" y1="8" x2="12" y2="16" stroke={GOLD} strokeWidth="1" />
            <line x1="8" y1="12" x2="16" y2="12" stroke={GOLD} strokeWidth="1" />
          </svg>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.42)',
            }}
          >
            Drop image
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,.24)' }}>
            {hint || 'or click to upload'}
          </div>
        </div>
      )}
    </div>
  )
}
