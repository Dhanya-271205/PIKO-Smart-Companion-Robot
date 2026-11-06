# PIKO Electronics

This folder contains the electronics simulation source files for the PIKO project.

## ESP32

- `ESP32/sketch.ino`: ESP32 firmware for PIR motion monitoring, MPU6050 readings, Wi-Fi connection, and an HTTP POST attempt to the local PIKO backend.
- `ESP32/libraries.txt`: Wokwi library dependencies.

Wiring used:
- PIR OUT -> GPIO 27; VCC -> 3V3; GND -> GND
- MPU6050 SDA -> GPIO 21; SCL -> GPIO 22; VCC -> 3V3; GND -> GND

The Wokwi ESP32 project is available at:
https://wokwi.com/projects/479960012229183489

**Integration note:** Wi-Fi connection was tested successfully. Live ESP32-to-laptop HTTP delivery was not yet confirmed; the firmware currently uses `host.wokwi.internal`, which requires a supported Wokwi host-gateway/tunnel setup.

## Arduino Uno

- `Arduino_Uno/sketch.ino`: Uno controller code for pan/tilt servos, privacy button and LEDs, buzzer, and HC-SR04 distance sensing.

Pin mapping:
- Pan servo signal -> D9
- Tilt servo signal -> D10
- Privacy button -> D2 and GND (INPUT_PULLUP)
- Green LED -> D4 through 220 ohm resistor
- Red LED -> D5 through 220 ohm resistor
- Buzzer -> D6
- HC-SR04 TRIG -> D7; ECHO -> D8; VCC -> 5V; GND -> GND

The Wokwi Arduino Uno project is available at:
https://wokwi.com/projects/479768662664094721

## Important

The Arduino Uno sketch is reconstructed from the documented pin map and tested behaviours from the project work. Compare it with the exact Wokwi project sketch before treating it as a byte-for-byte copy of the original.
