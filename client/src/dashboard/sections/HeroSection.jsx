import { GOLD, save } from '../../cms/store'
import { Eyebrow, Field, ImageSlot, Panel } from '../ui'
import { LBL_CSS } from '../styles'

const PANEL_LABELS = ['Left', 'Centre', 'Right']

function previewBg(v) {
  return v
    ? {
        backgroundImage: `url('${v}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }
    : {
        background: '#141414',
        backgroundImage:
          'repeating-linear-gradient(135deg,transparent,transparent 6px,rgba(255,255,255,.02) 6px,rgba(255,255,255,.02) 7px)',
      }
}

function HeroPreview({ hero }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/10.5',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '40%',
          background: `${GOLD}0a`,
          borderRadius: '9999px',
          filter: 'blur(40px)',
        }}
      />
      <div style={{ position: 'absolute', top: '7%', left: '1.5%', right: '1.5%', height: '60%', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
        {hero.models.map((img, i) => (
          <div key={i} style={{ flex: 1, height: i === 1 ? '100%' : '93%', position: 'relative', ...previewBg(img) }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  i === 1
                    ? 'linear-gradient(to bottom,transparent 45%,rgba(0,0,0,.75))'
                    : 'linear-gradient(to bottom,transparent 55%,rgba(0,0,0,.6))',
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '6%',
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(30px,9vw,74px)',
          fontWeight: 400,
          lineHeight: 0.85,
          letterSpacing: '-.04em',
          textTransform: 'uppercase',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,.16)',
        }}
      >
        Kate
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20%',
          height: '44%',
          background: '#0d0d0d',
          border: `1px solid ${GOLD}3a`,
          padding: '3px',
        }}
      >
        <div style={{ width: '100%', height: '100%', ...previewBg(hero.portrait) }} />
      </div>
      <div style={{ position: 'absolute', left: '4%', bottom: '19%', maxWidth: '34%' }}>
        <div style={{ width: '18px', height: '1px', background: GOLD, opacity: 0.65, marginBottom: '7px' }} />
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(8px,1.5vw,13px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,.62)',
          }}
        >
          {hero.taglineLine1}
          <br />
          {hero.taglineLine2} <span style={{ color: GOLD }}>{hero.emphasis}.</span>
        </p>
      </div>
    </div>
  )
}

export default function HeroSection({ db }) {
  const h = db.hero
  const set = (fn) => {
    fn()
    save()
  }

  return (
    <div id="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '26px', alignItems: 'start' }}>
      <style>{'@media(max-width:980px){#hero-grid{grid-template-columns:1fr !important}}'}</style>

      {/* left: editors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <Eyebrow
          num="01"
          title="The Hero"
          desc="The first thing visitors see — three model panels forming a triptych, the designer portrait rising in front, and the opening tagline."
        />

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '4px' }}>Model Panels</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,.4)', marginBottom: '18px' }}>
            Three images, left to right. The centre panel sits taller.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
            {PANEL_LABELS.map((label, i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ImageSlot
                  value={h.models[i]}
                  onChange={(v) => set(() => (h.models[i] = v))}
                  ratio={i === 1 ? '3/4.4' : '3/4'}
                  hint={label.toLowerCase()}
                />
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,.34)',
                    textAlign: 'center',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '4px' }}>Designer Portrait</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,.4)', marginBottom: '18px' }}>
            Framed portrait that rises in front of the panels, centred at the base of the hero.
          </div>
          <div style={{ maxWidth: '230px' }}>
            <ImageSlot value={h.portrait} onChange={(v) => set(() => (h.portrait = v))} ratio="3/4" hint="portrait" />
          </div>
        </Panel>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '18px' }}>Tagline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Line 1" value={h.taglineLine1} onChange={(v) => set(() => (h.taglineLine1 = v))} />
            <Field label="Line 2" value={h.taglineLine2} onChange={(v) => set(() => (h.taglineLine2 = v))} />
            <Field
              label="Emphasised word (shown in accent)"
              value={h.emphasis}
              onChange={(v) => set(() => (h.emphasis = v))}
            />
          </div>
        </Panel>
      </div>

      {/* right: live preview */}
      <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD }} />
          <span style={LBL_CSS}>Live preview</span>
        </div>
        <HeroPreview hero={h} />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 300, color: 'rgba(255,255,255,.3)', lineHeight: 1.6 }}>
          A scaled reflection of the live hero. Drop new images on the left to see them here instantly.
        </div>
      </div>
    </div>
  )
}
