# Roamly product plan

## User and outcome

A traveler needs to create trips, plan activities for each day, and understand timing and cost before leaving. Roamly is a local-first demonstration; it does not provide collaborative editing, bookings, or live route estimates.

## Screens and workflows

- Trips: create, edit, delete, and select trips with destination, date range, traveler count, and budget.
- Trip overview: aggregate activity costs, flag budget overruns and schedule conflicts, and navigate to each day.
- Itinerary: add and edit activities with date, time, duration, cost, notes, and location. Remove with confirmation and reorder with keyboard-accessible controls.
- Saved places: search, filter, save, and add a place to an itinerary.
- Route: show the ordered locations for the selected day. If geographic coordinates are unavailable, use a clearly labeled illustrative route rather than implying actual navigation.
- Data: export a versioned JSON backup and validate imports before replacing local data.

## Model and behavior

Trips own activities and saved places. Date inputs must remain within the trip range. Overlap detection compares actual start and end times on the same date, including activities crossing midnight. Clearly specify whether costs are per person or per group and derive totals consistently. Reordering affects the displayed route order but does not silently change scheduled times.

Use a versioned local storage document with validation and explicit recovery for corrupt data. Browser storage is device-local, can be cleared, and is not a synchronization service. Tests should cover date boundaries, overlaps, budget calculations, validation, and import/export; browser tests should cover trip and activity management.
