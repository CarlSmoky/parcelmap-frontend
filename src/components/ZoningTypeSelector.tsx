import React from "react";
import { ZoningType, ZoningTypeEnum } from "../types/parcelTypes";

interface ZoningTypeSelectorProps {
  newZoningType: ZoningType | "";
  setNewZoningType: (value: ZoningType | "") => void;
}

const ZoningTypeSelector: React.FC<ZoningTypeSelectorProps> = ({
  newZoningType,
  setNewZoningType,
}) => {
  return (
    <div className="border-t border-gray-300 pt-4">
      <label className="block mb-2 font-semibold">Zoning Type:</label>
      <select
        value={newZoningType}
        onChange={(e) => setNewZoningType(e.target.value as ZoningType)}
        className="border p-2 w-full mb-2"
      >
        <option value="" disabled>
          Select zoning type
        </option>
        {Object.values(ZoningTypeEnum).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ZoningTypeSelector;
