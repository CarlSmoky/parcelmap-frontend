import React, { useState, useMemo } from "react";
import { useParcels } from "../context/ParcelsContext";
import { ZoningType } from "../types/parcelTypes";
import ParcelSelectionList from "./ParcelSelectionList";
import Spinner from "./Spinner";
import { MessageType } from "../types/messageTypes";
import SelectedParcelStats from "./SelectedParcelStats";
import UpdateZoningType from "./UpdateZoningType";
import MessageBox from "./MessageBox";
import { calculateZoningTypeCounts } from "../utils/parcelUtils";
import { handleUpdateZoningType } from "../api/parcels";
import { ERROR_MESSAGE } from "../constants/messsage";

const InfoPane: React.FC = () => {
  const { selectedParcels, data, clearSelection, refetch, error, isLoading } =
    useParcels();
  const [newZoningType, setNewZoningType] = useState<ZoningType | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  // Calculate zoning type counts for selected parcels
  const zoningTypeCounts = useMemo(() => {
    if (!data) return null;
    return calculateZoningTypeCounts(data, selectedParcels);
  }, [data, selectedParcels]);

  const totalSelectedParcels = selectedParcels.length;

  const handleUpdate = async () => {
    await handleUpdateZoningType({
      selectedParcels,
      data,
      newZoningType,
      refetch,
      setMessage,
      setIsUpdating,
    });
  };

  const clearHandler = () => {
    clearSelection();
    setNewZoningType("");
    setMessage(null);
  };

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
      <div className="flex justify-center items-center h-full p-4">
        <p className="text-red-500">{ERROR_MESSAGE}</p>
      </div>
    );
  }

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
            isUpdating={isUpdating}
          />

          <UpdateZoningType
            newZoningType={newZoningType}
            setNewZoningType={setNewZoningType}
            handleUpdateZoningType={handleUpdate}
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
