"use client";
import React from "react";
import { useNode, Element } from "@craftjs/core";

const Container = ({ children }) => {
  const { connectors: { drag } } = useNode();

  return (
    <div ref={drag} style={{ padding: "20px", border: "1px solid black" }}>
      {children} {/* This will allow components to be added inside */}
    </div>
  );
};

export default Container;
