import React, { useState } from "react";
import { useParcels } from "../context/ParcelsContext";
import { ZoningType } from "../types/parcelTypes";
import Button from "./Button";
import ParcelSelectionList from "./ParcelSelectionList";
import ZoningTypeSelector from "./ZoningTypeSelector";
import { API_BASE_URL } from "../config";
import Spinner from "./Spinner";
import { MESSAGES } from "../constants/messsage";
import { MessageType } from "../types/messageTypes";

const InfoPane: React.FC = () => {
  const { selectedParcels, data, clearSelection, refetch } = useParcels();
  const [newZoningType, setNewZoningType] = useState<ZoningType | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  const handleUpdateZoningType = async () => {
    if (!newZoningType) {
      setMessage({
        text: MESSAGES.ERROR_NO_ZONING_TYPE,
        type: "error",
      });
      return;
    }
    if (selectedParcels.length !== 0) {
      // Filter parcels where zoning_typ is not equal to newZoningType
      const targetParcels = selectedParcels.filter((id) => {
        const parcel = data?.features.find(
          (feature) => feature.properties.id === id
        );
        return parcel?.properties.zoning_typ !== newZoningType;
      });

      if (targetParcels.length === 0) {
        setMessage({
          text: MESSAGES.INFO_NO_CHANGES,
          type: "info",
        });
        return;
      }

      const updateData = {
        targetParcels,
        newZoningType,
      };

      const unchangedParcels = selectedParcels.filter(
        (id) => !targetParcels.includes(id)
      );

      try {
        setIsUpdating(true);
        const response = await fetch(`${API_BASE_URL}/parcels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(MESSAGES.ERROR_UPDATE);
        }

        const result = await response.json();
        await refetch();

        const messageText = MESSAGES.SUCCESS_UPDATE(
          result.length,
          unchangedParcels.length
        );
        setMessage({
          text: messageText,
          type: "success",
        });
      } catch (error) {
        console.error("Error updating zoning type: ", error);

        setMessage({
          text: MESSAGES.ERROR_UPDATE,
          type: "error",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const clearHandler = () => {
    clearSelection();
    setNewZoningType("");
    setMessage(null);
  };

  return (
    <div className="w-80 bg-white border-l p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Parcel Info</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
          <Button
            onClick={() => setMessage(null)}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            OK
          </Button>
        </div>
      )}

      {selectedParcels.length === 0 ? (
        <p>Select a parcel on the map to see details.</p>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">Update Zoning Type</h3>
          <ZoningTypeSelector
            newZoningType={newZoningType}
            setNewZoningType={setNewZoningType}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateZoningType}
              className={`bg-blue-500 text-white ${
                isUpdating ? "opacity-50" : ""
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update All"}
            </Button>
            <Button
              onClick={clearHandler}
              className={`bg-blue-500 text-white ${
                isUpdating ? "opacity-50" : ""
              }`}
              disabled={isUpdating}
            >
              Clear Selection
            </Button>
          </div>
          {isUpdating ? <Spinner /> : <ParcelSelectionList />}
        </>
      )}
    </div>
  );
};

export default InfoPane;
