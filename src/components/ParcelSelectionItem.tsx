import React from "react";
import { ParcelProperties } from "../types/parcelTypes";

interface ParcelSelectionItemProps {
  id: number;
  parcel: ParcelProperties | undefined;
}

const ParcelSelectionItem: React.FC<ParcelSelectionItemProps> = ({
  id,
  parcel,
}) => {
  return (
    <li className="mb-2">
      <strong>ID:</strong> {id} <br />
      <strong>Zoning Type:</strong> {parcel?.zoning_typ || "Unknown"}
    </li>
  );
};

export default ParcelSelectionItem;
