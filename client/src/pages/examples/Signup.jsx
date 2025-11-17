import Signup from '../Signup';
import { AuthProvider } from '@/context/AuthContext';

export default function SignupExample() {
  return (
    <AuthProvider>
      <Signup />
    </AuthProvider>
  );
}
