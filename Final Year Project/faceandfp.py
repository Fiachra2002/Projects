import face_recognition
import cv2
import os
import RPi.GPIO as GPIO
import time
import threading

# GPIO setup
LOCK_PIN = 26  # solenoid lock control pin
FINGERPRINT_PIN = 16  # GPIO input from Arduino fingerprint match signal
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(LOCK_PIN, GPIO.OUT)
GPIO.setup(FINGERPRINT_PIN, GPIO.IN)
GPIO.output(LOCK_PIN, GPIO.LOW)

# Load known face encodings
def load_known_faces():
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir('images'):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join('images', filename)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if encodings:
                known_face_encodings.append(encodings[0])
                known_face_names.append(os.path.splitext(filename)[0])
            else:
                print(f"Warning: No face found in {filename}. Skipping.")

    return known_face_encodings, known_face_names

# Wait for fingerprint for up to 15 seconds
def wait_for_fingerprint(timeout=15):
    print(" Awaiting fingerprint via GPIO 16...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if GPIO.input(FINGERPRINT_PIN) == GPIO.HIGH:
            print("\n Fingerprint signal received!")
            return True
        time.sleep(0.1)
    print("\n Fingerprint not detected in time.")
    return False

# Unlock solenoid for 5 seconds
def unlock():
    print(" Unlocking solenoid lock for 5 seconds")
    GPIO.output(LOCK_PIN, GPIO.HIGH)
    time.sleep(5)
    GPIO.output(LOCK_PIN, GPIO.LOW)
    print(" Lock re-engaged")

# Setup
known_face_encodings, known_face_names = load_known_faces()
video_capture = cv2.VideoCapture(0)
video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
video_capture.set(cv2.CAP_PROP_FPS, 15)

if not video_capture.isOpened():
    print("Error: Could not access webcam.")
    exit()

print("System ready. Press 'q' to quit.")
frame_count = 0
waiting = False

while True:
    ret, frame = video_capture.read()
    if not ret:
        print("Error: Could not read frame.")
        break

    frame_count += 1
    if frame_count % 3 != 0:
        continue

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame, model='hog')
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    if not face_encodings:
        print(" No face found.")

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        if True in matches and not waiting:
            match_index = matches.index(True)
            name = known_face_names[match_index]
            print(f" Face recognized: {name}")
            waiting = True

            def fingerprint_and_unlock():
                if wait_for_fingerprint():
                    print(" Access granted!")
                    unlock()
                else:
                    print(" Access denied (no valid fingerprint).")
                nonlocal waiting
                waiting = False

            threading.Thread(target=fingerprint_and_unlock).start()
        elif True in matches:
            print(" Already processing fingerprint, please wait...")
        else:
            print(" Face not recognized.")

        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.imshow('Facial Recognition', frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

# Cleanup
GPIO.output(LOCK_PIN, GPIO.LOW)
video_capture.release()
cv2.destroyAllWindows()
GPIO.cleanup()
