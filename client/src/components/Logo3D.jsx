import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export const Logo3D = ({ modelPath }) => {
  const ref = useRef();

  const gltf = useGLTF(modelPath);

  return <primitive ref={ref} object={gltf.scene} />;
};
