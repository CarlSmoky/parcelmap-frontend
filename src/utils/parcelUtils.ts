import { FeatureCollection, Geometry } from "geojson";
import { ZoningType } from "../types/parcelTypes";

/**
 * Filters parcels where the zoning type is not equal to the new zoning type.
 * @param selectedParcels - Parcel IDs
 * @param data - GeoJSON FeatureCollection containing parcel data
 * @param newZoningType - New zoning type
 * @returns Parcel IDs that need to be updated
 */
export const filterTargetParcels = (
  selectedParcels: number[],
  data: FeatureCollection<Geometry, any>,
  newZoningType: ZoningType
): number[] => {
  return selectedParcels.filter((id) => {
    const parcel = data?.features.find(
      (feature) => feature.properties.id === id
    );
    return parcel?.properties.zoning_typ !== newZoningType;
  });
};

/**
 * Calculates the count of zoning types for selected parcels.
 * @param data - GeoJSON
 * @param selectedParcels -Parcel IDs
 * @returns A record of zoning type counts
 */
export const calculateZoningTypeCounts = (
  data: FeatureCollection<Geometry, any>,
  selectedParcels: number[]
): Record<string, number> | null => {
  if (!data || selectedParcels.length === 0) return null;

  const uniqueSelectedParcels = Array.from(new Set(selectedParcels));

  // Filter features based on unique selected parcels
  const selectedFeatures = data.features.filter((feature) =>
    uniqueSelectedParcels.includes(feature.properties.id)
  );

  const counts: Record<string, number> = {};

  // Iterate over selected features and count zoning types
  selectedFeatures.forEach((feature) => {
    const zoningType = feature.properties.zoning_typ || "Unknown";
    counts[zoningType] = (counts[zoningType] || 0) + 1;
  });

  return counts;
};
