import { useSyncExternalStore } from 'react'
import photo1 from '../assets/images/photo_1.jpg'
import photo2 from '../assets/images/photo_2.jpg'
import photo3 from '../assets/images/photo_3.jpg'
import photo4 from '../assets/images/photo_4.jpg'
import blue1 from '../assets/images/blue-1.png'
import blue2 from '../assets/images/blue-2.png'
import blue3 from '../assets/images/blue-3.png'
import purple1 from '../assets/images/purple-1.png'
import purple2 from '../assets/images/purple-2.png'
import yellow1 from '../assets/images/yellow-1.png'
import yellow2 from '../assets/images/yellow-2.png'
import yellow3 from '../assets/images/yellow-3.png'
import yellow4 from '../assets/images/yellow-4.png'
import aboutMe from '../assets/images/aboutMe.png'
import fashionDesigner from '../assets/images/fashion-designer.png'

export const CMS_KEY = 'kate_cms_v2'
export const GOLD = '#d4af37'

export function defaults() {
  return {
    hero: {
      models: [photo2, photo1, photo3],
      portrait: fashionDesigner,
      taglineLine1: 'Fashion is not about',
      taglineLine2: 'clothing. It is about',
      emphasis: 'identity',
    },
    about: {
      name: 'Khin Kyi',
      knownAs: 'known as Kate',
      credit: 'About the Designer',
      image: aboutMe,
      caption: 'Khin Kyi, 2024',
      bio: [
        'Khin Kyi is a Yangon-born fashion designer whose work navigates the tension between heritage and modernity. Trained at the Institut Français de la Mode in Paris, she returned to Southeast Asia with a singular vision — to build a couture language that speaks fluently to both worlds.',
        'Her collections are studies in contradiction — fluid and structured, dark and radiant, rooted and restless. Each piece begins as an obsession with a single material: the way raw silk catches midnight light, the weight of hand-stitched beading against bare skin.',
        'Based between Yangon and Milan, Kate collaborates with independent artisans across Southeast Asia — ensuring every garment carries the marks of the hands that made it.',
      ],
    },
    collections: [
      {
        id: 'midnight-reverie',
        category: 'Evening',
        name: 'Midnight Reverie',
        fabric: 'Duchess satin · silk organza',
        description:
          'An after-dark study in shadow and structure — floor-sweeping silhouettes built to precede the wearer into the room.',
        season: 'SS 2024',
        count: '14 Looks',
        latest: false,
        thumb: photo1,
        dresses: [
          {
            id: 'd1',
            num: '001',
            name: 'Noir Descent',
            img: photo1,
          },
          {
            id: 'd2',
            num: '002',
            name: 'Spectral Veil',
            img: purple1,
          },
          {
            id: 'd3',
            num: '003',
            name: 'After Midnight',
            img: photo2,
          },
        ],
      },
      {
        id: 'golden-hour',
        category: 'Day',
        name: 'Golden Hour',
        fabric: 'Silk charmeuse · linen',
        description:
          'Daywear that moves like water — bias cuts and hand-pleated panels that catch the light with every step.',
        season: 'SS 2024',
        count: '10 Looks',
        latest: false,
        thumb: blue1,
        dresses: [
          { id: 'd4', num: '004', name: 'First Light', img: blue2 },
          { id: 'd5', num: '005', name: 'Solar Fold', img: blue3 },
        ],
      },
      {
        id: 'phantom-silk',
        category: 'Silk',
        name: 'Phantom Silk',
        fabric: 'Bias-cut charmeuse · silk twill',
        description:
          'A meditation on structural invisibility, where barely-there construction lets the body become the architecture.',
        season: 'FW 2023',
        count: '12 Looks',
        latest: false,
        thumb: photo3,
        dresses: [
          { id: 'd6', num: '006', name: 'White Noise', img: photo3 },
          { id: 'd7', num: '007', name: 'Shadow Move', img: purple2 },
        ],
      },
      {
        id: 'obsidian-cut',
        category: 'Tailoring',
        name: 'Obsidian Cut',
        fabric: 'Double-faced wool · burnout velvet',
        description: 'Tailoring as armour — power shoulders and knife pleats structured to the millimetre.',
        season: 'AW 2023',
        count: '9 Looks',
        latest: false,
        thumb: purple1,
        dresses: [
          { id: 'd8', num: '008', name: 'Hard Edge', img: purple2 },
          { id: 'd9', num: '009', name: 'Velvet Theory', img: yellow1 },
        ],
      },
      {
        id: 'ivory-dust',
        category: 'Bridal',
        name: 'Ivory & Dust',
        fabric: 'Seed pearls · vintage lace',
        description:
          'Bridal built by hand over months: twelve thousand seed pearls and salvaged Belgian lace that decides its own pattern.',
        season: 'SS 2023',
        count: '8 Looks',
        latest: false,
        thumb: yellow2,
        dresses: [
          { id: 'd10', num: '010', name: 'The Vow', img: yellow3 },
          { id: 'd11', num: '011', name: 'Dust Waltz', img: yellow4 },
        ],
      },
      {
        id: 'crimson-theory',
        category: 'Couture',
        name: 'Crimson Theory',
        fabric: 'Duchess gazar · structured organza',
        description:
          'Statement couture interrogating the politics of red — silhouettes that expand, collapse and trail behind the body.',
        season: 'SS 2025',
        count: 'Statement pieces',
        latest: true,
        thumb: blue1,
        dresses: [
          { id: 'd12', num: '012', name: 'Red Study', img: blue2 },
          { id: 'd13', num: '013', name: 'The Manifesto', img: blue3 },
        ],
      },
    ],
    contact: {
      email: 'kate@khinkyi.com',
      phone: '+95 9 123 456 789',
      role: 'Haute Couture Designer',
      linkedin: 'https://linkedin.com/in/khinkyi',
      instagram: 'https://instagram.com/khinkyi',
      locations: ['Yangon', 'Milan', 'Paris'],
      footerTagline: 'Ready to begin something extraordinary?',
    },
  }
}

