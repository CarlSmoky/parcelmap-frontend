import React from "react";
import Spinner from "./Spinner";

interface SelectedParcelStatsProps {
  totalSelectedParcels: number;
  zoningTypeCounts: Record<string, number> | null;
  isUpdating: boolean;
}

const SelectedParcelStats: React.FC<SelectedParcelStatsProps> = ({
  totalSelectedParcels,
  zoningTypeCounts,
  isUpdating = false,
}) => {
  return (
    <div className="mt-4 mb-4 p-2 border border-gray-100 rounded-sm">
      <h3 className="text-lg font-semibold mb-2">
        Selected Parcels: {totalSelectedParcels}
      </h3>
      <div className="p-2">
        {isUpdating ? (
          <div className="h-20 pl-2">
            <Spinner />
          </div>
        ) : (
          zoningTypeCounts && (
            <>
              <p>
                <strong>Zoning Types:</strong>
              </p>
              <ul className="list-disc list-inside h-20 pl-2">
                {Object.entries(zoningTypeCounts).map(([zoningType, count]) => (
                  <li key={zoningType}>
                    {zoningType}: {count}
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SelectedParcelStats;
