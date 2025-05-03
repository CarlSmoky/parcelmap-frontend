import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isUpdating?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  isUpdating = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-1/2 rounded bg-purple-500 text-white text-sm ${className} ${
        isUpdating
          ? "opacity-50"
          : "hover:bg-purple-600 hover:shadow-lg transition-transform duration-300 ease-in-out"
      }`}
      disabled={isUpdating}
    >
      {children}
    </button>
  );
};

export default Button;
