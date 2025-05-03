import React from "react";
import { useParcels } from "../context/ParcelsContext";
import ParcelSelectionItem from "./ParcelSelectionItem";

const ParcelSelectionList: React.FC = () => {
  const { selectedParcels, data } = useParcels();

  if (selectedParcels.length === 0) {
    return <p>Select a parcel on the map to see details.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Selected Parcels</h3>
      <ul className="mb-4">
        {selectedParcels.map((id) => {
          const parcel = data?.features.find(
            (feature) => feature.properties.id === id
          )?.properties;

          return <ParcelSelectionItem key={id} parcel={parcel} />;
        })}
      </ul>
    </div>
  );
};

export default ParcelSelectionList;
