import t from '@/lib/i18n';
import { useLanguageStore } from '@/store/language.store';

export function useT() {
  const locale = useLanguageStore((s) => s.locale);
  return t[locale];
}
