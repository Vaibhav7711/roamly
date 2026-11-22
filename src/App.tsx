import { useMemo, useState } from 'react'
import {
  ArrowLeft, CalendarDays, Check, ChevronDown, CircleAlert, Clock3, Compass,
  GripVertical, Heart, Leaf, Map, MapPin, Menu, MessageCircle, MoreHorizontal,
  Plus, Search, Share2, SlidersHorizontal, Sparkles, Star, TrainFront, Users, WalletCards, X,
} from 'lucide-react'
import { initialItinerary, places } from './data'
import type { Category, DayKey, Itinerary, Place, ScheduledItem, TimeSlot } from './types'
import { formatYen, hasConflict, totalCost, tripProgress } from './utils'

const days: { key: DayKey; weekday: string; date: string; theme: string }[] = [
  { key: 'day1', weekday: 'Friday', date: '14 Mar', theme: 'Temples & tastes' },
  { key: 'day2', weekday: 'Saturday', date: '15 Mar', theme: 'Bamboo & old Kyoto' },
  { key: 'day3', weekday: 'Sunday', date: '16 Mar', theme: 'Slow city morning' },
]
const slots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening']
const categoryIcon: Record<Category, string> = { Culture: '文', Food: '味', Nature: '葉', Shopping: '店' }

