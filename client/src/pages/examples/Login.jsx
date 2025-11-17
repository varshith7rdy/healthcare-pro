import Login from '../Login';
import { AuthProvider } from '@/context/AuthContext';

export default function LoginExample() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
