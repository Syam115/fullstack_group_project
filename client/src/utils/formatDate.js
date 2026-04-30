export default function formatDate(date) {
  if (!date) return 'TBD';

  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
//It formats a date string into a more readable format. If the input date is null or undefined, it returns "TBD".
// For example, "2024-06-15" would be formatted as "15 Jun 2024". It uses the 'en-IN' locale to ensure the date 
// is displayed in a consistent format.