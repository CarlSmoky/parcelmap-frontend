export const MESSAGES = {
  SUCCESS_UPDATE: (updatedCount: number, unchangedCount: number) => {
    const updatedText = `Successfully updated ${updatedCount} parcel${
      updatedCount === 1 ? "" : "s"
    }.`;
    const unchangedText =
      unchangedCount > 0
        ? ` ${unchangedCount} parcel${
            unchangedCount === 1 ? " was" : "s were"
          } unchanged.`
        : "";
    return `${updatedText} ${unchangedText}`;
  },
  ERROR_UPDATE: "Failed to update zoning type. Please try again.",
  INFO_NO_CHANGES:
    "All selected parcels already have the selected target zoning type.",
  ERROR_NO_ZONING_TYPE: "Please select a zoning type.",
  ERROR_NO_DATA: "No parcel data available. Please try again later.",
};

export const ERROR_MESSAGE =
  "Unable to load parcels. Please check your internet connection or try again later.";
