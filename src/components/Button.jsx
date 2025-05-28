import React from "react";
import { useNode } from "@craftjs/core";

export const Button = ({ text = "Button" }) => {
  const { connectors } = useNode();
  return (
    <button ref={connectors.connect} className="p-2 bg-blue-500 text-white rounded">
      {text}
    </button>
  );
};