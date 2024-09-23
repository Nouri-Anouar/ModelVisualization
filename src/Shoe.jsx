import React, { useEffect, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { Color } from 'three'

const SHOE_MODEL_PATH = './models/shoe-draco.glb'

export function Model() {
  const [hovered, setHovered] = useState(false)
  const { nodes, materials } = useGLTF(SHOE_MODEL_PATH)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  const generateRandomColor = useCallback(() => 
    '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
  [])

  const createColorPicker = useCallback((materialName) => ({
    value: generateRandomColor(),
    onChange: (value) => {
      materials[materialName].color = new Color(value)
    }
  }), [materials, generateRandomColor])

  useControls('Shoe', () => 
    Object.keys(materials).reduce((acc, materialName) => ({
      ...acc,
      [materialName]: createColorPicker(materialName)
    }), {})
  )

  const handlePointerOver = useCallback(() => setHovered(true), [])
  const handlePointerOut = useCallback(() => setHovered(false), [])
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    document.getElementById(`Shoe.${e.object.material.name}`).focus()
  }, [])

  return (
    <group
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {Object.entries(nodes).map(([nodeName, node]) => 
        nodeName.startsWith('shoe') && (
          <mesh 
            key={nodeName}
            geometry={node.geometry}
            material={materials[node.material.name]}
          />
        )
      )}
    </group>
  )
}

useGLTF.preload(SHOE_MODEL_PATH)
