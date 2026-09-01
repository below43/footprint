export function normalize(value: string): string {
  return value.trim().replace(/\\/g, "/").toLowerCase();
}
