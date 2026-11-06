
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let sensorData = {
  motion: false,
  acceleration: 9.81,
  rotation: 0,
  temperature: 24,
  wifi: false,
  lastUpdated: null
};

app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

app.post('/api/sensors', (req, res) => {
  sensorData = {
    ...sensorData,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };

  console.log('Piko sensor update:', sensorData);

  res.json({
    success: true,
    message: 'Sensor data received'
  });
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Piko server running on port 3001');
});
