import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ParcelMap from "./components/ParcelMap";
import { ParcelsProvider } from "./context/ParcelsContext";
import InfoPane from "./components/InfoPane";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParcelsProvider>
        <div className="flex flex-col md:flex-row h-screen">
          <ParcelMap />
          <div className="w-96 bg-white border-l p-4 overflow-y-auto">
            <InfoPane />
          </div>
        </div>
      </ParcelsProvider>
    </QueryClientProvider>
  );
};

export default App;
