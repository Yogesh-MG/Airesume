import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Axios instance for auth calls

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Heads Up! ⚠️",
        description: "Email and password are required to log in.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Login Request:", { email });  // Debug log (obscure password)
      const response = await api.post('/api/token/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        
        // Optional: Fetch user profile if needed, but for now, proceed
        toast({
          title: "Hey There! 👋",
          description: "Logged in successfully. Time to crush those applications!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const message = error.response?.data?.detail || error.message || 'Login failed.';
      toast({
        title: "Oops! 🔒",
        description: message.includes('No active account') ? "Email not found or wrong password. Double-check?" : message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-fade-in">
      {/* Subtle background pattern for Gen Z vibe */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-l from-pink-400 to-purple-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-md relative overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            Back in Action 🚀
          </CardTitle>
          <CardDescription className="text-gray-600">
            Dive back into your resume magic. We've missed you!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@work.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Unlock the vibes 🔓"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent rounded-r-xl"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Unlocking Access...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In ✨
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-4">
              New here?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors">
                Create Account
              </Link>
            </div>
            
            <div className="text-center pt-2">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;