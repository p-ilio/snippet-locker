from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    
    Expected JSON:
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    
    Returns:
    {
        "token": "string",
        "user": {
            "id": int,
            "username": "string",
            "email": "string"
        }
    }
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Validation
    if not username or not password:
        return Response(
            {'error': 'Please provide username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    # Create token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login existing user
    
    Expected JSON:
    {
        "username": "string",
        "password": "string"
    }
    
    Returns:
    {
        "token": "string",
        "user": {
            "id": int,
            "username": "string",
            "email": "string"
        }
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Validation
    if not username or not password:
        return Response(
            {'error': 'Please provide username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get or create token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })


@api_view(['POST'])
def logout(request):
    """
    Logout user by deleting their token
    
    Requires authentication token in header
    """
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)