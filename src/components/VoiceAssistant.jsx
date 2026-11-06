
import { useState, useEffect, useRef } from 'react'

function VoiceAssistant({ isPrivate = false }) {
  const [listening, setListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const [response, setResponse] = useState(
    "Hello! I'm Piko. How can I help you?"
  )

  const recognitionRef = useRef(null)

  useEffect(() => {
    if (isPrivate) {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }

      window.speechSynthesis.cancel()
      setListening(false)
      setSpokenText('')
      setResponse('Privacy Mode is ON. Piko cannot listen or speak.')
    } else {
      setResponse("Hello! I'm Piko. How can I help you?")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
      window.speechSynthesis.cancel()
    }
  }, [isPrivate])

  function speak(message) {
    if (isPrivate) return

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(message)
    speech.lang = 'en-IN'
    speech.rate = 0.9

    window.speechSynthesis.speak(speech)
    setResponse(message)
  }

  function startListening() {
    if (isPrivate || listening) return

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      speak('Sorry, please try using Google Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
      setSpokenText('Listening...')
    }

    recognition.onresult = (event) => {
      if (isPrivate) return

      const text = event.results[0][0].transcript
      setSpokenText(text)

      const command = text.toLowerCase()

      if (
        command.includes('hello') ||
        command.includes('hey piko') ||
        command.includes('hi piko')
      ) {
        speak("Hello! I'm Piko. It is lovely to hear from you.")
      } else if (
        command.includes('doing good') ||
        command.includes('doing well') ||
        command.includes("i'm good") ||
        command.includes('feeling good') ||
        command.includes('i am fine') ||
        command.includes('i am good')
      ) {
        speak("That is wonderful to hear! I hope you have a lovely day. Remember, I'm always here if you need me.")
      } else if (command.includes('how are you')) {
        speak("I'm doing great! How are you feeling today?")
      } else if (
        command.includes('medicine') ||
        command.includes('reminder')
      ) {
        speak('Of course! Remember to take your medicine on time.')
      } else if (command.includes('thank you')) {
        speak("You're very welcome! I'm always here to help.")
      } else if (command.includes('good morning')) {
        speak('Good morning! I hope you have a wonderful day.')
      } else if (command.includes('good night')) {
        speak('Good night! Sleep well and take care.')
      } else if (
        command.includes('sad') ||
        command.includes('not feeling good') ||
        command.includes('feeling low')
      ) {
        speak("I'm sorry to hear that. Would you like to talk about it? I'm here to listen.")
      } else {
        speak('I heard you. Could you please tell me a little more?')
      }
    }

    recognition.onerror = (event) => {
      if (!isPrivate) {
        setSpokenText('Could not recognise speech: ' + event.error)
      }
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (error) {
      setListening(false)
      setSpokenText('Could not start microphone.')
    }
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
        Piko Voice Assistant
      </h2>

      <p style={{ color: '#71695e' }}>
        {isPrivate
          ? '🔒 Privacy Mode is ON. Microphone and voice responses are disabled.'
          : 'Talk to Piko using your microphone.'}
      </p>

      <button
        onClick={startListening}
        disabled={listening || isPrivate}
        style={{
          padding: '14px 24px',
          background: isPrivate
            ? '#999999'
            : listening
              ? '#718b76'
              : '#a66b32',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: isPrivate || listening ? 'not-allowed' : 'pointer'
        }}
      >
        {isPrivate
          ? '🔒 Privacy Mode Enabled'
          : listening
            ? '🎙️ Listening...'
            : '🎤 Talk to Piko'}
      </button>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f3eee5',
        borderRadius: '10px'
      }}>
        <strong>You said:</strong>
        <p>{spokenText || 'Nothing spoken yet.'}</p>

        <strong>Piko says:</strong>
        <p>{response}</p>
      </div>

    </div>
  )
}

export default VoiceAssistant
