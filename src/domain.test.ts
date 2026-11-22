import { describe, expect, it } from 'vitest'
import { conflictIds, datesBetween, overlaps, seed, totalCost, validDatabase } from './domain'

describe('trip planning rules', () => {
  it('detects overlaps across midnight but not adjacent activities', () => {
    const a = { ...seed.trips[0].activities[0], date:'2027-03-14', time:'23:30', duration:60 }
    const b = { ...a, id:'other', date:'2027-03-15', time:'00:15' }
    expect(overlaps(a,b)).toBe(true)
    expect(conflictIds([a,b]).size).toBe(2)
    expect(overlaps(a,{ ...b,time:'00:30' })).toBe(false)
  })
  it('calculates group costs, inclusive dates, and validates backups', () => {
    expect(totalCost(seed.trips[0])).toBe(4600)
    expect(datesBetween('2027-03-14','2027-03-16')).toHaveLength(3)
    expect(validDatabase(seed)).toBe(true)
    expect(validDatabase({version:1,trips:[{...seed.trips[0],end:'2020-01-01'}]})).toBe(false)
  })
})
