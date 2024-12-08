import speech_recognition as sr

# Initialize the recognizer
r = sr.Recognizer()

while True:
    try:
        # Use the microphone as the audio source
        with sr.Microphone() as source2:
            # Adjust for ambient noise (using the Recognizer object 'r')
            r.adjust_for_ambient_noise(source2, duration=0.2)
            print("Listening...")

            # Listen to the audio input
            audio2 = r.listen(source2)

            # Convert speech to text using Google's speech recognition
            MyText = r.recognize_google(audio2)
            MyText = MyText.lower()

            # Print the recognized text
            print(f"Recognized Text: {MyText}")
            
    except sr.UnknownValueError:
        print("Could not understand audio")

    except Exception as e:
        print(f"Error: {e}")
