import React from "react";
import { ParcelProperties } from "../types/parcelTypes";
import { zoningColors } from "../constants/zoningColors";

interface ParcelSelectionItemProps {
  parcel: ParcelProperties | undefined;
  onUnselect: (id: number) => void;
}

const ParcelSelectionItem: React.FC<ParcelSelectionItemProps> = ({
  parcel,
  onUnselect,
}) => {
  const borderColor =
    zoningColors[parcel?.zoning_typ as keyof typeof zoningColors] ||
    zoningColors.UnKnown;
  return (
    <li
      className="m-2 border p-2 rounded bg-gray-100 cursor-pointer hover:shadow-lg transition-transform duration-300 ease-in-out"
      style={{ borderColor, borderWidth: "2px", borderStyle: "solid" }}
      onClick={() => parcel?.id !== undefined && onUnselect(parcel.id)}
    >
      <strong>Number:</strong> {parcel?.parcelnumb} <br />
      <strong>Name:</strong> {parcel?.name} <br />
      <strong>Zoning Type:</strong> {parcel?.zoning_typ || "Unknown"}
    </li>
  );
};

export default ParcelSelectionItem;
