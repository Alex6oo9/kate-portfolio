import { save } from '../../cms/store'
import { Eyebrow, Field, ImageSlot, Panel } from '../ui'
import { LBL_CSS } from '../styles'

export default function AboutSection({ db }) {
  const a = db.about
  const set = (fn) => {
    fn()
    save()
  }

  return (
    <div>
      <Eyebrow
        num="02"
        title="About the Designer"
        desc="The biography section — the portrait, the designer name and credit, and the three paragraphs of story."
      />
      <div id="about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,300px) minmax(0,1fr)', gap: '26px', alignItems: 'start' }}>
        <style>{'@media(max-width:820px){#about-grid{grid-template-columns:1fr !important}}'}</style>

        <Panel>
          <div style={{ ...LBL_CSS, marginBottom: '16px' }}>Portrait Image</div>
          <ImageSlot value={a.image} onChange={(v) => set(() => (a.image = v))} ratio="3/4" hint="lifestyle photo" />
          <div style={{ height: '20px' }} />
          <Field label="Image caption" value={a.caption} onChange={(v) => set(() => (a.caption = v))} placeholder="e.g. Khin Kyi, 2024" />
        </Panel>

        <Panel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Designer name" value={a.name} onChange={(v) => set(() => (a.name = v))} />
            <Field label={'Credit line ("known as…")'} value={a.knownAs} onChange={(v) => set(() => (a.knownAs = v))} />
          </div>
          <div style={{ height: '18px' }} />
          <Field
            label="Section credit label"
            value={a.credit}
            onChange={(v) => set(() => (a.credit = v))}
            placeholder="About the Designer"
          />
          <div style={{ height: '22px' }} />
          <div style={{ ...LBL_CSS, marginBottom: '14px' }}>Biography</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {a.bio.map((p, i) => (
              <Field
                key={i}
                label={`Paragraph ${i + 1}`}
                value={p}
                onChange={(v) => set(() => (a.bio[i] = v))}
                textarea
                rows={3}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
