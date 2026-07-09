import { useState } from 'react'
import { GOLD } from '../../cms/store'
import { LBL_CSS } from '../styles'

const JUMPS = [
  { sec: 'hero', num: '01', title: 'Hero', sub: '3 models · portrait · tagline' },
  { sec: 'about', num: '02', title: 'About', sub: 'Bio, credit & portrait image' },
  { sec: 'work', num: '03', title: 'The Work', sub: 'Details, fabric & photos' },
  { sec: 'contact', num: '04', title: 'Contact', sub: 'Email, socials, locations' },
]

function JumpCard({ jump, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#131315' : '#101012',
        border: `1px solid ${hovered ? `${GOLD}55` : 'rgba(255,255,255,.06)'}`,
        borderRadius: '3px',
        padding: '22px',
        cursor: 'pointer',
        transition: '.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.2em', color: GOLD }}>
          {jump.num}
        </span>
        <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '15px' }}>→</span>
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 300, color: 'rgba(255,255,255,.9)' }}>
        {jump.title}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,.4)' }}>
        {jump.sub}
      </div>
    </div>
  )
}

export default function Overview({ go }) {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: GOLD,
            marginBottom: '12px',
          }}
        >
          Studio Dashboard
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '44px',
            fontWeight: 300,
            color: 'rgba(255,255,255,.92)',
            lineHeight: 1.05,
          }}
        >
          Manage the portfolio.
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,.45)',
            maxWidth: '520px',
            marginTop: '14px',
          }}
        >
          Edit every image, headline and collection that appears on the public site. Changes save to this browser as
          you type — open the live site to preview them.
        </p>
      </div>

      <div style={{ ...LBL_CSS, marginBottom: '14px' }}>Jump to a section</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '14px' }}>
        {JUMPS.map((jump) => (
          <JumpCard key={jump.sec} jump={jump} onClick={() => go(jump.sec)} />
        ))}
      </div>
    </div>
  )
}
