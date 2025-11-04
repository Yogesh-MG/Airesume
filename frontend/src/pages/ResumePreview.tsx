import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Download,
  Edit,
  Mail,
  Phone,
  MapPin,
  LinkIcon,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Loader2,
  Sparkles,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';  // Axios with auth

// --- INTERFACES (updated skills to string[] for consistency) ---
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
}

interface Experience {
  title: string;
  company: string;
  startDate: string;
  location: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: string;
}

interface Project {
  title: string;
  duration: string;
  description: string;
}

type ResumeTemplate = 'modern' | 'minimalistic' | 'ats-friendly' | 'creative';

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];  // Structured as array
  projects: Project[];
  score?: number;
  status: 'draft' | 'completed';
  template?: ResumeTemplate;
}
// --- END INTERFACES ---

// Helper function to process responsibilities
const splitResponsibilities = (resp: any): string[] => {
  if (Array.isArray(resp)) return resp;
  if (typeof resp === 'string') {
    return resp.split('\n').map(line => line.trim().replace(/^\s*[-•*]\s*/, '')).filter(Boolean);
  }
  return [];
};

// Sample data for fallback/no-id preview
const sampleData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedinUrl: "linkedin.com/in/alexjohnson"
  },
  summary: "Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to success.",
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      duration: "2022 - Present",
      location: "San Francisco, CA",
      responsibilities: [
        "Led development of microservices architecture serving 1M+ users",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      duration: "2020 - 2022",
      location: "Remote",
      responsibilities: [
        "Built responsive web applications using React and TypeScript",
        "Collaborated with UX/UI team to implement pixel-perfect designs",
        "Optimized application performance resulting in 40% faster load times"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      institution: "Stanford University",
      duration: "2016 - 2020",
      location: "Stanford, CA",
      gpa: "3.8/4.0"
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", 
    "AWS", "Docker", "PostgreSQL", "MongoDB", "Git"
  ],
  projects: [
    {
      title: "E-commerce Platform",
      duration: "2023",
      description: "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration"
    },
    {
      title: "Task Management App",
      duration: "2022",
      description: "Developed a collaborative task management application with real-time updates"
    }
  ],
  status: 'completed' as const,
  template: 'modern' as const
};

