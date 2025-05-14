import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getFingerprint() {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  const fingerprint = result.visitorId

  return fingerprint
}
