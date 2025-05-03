import React from "react";
import { MdCancel } from "react-icons/md";
import Button from "./Button";
import { MessageType } from "../types/messageTypes";

interface MessageBoxProps {
  message: { text: string; type: MessageType };
  setMessage: (value: { text: string; type: MessageType } | null) => void;
  onClear: () => void;
  isUpdating: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  setMessage,
  onClear,
  isUpdating,
}) => {
  return (
    <div
      className={`flex flex-col justify-between p-4 rounded h-full ${
        message.type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <div className="flex">
        <p className="flex-grow text-sm">
          {message.text || "No message available"}
        </p>
        <MdCancel
          className="cursor-pointer ml-2 w-6 h-6 flex-shrink-0 text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform duration-200 ease-in-out"
          onClick={() => setMessage(null)}
        />
      </div>

      <div className="flex w-full pt-2 items-end">
        <Button
          onClick={onClear}
          className="ml-auto p-1"
          isUpdating={isUpdating}
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
};

export default MessageBox;