function App() {
  const [itinerary, setItinerary] = useState<Itinerary>(() => {
    const saved = localStorage.getItem('roamly-itinerary')
    return saved ? JSON.parse(saved) : initialItinerary
  })
  const [activeDay, setActiveDay] = useState<DayKey>('day1')
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>(['fushimi', 'arashiyama'])
  const [dragged, setDragged] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [mobilePanel, setMobilePanel] = useState<'discover' | 'map' | null>(null)
  const [travellers, setTravellers] = useState(2)

  const allItems = useMemo(() => Object.values(itinerary).flat(), [itinerary])
  const currentItems = itinerary[activeDay]
  const filteredPlaces = places.filter((place) => {
    const matchesCategory = category === 'All' || place.category === category
    const matchesQuery = `${place.name} ${place.area}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })
  const activeMeta = days.find((day) => day.key === activeDay)!

  const persist = (next: Itinerary) => {
    setItinerary(next)
    localStorage.setItem('roamly-itinerary', JSON.stringify(next))
  }

  const addPlace = (place: Place, slot: TimeSlot = 'Afternoon') => {
    if (currentItems.some((item) => item.id === place.id)) {
      setToast(`${place.name} is already on this day`)
    } else {
      const start = slot === 'Morning' ? '09:00' : slot === 'Afternoon' ? '14:00' : '18:30'
      persist({ ...itinerary, [activeDay]: [...currentItems, { ...place, slot, start }] })
      setToast(`${place.name} added to ${activeMeta.weekday}`)
    }
    window.setTimeout(() => setToast(''), 2500)
  }

  const moveItem = (id: string, slot: TimeSlot) => {
    persist({ ...itinerary, [activeDay]: currentItems.map((item) => item.id === id ? { ...item, slot } : item) })
    setDragged(null)
  }

  const removeItem = (id: string) => persist({ ...itinerary, [activeDay]: currentItems.filter((item) => item.id !== id) })
  const toggleFavorite = (id: string) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])

  return (
    <div className="roamly-app">
      <header className="app-header">
        <div className="wordmark"><span><Compass size={21} /></span><b>roamly</b></div>
        <div className="trip-switcher"><span className="trip-cover">京</span><div><small>MY TRIP</small><b>Kyoto in bloom</b></div><ChevronDown size={16} /></div>
        <nav><button className="active">Plan</button><button>Explore</button><button>Notes</button></nav>
        <div className="header-actions"><button className="mobile-icon" onClick={() => setMobilePanel('discover')} aria-label="Explore places"><Search size={18} /></button><div className="collaborators"><span>MJ</span><span>AK</span><span>+1</span></div><button><MessageCircle size={17} /><span>Comments</span><i>3</i></button><button className="share"><Share2 size={17} />Share</button><button className="menu"><Menu size={20} /></button></div>
      </header>

      <section className="trip-hero">
        <div><button className="back"><ArrowLeft size={15} />All trips</button><p className="kicker">JAPAN · 3 DAYS</p><h1>Kyoto in bloom</h1><p className="subtitle">A thoughtful weekend of quiet temples, tiny kitchens, and long walks.</p></div>
        <div className="trip-facts"><div><CalendarDays size={17} /><span><small>DATES</small><b>14–16 Mar 2027</b></span></div><div><Users size={17} /><span><small>TRAVELLERS</small><b>{travellers} people</b></span><button onClick={() => setTravellers((value) => value === 4 ? 1 : value + 1)}><Plus size={13} /></button></div><div><WalletCards size={17} /><span><small>ACTIVITY BUDGET</small><b>{formatYen(totalCost(allItems, travellers))}</b></span></div></div>
      </section>

      <main className="planner-shell">
        <aside className={`discover-panel ${mobilePanel === 'discover' ? 'mobile-open' : ''}`}>
          <div className="mobile-panel-head"><b>Discover Kyoto</b><button onClick={() => setMobilePanel(null)}><X /></button></div>
          <div className="discover-title"><div><p className="section-label">DISCOVER</p><h2>Find a new favorite</h2></div><button><SlidersHorizontal size={16} /></button></div>
          <label className="place-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Kyoto" /></label>
          <div className="category-pills">{(['All', 'Culture', 'Food', 'Nature', 'Shopping'] as const).map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
          <div className="place-list">
            {filteredPlaces.map((place) => <article className="place-card" key={place.id} draggable onDragStart={() => setDragged(place.id)}>
              <div className="place-art" style={{ '--place-color': place.color } as React.CSSProperties}><span>{categoryIcon[place.category]}</span><small>{place.category}</small><button onClick={() => toggleFavorite(place.id)} aria-label={`Favorite ${place.name}`}><Heart size={16} fill={favorites.includes(place.id) ? 'currentColor' : 'none'} /></button></div>
              <div className="place-copy"><div><h3>{place.name}</h3><span><Star size={11} fill="currentColor" />{place.rating}</span></div><p><MapPin size={11} />{place.area}</p><footer><span><Clock3 size={12} />{Math.round(place.duration / 60 * 10) / 10} hr</span><span>{place.cost ? formatYen(place.cost) : 'Free'}</span><button onClick={() => addPlace(place)} aria-label={`Add ${place.name}`}><Plus size={15} /></button></footer></div>
            </article>)}
          </div>
        </aside>

        <section className="itinerary-panel">
          <div className="day-tabs">{days.map((day, index) => <button key={day.key} onClick={() => setActiveDay(day.key)} className={activeDay === day.key ? 'active' : ''}><span>DAY {index + 1}</span><b>{day.weekday}</b><small>{day.date}</small></button>)}</div>
          <div className="day-heading"><div><p className="section-label">{activeMeta.date.toUpperCase()} · KYOTO</p><h2>{activeMeta.theme}</h2></div><div><button className="map-mobile" onClick={() => setMobilePanel('map')}><Map size={16} />Map</button><button><Sparkles size={16} />Smart fill</button><button aria-label="More options"><MoreHorizontal size={19} /></button></div></div>

          <div className="progress-note"><div className="progress-icon"><Leaf size={17} /></div><div><b>Your day is {tripProgress(currentItems, 4)}% planned</b><span>{currentItems.length < 4 ? 'There is room for one more slow moment.' : 'A full day — remember to leave space to wander.'}</span></div><div className="progress-track"><span style={{ width: `${tripProgress(currentItems, 4)}%` }} /></div></div>

          <div className="timeline">
            {slots.map((slot) => {
              const slotItems = currentItems.filter((item) => item.slot === slot)
              const conflict = hasConflict(currentItems, slot)
              return <section className={`time-block ${dragged ? 'drag-active' : ''}`} key={slot} onDragOver={(event) => event.preventDefault()} onDrop={() => {
                if (!dragged) return
                const existing = currentItems.find((item) => item.id === dragged)
                existing ? moveItem(dragged, slot) : addPlace(places.find((place) => place.id === dragged)!, slot)
                setDragged(null)
              }}>
                <div className="slot-label"><span>{slot}</span><small>{slot === 'Morning' ? '07:00–12:00' : slot === 'Afternoon' ? '12:00–17:30' : '17:30–22:00'}</small>{conflict && <em><CircleAlert size={12} />Too full</em>}</div>
                <div className="slot-items">
                  {slotItems.map((item) => <ItineraryCard key={item.id} item={item} onDrag={() => setDragged(item.id)} onRemove={() => removeItem(item.id)} />)}
                  <button className="add-stop" onClick={() => setMobilePanel('discover')}><Plus size={15} />Add a stop</button>
                </div>
              </section>
            })}
          </div>
        </section>

        <aside className={`map-panel ${mobilePanel === 'map' ? 'mobile-open' : ''}`}>
          <div className="mobile-panel-head"><b>Route map</b><button onClick={() => setMobilePanel(null)}><X /></button></div>
          <div className="map-toolbar"><div><button className="active">Map</button><button>List</button></div><button><SlidersHorizontal size={15} /></button></div>
          <RouteMap items={currentItems} />
          <div className="route-summary"><div className="route-heading"><div><span><TrainFront size={16} /></span><div><small>ESTIMATED TRAVEL</small><b>48 min · 3 transfers</b></div></div><button><ChevronDown size={15} /></button></div><div className="route-steps"><span><i className="walk" />Walk <b>18 min</b></span><span><i className="train" />Train <b>24 min</b></span><span><i className="wait" />Buffer <b>6 min</b></span></div></div>
          <div className="budget-card"><div><span><WalletCards size={17} /></span><div><small>DAY BUDGET</small><b>{formatYen(totalCost(currentItems, travellers))}</b></div><em>{Math.round((totalCost(currentItems, travellers) / Math.max(totalCost(allItems, travellers), 1)) * 100)}%</em></div><div className="budget-track"><span style={{ width: `${Math.min(100, totalCost(currentItems, travellers) / 120)}%` }} /></div><p>Activities for {travellers} travellers · transport not included</p></div>
          <button className="ready-button"><Check size={17} />Mark day as ready</button>
        </aside>
      </main>
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
      {mobilePanel && <button className="panel-scrim" onClick={() => setMobilePanel(null)} aria-label="Close panel" />}
    </div>
  )
}

function ItineraryCard({ item, onDrag, onRemove }: { item: ScheduledItem; onDrag: () => void; onRemove: () => void }) {
  return <article className="itinerary-card" draggable onDragStart={onDrag}>
    <button className="grip" aria-label="Drag item"><GripVertical size={17} /></button>
    <div className="time"><b>{item.start}</b><span>{item.duration} min</span></div>
    <div className="activity-mark" style={{ background: item.color }}><span>{categoryIcon[item.category]}</span></div>
    <div className="activity-copy"><div><h3>{item.name}</h3><span className="rating"><Star size={10} fill="currentColor" />{item.rating}</span></div><p><MapPin size={11} />{item.area}</p><small>{item.note}</small></div>
    <button className="remove" onClick={onRemove} aria-label={`Remove ${item.name}`}><X size={14} /></button>
  </article>
}

function RouteMap({ items }: { items: ScheduledItem[] }) {
  const points = items.map((item) => item.coordinates.join(',')).join(' ')
  return <div className="map-canvas">
    <svg viewBox="0 0 100 100" role="img" aria-label="Map of planned stops in Kyoto">
      <defs><pattern id="street" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><path d="M 0 0 L 0 14" stroke="#d5d0c5" strokeWidth=".5" /></pattern></defs>
      <rect width="100" height="100" fill="#e9e6de" /><rect width="100" height="100" fill="url(#street)" />
      <path d="M0 62 C20 55,28 70,48 58 S78 40,100 47" fill="none" stroke="#b7d5d3" strokeWidth="5" opacity=".8" />
      <path d="M15 0 L32 100 M58 0 L48 100 M82 0 L70 100 M0 28 L100 35 M0 78 L100 70" stroke="#d0cbc0" strokeWidth="1.2" fill="none" />
      <polyline points={points} fill="none" stroke="#e9634b" strokeWidth="1.8" strokeDasharray="3 2" strokeLinecap="round" strokeLinejoin="round" />
      {items.map((item, index) => <g key={item.id} transform={`translate(${item.coordinates[0]} ${item.coordinates[1]})`}><circle r="4.5" fill="#fffaf1" stroke={item.color} strokeWidth="1.4" /><text x="0" y="1.6" textAnchor="middle" fontSize="4.6" fontWeight="700" fill="#253d35">{index + 1}</text></g>)}
    </svg>
    <div className="map-legend"><span><i />Your route</span><span>{items.length} stops</span></div>
    <div className="map-zoom"><button>+</button><button>−</button></div>
  </div>
}

export default App
