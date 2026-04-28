export default function formatDate(date) {
  if (!date) return 'TBD';

  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
