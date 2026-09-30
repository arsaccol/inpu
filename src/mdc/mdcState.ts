// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
import { convertMdcToUnicode } from './convertMdcToUnicode'

export interface MdcDraft {
  source: string
  unicode: string
  warnings: string[]
  status: 'empty' | 'valid' | 'invalid'
  error?: string
}

export function updateMdcDraft(previous: MdcDraft, source: string): MdcDraft {
  try {
    const { unicode, warnings } = convertMdcToUnicode(source)
    return { source, unicode, warnings, status: source.trim() ? 'valid' : 'empty' }
  } catch (error) {
    return {
      source,
      unicode: previous.unicode,
      warnings: previous.warnings,
      status: 'invalid',
      error: error instanceof Error ? error.message : 'Could not convert this MdC composition.',
    }
  }
}
