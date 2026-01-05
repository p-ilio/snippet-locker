from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Snippet
from .serializers import SnippetSerializer

class SnippetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Snippet CRUD operations
    
    - Requires authentication for all operations
    - Users can only see and manage their own snippets
    - Automatically associates new snippets with the authenticated user
    """
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return only snippets belonging to the authenticated user
        """
        return Snippet.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Save the snippet with the authenticated user as the owner
        """
        serializer.save(user=self.request.user)

# ============================================================================
# USER AUTHENTICATION VIEWS (NEW)
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Handles new user registration.
    
    1. Extracts 'username' and 'password' from the request body.
    2. Validates that both fields are provided.
    3. Checks if the username already exists in the database.
    4. Creates a new User instance with a hashed password.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Basic validation
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prevent duplicate usernames
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # create_user is a built-in helper that hashes the password automatically
    User.objects.create_user(username=username, password=password)
    
    return Response(
        {'message': 'User created successfully'}, 
        status=status.HTTP_201_CREATED
    )