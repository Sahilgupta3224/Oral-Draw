// "use client";
// import React from "react";
// import { Editor, Frame, Element,useEditor } from "@craftjs/core";
// import Container from '../../components/Container';
// import TextComponent from "../../components/TextComponent";
// import { Button } from "../../components/Button";
// // const TextComponent = ({ text }) => {
// //   const { connectors: { drag } } = useNode();

// //   return (
// //     <div ref={drag}>
// //       <h2>{text}</h2>
// //     </div>
// //   );
// // };

// // const Container = ({ children }) => {
// //   const { connectors: { drag } } = useNode();

// //   return (
// //     <div ref={drag} style={{ padding: "20px", border: "1px solid black" }}>
// //       {/* Ensure the Element inside has an `id` */}
// //       <Canvas id="drop_section">
// //          // Now users will be able to drag/drop components into this section
// //         <TextComponent />
// //       </Canvas>
// //     </div>
// //   );
// // };

// const SaveButton = () => {
//   const { query } = useEditor();
//   return <a onClick={() => console.log(query.serialize()) }>Get JSON</a>
// }

// export default function EditorComp() {
//   return (
//     <div>
//       <header>Some fancy header or whatever</header>
//       <Editor resolver={{ TextComponent, Container }}>
//         <Frame>
//           <Element is={Container} canvas>
//             <TextComponent text="I'm already rendered here" />
//           </Element>
//         </Frame>
//           <SaveButton/>
//       </Editor>
//     </div>
//   );
// }
