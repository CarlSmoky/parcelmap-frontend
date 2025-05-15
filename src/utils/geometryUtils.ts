import { Feature, Geometry } from "geojson";

// Because there are multiple parcels that share the same geometry, we need to filter them
// to only keep the one with the highest id, else they will display on top of each other
export const filterByHighestIdForSharedGeometries = <T extends { id: number }>(
  features: Feature<Geometry, T>[]
): Feature<Geometry, T>[] => {
  const geometryMap = new Map<string, Feature<Geometry, T>>();

  features.forEach((feature) => {
    const geometryString = JSON.stringify(feature.geometry);
    const currentFeature = geometryMap.get(geometryString);

    if (
      !currentFeature ||
      feature.properties.id > currentFeature.properties.id
    ) {
      // Replace with the feature that has the highest ID
      geometryMap.set(geometryString, feature);
    }
  });

  return Array.from(geometryMap.values());
};
