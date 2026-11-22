export type DayKey = 'day1' | 'day2' | 'day3'
export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening'
export type Category = 'Culture' | 'Food' | 'Nature' | 'Shopping'

export interface Place {
  id: string
  name: string
  area: string
  category: Category
  duration: number
  cost: number
  rating: number
  note: string
  color: string
  coordinates: [number, number]
}

export interface ScheduledItem extends Place {
  slot: TimeSlot
  start: string
}

export type Itinerary = Record<DayKey, ScheduledItem[]>
