import React, { createContext, useState, useContext, useCallback } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { useQuery } from "@tanstack/react-query";
import { fetchParcels } from "../api/parcels";

interface ParcelProperties {
  id: string;
  zoning_typ: string;
  [key: string]: any; // REVIEW: Add other properties as needed
}

interface ParcelsContextType {
  data: FeatureCollection<Geometry, ParcelProperties> | null;
  selectedParcels: string[];
  toggleParcel: (id: string) => void;
  hoveredParcel: string | null;
  setHoveredParcel: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const ParcelsContext = createContext<ParcelsContextType | undefined>(undefined);

export const useParcels = () => {
  const context = useContext(ParcelsContext);
  if (!context) {
    throw new Error("useParcels must be used within a ParcelsProvider");
  }
  return context;
};

export const ParcelsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedParcels, setSelectedParcels] = useState<string[]>([]);
  const [hoveredParcel, setHoveredParcel] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<
    FeatureCollection<Geometry, ParcelProperties>
  >({
    queryKey: ["parcels"],
    queryFn: fetchParcels,
  });

  // Memoize the toggleParcel function
  const toggleParcel = useCallback((id: string) => {
    setSelectedParcels((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((parcelId) => parcelId !== id)
        : [...prevSelected, id]
    );
  }, []);

  return (
    <ParcelsContext.Provider
      value={{
        // REVIEW: consider to use  useMemo for data
        // to avoid unnecessary re-renders
        data: data ?? null,
        selectedParcels,
        toggleParcel,
        hoveredParcel,
        setHoveredParcel,
        isLoading,
        error: error ? (error as Error).message : null,
      }}
    >
      {children}
    </ParcelsContext.Provider>
  );
};
