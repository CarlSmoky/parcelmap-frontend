import { Feature, FeatureCollection, Geometry } from "geojson";
import { filterByHighestIdForSharedGeometries } from "../utils/geometryUtils";
import { ZoningType } from "../types/parcelTypes";
import { MESSAGES } from "../constants/messsage";
import { filterTargetParcels } from "../utils/parcelUtils";
import { MessageType } from "../types/messageTypes";
import { apiService } from "./apiService";

interface ParcelProperties {
  id: number;
  zoning_typ: string;
}

interface ParcelApiResponse {
  id: number;
  geometry: string;
  parcelnumb: string;
  name: string;
  zoning_typ: string;
}

interface HandleUpdateZoningTypeArgs {
  selectedParcels: number[];
  data: FeatureCollection<Geometry, any> | null;
  newZoningType: ZoningType | "";
  refetch: () => Promise<void>;
  setMessage: (message: { text: string; type: MessageType }) => void;
  setIsUpdating: (isUpdating: boolean) => void;
}

// Fetch parcels using the centralized API service
export const fetchParcels = async (): Promise<
  FeatureCollection<Geometry, ParcelProperties>
> => {
  try {
    // Use the centralized apiService to fetch parcels
    const parcels: ParcelApiResponse[] = await apiService.fetchParcels();

    // Map the API response to GeoJSON features
    const features: Feature<Geometry, ParcelProperties>[] = parcels.map(
      (parcel) => ({
        type: "Feature",
        geometry: JSON.parse(parcel.geometry) as Geometry,
        properties: {
          id: parcel.id,
          parcelnumb: parcel.parcelnumb,
          name: parcel.name,
          zoning_typ: parcel.zoning_typ,
        },
      })
    );

    // Filter features to ensure unique geometries
    const uniqueFeatures = filterByHighestIdForSharedGeometries(features);

    return {
      type: "FeatureCollection",
      features: uniqueFeatures,
    };
  } catch (error) {
    console.error("Error fetching parcels:", error);

    throw error;
  }
};

// Update zoning type for selected parcels using the centralized API service
export const handleUpdateZoningType = async ({
  selectedParcels,
  data,
  newZoningType,
  refetch,
  setMessage,
  setIsUpdating,
}: HandleUpdateZoningTypeArgs) => {
  if (!newZoningType) {
    setMessage({
      text: MESSAGES.ERROR_NO_ZONING_TYPE,
      type: "error",
    });
    return;
  }

  if (!data) {
    setMessage({
      text: MESSAGES.ERROR_NO_DATA,
      type: "error",
    });
    return;
  }

  if (selectedParcels.length !== 0) {
    const targetParcels = filterTargetParcels(
      selectedParcels,
      data,
      newZoningType
    );

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

      // Use the centralized apiService to update zoning type
      const result = await apiService.updateZoningType(updateData);

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
