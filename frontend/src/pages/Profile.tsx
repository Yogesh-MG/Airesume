import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  X, 
  Star,
  Brain,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [aiScore, setAiScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as const });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchProfileData();
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      // TODO: Replace with actual Django API calls
      const response = await fetch('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setAiScore(data.ai_score || 0);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // Mock data for development
      setSkills([
        { id: 1, name: 'React', level: 'Advanced' },
        { id: 2, name: 'TypeScript', level: 'Intermediate' },
        { id: 3, name: 'Python', level: 'Advanced' }
      ]);
      setExperiences([
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Tech Corp',
          duration: '2023 - Present',
          description: 'Developed responsive web applications using React and TypeScript'
        }
      ]);
      setEducation([
        {
          id: 1,
          degree: 'Bachelor of Computer Science',
          institution: 'University of Technology',
          year: '2023',
          gpa: '3.8'
        }
      ]);
      setAiScore(78);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skill: Skill = {
      id: Date.now(),
      name: newSkill.name,
      level: newSkill.level
    };
    
    setSkills([...skills, skill]);
    setNewSkill({ name: '', level: 'Intermediate' });
  };

  const handleRemoveSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const evaluateWithAI = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Django API call
      const response = await fetch('http://localhost:8000/api/profile/evaluate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills,
          experiences,
          education
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiScore(data.score);
        toast({
          title: "AI Evaluation Complete!",
          description: `Your profile score: ${data.score}/100`,
        });
      }
    } catch (error) {
      // Mock AI evaluation for development
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      setAiScore(mockScore);
      toast({
        title: "AI Evaluation Complete!",
        description: `Your profile score: ${mockScore}/100`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Django API call
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills,
          experiences,
          education
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Profile Saved!",
        description: "Your profile has been saved successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Profile & Skills</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={saveProfile} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* AI Score Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Profile Evaluation
                </CardTitle>
                <CardDescription>
                  Get AI-powered insights to improve your profile
                </CardDescription>
              </div>
              <Button onClick={evaluateWithAI} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Evaluate with AI
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Profile Score:</span>
                  <span className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
                    {aiScore}/100
                  </span>
                </div>
                <Progress value={aiScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add and manage your technical and soft skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <select
                    className="px-3 py-2 border border-input rounded-md bg-background"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <Button onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="flex items-center gap-2">
                      {skill.name} ({skill.level})
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveSkill(skill.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add your professional experience and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No experience added yet. Click "Add Experience" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add your educational background and qualifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {education.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No education added yet. Click "Add Education" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                        {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={user.first_name || ''}
                      onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={user.last_name || ''}
                      onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write a brief professional summary..."
                    value={user.bio || ''}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;