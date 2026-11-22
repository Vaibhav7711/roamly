import type { ScheduledItem, TimeSlot } from './types'

export function totalCost(items: ScheduledItem[], travellers = 1): number {
  return items.reduce((sum, item) => sum + item.cost, 0) * travellers
}

export function formatYen(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value)
}

export function slotLoad(items: ScheduledItem[], slot: TimeSlot): number {
  return items.filter((item) => item.slot === slot).reduce((sum, item) => sum + item.duration, 0)
}

export function hasConflict(items: ScheduledItem[], slot: TimeSlot): boolean {
  return slotLoad(items, slot) > 210
}

export function tripProgress(items: ScheduledItem[], targetItems = 9): number {
  return Math.min(100, Math.round((items.length / targetItems) * 100))
}
