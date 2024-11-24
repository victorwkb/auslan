# Australian Sign Language Recognition Web App

This project is a web application that uses machine learning to recognize and interpret Australian Sign Language (Auslan) fingerspelling gestures. The current version is limited to recognizing individual letters and does not yet support full-word gestures or phrases.

## Features

- **Real-Time Fingerspelling Recognition**: Recognizes Auslan fingerspelling in real-time using machine learning models.
- **Hand Tracking with MediaPipe**: Uses Google MediaPipe for accurate hand landmark tracking to improve gesture recognition.
- **In-Browser Machine Learning**: Runs the recognition model directly in the user's browser using TensorFlow.js.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, TensorFlow.js (for in-browser model inference), MediaPipe (for hand tracking)
- **Other**: WebRTC (for video input), OpenCV (for image processing)

### Prerequisites

- Node.js (if using additional frontend libraries like React)
- Required libraries: TensorFlow.js, MediaPipe, OpenCV.js, 

