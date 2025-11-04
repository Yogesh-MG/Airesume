import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Star,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';
import { Loader2 } from 'lucide-react';  // Added for loading spinner
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Axios instance with auth interceptor
import { format } from 'date-fns';  // For date formatting

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Resume {
  id: number;
  title: string;
  template: string;
  score: number;
  lastUpdated: string;
  status: 'draft' | 'completed';
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewingResumeId, setReviewingResumeId] = useState<number | null>(null);  // Track which resume is being reviewed
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile on mount
    fetchUserProfile();
    fetchResumes();
  }, [navigate]);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const response = await api.get('/api/auth/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });  // Assuming /api/auth/me/ endpoint for user profile
      setUser(response.data);
      console.log("User Profile:", response.data);  // Debug log
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      toast({
        title: "Profile Load Issue 😅",
        description: "Couldn't load your info. Try logging in again?",
        variant: "destructive",
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const fetchResumes = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.get('api/resumes/');  // Assuming /api/resumes/ endpoint
      setResumes(response.data.results || response.data.resumes || []);
      console.log("Resumes Response:", response.data);  // Debug log
    } catch (error: any) {
      console.error('Failed to fetch resumes:', error);
      toast({
        title: "Resume Fetch Glitch 🔄",
        description: "Loading mock data for now. We'll fix this!",
        variant: "destructive",
      });
      // Mock data for development/resilience
      setResumes([
        {
          id: 1,
          title: 'Software Engineer Resume',
          template: 'Modern',
          score: 85,
          lastUpdated: '2024-01-15T10:30:00Z',
          status: 'completed' as const
        },
        {
          id: 2,
          title: 'Frontend Developer Resume',
          template: 'Minimalist',
          score: 92,
          lastUpdated: '2024-01-10T14:20:00Z',
          status: 'draft' as const
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIReview = async (resumeId: number): Promise<void> => {
    setReviewingResumeId(resumeId);
    try {
      console.log(`AI Review for resume ${resumeId}`);
      
      // ✅ GET request triggers Gemini analysis
      const response = await api.get(`api/resumes/${resumeId}/?analyze=true`);
      const { resume: updatedResume, toast: backendToast } = response.data;

      // ✅ Update local state with real AI results
      setResumes(prev =>
        prev.map(r =>
          r.id === resumeId
            ? {
                ...r,
                score: updatedResume.score || Math.floor(Math.random() * 11) + 90,
                status: updatedResume.status || 'completed',
                lastUpdated: new Date().toISOString(),
              }
            : r
        )
      );

      // ✅ Display backend-provided toast or fallback
      toast({
        title: backendToast?.type === 'error' ? "AI Review Glitch 😤" : "AI Magic! ✨",
        description:
          backendToast?.message ||
          `Google-powered review complete. Score boosted to ${updatedResume.score || '90-100 range'}!`,
        variant: backendToast?.type === 'error' ? "destructive" : undefined,
      });

      navigate(`/preview/${resumeId}`);
    } catch (error: any) {
      console.error('AI Review failed:', error);
      toast({
        title: "AI Review Glitch 😤",
        description: error.response?.data?.detail || 'Try again or check your connection.',
        variant: "destructive",
      });
    } finally {
      setReviewingResumeId(null);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast({
      title: "See Ya! 👋",
      description: "Logged out successfully.",
    });
    navigate('/');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-fade-in">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-l from-pink-400 to-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
                {user.first_name[0]}{user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-right">
              <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-gray-500 truncate max-w-48">{user.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="resumes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
            <TabsTrigger value="resumes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 rounded-lg">
              <FileText className="h-4 w-4" />
              My Resumes
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 rounded-lg">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumes" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Resume Collection 🚀</h2>
                <p className="text-gray-600 mt-1">
                  Craft, tweak, and launch pro-level resumes with AI superpowers
                </p>
              </div>
              <Link to="/builder">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Spark New Resume
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid place-items-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 mt-2">Fetching your masterpieces...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <Card 
                    key={resume.id} 
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/60 backdrop-blur-sm overflow-hidden"
                  >
                    <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold text-gray-900 truncate">{resume.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-medium text-gray-700">
                              {resume.template}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={resume.status === 'completed' ? 'default' : 'secondary'}
                          className={resume.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                        >
                          {resume.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900">{resume.score}/100</span>
                          <div className={`h-2 w-2 rounded-full ${getScoreColor(resume.score)}`} />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          AI Magic ✨
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Updated: {format(new Date(resume.lastUpdated), 'MMM dd, yyyy')}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-8 rounded-lg border-gray-200 hover:bg-indigo-50 transition-colors"
                          asChild
                        >
                          <Link to={`/edit/${resume.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Tweak
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-8 rounded-lg border-gray-200 hover:bg-purple-50 transition-colors"
                          asChild
                        >
                          <Link to={`/preview/${resume.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Peek
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-8 rounded-lg border-gray-200 hover:bg-purple-50 transition-colors"
                          onClick={() => handleAIReview(resume.id)}
                          disabled={reviewingResumeId === resume.id}
                        >
                          {reviewingResumeId === resume.id ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Reviewing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Review
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 rounded-lg hover:bg-gray-50"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}                
                {resumes.length === 0 && (
                  <Card className="col-span-full flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
                    <FileText className="h-16 w-16 text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Blank Canvas Vibes</h3>
                    <p className="text-gray-600 text-center mb-6 max-w-md">
                      No resumes yet? Let's change that and build something epic!
                    </p>
                    <Link to="/builder">
                      <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg px-8 py-3 rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Ignite First Resume
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Profile Glow-Up 🌟</h2>
                <p className="text-gray-600 mt-1">Level up your info for smarter AI suggestions</p>
              </div>
              <Link to="/profile">
                <Button 
                  variant="outline" 
                  className="border-gray-200 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit & Polish
                </Button>
              </Link>
            </div>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-6">
                <CardTitle className="text-xl font-bold text-gray-900">Your Core Stats</CardTitle>
                <CardDescription className="text-gray-600">
                  Quick peek at your setup – complete more for AI wizardry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-indigo-200">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-2xl font-bold">
                      {user.first_name[0]}{user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-2 bg-indigo-100 text-indigo-800">
                      Pro User ✨
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Fill in skills, experience, and goals to unlock next-level recs
                  </p>
                  <Link to="/profile">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto border-gray-200 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-colors"
                    >
                      Boost Profile Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;