export function capitalize(text: string): string {
  if (!text) return text
  return text
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

export function getEnglishFlavorText(
  entries: { flavor_text: string; language: { name: string } }[],
): string {
  const entry = entries.find((item) => item.language.name === 'en')
  return entry ? entry.flavor_text.replace(/[\n\f\r]/g, ' ') : ''
}

export function getEnglishGenus(entries: { genus: string; language: { name: string } }[]): string {
  const entry = entries.find((item) => item.language.name === 'en')
  return entry ? entry.genus : ''
}
