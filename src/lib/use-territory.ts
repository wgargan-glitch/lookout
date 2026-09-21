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
  const setTerritory = useTerritory((s) => s.setTerritory);
  useEffect(() => {
    const apply = () => {
      if (!useTerritory.getState().chosen) setTerritory(detectTerritory());
    };
    if (useTerritory.persist.hasHydrated()) apply();
    return useTerritory.persist.onFinishHydration(apply);
  }, [setTerritory]);
}