const ResumePreview: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');
  const { toast } = useToast();

  const fetchResume = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/resumes/${id}/`);
      const apiData = response.data;  // Top-level data
      const data = apiData.resume;  // Structured resume from backend

      if (!data) {
        throw new Error('No resume data found in response');
      }

      // Process skills if string
      let skills = data.skills;
      if (typeof skills === 'string') {
        skills = skills.split(/, ?/).filter(Boolean);
      }

      // Process experience responsibilities
      const experience = data.experience.map((exp: any) => ({
        ...exp,
        responsibilities: splitResponsibilities(exp.responsibilities)
      }));

      // Set structured data
      setResumeData({
        ...data,
        experience,
        skills: skills as string[],
      });
    } catch (error: any) {
      console.error('Failed to fetch resume:', error);
      toast({
        title: "Preview Load Fail 😩",
        description: error.response?.data?.detail || error.message || 'Using sample data for preview.',
        variant: "destructive",
      });
      // Fallback to sample
      setResumeData(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId);
    } else {
      // Use sample for no-id preview
      setResumeData(sampleData);
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    // Update selectedTemplate from fetched data or sample
    if (resumeData?.template) {
      setSelectedTemplate(resumeData.template);
    }
  }, [resumeData]);

  const handleTemplateChange = (value: ResumeTemplate): void => {
    setSelectedTemplate(value);
    toast({
      title: "Style Switch! 🎨",
      description: `Previewing ${value.charAt(0).toUpperCase() + value.slice(1)} template. Save in editor to apply permanently.`,
    });
  };

  const handleDownload = async (): Promise<void> => {
    if (!resumeData) return;
    setIsDownloading(true);
    try {
      // Simulation - replace with actual blob download from backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      const link = document.createElement('a');
      const filename = resumeData.personalInfo.fullName.replace(/\s+/g, '_');
      link.href = URL.createObjectURL(new Blob([`PDF Content for ${filename} using ${selectedTemplate} template`], { type: 'application/pdf' }));
      link.download = `resume_${filename}_${selectedTemplate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Complete! 📥",
        description: `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} style PDF ready.`,
      });
    } catch (error) {
      console.error("Download Error:", error);
      toast({
        title: "Download Glitch 🔄",
        description: "Try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Memoize style functions
  const getStyleClasses = useMemo(() => (template: ResumeTemplate) => {
    switch (template) {
      case 'modern':
        return 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg';
      case 'minimalistic':
        return 'bg-white text-gray-900 border-b border-gray-200';
      case 'ats-friendly':
        return 'bg-white text-black border-b border-black font-sans';
      case 'creative':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl rotate-1 hover:rotate-0 transition-transform';
      default:
        return 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white';
    }
  }, []);

  const getSectionClasses = useMemo(() => (template: ResumeTemplate) => {
    switch (template) {
      case 'modern':
        return 'p-8 sm:p-10 space-y-8 text-gray-900 leading-relaxed';
      case 'minimalistic':
        return 'p-6 space-y-6 text-sm text-gray-800 leading-tight';
      case 'ats-friendly':
        return 'p-4 space-y-4 text-base text-black leading-6';
      case 'creative':
        return 'p-8 sm:p-10 space-y-8 text-white leading-loose bg-black/20 backdrop-blur-sm';
      default:
        return 'p-8 sm:p-10 space-y-8 text-gray-900 leading-relaxed';
    }
  }, []);

  if (isLoading || !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
          <p className="text-gray-600">Rendering your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 animate-fade-in">
      {/* BG patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-l from-pink-400 to-purple-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header with Style Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md z-20 sticky top-0">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 h-10 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <Badge 
              variant={resumeData.status === 'completed' ? 'default' : 'secondary'}
              className={`px-3 py-1 ${resumeData.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
            >
              {resumeData.status.toUpperCase()}
            </Badge>
            {resumeData.score && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                AI Score: {resumeData.score}/100 ✨
              </Badge>
            )}
            {/* Style Selector */}
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-gray-600" />
              <Select value={selectedTemplate} onValueChange={(value) => handleTemplateChange(value as ResumeTemplate)}>
                <SelectTrigger className="w-[180px] h-10 rounded-lg border-gray-200">
                  <SelectValue placeholder="Template Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimalistic">Minimalistic</SelectItem>
                  <SelectItem value="ats-friendly">ATS-Friendly</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button 
                variant="outline"
                onClick={() => navigate(`/edit/${resumeId}`)}
                className="flex items-center gap-2 h-10 px-4 rounded-lg border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg h-10 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isDownloading ? 'Exporting...' : `Download ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}`}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Dynamic Template based on selectedTemplate */}
            <div className="bg-white">
              {/* Header - Style Specific */}
              <div className={`${getStyleClasses(selectedTemplate)} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <Sparkles className={`h-32 w-32 absolute -top-16 -right-16 ${selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-white/50'}`} />
                </div>
                <div className={`relative z-10 text-center max-w-2xl mx-auto p-8 ${selectedTemplate === 'minimalistic' || selectedTemplate === 'ats-friendly' ? 'p-6' : 'p-8'}`}>
                  <h1 className={`font-bold mb-4 leading-tight ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-4xl sm:text-5xl text-white' : 'text-3xl sm:text-4xl text-gray-900'}`}>
                    {resumeData.personalInfo.fullName}
                  </h1>
                  <div className={`flex flex-wrap justify-center gap-4 ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-sm sm:text-base text-white/90' : 'text-xs sm:text-sm text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                      <Mail className={`h-4 w-4 flex-shrink-0 ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-white' : 'text-gray-600'}`} />
                      <span className="truncate">{resumeData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className={`h-4 w-4 flex-shrink-0 ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-white' : 'text-gray-600'}`} />
                      <span>{resumeData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className={`h-4 w-4 flex-shrink-0 ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-white' : 'text-gray-600'}`} />
                      <span>{resumeData.personalInfo.location}</span>
                    </div>
                    {resumeData.personalInfo.linkedinUrl && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className={`h-4 w-4 flex-shrink-0 ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-white' : 'text-gray-600'}`} />
                        <span className="truncate max-w-50">{resumeData.personalInfo.linkedinUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className={getSectionClasses(selectedTemplate)}>
                {/* Summary */}
                <section>
                  <h2 className={`font-bold mb-4 flex items-center gap-2 border-b pb-2 ${selectedTemplate === 'modern' ? 'text-2xl text-gray-900 border-gray-200' : selectedTemplate === 'minimalistic' ? 'text-xl text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'text-lg text-black border-black' : 'text-2xl text-white border-white/20'}`}>
                    <Briefcase className={`h-6 w-6 ${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-700'}`} />
                    Summary
                  </h2>
                  <p className={`leading-relaxed ${selectedTemplate === 'modern' ? 'text-lg text-gray-700' : selectedTemplate === 'minimalistic' ? 'text-sm text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-base text-black' : 'text-lg text-white/90'}`}>
                    {resumeData.summary}
                  </p>
                </section>

                <Separator className={`${selectedTemplate === 'ats-friendly' ? 'border-black' : 'border-gray-200'}`} />

                {/* Experience */}
                <section>
                  <h2 className={`font-bold mb-6 flex items-center gap-2 border-b pb-2 ${selectedTemplate === 'modern' ? 'text-2xl text-gray-900 border-gray-200' : selectedTemplate === 'minimalistic' ? 'text-xl text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'text-lg text-black border-black' : 'text-2xl text-white border-white/20'}`}>
                    <Briefcase className={`h-6 w-6 ${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-700'}`} />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <article key={index} className="group">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-semibold ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-xl text-gray-900' : selectedTemplate === 'ats-friendly' ? 'text-base text-black' : 'text-lg text-gray-800'}`}>
                            {exp.title}
                          </h3>
                          <Badge variant="outline" className={`ml-4 whitespace-nowrap ${selectedTemplate === 'modern' ? 'border-gray-200 text-gray-600' : selectedTemplate === 'ats-friendly' ? 'border-black text-black' : 'border-white/30 text-white/80'}`}>
                            <Calendar className={`h-3 w-3 mr-1 ${selectedTemplate === 'modern' ? 'text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-white/80'}`} />
                            {exp.startDate}
                          </Badge>
                        </div>
                        <div className={`font-medium mb-2 flex items-center gap-2 ${selectedTemplate === 'modern' ? 'text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-gray-400'}`}>
                          {exp.company} • {exp.location}
                        </div>
                        <ul className={`space-y-2 ${selectedTemplate === 'modern' ? 'text-gray-700' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-gray-300'}`}>
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className={`flex items-start gap-3 pl-4 border-l-2 ${selectedTemplate === 'modern' ? 'border-indigo-200 group-hover:border-indigo-400 text-gray-700' : selectedTemplate === 'minimalistic' ? 'border-gray-300 text-gray-600' : selectedTemplate === 'ats-friendly' ? 'border-black text-black pl-0 -ml-1 list-disc' : 'border-yellow-300 group-hover:border-yellow-400 text-gray-200'}`}>
                              {selectedTemplate === 'ats-friendly' ? (
                                <span className='hidden'>•</span> // Hidden but preserves structure for ATS
                              ) : (
                                <span className={`${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-500'} font-medium min-w-[1rem]`}>→</span>
                              )}
                              <span className="leading-relaxed">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <Separator className={`${selectedTemplate === 'ats-friendly' ? 'border-black' : 'border-gray-200'}`} />

                {/* Education */}
                <section>
                  <h2 className={`font-bold mb-6 flex items-center gap-2 border-b pb-2 ${selectedTemplate === 'modern' ? 'text-2xl text-gray-900 border-gray-200' : selectedTemplate === 'minimalistic' ? 'text-xl text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'text-lg text-black border-black' : 'text-2xl text-white border-white/20'}`}>
                    <GraduationCap className={`h-6 w-6 ${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-700'}`} />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <article key={index} className="group">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-semibold ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-xl text-gray-900' : selectedTemplate === 'ats-friendly' ? 'text-base text-black' : 'text-lg text-gray-800'}`}>
                            {edu.degree}
                          </h3>
                          <Badge variant="outline" className={`ml-4 whitespace-nowrap ${selectedTemplate === 'modern' ? 'border-gray-200 text-gray-600' : selectedTemplate === 'ats-friendly' ? 'border-black text-black' : 'border-white/30 text-white/80'}`}>
                            <Calendar className={`h-3 w-3 mr-1 ${selectedTemplate === 'modern' ? 'text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-white/80'}`} />
                            {edu.startDate && edu.endDate ? edu.startDate + '  ' + edu.endDate :" N/A"}
                          </Badge>
                        </div>
                        <div className={`font-medium mb-2 flex items-center gap-2 ${selectedTemplate === 'modern' ? 'text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-gray-400'}`}>
                          {edu.institution} • {edu.location}
                        </div>
                        {edu.gpa && (
                          <div className={`text-sm ${selectedTemplate === 'modern' ? 'text-gray-500' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-gray-400'}`}>GPA: {edu.gpa}</div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>

                <Separator className={`${selectedTemplate === 'ats-friendly' ? 'border-black' : 'border-gray-200'}`} />

                {/* Skills */}
                <section>
                  <h2 className={`font-bold mb-6 flex items-center gap-2 border-b pb-2 ${selectedTemplate === 'modern' ? 'text-2xl text-gray-900 border-gray-200' : selectedTemplate === 'minimalistic' ? 'text-xl text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'text-lg text-black border-black' : 'text-2xl text-white border-white/20'}`}>
                    <Award className={`h-6 w-6 ${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-700'}`} />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className={`px-3 py-1 ${selectedTemplate === 'modern' ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100' : selectedTemplate === 'minimalistic' ? 'bg-gray-100 text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'bg-transparent text-black border border-black' : 'bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500'}`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator className={`${selectedTemplate === 'ats-friendly' ? 'border-black' : 'border-gray-200'}`} />

                {/* Projects */}
                <section>
                  <h2 className={`font-bold mb-6 flex items-center gap-2 border-b pb-2 ${selectedTemplate === 'modern' ? 'text-2xl text-gray-900 border-gray-200' : selectedTemplate === 'minimalistic' ? 'text-xl text-gray-800 border-gray-300' : selectedTemplate === 'ats-friendly' ? 'text-lg text-black border-black' : 'text-2xl text-white border-white/20'}`}>
                    <Award className={`h-6 w-6 ${selectedTemplate === 'modern' ? 'text-indigo-600' : selectedTemplate === 'creative' ? 'text-yellow-300' : 'text-gray-700'}`} />
                    Projects
                  </h2>
                  <div className="space-y-6">
                    {resumeData.projects.map((project, index) => (
                      <article key={index} className="group">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-semibold ${selectedTemplate === 'modern' || selectedTemplate === 'creative' ? 'text-lg text-gray-900' : selectedTemplate === 'ats-friendly' ? 'text-base text-black' : 'text-lg text-gray-800'}`}>
                            {project.title}
                          </h3>
                          <Badge variant="outline" className={`ml-4 whitespace-nowrap ${selectedTemplate === 'modern' ? 'border-gray-200 text-gray-600' : selectedTemplate === 'ats-friendly' ? 'border-black text-black' : 'border-white/30 text-white/80'}`}>
                            <Calendar className={`h-3 w-3 mr-1 ${selectedTemplate === 'modern' ? 'text-gray-600' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-white/80'}`} />
                            {project.duration}
                          </Badge>
                        </div>
                        <p className={`leading-relaxed ${selectedTemplate === 'modern' ? 'text-gray-700' : selectedTemplate === 'ats-friendly' ? 'text-black' : 'text-gray-300'}`}>
                          {project.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumePreview;