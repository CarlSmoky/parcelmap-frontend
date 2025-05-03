export const tileLayers = {
  stadiaMaps: {
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">@Stadia Maps</a>',
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  },
  openMapTiles: {
    attribution:
      '&copy; <a href="https://openmaptiles.org/" target="_blank">@OpenMap Tiles</a>',
  },
  openStreetMap: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">@OpenStreetMap contributors</a>',
  },
};

export const combinedAttribution = Object.values(tileLayers)
  .map((layer) => layer.attribution)
  .join(" ");
