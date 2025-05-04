# Parcel Map Frontend

This is the React-based frontend ParcelMap application for visualizing and managing parcel data from Leaflet.

## Features

- Interactive map to view parcels
- Selects multiple parcels, display their details, and update zoning their types
- Display and update zoning type counts

## Production url

[Parcel Map Frontend](https://parcelmap-frontend.vercel.app/)

## Prerequisites

- Node.js and npm installed on your system

## How to Run the System

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

   This will start the application and open it in your default browser.

3. **Build for Production**:
   To create a production build, run:

   ```bash
   npm run build
   ```

## Environment Variables

- Configure the API base URL in the `.env` file:
  ```env
  VITE_API_BASE_URL=http://localhost:3001/api
  ```

## Development Assumptions

There are many instance in the returned data where multiple parcels appear to share the same geoJSON data. In the these cases, I have assumed that the most recent entry (i.e. the one with the highest unique table id) to be the current one. Earlier parcel entries that share the same coordinates have been filtered out
