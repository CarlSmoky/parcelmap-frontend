import { API_BASE_URL } from "../config";

export const apiService = {
  fetchParcels: async () => {
    const response = await fetch(`${API_BASE_URL}/parcels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch parcels (Error: ${response.status}).`);
    }
    return await response.json();
  },

  updateZoningType: async (updateData: {
    targetParcels: number[];
    newZoningType: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/parcels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to update zoning type (Error: ${response.status}).`
      );
    }
    return await response.json();
  },
};
