#include <Servo.h>

Servo panServo;
Servo tiltServo;

const int PAN_SERVO_PIN = 9;
const int TILT_SERVO_PIN = 10;
const int PRIVACY_BUTTON_PIN = 2;
const int GREEN_LED_PIN = 4;
const int RED_LED_PIN = 5;
const int BUZZER_PIN = 6;
const int TRIG_PIN = 7;
const int ECHO_PIN = 8;

const int scanPositions[] = {45, 90, 135, 90};
const int scanCount = sizeof(scanPositions) / sizeof(scanPositions[0]);

bool privacyMode = false;
bool lastButtonReading = HIGH;
bool stableButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

unsigned long lastScanTime = 0;
unsigned long lastProximityBeep = 0;
int scanIndex = 0;
int currentPanAngle = 90;
const unsigned long scanInterval = 700;
const unsigned long proximityBeepInterval = 2000;

long readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    return -1;
  }
  return (long)(duration * 0.0343 / 2.0);
}

void setPrivacyMode(bool enabled) {
  privacyMode = enabled;

  if (privacyMode) {
    panServo.write(90);
    tiltServo.write(90);
    currentPanAngle = 90;
    digitalWrite(RED_LED_PIN, HIGH);
    digitalWrite(GREEN_LED_PIN, LOW);
    tone(BUZZER_PIN, 1200, 180);
    Serial.println("PRIVACY MODE: ON");
  } else {
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(GREEN_LED_PIN, HIGH);
    tone(BUZZER_PIN, 1800, 120);
    Serial.println("PRIVACY MODE: OFF");
  }
}

void setup() {
  Serial.begin(9600);

  panServo.attach(PAN_SERVO_PIN);
  tiltServo.attach(TILT_SERVO_PIN);

  pinMode(PRIVACY_BUTTON_PIN, INPUT_PULLUP);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  panServo.write(90);
  tiltServo.write(90);
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, LOW);

  Serial.println("PIKO ARDUINO CONTROLLER READY");
  Serial.println("Privacy mode: OFF");
}

void loop() {
  int buttonReading = digitalRead(PRIVACY_BUTTON_PIN);

  if (buttonReading != lastButtonReading) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (buttonReading != stableButtonState) {
      stableButtonState = buttonReading;
      if (stableButtonState == LOW) {
        setPrivacyMode(!privacyMode);
      }
    }
  }
  lastButtonReading = buttonReading;

  if (privacyMode) {
    delay(10);
    return;
  }

  if (millis() - lastScanTime >= scanInterval) {
    lastScanTime = millis();
    currentPanAngle = scanPositions[scanIndex];
    panServo.write(currentPanAngle);
    tiltServo.write(90);
    scanIndex = (scanIndex + 1) % scanCount;
  }

  long distance = readDistanceCm();

  if (distance > 0 && distance <= 50) {
    if (millis() - lastProximityBeep >= proximityBeepInterval) {
      lastProximityBeep = millis();
      tone(BUZZER_PIN, 1000, 150);
      Serial.print("OBSTACLE DETECTED: ");
      Serial.print(distance);
      Serial.println(" cm");
    }
  }

  delay(30);
}