function migrate(db) {
  const base = defaults()
  db.hero = { ...base.hero, ...db.hero }
  db.about = { ...base.about, ...db.about }
  db.contact = { ...base.contact, ...db.contact }
  if (!Array.isArray(db.collections)) db.collections = base.collections
  db.collections.forEach((c) => {
    if (!Array.isArray(c.dresses)) c.dresses = []
    if (c.fabric === undefined) c.fabric = (c.dresses[0] && c.dresses[0].fabric) || ''
    if (c.description === undefined) c.description = (c.dresses[0] && c.dresses[0].desc) || ''
  })
  return db
}

function load() {
  try {
    const raw = localStorage.getItem(CMS_KEY)
    return raw ? migrate(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

let db = load() || defaults()
let version = 0
let saveState = 'saved' // 'saved' | 'saving'
let saveTimer = null
const listeners = new Set()

function notify() {
  version++
  listeners.forEach((fn) => fn())
}

function persist() {
  try {
    localStorage.setItem(CMS_KEY, JSON.stringify(db))
  } catch {
    // quota exceeded — keep editing in memory
  }
}

export function getDb() {
  return db
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Call after mutating the db: re-renders subscribers now, persists shortly after. */
export function save() {
  saveState = 'saving'
  notify()
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    persist()
    saveState = 'saved'
    notify()
  }, 260)
}

export function reset() {
  db = defaults()
  persist()
  notify()
}

export function getSaveState() {
  return saveState
}

export function storageKb() {
  try {
    return Math.round((localStorage.getItem(CMS_KEY) || '').length / 1024)
  } catch {
    return 0
  }
}

// pick up edits made in another tab (e.g. dashboard open next to the live site)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== CMS_KEY) return
    const next = load()
    if (next) {
      db = next
      notify()
    }
  })
}

/** Subscribe a component to the CMS. Returns the (mutable) db; re-renders on every save(). */
export function useCms() {
  useSyncExternalStore(subscribe, () => version)
  return db
}

export function useSaveState() {
  return useSyncExternalStore(subscribe, () => saveState)
}
