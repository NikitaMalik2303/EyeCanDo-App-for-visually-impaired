import CheckAuth from '@/components/constants/CheckAuth';
import HomePage from '@/components/home/HomePage';

export default function HomeScreen() {
  return (
    <>
    <CheckAuth isPublic />
    <HomePage />
    </>
  );
}
