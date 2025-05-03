import { Feature, Geometry } from "geojson";

/**
 * Filters a list of GeoJSON features to ensure that only the feature with the highest `id`
 * is retained for each unique geometry.
 *
 * @template T - The type of the feature properties, which must include an `id` field.
 * @param features - An array of GeoJSON features to filter.
 * @returns A new array of GeoJSON features, where each geometry is unique and only the feature
 *          with the highest `id` is retained for duplicate geometries.
 */
export const filterByHighestIdForSharedGeometries = <T extends { id: string }>(
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
