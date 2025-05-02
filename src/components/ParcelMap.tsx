import React, { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, GeoJSONProps } from "react-leaflet";
import { useParcels } from "../context/ParcelsContext";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Layer } from "leaflet";
import Spinner from "./Spinner";
import { ZoningType } from "../types/parcelTypes";
import { zoningColors } from "../constants/zoningColors";

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
        fillOpacity: isSelected ? 1 : isHovered ? 1 : 0.7,
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

  if (isLoading) {
    return (
      <div className="flex-1">
        <Spinner />;
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 ">
        <p className="flex justify-center items-center h-full text-red-500">
          Error: {error}
        </p>
      </div>
    );
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
          // REVIEW: Performance
          key={JSON.stringify(data)}
          data={data}
          style={parcelStyle}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default ParcelMap;
