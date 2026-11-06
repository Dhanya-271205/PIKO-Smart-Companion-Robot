
import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PikoRobot from './components/PikoRobot'
import CameraView from './components/CameraView'
import WebcamDetection from './components/WebcamDetection'
import VoiceAssistant from './components/VoiceAssistant'
import MedicineReminder from './components/MedicineReminder'
import HealthCheckIn from './components/HealthCheckIn'
import './App.css'

function App() {
  const [panAngle, setPanAngle] = useState(0)
  const [tiltAngle, setTiltAngle] = useState(0)
  const [personPosition, setPersonPosition] = useState(0)
  const [tracking, setTracking] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [detectedPersonAngle, setDetectedPersonAngle] = useState(null)

  // Receive the detected person's position from the webcam
  const handlePersonDetected = useCallback((angle) => {
    setDetectedPersonAngle(angle)
  }, [])

  // Simulated tracking movement
  useEffect(() => {
    if (!tracking || privacyMode) return

    let direction = 1

    const movement = setInterval(() => {
      setPersonPosition((current) => {
        if (current >= 25) direction = -1
        if (current <= -25) direction = 1
        return current + direction
      })
    }, 100)

    return () => clearInterval(movement)
  }, [tracking, privacyMode])

  // Choose real webcam tracking when a person is detected
  const currentPanAngle = privacyMode
    ? panAngle
    : detectedPersonAngle !== null
      ? Math.max(-60, Math.min(60, detectedPersonAngle))
      : tracking
        ? personPosition * 2
        : panAngle

  const togglePrivacy = () => {
    setPrivacyMode((current) => !current)
    setTracking(false)
    setDetectedPersonAngle(null)
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#f3eee5',
      color: '#29251f',
      fontFamily: 'Arial, sans-serif',
      padding: '24px',
      boxSizing: 'border-box'
    }}>

      <h1>PIKO - Virtual Robot</h1>
      <p>Your virtual elderly care companion.</p>

      {/* Privacy Mode */}
      <div style={{
        margin: '20px 0',
        padding: '16px',
        borderRadius: '10px',
        background: privacyMode ? '#f8dddd' : '#e5f1e6',
        border: `2px solid ${privacyMode ? '#b83d35' : '#6a9b70'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div>
          <strong style={{
            color: privacyMode ? '#a52e28' : '#287b45'
          }}>
            {privacyMode ? '🔒 PRIVACY MODE ON' : '🟢 PRIVACY MODE OFF'}
          </strong>

          <p style={{ margin: '6px 0 0', fontSize: '13px' }}>
            {privacyMode
              ? 'Camera and voice listening are disabled.'
              : 'Camera and voice listening are available.'}
          </p>
        </div>

        <button
          onClick={togglePrivacy}
          style={{
            padding: '12px 20px',
            background: privacyMode ? '#287b45' : '#a34b3e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {privacyMode ? 'Turn Privacy OFF' : 'Turn Privacy ON'}
        </button>
      </div>

      {/* Tracking Status */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setTracking(!tracking)}
          disabled={privacyMode}
          style={{
            padding: '12px 22px',
            background: tracking ? '#a34b3e' : '#a66b32',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: privacyMode ? 'not-allowed' : 'pointer',
            opacity: privacyMode ? 0.5 : 1,
            fontWeight: 'bold'
          }}
        >
          {tracking ? 'Stop Simulated Tracking' : 'Start Simulated Tracking'}
        </button>

        <span style={{ fontWeight: 'bold', color: '#287b45' }}>
          {privacyMode
            ? '● Tracking disabled'
            : detectedPersonAngle !== null
              ? '● AI detecting person'
              : tracking
                ? '● Simulated tracking'
                : '● Manual mode'}
        </span>
      </div>

      {/* Head Controls */}
      <div style={{
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        <div>
          <label>Head rotation: {Math.round(currentPanAngle)}°</label>
          <br />
          <input
            type="range"
            min="-60"
            max="60"
            value={currentPanAngle}
            disabled={tracking || detectedPersonAngle !== null || privacyMode}
            onChange={(e) => setPanAngle(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Head tilt: {tiltAngle}°</label>
          <br />
          <input
            type="range"
            min="-30"
            max="30"
            value={tiltAngle}
            onChange={(e) => setTiltAngle(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Robot and Simulated Camera */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        <div>
          <h2>3D Piko Robot</h2>

          <div style={{
            width: '100%',
            height: '550px',
            background: '#e5dfd4',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <Canvas camera={{ position: [0, 3, 7], fov: 40 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[5, 8, 5]} intensity={2} />

              <PikoRobot
                panAngle={(currentPanAngle * Math.PI) / 180}
                tiltAngle={(tiltAngle * Math.PI) / 180}
              />

              <gridHelper args={[12, 24, '#999999', '#cccccc']} />

              <OrbitControls
                target={[0, 1.3, 0]}
                enablePan={false}
                minDistance={4}
                maxDistance={10}
              />
            </Canvas>
          </div>
        </div>

        <div>
          <h2>Camera Vision</h2>

          <CameraView
            panAngle={currentPanAngle}
            tiltAngle={tiltAngle}
            personPosition={personPosition}
            isPrivate={privacyMode}
          />
        </div>
      </div>

      {/* Live Webcam AI Detection */}
      <WebcamDetection
        isPrivate={privacyMode}
        onPersonDetected={handlePersonDetected}
      />

      <VoiceAssistant isPrivate={privacyMode} />

      <MedicineReminder />

      <HealthCheckIn />

    </div>
  )
}

export default App
