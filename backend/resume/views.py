from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Resume
from .serializer import ResumeListSerializer, ResumeSerializer
from .google import gemini_resume_generation_and_analysis

class ResumePagination(PageNumberPagination):
    """
    Pagination for resume lists (>50 items).
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ResumeListView(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating user's resumes.
    Scoped to authenticated user.
    Supports pagination and filtering by status.
    """
    serializer_class = ResumeSerializer  # Use full serializer for create
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ResumePagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """
        Use lightweight serializer for list, full for create/retrieve.
        """
        if self.request.method == 'GET':
            return ResumeListSerializer
        return ResumeSerializer


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for single resume detail/update/delete.
    Scoped to user's own resume.
    For GET (preview), it structures the response for frontend rendering and optionally triggers AI analysis if requested.
    """
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        """
        Enhanced GET for preview: Returns structured data for frontend.
        Optionally triggers AI review if ?analyze=true query param is present.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        data = serializer.data
        
        # Structure for frontend preview (match ResumeData interface)
        structured_data = {
            'id': data['id'],
            'title': data['title'],
            'template': data['template'],
            'status': data['status'],
            'score': data['score'],
            'content': data['content'],  # Full JSON content for preview rendering
            'personalInfo': data['content'].get('personalInfo', {}),
            'summary': data['content'].get('summary', ''),
            'experience': data['content'].get('experiences', data['content'].get('experience', [])),
            'education': data['content'].get('educations', data['content'].get('education', [])),
            'skills': data['content'].get('skills', ''),
            'projects': data['content'].get('projects', []),
            'certifications': data['content'].get('certifications', []),
            'languages': data['content'].get('languages', ''),
            'hobbies': data['content'].get('hobbies', ''),
            'volunteering': data['content'].get('volunteering', ''),
            'resumeStyle': data['content'].get('resumeStyle', 'modern'),
        }
        
        # If analyze=true, trigger AI review and update score/content
        toast_data = None
        if request.query_params.get('analyze') == 'true':
            try:
                print("Sending the request to gemini")
                ai_result = gemini_resume_generation_and_analysis(data['content'])
                if 'error' not in ai_result:
                    # Update resume with AI suggestions (e.g., improved summary, skills)
                    instance.content.update({
                        'summary': ai_result.get('improved_summary', data['content'].get('summary', '')),
                        'skills': ', '.join(ai_result.get('optimized_skills', [])),
                    })
                    instance.score = ai_result.get('overall_score', 95)  # High score from AI (90-100)
                    instance.status = 'completed'
                    instance.save()
                    
                    # Refresh structured data
                    structured_data['score'] = instance.score
                    structured_data['status'] = instance.status
                    structured_data['summary'] = instance.content.get('summary', '')
                    structured_data['skills'] = instance.content.get('skills', '')
                    
                    structured_data['ai_analysis'] = {
                        'suggestions': ai_result.get('suggestions', []),
                        'details': ai_result.get('details', ''),
                        'confidence': ai_result.get('confidence', 95),
                    }
                    
                    toast_data = {
                        'message': f"AI Review Complete! New Score: {structured_data['score']}%",
                        'type': 'success'
                    }
                else:
                    toast_data = {
                        'message': f"AI Review Error: {ai_result['error']}",
                        'type': 'error'
                    }
            except Exception as e:
                toast_data = {
                    'message': f"AI Review Failed: {str(e)}",
                    'type': 'error'
                }
        else:
            toast_data = None

        return Response({
            'resume': structured_data,
            'toast': toast_data  # Optional frontend toast trigger
        })

    def put(self, request, *args, **kwargs):
        """Handle update as before."""
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """Handle delete as before."""
        return super().delete(request, *args, **kwargs)