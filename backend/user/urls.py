# user/urls.py
from django.urls import path
from .views import SignupView, MeView


app_name = 'user'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('me/', MeView.as_view(), name='me'),
]