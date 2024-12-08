import CheckAuth from "@/components/constants/CheckAuth";
import RegisterPage from "@/components/home/RegisterPage";

export default function RegisterScreen() {
  return (
    <>
    <CheckAuth isPublic />
    <RegisterPage />
    </>
  );
}
