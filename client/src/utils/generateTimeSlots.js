export default function generateTimeSlots(startHour = 9, endHour = 17) {
  const slots = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    ['00', '30'].forEach((minute) => {
      const normalizedHour = hour % 12 || 12;
      const meridian = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${String(normalizedHour).padStart(2, '0')}:${minute} ${meridian}`);
    });
  }

  return slots;
}
/*

it generates time slots in 30-minute intervals between the specified start and end hours. 
The default range is from 9 AM to 5 PM. Each time slot is formatted as "HH:MM AM/PM".
[
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  ...
  "05:00 PM",
  "05:30 PM"
]
*/