import de from './de'
import en from './en'

export const messages = { de, en }
export type Locale = keyof typeof messages
export type MessageKey = keyof typeof de
export const defaultLocale: Locale = 'de'
export const localeNames: Record<Locale, string> = { de: 'Deutsch', en: 'English' }
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && Object.hasOwn(messages, value)
}
