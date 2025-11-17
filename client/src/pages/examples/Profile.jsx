import Profile from '../Profile';
import { AuthProvider } from '@/context/AuthContext';

export default function ProfileExample() {
  return (
    <AuthProvider>
      <div className="p-8">
        <Profile />
      </div>
    </AuthProvider>
  );
}
