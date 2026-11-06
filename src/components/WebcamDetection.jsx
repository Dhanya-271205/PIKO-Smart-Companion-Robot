
import { useEffect, useRef, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-webgl'

function WebcamDetection({ isPrivate = false, onPersonDetected }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [status, setStatus] = useState('Camera not started')
  const [fallAlert, setFallAlert] = useState(false)

  useEffect(() => {
    let stream = null
    let model = null
    let active = true
    let timeoutId = null
    let detecting = false

    // Fall detection tracking variables
    let previousBox = null
    let standingHeight = null
    let possibleFallFrames = 0
    let suddenMovementDetected = false

    async function startCamera() {
      if (isPrivate) {
        setStatus('🔒 Privacy Mode ON — Camera disabled')
        setFallAlert(false)
        onPersonDetected?.(null)
        return
      }

      try {
        setFallAlert(false)
        setStatus('Starting camera...')

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })

        if (!active) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        videoRef.current.srcObject = stream
        await videoRef.current.play()

        setStatus('Loading AI detection model...')

        const tf = await import('@tensorflow/tfjs')
        await tf.setBackend('webgl')
        await tf.ready()

        model = await cocoSsd.load()

        if (!active) return

        setStatus('Camera live — person and fall monitoring active')

        async function detect() {
          if (!active || !videoRef.current || !model || detecting) {
            return
          }

          const video = videoRef.current

          if (video.readyState >= 2) {
            detecting = true

            try {
              const predictions = await model.detect(video)

              if (!active) return

              const canvas = canvasRef.current
              if (!canvas) return

              const context = canvas.getContext('2d')

              canvas.width = video.videoWidth
              canvas.height = video.videoHeight

              context.clearRect(0, 0, canvas.width, canvas.height)

              const people = predictions.filter(
                prediction => prediction.class === 'person'
              )

              let possibleFall = false

              if (people.length > 0) {
                const person = people.reduce((best, current) =>
                  current.score > best.score ? current : best
                )

                const [x, y, width, height] = person.bbox

                const centerX = x + width / 2
                const centerY = y + height / 2

                const normalizedCenterY = centerY / video.videoHeight
                const normalizedHeight = height / video.videoHeight
                const aspectRatio = width / Math.max(height, 1)

                // Keep automatic head tracking
                const angle = ((centerX / video.videoWidth) - 0.5) * 100
                onPersonDetected?.(angle)

                // Draw person detection boxes
                people.forEach(person => {
                  const [px, py, pw, ph] = person.bbox

                  context.strokeStyle = '#00ff88'
                  context.lineWidth = 3
                  context.strokeRect(px, py, pw, ph)

                  context.fillStyle = '#00ff88'
                  context.font = '18px Arial'

                  context.fillText(
                    `Person ${Math.round(person.score * 100)}%`,
                    px,
                    py > 20 ? py - 8 : 20
                  )
                })

                if (person.score > 0.6) {
                  // Establish a baseline from an upright position
                  if (aspectRatio < 0.95 && standingHeight === null) {
                    standingHeight = normalizedHeight
                  }

                  // Detect a sudden change from the previous frame
                  if (previousBox !== null) {
                    const verticalMovement = Math.abs(
                      normalizedCenterY - previousBox.centerY
                    )

                    const heightReduction =
                      previousBox.height > 0
                        ? (previousBox.height - normalizedHeight) /
                          previousBox.height
                        : 0

                    if (
                      verticalMovement > 0.07 ||
                      heightReduction > 0.25
                    ) {
                      suddenMovementDetected = true
                    }
                  }

                  // A wide bounding box can indicate a horizontal posture
                  const horizontalPosition =
                    aspectRatio > 1.15 &&
                    normalizedCenterY > 0.4

                  // A substantial height reduction from the standing baseline
                  const heightChanged =
                    standingHeight !== null &&
                    normalizedHeight < standingHeight * 0.7

                  // Combine posture and movement evidence
                  possibleFall =
                    horizontalPosition &&
                    (suddenMovementDetected || heightChanged)

                  // Remember the previous position
                  previousBox = {
                    centerY: normalizedCenterY,
                    height: normalizedHeight
                  }

                  // Update standing baseline only while upright
                  if (aspectRatio < 0.95 && !suddenMovementDetected) {
                    standingHeight =
                      standingHeight === null
                        ? normalizedHeight
                        : standingHeight * 0.9 +
                          normalizedHeight * 0.1
                  }
                }

              } else {
                onPersonDetected?.(null)
                previousBox = null
                possibleFall = false
              }

              // Require sustained possible-fall detection
              if (possibleFall) {
                possibleFallFrames += 1
              } else {
                possibleFallFrames = Math.max(
                  0,
                  possibleFallFrames - 1
                )
              }

              // Trigger and retain the alert until acknowledged
              if (possibleFallFrames >= 8) {
                setFallAlert(true)
              }

            } catch (error) {
              if (active) {
                console.error('Detection error:', error)
              }
            } finally {
              detecting = false
            }
          }

          if (active) {
            timeoutId = setTimeout(detect, 200)
          }
        }

        detect()

      } catch (error) {
        console.error('Camera error:', error)

        if (active) {
          setStatus('Camera error: ' + error.message)
        }
      }
    }

    startCamera()

    return () => {
      active = false
      clearTimeout(timeoutId)

      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }

      onPersonDetected?.(null)
    }
  }, [isPrivate, onPersonDetected])

  return (
    <div style={{
      background: '#fffaf2',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #dfd1bd',
      marginTop: '24px'
    }}>
      <h2 style={{ color: '#594735' }}>Piko Live Camera</h2>

      <p>{status}</p>

      {!isPrivate && (
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '640px'
        }}>
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            style={{
              width: '100%',
              borderRadius: '12px',
              display: 'block'
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {fallAlert && !isPrivate && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: '#ffe1e1',
          border: '3px solid #d00000',
          borderRadius: '12px',
          color: '#a00000'
        }}>
          <h2>🚨 POSSIBLE FALL DETECTED!</h2>

          <p>
            Piko has detected a possible fall.
            Please check on the person immediately.
          </p>

          <button
            onClick={() => {
              setFallAlert(false)
              possibleFallFrames = 0
              suddenMovementDetected = false
            }}
            style={{
              padding: '10px 18px',
              background: '#b00000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Acknowledge Alert
          </button>
        </div>
      )}

      {isPrivate && <p>🔒 Camera disabled.</p>}
    </div>
  )
}

export default WebcamDetection
