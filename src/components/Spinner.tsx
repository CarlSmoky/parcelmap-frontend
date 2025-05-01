import React from "react";

const Spinner: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center h-full m-10"
      aria-label="Loading content"
    >
      <div
        className="border-gray-200/70 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-200"
        role="status"
      ></div>
    </div>
  );
};

export default Spinner;
