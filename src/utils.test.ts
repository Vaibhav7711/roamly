import { describe, expect, it } from 'vitest'
import { initialItinerary } from './data'
import { formatYen, hasConflict, slotLoad, totalCost, tripProgress } from './utils'

describe('trip planning utilities', () => {
  it('calculates the group activity budget', () => {
    expect(totalCost(initialItinerary.day1, 2)).toBe(3600)
    expect(formatYen(3600)).toContain('3,600')
  })

  it('detects overloaded time slots', () => {
    const overloaded = [...initialItinerary.day1, { ...initialItinerary.day1[0], id: 'duplicate', duration: 120 }]
    expect(slotLoad(overloaded, 'Morning')).toBe(240)
    expect(hasConflict(overloaded, 'Morning')).toBe(true)
  })

  it('caps planning progress at one hundred percent', () => {
    expect(tripProgress(initialItinerary.day1, 3)).toBe(100)
    expect(tripProgress(initialItinerary.day3, 4)).toBe(50)
  })
})
