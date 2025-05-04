import React, { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, GeoJSONProps } from "react-leaflet";
import { useParcels } from "../context/ParcelsContext";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Layer } from "leaflet";
import Spinner from "./Spinner";
import { ZoningType } from "../types/parcelTypes";
import { zoningColors } from "../constants/zoningColors";
import { ERROR_MESSAGE } from "../constants/messsage";
import { tileLayers } from "../constants/mapLayers";

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

  const parcelStyle = useMemo(
    () => (feature?: Feature<Geometry, GeoJsonProperties>) => {
      if (!feature || !feature.properties) {
        return {
          fillColor: "#D1D5DB",
          weight: 1,
          color: "white",
          fillOpacity: 0.1,
        };
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
      <div className="flex-1">
        <p className="flex justify-center items-center h-full p-4 text-red-500">
          {ERROR_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[32.964735, -96.790005]} // (Dallas)
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && (
        <GeoJSON
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
