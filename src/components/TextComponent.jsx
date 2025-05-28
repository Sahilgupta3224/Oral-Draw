"use client";
import React from "react";
import { useNode } from "@craftjs/core";

const TextComponent = ({ text = "Default text" }) => {
  const { connectors: { drag } } = useNode();

  return (
    <div ref={drag}>
      <h2>{text}</h2>
    </div>
  );
};

export default TextComponent;