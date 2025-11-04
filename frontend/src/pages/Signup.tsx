// Signup.tsx (updated for TypeScript, modern Gen Z aesthetic: vibrant gradients, subtle animations, emoji accents, mobile-optimized)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, UserPlus, Mail, User, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Assuming your Axios instance

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Oops! 🚫",
        description: "Passwords don't match. Try again?",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Hold Up! 🔒",
        description: "Password needs at least 8 characters for max security.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Signup Request:", formData);  // Debug log
      const response = await api.post('api/auth/signup/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
      });

      if (response.status === 201) {
        // Store tokens if returned
        if (response.data.access && response.data.refresh) {
          localStorage.setItem('token', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);
          toast({
            title: "Welcome Aboard! 🎉",
            description: "Account created. Let's build that dream resume!",
          });
          navigate('/dashboard');  // Or wherever post-signup
        } else {
          toast({
            title: "Success! ✨",
            description: "Account ready. Sign in to get started.",
          });
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      const message = error.response?.data?.detail || error.message || 'Something went wrong.';
      toast({
        title: "Not Quite! 😅",
        description: message,
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
            Join the Crew 🚀
          </CardTitle>
          <CardDescription className="text-gray-600">
            Level up your career with AI magic. Thousands already slaying job hunts!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Alex"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Rivera"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="alex@dreamjob.com"
                value={formData.email}
                onChange={handleInputChange}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Make it strong 💪"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Match it up 🔄"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="h-12 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent rounded-r-xl"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                  Creating Your Vibe...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Launch Account ✨
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-4">
              Got an account already?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors">
                Jump In
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

export default Signup;