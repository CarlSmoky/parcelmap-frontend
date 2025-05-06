import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Layer } from "leaflet";
import { ZoningType } from "../types/parcelTypes";
import { zoningColors } from "../constants/zoningColors";

// Default parcel style
export const DEFAULT_PARCEL_STYLE = {
  fillColor: "#D1D5DB",
  weight: 1,
  color: "white",
  fillOpacity: 0.1,
};

/**
 * Get the style for a parcel feature.
 * @param feature - The GeoJSON feature.
 * @param selectedParcels - Array of selected parcel IDs.
 * @param hoveredParcel - The currently hovered parcel ID.
 * @returns The style object for the parcel.
 */
export const getParcelStyle = (
  feature?: Feature<Geometry, GeoJsonProperties>,
  selectedParcels: number[] = [],
  hoveredParcel: number | null = null
) => {
  if (!feature || !feature.properties) {
    return DEFAULT_PARCEL_STYLE;
  }

  const zoningType: ZoningType = feature.properties.zoning_typ;
  const baseColor = zoningColors[zoningType] || zoningColors.UnKnown;
  const isSelected = selectedParcels.includes(feature.properties.id);
  const isHovered = hoveredParcel === feature.properties.id;

  return {
    fillColor: baseColor,
    weight: isHovered ? (isSelected ? 6 : 3) : isSelected ? 4 : 1,
    color: isSelected ? "gray" : isHovered ? "yellow" : "white",
    fillOpacity: isSelected ? 1 : isHovered ? 1 : 0.6,
  };
};

/**
 * Handle interactions for a GeoJSON feature.
 * @param feature - The GeoJSON feature.
 * @param layer - The Leaflet layer.
 * @param toggleParcel - Function to toggle parcel selection.
 * @param setHoveredParcel - Function to set the hovered parcel.
 */
export const attachFeatureHandlers = (
  feature: Feature<Geometry, GeoJsonProperties>,
  layer: Layer,
  toggleParcel: (id: number) => void,
  setHoveredParcel: (id: number | null) => void
) => {
  layer.on({
    click: () => toggleParcel(feature?.properties?.id),
    mouseover: () => setHoveredParcel(feature?.properties?.id),
    mouseout: () => setHoveredParcel(null),
  });
};
