
import { useState, useEffect } from 'react'

function MedicineReminder() {
  const [medicine, setMedicine] = useState('')
  const [time, setTime] = useState('')
  const [reminders, setReminders] = useState([])
  const [alertMessage, setAlertMessage] = useState('')

  // Check whether a medicine reminder is due
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      setReminders((previous) =>
        previous.map((item) => {
          if (item.time === currentTime && !item.alerted) {
            setAlertMessage(`It's time to take ${item.name}!`)

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Piko Medicine Reminder', {
                body: `It's time to take ${item.name}!`
              })
            }

            return { ...item, alerted: true }
          }

          return item
        })
      )
    }

    const timer = setInterval(checkReminders, 1000)

    return () => clearInterval(timer)
  }, [])

  function addReminder() {
    if (!medicine.trim() || !time) {
      setAlertMessage('Please enter a medicine name and time.')
      return
    }

    setReminders((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: medicine.trim(),
        time,
        alerted: false
      }
    ])

    setMedicine('')
    setTime('')
    setAlertMessage('Medicine reminder added successfully!')

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  function deleteReminder(id) {
    setReminders((previous) =>
      previous.filter((item) => item.id !== id)
    )
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
        💊 Medicine Reminders
      </h2>

      <p style={{ color: '#71695e' }}>
        Piko will help you remember your medicines.
      </p>

      {/* Medicine name */}
      <div style={{ marginBottom: '16px' }}>
        <label>Medicine name</label>
        <br />
        <input
          type="text"
          placeholder="Enter medicine name"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          style={{
            padding: '12px',
            width: '100%',
            maxWidth: '350px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1px solid #cbbba5'
          }}
        />
      </div>

      {/* Reminder time */}
      <div style={{ marginBottom: '18px' }}>
        <label>Reminder time</label>
        <br />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            padding: '12px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1px solid #cbbba5'
          }}
        />
      </div>

      {/* Add reminder */}
      <button
        onClick={addReminder}
        style={{
          padding: '12px 22px',
          background: '#a66b32',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        + Add Reminder
      </button>

      {/* Status message */}
      {alertMessage && (
        <p style={{
          color: '#287b45',
          fontWeight: 'bold',
          marginTop: '16px'
        }}>
          {alertMessage}
        </p>
      )}

      {/* Reminder list */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#594735' }}>
          Your Scheduled Medicines
        </h3>

        {reminders.length === 0 ? (
          <p>No reminders added yet.</p>
        ) : (
          reminders.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: '#f3eee5',
                borderRadius: '10px',
                marginTop: '10px'
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: '5px 0 0' }}>
                  ⏰ {item.time}
                  {item.alerted ? ' — Reminder sent' : ''}
                </p>
              </div>

              <button
                onClick={() => deleteReminder(item.id)}
                style={{
                  background: '#a34b3e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default MedicineReminder
