
function PikoRobot({ panAngle = 0, tiltAngle = 0 }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 1, 0]} scale={[1.25, 0.9, 0.85]}>
        <sphereGeometry args={[0.8, 48, 48]} />
        <meshStandardMaterial color="#d8c9ad" roughness={0.75} />
      </mesh>

      {/* Bottom trim */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.045, 48]} />
        <meshStandardMaterial color="#a66b32" />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 0.95, 0.73]}>
        <boxGeometry args={[1.05, 0.58, 0.035]} />
        <meshStandardMaterial color="#252525" />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.95, 0.751]}>
        <boxGeometry args={[0.94, 0.46, 0.012]} />
        <meshStandardMaterial color="#9eafb4" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.83, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 40]} />
        <meshStandardMaterial color="#b7a991" />
      </mesh>

      {/* Neck ring */}
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.045, 40]} />
        <meshStandardMaterial color="#a66b32" />
      </mesh>

      {/* Head pan pivot */}
      <group position={[0, 1.95, 0]} rotation={[0, panAngle, 0]}>

        {/* Head tilt pivot */}
        <group rotation={[tiltAngle, 0, 0]}>

          {/* Head */}
          <mesh position={[0, 0.4, 0]} scale={[1.2, 0.9, 0.85]}>
            <sphereGeometry args={[0.55, 48, 48]} />
            <meshStandardMaterial color="#e8dcc7" roughness={0.65} />
          </mesh>

          {/* Left camera bezel */}
          <mesh position={[-0.29, 0.41, 0.44]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#a99a83" />
          </mesh>

          {/* Right camera bezel */}
          <mesh position={[0.29, 0.41, 0.44]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#a99a83" />
          </mesh>

          {/* Left camera lens */}
          <mesh position={[-0.29, 0.41, 0.535]}>
            <sphereGeometry args={[0.085, 32, 32]} />
            <meshStandardMaterial color="#101820" />
          </mesh>

          {/* Right camera lens */}
          <mesh position={[0.29, 0.41, 0.535]}>
            <sphereGeometry args={[0.085, 32, 32]} />
            <meshStandardMaterial color="#101820" />
          </mesh>

        </group>
      </group>
    </group>
  )
}

export default PikoRobot
