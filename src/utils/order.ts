export function generateOrderReference(
  now: Date = new Date(),
  random: () => number = Math.random,
): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(random() * 9000) + 1000);
  return `BK-${year}${month}${day}-${suffix}`;
}