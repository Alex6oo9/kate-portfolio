import { useEffect, useRef, useState } from 'react'
import { GOLD, save } from '../../cms/store'
import { AddTile, Btn, Eyebrow, Field, ImageSlot, Panel } from '../ui'
import { LBL_CSS } from '../styles'

function DeleteIconBtn({ onClick, size = 40 }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '0 0 auto',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        lineHeight: 1,
        borderRadius: '2px',
        cursor: 'pointer',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,.1)',
        color: 'rgba(255,255,255,.4)',
        transition: '.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,90,70,.5)'
        e.currentTarget.style.color = 'rgba(210,120,100,.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
        e.currentTarget.style.color = 'rgba(255,255,255,.4)'
      }}
    >
      ✕
    </button>
  )
}

function CollectionCard({ coll, onOpen, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#101012',
        border: `1px solid ${hovered ? `${GOLD}44` : 'rgba(255,255,255,.06)'}`,
        borderRadius: '3px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'cmsRowIn .3s ease',
        transition: 'border-color .2s ease',
      }}
    >
      {/* cover */}
      <div
        onClick={onOpen}
        style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#0c0c0e', overflow: 'hidden', cursor: 'pointer' }}
      >
        {coll.thumb ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${coll.thumb}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)' }} />
          </>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage:
                'repeating-linear-gradient(135deg,transparent,transparent 9px,rgba(255,255,255,.02) 9px,rgba(255,255,255,.02) 10px)',
            }}
          >
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>
              No cover
            </div>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '.08em',
            color: 'rgba(255,255,255,.85)',
            background: 'rgba(0,0,0,.5)',
            border: '1px solid rgba(255,255,255,.14)',
            padding: '5px 9px',
            borderRadius: '2px',
          }}
        >
          {coll.dresses.length} photos
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD }}>
          {(coll.category || '') + (coll.season ? ' · ' + coll.season : '')}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 400, color: 'rgba(255,255,255,.92)', lineHeight: 1.1 }}>
          {coll.name || 'Untitled'}
        </div>
        {coll.description && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 300,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,.45)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {coll.description}
          </p>
        )}
      </div>

      {/* footer */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 18px 18px', alignItems: 'center' }}>
        <Btn onClick={onOpen} style={{ flex: 1, padding: '11px 14px' }}>
          Edit collection &nbsp;→
        </Btn>
        <DeleteIconBtn onClick={onDelete} />
      </div>
    </div>
  )
}

function PhotoCard({ dress, idx, onDelete, highlight, nameRef }) {
  const set = (fn) => {
    fn()
    save()
  }
  return (
    <div
      data-photo-id={dress.id}
      style={{
        position: 'relative',
        background: '#101012',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: '3px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'cmsRowIn .3s ease',
        boxShadow: highlight ? `0 0 0 1px ${GOLD}, 0 0 0 5px ${GOLD}1a` : 'none',
        transition: 'box-shadow .6s ease',
      }}
    >
      <div style={{ position: 'relative' }}>
        <ImageSlot value={dress.img} onChange={(v) => set(() => (dress.img = v))} ratio="3/4" hint="dress photo" />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 2,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '.06em',
            color: 'rgba(255,255,255,.9)',
            background: 'rgba(0,0,0,.55)',
            border: '1px solid rgba(255,255,255,.14)',
            padding: '4px 8px',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        >
          {dress.num || String(idx + 1).padStart(3, '0')}
        </div>
      </div>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '8px' }}>
          <Field label="No." value={dress.num} onChange={(v) => set(() => (dress.num = v))} mono />
          <Field label="Name" value={dress.name} onChange={(v) => set(() => (dress.name = v))} placeholder="optional" inputRef={nameRef} />
        </div>
        <button
          onClick={onDelete}
          style={{
            width: '100%',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            padding: '9px 0',
            borderRadius: '2px',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,.1)',
            color: 'rgba(255,255,255,.45)',
            transition: '.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200,90,70,.5)'
            e.currentTarget.style.color = 'rgba(210,120,100,.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
            e.currentTarget.style.color = 'rgba(255,255,255,.45)'
          }}
        >
          Delete photo
        </button>
      </div>
    </div>
  )
}

function CrumbLink({ label, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{ cursor: 'pointer', color: 'rgba(255,255,255,.45)', transition: 'color .2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.8)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.45)')}
    >
      {label}
    </span>
  )
}

