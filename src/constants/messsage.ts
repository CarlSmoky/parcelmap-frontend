export const MESSAGES = {
  SUCCESS_UPDATE: (updatedCount: number, unchangedCount: number) =>
    `${updatedCount} item's zoning type updated successfully!${
      unchangedCount > 0
        ? ` ${unchangedCount} item${
            unchangedCount > 1 ? "s were" : " was"
          } unchanged.`
        : ""
    }`,
  ERROR_UPDATE: "Failed to update zoning type. Please try again.",
  INFO_NO_CHANGES: "All selected parcels already have the same zoning type.",
  ERROR_NO_ZONING_TYPE: "Please select a zoning type.",
};
