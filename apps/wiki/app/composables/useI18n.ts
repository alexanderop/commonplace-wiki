import { defaultLocale, isLocale, localeNames, messages, type Locale, type MessageKey } from '~/i18n'
import type { NoteKind, ResourceType } from '#shared/wiki'

export function useI18n() {
  const locale = useState<Locale>('locale', () => defaultLocale)
  function t(key: MessageKey, params: Record<string, string | number> = {}) {
    return messages[locale.value][key].replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match))
  }
  function setLocale(value: string) {
    if (!isLocale(value)) return
    locale.value = value
    try { localStorage.setItem('commonplace-locale', value) } catch {}
  }
  function restoreLocale() {
    try {
      const saved = localStorage.getItem('commonplace-locale')
      if (isLocale(saved)) locale.value = saved
    } catch {}
  }
  const kindLabel = (kind: NoteKind) => t(kind)
  const resourceLabel = (type: ResourceType = 'other') => t(`resource_${type}`)
  const formatDate = (date: string) => new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
  return { locale: readonly(locale), localeNames, t, kindLabel, resourceLabel, formatDate, setLocale, restoreLocale }
}
