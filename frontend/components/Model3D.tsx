import { Center, useGLTF } from '@react-three/drei';
import { useRef, JSX } from 'react';
import { Group } from 'three';

export function Model3D(): JSX.Element {
  const { scene } = useGLTF('/model3d/scene.gltf');
  const groupRef = useRef<Group>(null);

  return (
    <Center>
      <group ref={groupRef} rotation={[Math.PI / 6, 0, 0]}>
        <primitive object={scene} scale={1.2} />
      </group>
    </Center>
  );
}
