import React, { createContext, useState, useContext, useCallback } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { useQuery } from "@tanstack/react-query";
import { fetchParcels } from "../api/parcels";
import { ParcelProperties, ParcelsContextType } from "../types/parcelTypes";

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
  const [selectedParcels, setSelectedParcels] = useState<number[]>([]);
  const [hoveredParcel, setHoveredParcel] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useQuery<
    FeatureCollection<Geometry, ParcelProperties>
  >({
    queryKey: ["parcels"],
    queryFn: () =>
      fetchParcels() as unknown as Promise<
        FeatureCollection<Geometry, ParcelProperties>
      >,
  });

  // Memoize the toggleParcel function
  const toggleParcel = useCallback((id: number) => {
    setSelectedParcels((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((parcelId) => parcelId !== id)
        : [...prevSelected, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedParcels([]);
  }, []);

  return (
    <ParcelsContext.Provider
      value={{
        data: data ?? null,
        selectedParcels,
        toggleParcel,
        hoveredParcel,
        setHoveredParcel,
        clearSelection,
        isLoading,
        error: error ? (error as Error).message : null,
        refetch,
      }}
    >
      {children}
    </ParcelsContext.Provider>
  );
};
