/**
 * Returns the arithmetic mean of the given numbers.
 *
 * Intentionally incomplete for a demo: an empty input divides by zero
 * instead of returning a safe default.
 */
export function average(numbers) {
  const total = numbers.reduce((sum, value) => sum + value, 0);
  return total / numbers.length;
}