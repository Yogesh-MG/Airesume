import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  Download, 
  Eye, 
  Zap, 
  Target,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const features: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }> = [
    {
      icon: Bot,
      title: "AI-Powered Insights",
      description: "Harness intelligent AI to craft compelling summaries and tailor your narrative for maximum impact."
    },
    {
      icon: Zap,
      title: "Effortless Speed",
      description: "Transform your experience into a polished resume in mere minutes, freeing you to focus on what matters."
    },
    {
      icon: Target,
      title: "ATS-Compliant Design",
      description: "Engineered to navigate Applicant Tracking Systems seamlessly, ensuring your profile reaches the right eyes."
    },
    {
      icon: Award,
      title: "Elegant Templates",
      description: "Select from a curated collection of sophisticated, recruiter-approved layouts to showcase your strengths."
    }
  ];

  const stats: Array<{ number: string; label: string }> = [
    { number: "50K+", label: "Resumes Generated" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9★", label: "User Satisfaction" },
    { number: "2min", label: "Creation Time" }
  ];

  const steps: Array<{
    step: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }> = [
    {
      step: "1",
      icon: Users,
      title: "Share Your Story",
      description: "Input your professional journey, skills, and aspirations with ease."
    },
    {
      step: "2",
      icon: Bot,
      title: "AI Refinement",
      description: "Experience AI-driven enhancements that elevate your content to excellence."
    },
    {
      step: "3",
      icon: Download,
      title: "Launch Forward",
      description: "Download your refined resume and step confidently into your next opportunity."
    }
  ];

  const benefits: string[] = [
    "AI-enhanced content optimized for modern ATS platforms",
    "Recruiter-favored templates that convey professionalism",
    "Instant, actionable feedback for continuous improvement",
    "Seamless exports in PDF, Word, and versatile formats"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="inline-flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
            <Bot className="h-12 w-12 text-blue-600 flex-shrink-0" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to Your AI Resume Journey
            </h1>
            <Sparkles className="h-12 w-12 text-blue-600 flex-shrink-0" />
          </div>

          {/* Hero Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover the ease of crafting a standout resume with cutting-edge AI. 
            <br className="hidden sm:block" />
            <span className="text-blue-600 font-semibold">Elevate your profile</span> and unlock doors to exceptional career possibilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-7 rounded-xl shadow-md transition-all duration-200 min-w-[200px]"
              onClick={() => navigate('/signup')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-base px-8 py-7 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 min-w-[200px]"
              onClick={() => navigate('/preview')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Explore a Sample
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6 mb-12">
          <Badge variant="secondary" className="text-blue-600 bg-blue-50 px-4 py-1">
            Discover Excellence
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Craft the <span className="text-blue-600">Resume That Opens Doors</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leverage our sophisticated AI to produce resumes that resonate with hiring professionals and drive results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6 mb-12">
          <Badge variant="secondary" className="text-blue-600 bg-blue-50 px-4 py-1">
            Effortless Workflow
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your Path to a Superior Resume in <span className="text-blue-600">Three Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg">
                  <step.icon className="h-8 w-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shadow-md">
                    {step.step}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 left-full hidden md:block transform -translate-y-1/2 w-16 h-0.5 bg-blue-200" />
                )}
              </div>
              <h3 className="font-semibold text-xl text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <Card className="border-0 bg-white shadow-lg overflow-hidden">
          <CardContent className="p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50 px-4 py-1 mb-4">
                    Proven Results
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Join Professionals Who Advance with Confidence
                  </h3>
                  <p className="text-gray-600">Experience the difference of AI precision in every detail.</p>
                </div>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md min-w-[160px]"
                    onClick={() => navigate('/login')}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Access Account
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="px-8 py-3 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 min-w-[160px]"
                    onClick={() => navigate('/templates')}
                  >
                    Browse Templates
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-md border">
                  <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">4.9</div>
                  <p className="text-sm text-gray-600 mb-4">Trusted by Thousands</p>
                  <div className="flex justify-center gap-1">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Welcome;