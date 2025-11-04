import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LinkIcon,
  GraduationCap,
  Briefcase,
  Wrench,
  Code,
  Award,
  Globe,
  Plus,
  Download,
  Eye,
  Sparkles,
  Bot,
  Loader2,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Axios instance with auth
import { format } from 'date-fns';  // For any date formatting if needed

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  location: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

interface Project {
  id: string;
  title: string;
  organization?: string;
  duration: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  description?: string;
}

type ResumeStyle = 'modern' | 'minimalistic' | 'ats-friendly' | 'creative';

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  educations: Education[];
  experiences: Experience[];
  skills: string;
  projects: Project[];
  certifications: Certification[];
  languages: string;
  hobbies: string;
  volunteering: string;
  resumeStyle: ResumeStyle;
}

const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { resumeId } = useParams<{ resumeId: string }>();  // For editing existing
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    location: ''
  });

  const [summary, setSummary] = useState<string>('');
  const [generateSummary, setGenerateSummary] = useState<boolean>(false);
  
  const [educations, setEducations] = useState<Education[]>([
    { id: '1', degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: '1', jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' }
  ]);

  const [skills, setSkills] = useState<string>('');
  const [generateSkills, setGenerateSkills] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: '', organization: '', duration: '', description: '' }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: '1', name: '', organization: '', date: '', description: '' }
  ]);

  const [languages, setLanguages] = useState<string>('');
  const [hobbies, setHobbies] = useState<string>('');
  const [volunteering, setVolunteering] = useState<string>('');

  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>('modern');

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
    } else {
      setIsLoading(false);
    }
  }, [resumeId]);

  const loadResume = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/resumes/${id}/`);
      const data: ResumeData = response.data.content;  // Assume content is structured as ResumeData
      // Map data to states (simplified; in real, deep copy)
      setPersonalInfo(data.personalInfo || personalInfo);
      setSummary(data.summary || '');
      setEducations(data.educations || educations);
      setExperiences(data.experiences || experiences);
      setSkills(data.skills || '');
      setProjects(data.projects || projects);
      setCertifications(data.certifications || certifications);
      setLanguages(data.languages || '');
      setHobbies(data.hobbies || '');
      setVolunteering(data.volunteering || '');
      setResumeStyle(data.resumeStyle || 'modern');
      console.log("Loaded Resume:", response.data);  // Debug log
    } catch (error: any) {
      console.error('Failed to load resume:', error);
      toast({
        title: "Load Glitch 😩",
        description: "Couldn't fetch your resume. Starting fresh?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEducation = (): void => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setEducations(prev => [...prev, newEducation]);
  };

  const removeEducation = (id: string): void => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  const addExperience = (): void => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const removeExperience = (id: string): void => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const addProject = (): void => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      organization: '',
      duration: '',
      description: ''
    };
    setProjects(prev => [...prev, newProject]);
  };

  const removeProject = (id: string): void => {
    setProjects(prev => prev.filter(proj => proj.id !== id));
  };

  const addCertification = (): void => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      organization: '',
      date: '',
      description: ''
    };
    setCertifications(prev => [...prev, newCertification]);
  };

  const removeCertification = (id: string): void => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string): void => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string): void => {
    setEducations(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string): void => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const updateProject = (id: string, field: keyof Project, value: string): void => {
    setProjects(prev => prev.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string): void => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const handleGenerateResume = async (): Promise<void> => {
    if (!personalInfo.fullName.trim()) {
      toast({
        title: "Quick Check! ⚠️",
        description: "Add your name to kick things off.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const resumeData: ResumeData = {
        personalInfo,
        summary,
        educations,
        experiences,
        skills,
        projects,
        certifications,
        languages,
        hobbies,
        volunteering,
        resumeStyle
      };

      console.log("Generating Resume:", resumeData);  // Debug log

      const response = await api.post('api/resumes/', {
        title: `${personalInfo.fullName}'s Resume`,  // Auto-title
        template: resumeStyle,
        content: resumeData,
        // If AI: trigger analysis
        ...(generateSummary || generateSkills ? { analyze: true } : {})
      });

      toast({
        title: "Magic Brewing! ✨",
        description: "Your AI-enhanced resume is ready.",
      });

      navigate(`/preview/${response.data.id}`);
    } catch (error: any) {
      console.error('Generation failed:', error);
      toast({
        title: "AI Hiccup 😤",
        description: error.response?.data?.detail || 'Try again or preview manually.',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const GenerateButton = (): JSX.Element => (
    <Button 
      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02] min-w-[160px] h-12 rounded-xl"
      onClick={handleGenerateResume}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          AI Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </>
      )}
    </Button>
  );

  const PreviewButton = (): JSX.Element => (
    <Button 
      variant="outline" 
      className="flex-1 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 min-w-[160px] h-12 rounded-xl"
      onClick={() => {
        // Quick save draft if new
        if (!resumeId) {
          toast({ title: "Draft Saved 📝", description: "Heading to preview." });
        }
        navigate('/preview');
      }}
    >
      <Eye className="h-4 w-4 mr-2" />
      Preview Now
    </Button>
  );

  const DownloadButton = (): JSX.Element => (
    <Button 
      variant="outline" 
      className="flex-1 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 min-w-[160px] h-12 rounded-xl"
      onClick={() => toast({ title: "Coming Soon! 📥", description: "PDF export in beta." })}
    >
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 animate-fade-in">
      {/* Subtle bg patterns for vibe */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-l from-pink-400 to-purple-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 h-10 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-right">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              {resumeId ? 'Edit Mode' : 'New Build'}
            </Badge>
          </div>
        </div>

        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
            <Bot className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Resume Forge 🚀</h1>
            <Sparkles className="h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Craft your standout story with AI smarts. Fill deets or let the bot vibe it out.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Info - Mobile stacked */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <User className="h-5 w-5 text-indigo-600" />
                Your Core Vibes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Full Name
                  </Label>
                  <Input
                    value={personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="Your epic name"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="you@dreamjob.com"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="City, Vibes"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn / Site
                </Label>
                <Input
                  value={personalInfo.linkedinUrl}
                  onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/you"
                  className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Your Story Hook
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Summary</Label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Passionate dev turning code into impact..."
                  rows={4}
                  disabled={generateSummary}
                  className="rounded-xl border-gray-200 focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="generateSummary"
                  checked={generateSummary}
                  onCheckedChange={(checked) => setGenerateSummary(!!checked)}
                />
                <Label htmlFor="generateSummary" className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer">
                  <Bot className="h-4 w-4 text-indigo-600" />
                  AI Craft It?
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Education - Responsive grids */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Learnings Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {educations.map((education, index) => (
                <div key={education.id} className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0">
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                    {educations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(education.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Degree</Label>
                      <Input
                        value={education.degree}
                        onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                        placeholder="B.S. in Magic"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Institution</Label>
                      <Input
                        value={education.institution}
                        onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                        placeholder="Hogwarts U"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Location</Label>
                      <Input
                        value={education.location}
                        onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
                        placeholder="Wizard City"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">GPA</Label>
                      <Input
                        value={education.gpa || ''}
                        onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                        placeholder="4.0/4.0"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Start</Label>
                      <Input
                        type="month"
                        value={education.startDate}
                        onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">End</Label>
                      <Input
                        type="month"
                        value={education.endDate}
                        onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addEducation}
                className="w-full h-11 rounded-xl border-gray-200 hover:border-indigo-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Experience - Similar pattern */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Gig History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {experiences.map((experience, index) => (
                <div key={experience.id} className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0">
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Gig {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(experience.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <Input
                        value={experience.jobTitle}
                        onChange={(e) => updateExperience(experience.id, 'jobTitle', e.target.value)}
                        placeholder="Code Wizard"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Company</Label>
                      <Input
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                        placeholder="Tech Co."
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Location</Label>
                      <Input
                        value={experience.location}
                        onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                        placeholder="Remote or City"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Duration</Label>
                      <Input
                        value={experience.startDate}
                        onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                        placeholder="2023 - Now"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Wins & Duties</Label>
                    <Textarea
                      value={experience.responsibilities}
                      onChange={(e) => updateExperience(experience.id, 'responsibilities', e.target.value)}
                      placeholder="• Built epic apps • Led teams to glory"
                      rows={3}
                      className="rounded-xl border-gray-200 focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addExperience}
                className="w-full h-11 rounded-xl border-gray-200 hover:border-indigo-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Gig
              </Button>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Wrench className="h-5 w-5 text-indigo-600" />
                Superpowers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Skills List</Label>
                <Textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node, Sass, Leadership, ML"
                  rows={3}
                  disabled={generateSkills}
                  className="rounded-xl border-gray-200 focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="generateSkills"
                  checked={generateSkills}
                  onCheckedChange={(checked) => setGenerateSkills(!!checked)}
                />
                <Label htmlFor="generateSkills" className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer">
                  <Bot className="h-4 w-4 text-indigo-600" />
                  AI Suggest?
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Projects - Similar responsive */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Code className="h-5 w-5 text-indigo-600" />
                Side Quests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {projects.map((project, index) => (
                <div key={project.id} className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0">
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Quest {index + 1}</h4>
                    {projects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        placeholder="App Quest"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Org / Solo</Label>
                      <Input
                        value={project.organization || ''}
                        onChange={(e) => updateProject(project.id, 'organization', e.target.value)}
                        placeholder="Solo or Team"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Timeline</Label>
                      <Input
                        value={project.duration}
                        onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                        placeholder="Jan '24 - Mar '24"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Epic Deets</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Conquered dragons with JS..."
                      rows={3}
                      className="rounded-xl border-gray-200 focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addProject}
                className="w-full h-11 rounded-xl border-gray-200 hover:border-indigo-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Quest
              </Button>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Award className="h-5 w-5 text-indigo-600" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {certifications.map((certification, index) => (
                <div key={certification.id} className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0">
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Badge {index + 1}</h4>
                    {certifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(certification.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        value={certification.name}
                        onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                        placeholder="Cert Level Up"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Issuer</Label>
                      <Input
                        value={certification.organization}
                        onChange={(e) => updateCertification(certification.id, 'organization', e.target.value)}
                        placeholder="Quest Master"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Date</Label>
                      <Input
                        type="month"
                        value={certification.date}
                        onChange={(e) => updateCertification(certification.id, 'date', e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Notes</Label>
                      <Input
                        value={certification.description || ''}
                        onChange={(e) => updateCertification(certification.id, 'description', e.target.value)}
                        placeholder="How you slayed it"
                        className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addCertification}
                className="w-full h-11 rounded-xl border-gray-200 hover:border-indigo-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Badge
              </Button>
            </CardContent>
          </Card>

          {/* Additional */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Globe className="h-5 w-5 text-indigo-600" />
                Extra Flavor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Languages</Label>
                  <Input
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="English (Fluency), Code (Expert)"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Hobbies</Label>
                  <Input
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder="Code jams, Trail runs"
                    className="h-11 rounded-xl border-gray-200 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Volunteering</Label>
                <Textarea
                  value={volunteering}
                  onChange={(e) => setVolunteering(e.target.value)}
                  placeholder="Mentored newbies, Built community apps"
                  rows={2}
                  className="rounded-xl border-gray-200 focus:border-indigo-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Style Picker */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Style Flex
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: 'modern' as ResumeStyle, label: 'Modern', desc: 'Sleek vibes' },
                  { value: 'minimalistic' as ResumeStyle, label: 'Minimal', desc: 'Clean AF' },
                  { value: 'ats-friendly' as ResumeStyle, label: 'ATS', desc: 'Bot-proof' },
                  { value: 'creative' as ResumeStyle, label: 'Creative', desc: 'Bold flex' }
                ].map((style) => (
                  <div
                    key={style.value}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      resumeStyle === style.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                    onClick={() => setResumeStyle(style.value)}
                  >
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">{style.label}</h3>
                      <p className="text-xs text-gray-500">{style.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions - Mobile stack */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <GenerateButton />
                <PreviewButton />
                <DownloadButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;