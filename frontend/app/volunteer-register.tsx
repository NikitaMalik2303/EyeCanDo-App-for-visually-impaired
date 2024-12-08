import CheckAuth from "@/components/constants/CheckAuth";
import VolunteerRegisterPage from "@/components/home/VolunteerRegisterPage";

export default function RegisterScreen() {
  return (
    <>
    <CheckAuth isPublic />
    <VolunteerRegisterPage />
    </>
  );
}
