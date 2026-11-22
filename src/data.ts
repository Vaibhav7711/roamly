import type { Itinerary, Place } from './types'

export const places: Place[] = [
  { id: 'fushimi', name: 'Fushimi Inari', area: 'Fushimi Ward', category: 'Culture', duration: 120, cost: 0, rating: 4.8, note: 'Walk the quiet upper torii trail', color: '#e9634b', coordinates: [72, 73] },
  { id: 'nishiki', name: 'Nishiki Market', area: 'Downtown Kyoto', category: 'Food', duration: 90, cost: 1800, rating: 4.6, note: 'Small plates and seasonal sweets', color: '#d98e39', coordinates: [47, 44] },
  { id: 'arashiyama', name: 'Arashiyama Grove', area: 'Ukyo Ward', category: 'Nature', duration: 150, cost: 500, rating: 4.7, note: 'Arrive before the first tour groups', color: '#557a64', coordinates: [18, 35] },
  { id: 'kiyomizu', name: 'Kiyomizu-dera', area: 'Higashiyama', category: 'Culture', duration: 110, cost: 500, rating: 4.7, note: 'Golden-hour temple terrace', color: '#8d6f9c', coordinates: [68, 48] },
  { id: 'gion', name: 'Gion Lantern Walk', area: 'Gion', category: 'Culture', duration: 75, cost: 0, rating: 4.5, note: 'Historic lanes after dusk', color: '#314d45', coordinates: [59, 49] },
  { id: 'kichi', name: 'Kichi Kichi Omurice', area: 'Pontocho', category: 'Food', duration: 80, cost: 3200, rating: 4.5, note: 'Reserve the counter in advance', color: '#dd7452', coordinates: [53, 43] },
  { id: 'philosopher', name: "Philosopher's Path", area: 'Sakyo Ward', category: 'Nature', duration: 100, cost: 0, rating: 4.6, note: 'Canal-side morning stroll', color: '#6f8f78', coordinates: [67, 26] },
  { id: 'teramachi', name: 'Teramachi Arcade', area: 'Nakagyo Ward', category: 'Shopping', duration: 90, cost: 2500, rating: 4.3, note: 'Craft stores and vintage finds', color: '#bf6c91', coordinates: [47, 40] },
]

export const initialItinerary: Itinerary = {
  day1: [
    { ...places[0], slot: 'Morning', start: '08:00' },
    { ...places[1], slot: 'Afternoon', start: '12:30' },
    { ...places[4], slot: 'Evening', start: '18:30' },
  ],
  day2: [
    { ...places[2], slot: 'Morning', start: '07:30' },
    { ...places[3], slot: 'Afternoon', start: '15:00' },
    { ...places[5], slot: 'Evening', start: '19:00' },
  ],
  day3: [
    { ...places[6], slot: 'Morning', start: '09:00' },
    { ...places[7], slot: 'Afternoon', start: '13:00' },
  ],
}
