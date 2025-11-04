// pages/EditResume.tsx (new component for dedicated edit route /edit/:resumeId)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Trash2,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Axios with auth

// Reuse interfaces from Builder
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

const EditResume: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // States mirrored from Builder
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    location: ''
  });

  const [summary, setSummary] = useState<string>('');
  const [generateSummary, setGenerateSummary] = useState<boolean>(false);
  
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string>('');
  const [generateSkills, setGenerateSkills] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<string>('');
  const [hobbies, setHobbies] = useState<string>('');
  const [volunteering, setVolunteering] = useState<string>('');
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>('modern');

  // Load resume on mount
  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
    } else {
      toast({
        title: "No Resume ID 😕",
        description: "Redirecting to builder.",
        variant: "destructive",
      });
      navigate('/builder');
    }
  }, [resumeId, navigate]);

  const loadResume = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/resumes/${id}/`);
      const data: any = response.data.content || {};
      
      // Map to states with fallbacks
      setPersonalInfo(data.personalInfo || personalInfo);
      setSummary(data.summary || '');
      setGenerateSummary(!!data.generateSummary);
      setEducations(data.educations || []);
      setExperiences(data.experiences || []);
      setSkills(data.skills || '');
      setGenerateSkills(!!data.generateSkills);
      setProjects(data.projects || []);
      setCertifications(data.certifications || []);
      setLanguages(data.languages || '');
      setHobbies(data.hobbies || '');
      setVolunteering(data.volunteering || '');
      setResumeStyle(data.resumeStyle || 'modern');
      
      console.log("Edit Loaded:", data);  // Debug
    } catch (error: any) {
      console.error('Load failed:', error);
      toast({
        title: "Load Error 🔄",
        description: "Couldn't load resume details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add/Remove/Update functions (same as Builder)
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

  const updateEducation = (id: string, field: keyof Education, value: string): void => {
    setEducations(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Similar for experiences, projects, certifications...
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

  const updateExperience = (id: string, field: keyof Experience, value: string): void => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
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

  const updateProject = (id: string, field: keyof Project, value: string): void => {
    setProjects(prev => prev.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
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

  const updateCertification = (id: string, field: keyof Certification, value: string): void => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string): void => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveResume = async (): Promise<void> => {
    if (!personalInfo.fullName.trim()) {
      toast({
        title: "Name Needed! ⚠️",
        description: "Enter your full name to save.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
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

      console.log("Saving Edit:", resumeData);  // Debug

      const response = await api.put(`/resumes/${resumeId}/`, {
        title: `${personalInfo.fullName}'s Resume`,  // Or keep original
        template: resumeStyle,
        content: resumeData,
        status: 'draft',  // Or completed if AI analyzed
      });

      toast({
        title: "Saved! 💾",
        description: "Your edits are locked in.",
      });

      navigate(`/preview/${resumeId}`);
    } catch (error: any) {
      console.error('Save failed:', error);
      toast({
        title: "Save Hiccup 😤",
        description: error.response?.data?.detail || 'Check details and try again.',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const SaveButton = (): JSX.Element => (
    <Button 
      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02] min-w-[160px] h-12 rounded-xl"
      onClick={handleSaveResume}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving Changes...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save Edits
        </>
      )}
    </Button>
  );

  const PreviewButton = (): JSX.Element => (
    <Button 
      variant="outline" 
      className="flex-1 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 min-w-[160px] h-12 rounded-xl"
      onClick={() => navigate(`/preview/${resumeId}`)}
    >
      <Eye className="h-4 w-4 mr-2" />
      Quick Preview
    </Button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading edit session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 animate-fade-in">
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
            Dashboard
          </Button>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Edit Mode - {personalInfo.fullName || 'Untitled'}
          </Badge>
        </div>

        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
            <Bot className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Edit Forge 🔧</h1>
            <Sparkles className="h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tweak your masterpiece. AI tweaks available too.
          </p>
        </div>

        {/* Reuse Builder sections here - Personal, Summary, Education, etc. */}
        {/* For brevity, assume sections are identical to ResumeBuilder but with Save button instead of Generate */}
        <div className="space-y-6">
          {/* Personal Info Section - same as Builder */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <User className="h-5 w-5 text-indigo-600" />
                Core Vibes
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
                {/* ... other fields ... */}
              </div>
            </CardContent>
          </Card>

          {/* Add other sections similarly... */}

          {/* Actions - Save instead of Generate */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <SaveButton />
                <PreviewButton />
                <Download />  {/* Optional, reuse from Builder */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditResume;