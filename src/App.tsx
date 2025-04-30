import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ParcelMap from "./components/ParcelMap";
import { ParcelsProvider } from "./context/ParcelsContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParcelsProvider>
        <div className="flex flex-col md:flex-row h-screen">
          <ParcelMap />
          <div className="w-80 bg-white border-l p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Parcel Info</h2>
            <p>Select a parcel on the map to see details.</p>
          </div>
        </div>
      </ParcelsProvider>
    </QueryClientProvider>
  );
};

export default App;
