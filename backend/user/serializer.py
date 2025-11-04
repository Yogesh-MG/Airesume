from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username']
        read_only_fields = ['id', 'username']
        
        def create(self, validated_data):
            if 'username' not in validated_data:
                validated_data['username'] = validated_data['email'].split('@')[0]
            return super().create(validated_data)
        

class SignupSerializer(UserSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        min_length=8,
        help_text={
            'min_length': 'Password must be at least 8 characters long.',
        }
    )
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['password', 'password_confirm']
        extra_kwargs = {
            'password_confirm': {'write_only': True},
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not math'}
            )
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save(update_fields=['password'])
        return user