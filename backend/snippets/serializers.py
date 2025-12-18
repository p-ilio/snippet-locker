from rest_framework import serializers
from .models import Snippet

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        # These fields must match the names in your models.py
        fields = ['id', 'title', 'code', 'language', 'created_at']