import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectTerritory, isTerritoryId, type TerritoryId } from "@/lib/territory";

const STORAGE = "lookout-territory";

type TerritoryState = {
  id: TerritoryId;
  chosen: boolean;
  setTerritory: (id: TerritoryId) => void;
};

export const useTerritory = create<TerritoryState>()(
  persist(
    (set) => ({
      id: "us",
      chosen: false,
      setTerritory: (id) => set({ id, chosen: true }),
    }),
    {
      name: STORAGE,
      partialize: (s) => ({ id: s.id, chosen: s.chosen }),
      merge: (persisted, current) => {
        const p = persisted as { id?: string; chosen?: boolean } | undefined;
        const id = p?.id && isTerritoryId(p.id) ? p.id : current.id;
        return { ...current, id, chosen: Boolean(p?.chosen) };
      },
    },
  ),
);

/** First visit: pick from timezone. After that the switcher wins. */
export function useDetectTerritory() {
  const chosen = useTerritory((s) => s.chosen);
  const setTerritory = useTerritory((s) => s.setTerritory);
  useEffect(() => {
    if (chosen) return;
    setTerritory(detectTerritory());
  }, [chosen, setTerritory]);
}
