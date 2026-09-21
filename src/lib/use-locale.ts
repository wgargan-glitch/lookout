import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectLocale, intlTag, isLocaleId, type LocaleId } from "@/lib/locale";
import { translate } from "@/lib/i18n";
import { setFormatLocale } from "@/lib/format";

const STORAGE = "lookout-locale";

type LocaleState = {
  id: LocaleId;
  chosen: boolean;
  setLocale: (id: LocaleId) => void;
};

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      id: "en",
      chosen: false,
      setLocale: (id) => set({ id, chosen: true }),
    }),
    {
      name: STORAGE,
      partialize: (s) => ({ id: s.id, chosen: s.chosen }),
      merge: (persisted, current) => {
        const p = persisted as { id?: string; chosen?: boolean } | undefined;
        const id = p?.id && isLocaleId(p.id) ? p.id : current.id;
        return { ...current, id, chosen: Boolean(p?.chosen) };
      },
    },
  ),
);

/** First visit: Spanish if the timezone is a Spanish-speaking country. After that the switcher wins. */
export function useDetectLocale() {
  const id = useLocale((s) => s.id);
  const setLocale = useLocale((s) => s.setLocale);
  useEffect(() => {
    const apply = () => {
      if (!useLocale.getState().chosen) setLocale(detectLocale());
    };
    if (useLocale.persist.hasHydrated()) apply();
    return useLocale.persist.onFinishHydration(apply);
  }, [setLocale]);
  useEffect(() => {
    setFormatLocale(intlTag(id));
    if (typeof document !== "undefined") document.documentElement.lang = id === "es" ? "es" : "en";
  }, [id]);
}

export function useT() {
  const id = useLocale((s) => s.id);
  return (key: string, vars?: Record<string, string | number>) => translate(id, key, vars);
}
