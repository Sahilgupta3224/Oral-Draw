import React from "react";
import { useEditor } from "@craftjs/core";
import Button from '../components/Button'
import TextComponent from '../components/TextComponent'

export const Toolbox = () => {
  const { connectors, actions } = useEditor();

  return (
    <div className="p-2 border-b border-gray-300">
      <button
        className="m-2 p-1 bg-gray-200"
        onClick={() => actions.add(<TextComponent text="New Text" />, "root")}
      >
        Add Text
      </button>
      <button
        className="m-2 p-1 bg-gray-200"
        onClick={() => actions.add(<Button text="New Button" />, "root")}
      >
        Add Button
      </button>
    </div>
  );
};
