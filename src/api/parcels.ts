import { Feature, FeatureCollection, Geometry } from "geojson";
import { API_BASE_URL } from "../config";
import { filterByHighestIdForSharedGeometries } from "../utils/geometryUtils";

interface ParcelProperties {
  id: string;
  zoning_typ: string;
  [key: string]: any;
}

export const fetchParcels = async (): Promise<
  FeatureCollection<Geometry, ParcelProperties>
> => {
  interface ParcelApiResponse {
    id: string;
    geometry: string;
    parcelnumb: string;
    name: string;
    zoning_typ: string;
    [key: string]: any;
  }

  const response = await fetch(`${API_BASE_URL}/parcels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    console.error(
      "Error fetching parcels:",
      response.status,
      response.statusText
    );
    throw new Error(`Failed to fetch parcel data (Error: ${response.status}).`);
  }
  const parcels: ParcelApiResponse[] = await response.json();

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

  const uniqueFeatures = filterByHighestIdForSharedGeometries(features);

  return {
    type: "FeatureCollection",
    features: uniqueFeatures,
  };
};