export default function WorkSection({ db, toast, setCrumb, mainRef }) {
  const [collId, setCollId] = useState(null)
  const [focusNewId, setFocusNewId] = useState(null)
  const newNameRef = useRef(null)
  const coll = collId ? db.collections.find((c) => c.id === collId) : null

  useEffect(() => {
    if (coll) {
      setCrumb(
        <>
          <CrumbLink label="The Work" onClick={() => setCollId(null)} />
          <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '16px', fontStyle: 'normal' }}>/</span>
          <span>{coll.name}</span>
        </>,
      )
    } else {
      setCrumb(null)
    }
  }, [coll, coll?.name, setCrumb])

  // focus + highlight a freshly added photo card
  useEffect(() => {
    if (!focusNewId) return
    const card = mainRef.current?.querySelector(`[data-photo-id="${focusNewId}"]`)
    if (card && mainRef.current) mainRef.current.scrollTop = card.offsetTop - 90
    newNameRef.current?.focus()
    const t = setTimeout(() => setFocusNewId(null), 900)
    return () => clearTimeout(t)
  }, [focusNewId, mainRef])

  if (!coll) {
    return (
      <div>
        <Eyebrow
          num="03"
          title="Collections"
          desc="Each collection appears on the site with a cover image and a short description. Open one to edit its details and manage the photos inside it."
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={LBL_CSS}>All Collections</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,.3)' }}>
            {db.collections.length} total
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {db.collections.map((c, idx) => (
            <CollectionCard
              key={c.id}
              coll={c}
              onOpen={() => setCollId(c.id)}
              onDelete={() => {
                if (confirm(`Delete “${c.name || 'Untitled'}” and its photos?`)) {
                  db.collections.splice(idx, 1)
                  save()
                  toast('Collection deleted')
                }
              }}
            />
          ))}
          <AddTile
            label="Add collection"
            minHeight={380}
            onClick={() => {
              const nc = {
                id: 'coll-' + Date.now(),
                category: 'New',
                name: 'Untitled Collection',
                season: 'SS 2025',
                fabric: '',
                description: '',
                thumb: '',
                dresses: [],
              }
              db.collections.push(nc)
              save()
              setCollId(nc.id)
              toast('Collection added — give it a name and cover')
            }}
          />
        </div>
      </div>
    )
  }

  const set = (fn) => {
    fn()
    save()
  }

  return (
    <div>
      <div
        onClick={() => setCollId(null)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,.4)',
          transition: 'color .2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <line x1="14" y1="5" x2="2" y2="5" stroke="currentColor" strokeWidth="1" />
          <polyline points="6,1 2,5 6,9" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        All collections
      </div>

      <Eyebrow
        num="03"
        title={coll.name}
        desc={`${coll.category} · ${coll.season} — edit this collection’s details, then manage the photos shown inside it.`}
      />

      <Panel style={{ marginBottom: '28px' }}>
        <style>{'@media(max-width:720px){#coll-info-grid{grid-template-columns:1fr !important}#coll-info-cover{max-width:200px}}'}</style>
        <div style={{ ...LBL_CSS, marginBottom: '18px' }}>Collection Info</div>
        <div id="coll-info-grid" style={{ display: 'grid', gridTemplateColumns: '180px minmax(0,1fr)', gap: '24px', alignItems: 'start' }}>
          <div id="coll-info-cover">
            <div style={{ ...LBL_CSS, marginBottom: '10px' }}>Cover image</div>
            <ImageSlot value={coll.thumb} onChange={(v) => set(() => (coll.thumb = v))} ratio="4/3" hint="shown on the card" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
              <Field label="Name" value={coll.name} onChange={(v) => set(() => (coll.name = v))} />
              <Field label="Category" value={coll.category} onChange={(v) => set(() => (coll.category = v))} placeholder="e.g. Evening" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Season" value={coll.season} onChange={(v) => set(() => (coll.season = v))} placeholder="e.g. SS 2025" />
              <Field label="Fabric" value={coll.fabric} onChange={(v) => set(() => (coll.fabric = v))} placeholder="Duchess satin · silk organza" />
            </div>
            <Field
              label="Description"
              value={coll.description}
              onChange={(v) => set(() => (coll.description = v))}
              textarea
              rows={3}
              placeholder="Shown on the collection card and detail page…"
            />
          </div>
        </div>
      </Panel>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={LBL_CSS}>Photos</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,.3)' }}>
          {coll.dresses.length} in collection
        </span>
      </div>

      {!coll.dresses.length && (
        <div
          style={{
            padding: '44px',
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,.1)',
            borderRadius: '3px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,.35)',
            marginBottom: '16px',
          }}
        >
          No photos yet — add the first one.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '16px' }}>
        {coll.dresses.map((d, idx) => (
          <PhotoCard
            key={d.id}
            dress={d}
            idx={idx}
            highlight={focusNewId === d.id}
            nameRef={focusNewId === d.id ? newNameRef : undefined}
            onDelete={() => {
              if (confirm(d.name ? `Delete “${d.name}”?` : 'Delete this photo?')) {
                coll.dresses.splice(idx, 1)
                save()
                toast('Photo deleted')
              }
            }}
          />
        ))}
        <AddTile
          label="Add photo"
          minHeight={296}
          onClick={() => {
            const nd = {
              id: 'd-' + Date.now(),
              num: String(coll.dresses.length + 1).padStart(3, '0'),
              name: '',
              img: '',
            }
            coll.dresses.push(nd)
            save()
            setFocusNewId(nd.id)
            toast('Photo added')
          }}
        />
      </div>
    </div>
  )
}
