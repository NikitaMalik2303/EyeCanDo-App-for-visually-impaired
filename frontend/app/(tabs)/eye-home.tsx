import EyePage from "@/components/eye/EyePage";

export default function EyeScreen() {
  return (
    <EyePage
      send_channel="video_frame"
      receive_channel="face_recognition_result"
      bottomSheetTitle="Person detected"
    />
  );
}
