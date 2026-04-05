export interface Booking {
  id: string;
  sport: string;
  date: string;
  startTime: number; // in minutes from midnight
  duration: number; // in hours
  endTime: number;
  totalPrice: number;
  customerName: string;
  status: "confirmed" | "cancelled";
}

export const SPORTS = [
  { id: "football", name: "Football", icon: "football" },
  { id: "cricket", name: "Cricket", icon: "cricket" },
  { id: "badminton", name: "Badminton", icon: "badminton" },
  { id: "basketball", name: "Basketball", icon: "basketball" },
];

export const DURATIONS = [1, 1.5, 2, 2.5, 3, 3.5];

export const OPERATING_HOURS = { start: 6, end: 24 }; // 6 AM to 12 AM

export const PEAK_HOURS = { start: 17, end: 21 }; // 5 PM to 9 PM

export const PRICING = {
  regular: 800,
  peak: 1200,
};

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function generateTimeSlots(): number[] {
  const slots: number[] = [];
  for (let m = OPERATING_HOURS.start * 60; m < OPERATING_HOURS.end * 60; m += 30) {
    slots.push(m);
  }
  return slots;
}

export function isPeakTime(minutes: number): boolean {
  const hour = minutes / 60;
  return hour >= PEAK_HOURS.start && hour < PEAK_HOURS.end;
}

export function calculatePrice(startTime: number, durationHours: number): number {
  let total = 0;
  const slots = durationHours * 2; // number of 30-min slots
  for (let i = 0; i < slots; i++) {
    const slotStart = startTime + i * 30;
    const hourlyRate = isPeakTime(slotStart) ? PRICING.peak : PRICING.regular;
    total += hourlyRate / 2; // price per 30-min slot
  }
  return total;
}

export function hasConflict(
  startTime: number,
  durationHours: number,
  date: string,
  existingBookings: Booking[]
): boolean {
  const endTime = startTime + durationHours * 60;
  return existingBookings
    .filter((b) => b.date === date && b.status === "confirmed")
    .some((b) => startTime < b.endTime && endTime > b.startTime);
}

export function isSlotAvailable(
  slotMinutes: number,
  date: string,
  bookings: Booking[]
): boolean {
  return !bookings
    .filter((b) => b.date === date && b.status === "confirmed")
    .some((b) => slotMinutes >= b.startTime && slotMinutes < b.endTime);
}

export function getBookingsFromStorage(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem("turf-bookings") || "[]");
  } catch {
    return [];
  }
}

export function saveBookingsToStorage(bookings: Booking[]): void {
  localStorage.setItem("turf-bookings", JSON.stringify(bookings));
}
