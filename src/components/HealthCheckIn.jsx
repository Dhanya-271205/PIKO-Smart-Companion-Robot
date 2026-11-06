
import { useState } from 'react'

function HealthCheckIn() {
  const [sleep, setSleep] = useState('')
  const [mood, setMood] = useState('')
  const [pain, setPain] = useState('')
  const [feeling, setFeeling] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submitCheckIn() {
    if (!sleep || !mood || !pain || !feeling.trim()) {
      alert('Please answer all the questions before submitting.')
      return
    }

    setSubmitted(true)
  }

  function resetCheckIn() {
    setSleep('')
    setMood('')
    setPain('')
    setFeeling('')
    setSubmitted(false)
  }

  const sectionStyle = {
    marginBottom: '20px'
  }

  const optionStyle = {
    padding: '10px',
    margin: '5px',
    borderRadius: '8px',
    border: '1px solid #cbbba5',
    background: '#f3eee5',
    cursor: 'pointer'
  }

  return (
    <div style={{
      background: '#fffaf2',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #dfd1bd',
      marginTop: '24px'
    }}>

      <h2 style={{ color: '#594735' }}>
        ❤️ Daily Health Check-in
      </h2>

      <p style={{ color: '#71695e' }}>
        Piko wants to know how you are doing today.
      </p>

      {!submitted ? (
        <>
          <div style={sectionStyle}>
            <h3>1. How did you sleep last night?</h3>

            {['Very well', 'Okay', 'Not well', 'Hardly slept'].map(option => (
              <button
                key={option}
                onClick={() => setSleep(option)}
                style={{
                  ...optionStyle,
                  background: sleep === option ? '#a66b32' : '#f3eee5',
                  color: sleep === option ? 'white' : '#594735'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3>2. How are you feeling emotionally?</h3>

            {['Happy', 'Calm', 'Okay', 'Sad', 'Anxious'].map(option => (
              <button
                key={option}
                onClick={() => setMood(option)}
                style={{
                  ...optionStyle,
                  background: mood === option ? '#a66b32' : '#f3eee5',
                  color: mood === option ? 'white' : '#594735'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3>3. Are you experiencing any pain?</h3>

            {['No pain', 'Mild pain', 'Moderate pain', 'Severe pain'].map(option => (
              <button
                key={option}
                onClick={() => setPain(option)}
                style={{
                  ...optionStyle,
                  background: pain === option ? '#a66b32' : '#f3eee5',
                  color: pain === option ? 'white' : '#594735'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3>4. Anything else you want to tell Piko?</h3>

            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="Tell Piko how you are feeling..."
              rows="3"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbbba5',
                boxSizing: 'border-box',
                fontFamily: 'Arial'
              }}
            />
          </div>

          <button
            onClick={submitCheckIn}
            style={{
              padding: '12px 24px',
              background: '#a66b32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Submit Daily Check-in
          </button>
        </>
      ) : (
        <div style={{
          padding: '20px',
          background: '#f3eee5',
          borderRadius: '12px'
        }}>
          <h3>Thank you for checking in! ❤️</h3>

          <p><strong>Sleep:</strong> {sleep}</p>
          <p><strong>Mood:</strong> {mood}</p>
          <p><strong>Pain:</strong> {pain}</p>
          <p><strong>Additional notes:</strong> {feeling}</p>

          <p style={{ color: '#287b45', fontWeight: 'bold' }}>
            Piko has recorded your check-in for this session.
          </p>

          <button
            onClick={resetCheckIn}
            style={{
              padding: '10px 20px',
              background: '#a66b32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Start New Check-in
          </button>
        </div>
      )}

    </div>
  )
}

export default HealthCheckIn
