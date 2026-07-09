// Collection background treatments + the mapping from CMS collections to
// the "look" shape the gallery viewers render. Kept out of Work.jsx so that
// component files only export components (react-refresh).

export const DEFAULT_BG = {
  background: '#101012',
  backgroundImage:
    'repeating-linear-gradient(135deg,transparent,transparent 32px,rgba(255,255,255,.018) 32px,rgba(255,255,255,.018) 33px)',
}

export const COLL_BACKGROUNDS = {
  'midnight-reverie': {
    background: '#0c0c10',
    backgroundImage:
      'repeating-linear-gradient(155deg,transparent,transparent 38px,rgba(160,160,220,.016) 38px,rgba(160,160,220,.016) 39px)',
  },
  'golden-hour': {
    background: '#110e08',
    backgroundImage:
      'repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(212,175,55,.026) 22px,rgba(212,175,55,.026) 23px)',
  },
  'phantom-silk': {
    background: '#0c0c0e',
    backgroundImage:
      'repeating-linear-gradient(90deg,transparent,transparent 56px,rgba(210,210,240,.013) 56px,rgba(210,210,240,.013) 57px)',
  },
  'obsidian-cut': {
    background: '#0f0f0f',
    backgroundImage:
      'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,.018) 28px,rgba(255,255,255,.018) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,.018) 28px,rgba(255,255,255,.018) 29px)',
  },
  'ivory-dust': {
    background: '#0e0c0a',
    backgroundImage:
      'repeating-linear-gradient(135deg,transparent,transparent 18px,rgba(255,248,230,.022) 18px,rgba(255,248,230,.022) 19px)',
  },
  'crimson-theory': {
    background: '#130507',
    backgroundImage:
      'repeating-linear-gradient(160deg,transparent,transparent 32px,rgba(180,20,28,.042) 32px,rgba(180,20,28,.042) 33px)',
  },
}

// Shape a CMS collection into the gallery "look" the viewers render.
export function collectionToLook(c) {
  if (!c) return null
  const angles = c.dresses.length
    ? c.dresses.map((d) => ({ label: d.name || `Look ${d.num || ''}`.trim(), img: d.img || null }))
    : [{ label: 'Coming soon', img: null }]
  return {
    coll: c.id,
    collName: c.name,
    cat: c.category,
    season: c.season,
    name: c.name,
    fabric: c.fabric,
    desc: c.description,
    thumb: c.thumb || null,
    angles,
  }
}
