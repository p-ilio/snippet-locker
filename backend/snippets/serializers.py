from rest_framework import serializers
from .models import Snippet
from django.contrib.auth.models import User

class SnippetSerializer(serializers.ModelSerializer):
    """
    Serializer for Snippet model
    Automatically associates snippets with the authenticated user
    """
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Snippet
        fields = ['id', 'title', 'code', 'language', 'created_at', 'user']
        read_only_fields = ['created_at', 'user']