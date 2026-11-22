import { describe, expect, it } from 'vitest'
import process from 'node:process'
import { assessJourney, previewShorten } from './scheduling'
import type { ScheduledStop } from './scheduling'

const lunch: ScheduledStop = { id: 'lunch', date: '2027-03-14', time: '12:00', duration: 60, fixed: false }
const booking: ScheduledStop = { id: 'booking', date: '2027-03-14', time: '13:20', duration: 60, fixed: true }
const route = { minutes: 35, source: 'demo' as const }
describe('destination-time journey assessment', () => {
  it('shows the Kyoto shortfall and previews an exact on-time fix without mutation', () => {
    expect(assessJourney(lunch, booking, route, 'Asia/Tokyo')).toMatchObject({ departure: '13:00', arrival: '13:35', lateMinutes: 15 })
    const result = previewShorten(lunch, booking, route, 'Asia/Tokyo', 15)
    expect(result.journey).toMatchObject({ departure: '12:45', arrival: '13:20', lateMinutes: 0 })
    expect(lunch.duration).toBe(60)
    expect(booking.time).toBe('13:20')
  })
  it('handles overnight, one minute late, and unknown estimates', () => {
    expect(assessJourney({ ...lunch, time: '23:30', duration: 30 }, { ...booking, date: '2027-03-15', time: '00:34' }, route, 'Asia/Tokyo')).toMatchObject({ departure: '00:00', arrival: '00:35', lateMinutes: 1 })
    expect(assessJourney(lunch, booking, { minutes: null, source: 'unknown' }, 'Asia/Tokyo')).toMatchObject({ arrival: null, lateMinutes: null, source: 'unknown' })
  })
  it('is independent of the device time zone and refuses edits to fixed stops', () => {
    const prior = process.env.TZ
    process.env.TZ = 'America/Los_Angeles'
    const west = assessJourney(lunch, booking, route, 'Asia/Tokyo')
    process.env.TZ = 'Europe/London'
    expect(assessJourney(lunch, booking, route, 'Asia/Tokyo')).toEqual(west)
    process.env.TZ = prior
    expect(() => previewShorten(booking, lunch, route, 'Asia/Tokyo', 15)).toThrow('fixed')
  })
  it('adds elapsed minutes across a daylight-saving transition in the destination zone', () => {
    const before = { ...lunch, date: '2027-03-14', time: '01:30', duration: 30 }
    const after = { ...booking, date: '2027-03-14', time: '03:35' }
    expect(assessJourney(before, after, route, 'America/New_York')).toMatchObject({ departure: '03:00', arrival: '03:35', lateMinutes: 0 })
  })
})
