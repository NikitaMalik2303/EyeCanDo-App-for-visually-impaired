# Manipal Hackathon 2024 README Template

**Team Name:** PSYDUCK

**Problem Statement:** R1 - Enhancing Object Recognition for the Visually Impaired (SDG-3)

## 📜 Introduction

Our project, "Eye Can Do," empowers visually impaired individuals by offering real-time assistance in recognizing objects, people, and places. Using advanced technologies like YOLO v3 for object recognition and a custom-trained face recognition model, we aim to provide seamless accessibility through voice commands and offline functionality.

## ✨ Features

### App:

- **Indoor Mode**: 
  - Real-time face recognition using a custom-trained model.
  - Less inference time (<0.6 sec) without any pre-training.
  - Uses Face Recognition library with K Nearest Neighbors for recognition.
  
- **Outdoor Mode**:
  - Real-time object recognition powered by YOLO v3.
  - Scene awareness helps users understand surroundings by identifying objects.
  
- **Street Mode**:
  - Depth estimation to detect obstacles and give information about direction and distance.
  - Uses Depth Anything model for relative depth estimation.
  
- **Voice Navigation**:
  - Control the app with simple voice commands, activating key features like object recognition, facial recognition, and obstacle estimation.
  - Real-time feedback and confirmation via voice.
  
- **Location Identification**:
  - Provides real-time information about the user’s current location.
  
- **Fall Detection**:
  - Automatically sends SMS notifications to emergency contacts when a fall is detected using accelerometer data.
  
- **Step Count**:
  - Displays step count on the app's dashboard, helping users monitor daily activity.
  
- **Assistive Video Calling**:
  - Utilizes FaceTime for high-quality video communication with volunteers.
  - Instant video calls for emergency assistance.
  
- **Community Features**:
  - Curated list of accessible venues and services, allowing users to rate based on accessibility.
  - Separate profile for volunteers to provide assistance in emergencies.

## 🟢 Access

#### 📱 To access the app:

1. Download the Expo Go app on your mobile device:
    - **Android**: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    - **iPhone**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Open the Expo Go app and scan the QR code to access the app:
    - **Android**: Use the QR code scanner in the Expo Go app.
    - **iPhone**: Scan the QR code using the camera app.
    
![QR Code](https://i.postimg.cc/76VzsXkc/image.png)
    
3. If step 2 didnt work, Open any browser in your mobile phone and paste the link below in your browser.
    - ```exp://165.22.214.104:8081```

## 📦 Instructions For Local Deployment With Docker (Optional)

To deploy the application locally using docker, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/ManipalHackathon2024/Psyduck.git
    cd Psyduck
    ```

## TODO
1. Build the docker image

    ```bash
    sudo docker build -t hackathon .
    ```

1. Start a container using the built image and expose necessary ports

    ```bash
    sudo docker run -it --rm -p 3000:3000 hackathon
    ```

1. Access the application at http://localhost:3000

## ⚙️ Instructions For Local Deployment Without Docker

```
Python version: 3.10

Operating system: Ubuntu 22
```

Follow these steps to run the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-team-repo/manipal-hackathon-2024.git
    cd manipal-hackathon-2024
    ```

1. Install dependencies

    ```bash
    npm install
    ```

1. Start server

    ```bash
    npm run start
    ```

1. Access the application at http://localhost:3000
