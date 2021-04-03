type Options = {
  ellipsis?: string
  maxLength?: number
}

export default function truncate(
  text: string,
  { maxLength = 180, ellipsis = '...' }: Options = {}
): string {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}
