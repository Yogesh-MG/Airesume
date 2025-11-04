import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Star } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  isPremium: boolean;
  rating: number;
  downloads: number;
}

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: Template[] = [
    {
      id: 'modern-1',
      name: 'Modern Professional',
      description: 'Clean and modern design perfect for tech professionals',
      preview: '/api/placeholder/300/400',
      category: 'modern',
      isPremium: false,
      rating: 4.8,
      downloads: 15420
    },
    {
      id: 'classic-1',
      name: 'Classic Executive',
      description: 'Traditional layout ideal for senior positions',
      preview: '/api/placeholder/300/400',
      category: 'classic',
      isPremium: true,
      rating: 4.9,
      downloads: 12350
    },
    {
      id: 'creative-1',
      name: 'Creative Designer',
      description: 'Bold and creative design for design professionals',
      preview: '/api/placeholder/300/400',
      category: 'creative',
      isPremium: true,
      rating: 4.7,
      downloads: 8920
    },
    {
      id: 'minimal-1',
      name: 'Minimal Clean',
      description: 'Simple and clean layout focusing on content',
      preview: '/api/placeholder/300/400',
      category: 'minimal',
      isPremium: false,
      rating: 4.6,
      downloads: 18760
    },
    {
      id: 'modern-2',
      name: 'Modern Gradient',
      description: 'Contemporary design with subtle gradients',
      preview: '/api/placeholder/300/400',
      category: 'modern',
      isPremium: true,
      rating: 4.8,
      downloads: 11230
    },
    {
      id: 'classic-2',
      name: 'Classic Academic',
      description: 'Perfect for academic and research positions',
      preview: '/api/placeholder/300/400',
      category: 'classic',
      isPremium: false,
      rating: 4.5,
      downloads: 9870
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    // Navigate to resume builder with selected template
    navigate(`/builder?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Resume Templates</h1>
              <p className="text-muted-foreground">Choose from professional resume templates</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="text-muted-foreground">Template Preview</div>
                  </div>
                  
                  {template.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500">
                      Premium
                    </Badge>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                <CardDescription className="text-sm mb-4 line-clamp-2">
                  {template.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                  <span>{template.downloads.toLocaleString()} downloads</span>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleUseTemplate(template.id)}
                  variant={template.isPremium ? 'default' : 'outline'}
                >
                  {template.isPremium ? 'Use Premium Template' : 'Use Template'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;