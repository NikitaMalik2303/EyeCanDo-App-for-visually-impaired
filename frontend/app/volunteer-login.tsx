import CheckAuth from "@/components/constants/CheckAuth";
import VolunteerLoginPage from "@/components/home/VolunteerLoginPage";

export default function VolunteerLoginScreen() {
  return (
    <>
    <CheckAuth isPublic />
    <VolunteerLoginPage/>
    </>
  );
}
