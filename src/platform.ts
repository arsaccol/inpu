// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
export function isMacOS() {
  if (typeof navigator === 'undefined') return false

  return navigator.platform.startsWith('Mac') && navigator.maxTouchPoints <= 1
}
