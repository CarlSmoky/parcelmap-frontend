import { FeatureCollection, Geometry } from "geojson";

export enum ZoningTypeEnum {
  Residential = "Residential",
  Commercial = "Commercial",
  Industrial = "Industrial",
}

export type ZoningType = keyof typeof ZoningTypeEnum;

export interface ParcelsContextType {
  data: FeatureCollection<Geometry, ParcelProperties> | null;
  selectedParcels: number[];
  toggleParcel: (id: number) => void;
  hoveredParcel: number | null;
  setHoveredParcel: (id: number | null) => void;
  clearSelection: () => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface ParcelProperties {
  id: number;
  zoning_typ: string;
  [key: string]: any; // REVIEW: Add other properties as needed
}
