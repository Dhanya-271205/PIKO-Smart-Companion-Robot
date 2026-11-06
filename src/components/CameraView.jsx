
function CameraView({ panAngle = 0, tiltAngle = 0, personPosition = 0 }) {
  return (
    <div style={{
      width: '100%',
      height: '300px',
      background: '#dce6df',
      borderRadius: '14px',
      overflow: 'hidden',
      position: 'relative',
      border: '3px solid #b7a991'
    }}>

      {/* Living room scene */}
      <div style={{
        position: 'absolute',
        inset: '-15px',
        transform: `translate(${-panAngle * 1.5}px, ${tiltAngle * 1.2}px) scale(1.08)`,
        transition: 'transform 0.25s ease'
      }}>

        {/* Floor */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '35%',
          background: '#b9a58b'
        }} />

        {/* Window */}
        <div style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          width: '110px',
          height: '100px',
          background: '#a8d5e5',
          border: '7px solid #f5f0e8'
        }}>
          <div style={{
            width: '4px',
            height: '100%',
            background: '#f5f0e8',
            margin: 'auto'
          }} />
        </div>

        {/* Sofa */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '25px',
          width: '150px',
          height: '75px',
          background: '#8b9c91',
          borderRadius: '18px 18px 8px 8px'
        }} />

        {/* Moving person */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: `${50 + personPosition}%`,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'left 0.25s ease'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#d6a17c'
          }} />

          <div style={{
            width: '75px',
            height: '105px',
            background: '#647f9a',
            borderRadius: '25px 25px 5px 5px'
          }} />
        </div>
      </div>

      {/* Camera status */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: '#ffffffdd',
        padding: '7px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#287b45'
      }}>
        ● CAMERA PREVIEW
      </div>

      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '12px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: '1px 1px 3px black'
      }}>
        PIKO VISION
      </div>
    </div>
  )
}

export default CameraView
