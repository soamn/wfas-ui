"use client";
import { Handle, Position, useConnection } from "@xyflow/react";

interface CustomHandleProps {
  id: string;
  type: "source" | "target";
  position: Position;
  show: boolean;
  isConnectable?: boolean;
  isValidConnection?: (connection: any) => boolean;
  className?: string;
}

const CustomHandle = ({ show, ...props }: CustomHandleProps) => {
  const connection = useConnection();

  const isDragging = connection.inProgress;
  const isTargetingThis =
    isDragging && connection.fromHandle?.type !== props.type;
  let borderColor = "border-black!";
  let bgColor = "bg-white!";
  if (isDragging || show) {
    if (props.type === "target") {
      borderColor = "border-emerald-500!";
      bgColor = "bg-emerald-100!";
    } else {
      bgColor = "bg-sky-500!";
    }
  }

  return (
    <Handle
      {...props}
      style={{ transition: "opacity 200ms, border-color 150ms" }}
      className={`
        z-50 w-2! h-2!  rounded-full! border!
        ${show || isTargetingThis ? "opacity-100" : "opacity-0"} 
        ${borderColor}
        ${props.className} 
        ${bgColor}
      `}
    />
  );
};

export default CustomHandle;
