from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializer import SignupSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        response_data = serializer.data
        response_data.update({
            'access': str(access_token),
            'refresh': str(refresh),
        })
        
        headers = self.get_success_headers(serializer.data)
        
        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class MeView(generics.RetrieveAPIView):
    """
    API endpoint to fetch current user profile.
    Returns basic user info.
    Permission: IsAuthenticated.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user