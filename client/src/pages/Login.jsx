import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';
import healthcareImage from '@assets/generated_images/Healthcare_consultation_with_technology_190ad608.png';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.login({ email, password });
      // login(response.data);
      
      // Mock login for demo
      setTimeout(() => {
        login({
          id: '1',
          name: 'John Doe',
          email: email,
          token: 'mock-token-123',
        });
        toast({
          title: 'Login successful',
          description: 'Welcome back to Patient Hub!',
        });
        setLocation('/dashboard');
      }, 1000);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Please check your credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl font-semibold">Patient Hub</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to access your health dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <a
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                  data-testid="link-signup"
                >
                  Sign up
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src={healthcareImage}
          alt="Healthcare professional consulting with patient"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
