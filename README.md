
# Australian Sign Language Recognition Web App  

This repository contains a web application designed to recognize and interpret Australian Sign Language (Auslan) fingerspelling. It uses ML/AI and a lightweight approach to computer vision enable seamless, browser-based recognition without the need for a server or backend GPU.  

---

## Features  

### 1. **Real Time Auslan Fingerspelling Recognition**  
- Recognizes individual letters of Auslan fingerspelling in real time. 
- **Technologies Used**:  
  - **Google's Mediapipe**: For accurate hand landmark detection.  
  - **TensorFlow.js**: Lightweight custom model for classification, enabling in-browser machine learning.  
- **Performance**: The lightweight model ensures fast and efficient recognition directly in the user's browser, making the system highly accessible.  

### 2. **Auslan Dictionary**  
- Provides an interactive dictionary of Auslan signs.  
- **Automated ETL Pipeline**:  
  - Data is sourced, vectorized, and indexed automatically from an open-source dataset and saved into AWS S3 for storage.
  - AWS Lambda powers a serverless query function for efficient and scalable data retrieval.  
  - LanceDB is utilized as a vector database for indexing and querying Auslan dictionary data. Operating directly on top of AWS S3 to significantly reduce costs and easy maintenance. 

---

## Technology Stack  

### Frontend  
- **Framework**: [Next.js](https://nextjs.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  

### Machine Learning  
- **Hand Tracking**: [Mediapipe](https://mediapipe.dev/)  
- **Model Development**: Custom TensorFlow.js model for recognizing fingerspelling.  

### Backend (Serverless Architecture)  
- **ETL Pipeline**:  
  - AWS Lambda for automated data extraction, transformation, and loading.  
- **Dictionary Data**: Indexed and stored for fast, queryable access.  

---

## Installation and Setup  

### Prerequisites  
1. **Node.js**: Ensure Node.js is installed on your system.  
2. **npm or yarn**: Package manager to install dependencies.  

### Steps to Run Locally  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/victorwkb/auslan.git  
   cd auslanapp
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm run dev  
   ```  
4. Open your browser and navigate to `http://localhost:3000`.  

---

## Deployment  

This app is optimized for deployment on platforms like Vercel or AWS Amplify. It leverages a serverless architecture for scalability and cost efficiency.  

---

## Future Improvements  

- Expand recognition capabilities to include full-word gestures and phrases.  
- Add more Auslan dictionary features, such as video demonstrations for signs.  
- Enhance the Auslan Fingerspelling Quiz with levels and graphics.

---

## Acknowledgments  

- **Google Mediapipe** for providing robust hand tracking capabilities.  
- **TensorFlow.js** for making in-browser machine learning possible.  
- The Australian Sign Language community for inspiring this project.  

Feel free to share feedback and suggestions by opening an issue or reaching out.  
