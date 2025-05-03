import React from "react";
import Button from "./Button";
import ZoningTypeSelector from "./ZoningTypeSelector";
import { ZoningType } from "../types/parcelTypes";

interface UpdateZoningTypeProps {
  newZoningType: ZoningType | "";
  setNewZoningType: (value: ZoningType | "") => void;
  handleUpdateZoningType: () => void;
  clearHandler: () => void;
  isUpdating: boolean;
}

const UpdateZoningType: React.FC<UpdateZoningTypeProps> = ({
  newZoningType,
  setNewZoningType,
  handleUpdateZoningType,
  clearHandler,
  isUpdating,
}) => {
  return (
    <div className="mt-4 mb-4 p-2 border border-gray-100 rounded-sm">
      <h3 className="text-lg font-semibold mb-2">Update Zoning Type</h3>
      <div className="p-2">
        <ZoningTypeSelector
          newZoningType={newZoningType}
          setNewZoningType={setNewZoningType}
        />
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleUpdateZoningType}
            className="px-4 py-2 "
            isUpdating={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update All"}
          </Button>
          <Button
            onClick={clearHandler}
            className="px-4 py-2 "
            isUpdating={isUpdating}
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateZoningType;
