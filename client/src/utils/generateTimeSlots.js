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
