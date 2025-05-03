import React, { useState, useMemo } from "react";
import { useParcels } from "../context/ParcelsContext";
import { ZoningType } from "../types/parcelTypes";
import ParcelSelectionList from "./ParcelSelectionList";
import { API_BASE_URL } from "../config";
import Spinner from "./Spinner";
import { MESSAGES } from "../constants/messsage";
import { MessageType } from "../types/messageTypes";
import SelectedParcelStats from "./SelectedParcelStats";
import UpdateZoningType from "./UpdateZoningType";
import MessageBox from "./MessageBox";

const InfoPane: React.FC = () => {
  const { selectedParcels, data, clearSelection, refetch } = useParcels();
  const [newZoningType, setNewZoningType] = useState<ZoningType | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  // Calculate zoning type counts for selected parcels
  const zoningTypeCounts = useMemo(() => {
    if (!data || selectedParcels.length === 0) return null;

    const uniqueSelectedParcels = Array.from(new Set(selectedParcels));

    // Filter features based on unique selected parcels
    const selectedFeatures = data.features.filter((feature) =>
      uniqueSelectedParcels.includes(feature.properties.id)
    );

    const counts: Record<string, number> = {};

    // Iterate over selected features and count zoning types
    selectedFeatures.forEach((feature) => {
      const zoningType = feature.properties.zoning_typ || "Unknown";
      counts[zoningType] = (counts[zoningType] || 0) + 1;
    });

    return counts;
  }, [data, selectedParcels]);

  const totalSelectedParcels = selectedParcels.length;

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
    <div className="w-full h-full overflow-y-auto bg-white p-4 border-t md:border-l border-gray-300">
      <h2 className="text-xl font-bold mb-4">Parcel Info</h2>

      {selectedParcels.length === 0 ? (
        <p>Select a parcel on the map to see details.</p>
      ) : (
        <>
          <SelectedParcelStats
            totalSelectedParcels={totalSelectedParcels}
            zoningTypeCounts={zoningTypeCounts}
          />

          <UpdateZoningType
            newZoningType={newZoningType}
            setNewZoningType={setNewZoningType}
            handleUpdateZoningType={handleUpdateZoningType}
            clearHandler={clearHandler}
            isUpdating={isUpdating}
          />

          <div className={`mb-4 min-h-24`}>
            {message && (
              <MessageBox
                message={message}
                onClear={clearHandler}
                isUpdating={isUpdating}
                setMessage={setMessage}
              />
            )}
          </div>

          {isUpdating ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <ParcelSelectionList />
          )}
        </>
      )}
    </div>
  );
};

export default InfoPane;
