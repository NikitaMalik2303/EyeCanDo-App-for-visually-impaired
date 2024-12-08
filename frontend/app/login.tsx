import CheckAuth from "@/components/constants/CheckAuth";
import LoginPage from "@/components/home/LoginPage";

export default function LoginScreen() {
  return (
    <>
      <CheckAuth isPublic />
      <LoginPage />
    </>
  );
}
