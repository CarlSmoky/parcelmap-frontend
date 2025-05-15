import React, { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, GeoJSONProps } from "react-leaflet";
import { useParcels } from "../context/ParcelsContext";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Layer } from "leaflet";
import Spinner from "./Spinner";
import { ERROR_MESSAGE } from "../constants/messsage";
import { tileLayers } from "../constants/mapLayers";
import { getParcelStyle, attachFeatureHandlers } from "../utils/parcelMapUtils";

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
    () => (feature?: Feature<Geometry, GeoJsonProperties>) =>
      getParcelStyle(feature, selectedParcels, hoveredParcel),
    [selectedParcels, hoveredParcel]
  );

  // Memoized feature handler
  const onEachFeature: GeoJSONProps["onEachFeature"] = useCallback(
    (feature: Feature, layer: Layer) =>
      attachFeatureHandlers(feature, layer, toggleParcel, setHoveredParcel),
    [toggleParcel, setHoveredParcel]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Spinner />;
      </div>
    );
  }

  if (!data && !error) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Spinner />
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
        attribution={tileLayers.openstreetmap.attribution}
        url={tileLayers.openstreetmap.url}
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
