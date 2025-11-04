# resumes/urls.py (updated - no router, just paths for consistency)
from django.urls import path
from .views import ResumeListView, ResumeDetailView


app_name = 'resumes'

urlpatterns = [
    path('resumes/', ResumeListView.as_view(), name='list'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='detail'),
    path('resumes/google/<int:pk>/', ResumeDetailView.as_view(), name='detail'),
]