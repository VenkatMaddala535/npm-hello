export function greeting(name = '') {
  const cleaned = name.trim();
  if (cleaned.length > 80) {
    throw new RangeError('Please use a name with 80 characters or fewer.');
  }
  return `Hello, ${cleaned || 'World'}!`;
}
