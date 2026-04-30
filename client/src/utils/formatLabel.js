export default function formatLabel(value) {
  if (!value) return '';

  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
//It converts messy text into clean, properly capitalized words.
//  For example, "john DOE" becomes "John Doe". It handles multiple words and ensures that each word
//  is capitalized correctly while removing extra spaces.