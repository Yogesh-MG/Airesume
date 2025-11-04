# resumes/serializers.py
from rest_framework import serializers
from .models import Resume
from django.contrib.auth import get_user_model


User = get_user_model()


class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer for Resume model.
    Handles creation/update with user scoping.
    """
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'template', 'content', 'score', 'status',
            'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['id', 'user', 'score', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Auto-set user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ResumeListSerializer(ResumeSerializer):
    """
    List serializer - lightweight for dashboard.
    """
    lastUpdated = serializers.DateTimeField(
        source='updated_at', format='%Y-%m-%dT%H:%M:%SZ'
    )

    class Meta(ResumeSerializer.Meta):
        fields = [
            'id', 'title', 'template', 'score', 'lastUpdated', 'status'
        ]