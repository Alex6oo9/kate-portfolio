import { save } from '../../cms/store'
import { Btn, Eyebrow, Field, Panel } from '../ui'
import { LBL_CSS } from '../styles'

function LocationChip({ value, onChange, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#0e0e11',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: '2px',
        padding: '7px 10px 7px 12px',
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'rgba(255,255,255,.85)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          width: `${Math.max(60, (value || '').length * 8)}px`,
        }}
      />
      <span
        onClick={onRemove}
        style={{ cursor: 'pointer', color: 'rgba(255,255,255,.35)', fontSize: '13px', lineHeight: 1 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(200,110,90,.9)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
      >
        ✕
      </span>
    </div>
  )
}

export default function ContactSection({ db }) {
  const ct = db.contact
  const set = (fn) => {
    fn()
    save()
  }

  return (
    <div>
      <Eyebrow
        num="04"
        title="Contact & Footer"
        desc="Everything in the footer — contact details, social links, the location tags and the closing line."
      />
      <div id="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <style>{'@media(max-width:820px){#contact-grid{grid-template-columns:1fr !important}}'}</style>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '18px' }}>Contact Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Email" value={ct.email} onChange={(v) => set(() => (ct.email = v))} />
            <Field label="Phone" value={ct.phone} onChange={(v) => set(() => (ct.phone = v))} />
            <Field label="Role / title" value={ct.role} onChange={(v) => set(() => (ct.role = v))} placeholder="Haute Couture Designer" />
          </div>
        </Panel>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '18px' }}>Social Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="LinkedIn URL" value={ct.linkedin} onChange={(v) => set(() => (ct.linkedin = v))} mono />
            <Field label="Instagram URL" value={ct.instagram} onChange={(v) => set(() => (ct.instagram = v))} mono />
          </div>
        </Panel>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '6px' }}>Location Tags</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>
            Shown in the footer, separated by dots.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {ct.locations.map((loc, i) => (
              <LocationChip
                key={i}
                value={loc}
                onChange={(v) => set(() => (ct.locations[i] = v))}
                onRemove={() => set(() => ct.locations.splice(i, 1))}
              />
            ))}
          </div>
          <Btn
            variant="ghost"
            style={{ padding: '9px 16px', fontSize: '9px' }}
            onClick={() => set(() => ct.locations.push('New City'))}
          >
            +&nbsp;&nbsp;Add location
          </Btn>
        </Panel>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '18px' }}>Closing Line</div>
          <Field
            label="Footer tagline"
            value={ct.footerTagline}
            onChange={(v) => set(() => (ct.footerTagline = v))}
            textarea
            rows={2}
            placeholder="Ready to begin something extraordinary?"
          />
        </Panel>
      </div>
    </div>
  )
}
