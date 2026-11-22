import { Temporal } from '@js-temporal/polyfill'

/** Local wall-clock time and an IANA zone belong to the destination, never the device. */
export interface ScheduledStop { id: string; date: string; time: string; duration: number; fixed: boolean }
export interface RouteEstimate { minutes: number | null; source: 'manual' | 'demo' | 'unknown' }
export interface JourneyAssessment { departure: string; arrival: string | null; booking: string; lateMinutes: number | null; source: RouteEstimate['source'] }

function instant(stop: ScheduledStop, timeZone: string): Temporal.ZonedDateTime {
  return Temporal.PlainDateTime.from(`${stop.date}T${stop.time}`).toZonedDateTime(timeZone)
}

function clock(time: Temporal.ZonedDateTime): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
}

export function assessJourney(from: ScheduledStop, to: ScheduledStop, route: RouteEstimate, timeZone: string): JourneyAssessment {
  if (!Number.isInteger(from.duration) || from.duration < 0 || (route.minutes !== null && (!Number.isInteger(route.minutes) || route.minutes < 0))) throw new RangeError('Durations must be non-negative whole minutes')
  const departure = instant(from, timeZone).add({ minutes: from.duration })
  const booking = instant(to, timeZone)
  if (route.minutes === null) return { departure: clock(departure), arrival: null, booking: clock(booking), lateMinutes: null, source: 'unknown' }
  const arrival = departure.add({ minutes: route.minutes })
  const minutes = Math.max(0, Math.ceil((arrival.epochMilliseconds - booking.epochMilliseconds) / 60000))
  return { departure: clock(departure), arrival: clock(arrival), booking: clock(booking), lateMinutes: minutes, source: route.source }
}

export function previewShorten(from: ScheduledStop, to: ScheduledStop, route: RouteEstimate, timeZone: string, minutes: number) {
  if (from.fixed) throw new Error('A fixed activity cannot be shortened')
  if (!Number.isInteger(minutes) || minutes <= 0 || minutes >= from.duration) throw new RangeError('Shortening must leave a positive duration')
  const proposed = { ...from, duration: from.duration - minutes }
  return { proposed, journey: assessJourney(proposed, to, route, timeZone) }
}
