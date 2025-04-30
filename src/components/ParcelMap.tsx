import React, { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, GeoJSONProps } from "react-leaflet";
import { useParcels } from "../context/ParcelsContext";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Layer } from "leaflet";
import Spinner from "./Spinner";

const ParcelMap: React.FC = () => {
  const {
    data,
    selectedParcels,
    toggleParcel,
    hoveredParcel,
    setHoveredParcel,
    isLoading,
    error,
  } = useParcels();

  type ZoningType = "Residential" | "Commercial" | "Industrial";

  const zoningColors = useMemo(
    () => ({
      Residential: "#60A5FA",
      Commercial: "#34D399",
      Industrial: "#F87171",
      UnKnown: "#FBBF24",
    }),
    []
  );

  // REVIEW: feature is optional
  const parcelStyle = useMemo(
    () => (feature?: Feature<Geometry, GeoJsonProperties>) => {
      if (!feature || !feature.properties) {
        return {
          fillColor: "#D1D5DB", // ToDO: change color
          weight: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.5,
        };
      }

      const zoningType: ZoningType = feature.properties.zoning_typ;
      const baseColor = zoningColors[zoningType] || zoningColors.UnKnown;
      const isSelected = selectedParcels.includes(feature.properties.id);
      const isHovered = hoveredParcel === feature.properties.id;

      return {
        fillColor: baseColor,
        weight: isHovered ? 3 : 1,
        color: isHovered ? "#666" : "white",
        dashArray: isHovered ? "" : "3",
        fillOpacity: isSelected ? 1 : isHovered ? 0.9 : 0.7,
      };
    },
    [zoningColors, selectedParcels, hoveredParcel]
  );

  const onEachFeature: GeoJSONProps["onEachFeature"] = useCallback(
    (feature: Feature, layer: Layer) => {
      layer.on({
        click: () => toggleParcel(feature?.properties?.id),
        mouseover: () => setHoveredParcel(feature?.properties?.id),
        mouseout: () => setHoveredParcel(null),
      });
    },
    [toggleParcel, setHoveredParcel]
  );

  // TODO: Style
  if (isLoading) {
    return <Spinner />;
  }

  // TODO: Style
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <MapContainer
      center={[32.964735, -96.790005]} // (Dallas)
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && (
        <GeoJSON
          data={data}
          style={parcelStyle}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default ParcelMap;
