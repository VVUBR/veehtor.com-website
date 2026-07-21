import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import MapDialog, { type MapDialogHandle } from "@/components/home/MapDialog";

interface MapDialogContextValue {
  open: (source: string, opener: HTMLElement | null) => void;
}

const MapDialogContext = createContext<MapDialogContextValue | null>(null);

/**
 * Mounts a single MapDialog for the whole app and exposes `open()` via context.
 * Any page's "Mapear meu processo" CTA can call `useMapDialog().open(source, opener)`.
 */
export function MapDialogProvider({ children }: { children: ReactNode }) {
  const ref = useRef<MapDialogHandle>(null);
  const open = useCallback((source: string, opener: HTMLElement | null) => {
    ref.current?.open(source, opener);
  }, []);
  return (
    <MapDialogContext.Provider value={{ open }}>
      {children}
      <MapDialog ref={ref} />
    </MapDialogContext.Provider>
  );
}

export function useMapDialog(): MapDialogContextValue {
  const ctx = useContext(MapDialogContext);
  if (!ctx) {
    // Fallback no-op so pages that render outside the provider don't crash.
    return { open: () => {} };
  }
  return ctx;
}
