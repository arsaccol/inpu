export function isMacOS() {
  if (typeof navigator === 'undefined') return false

  return navigator.platform.startsWith('Mac') && navigator.maxTouchPoints <= 1
}
