import { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-09-11', label: '09:00 AM – 11:00 AM', startHour: 9, endHour: 11, active: true },
  { id: 'slot-11-13', label: '11:00 AM – 01:00 PM', startHour: 11, endHour: 13, active: true },
  { id: 'slot-14-16', label: '02:00 PM – 04:00 PM', startHour: 14, endHour: 16, active: true },
  { id: 'slot-16-18', label: '04:00 PM – 06:00 PM', startHour: 16, endHour: 18, active: true },
  { id: 'slot-18-20', label: '06:00 PM – 08:00 PM', startHour: 18, endHour: 20, active: true },
];

export function getAvailableSlots(dateStr: string): TimeSlot[] {
  const selected = new Date(dateStr);
  const now = new Date();
  const isToday = selected.toDateString() === now.toDateString();

  if (!isToday) {
    return TIME_SLOTS.filter(s => s.active);
  }

  // If today, filter out past slots (require at least 1 hour advance booking)
  const currentHour = now.getHours();
  return TIME_SLOTS.filter(s => s.active && s.startHour > currentHour + 1);
}
