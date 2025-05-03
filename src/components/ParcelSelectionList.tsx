import React from "react";
import { useParcels } from "../context/ParcelsContext";
import ParcelSelectionItem from "./ParcelSelectionItem";

const ParcelSelectionList: React.FC = () => {
  const { selectedParcels, data, toggleParcel } = useParcels();

  if (selectedParcels.length === 0) {
    return <p>Select a parcel on the map to see details.</p>;
  }

  const handleUnselect = (id: number) => {
    toggleParcel(id);
  };

  return (
    <div className="mt-4 mb-4 p-2">
      <h3 className="text-lg font-semibold mb-2">Selected Parcels</h3>
      <ul className="mb-4">
        {selectedParcels.map((id) => {
          const parcel = data?.features.find(
            (feature) => feature.properties.id === id
          )?.properties;

          return (
            <ParcelSelectionItem
              key={id}
              parcel={parcel}
              onUnselect={handleUnselect}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ParcelSelectionList;
