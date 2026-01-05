from django.db import models
from django.contrib.auth.models import User

class Snippet(models.Model):
    """
    Code snippet model with user ownership
    
    Each snippet belongs to a specific user and contains:
    - title: Short description of the snippet
    - code: The actual code content
    - language: Programming language for syntax highlighting
    - created_at: Timestamp of creation
    - user: Foreign key to the User who owns this snippet
    """
    title = models.CharField(max_length=100)
    code = models.TextField()
    language = models.CharField(max_length=50, default='python')
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='snippets')

    class Meta:
        ordering = ['-created_at']  # Most recent first

    def __str__(self):
        return f"{self.title} - {self.user.username}"