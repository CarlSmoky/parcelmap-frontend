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
        <div className="flex flex-col md:flex-row h-screen overflow-y-auto">
          <div className="flex-1 h-1/2 min-h-80 md:h-full">
            <ParcelMap />
          </div>
          <div className="w-full md:w-[400px] bg-white">
            <InfoPane />
          </div>
        </div>
      </ParcelsProvider>
    </QueryClientProvider>
  );
};

export default App;
