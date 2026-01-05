from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
# Import the specialized view that converts credentials into a Token
from rest_framework.authtoken.views import obtain_auth_token 
from snippets.views import register_user # <--- Make sure this import is there

# Home view: Provides a landing message for the root URL 
# to confirm the server is live.
def home(request):
    return HttpResponse("Snippet Locker API is running. Go to /api/snippets/ to see data.")

urlpatterns = [
    # API Status Page
    path('', home, name='api-home'), 
    path('api/register/', register_user, name='register'), # <--- This line connects the view
    path('api/', include('snippets.urls')),
    
    # Django Admin Dashboard
    path('admin/', admin.site.urls),
    
    # AUTHENTICATION ENDPOINT
    # React hits this with a POST request containing {username, password}
    # to receive an {auth_token} in return.
    path('api/auth/', obtain_auth_token, name='api-token-auth'), 
    
    # SNIPPET ROUTES
    # Forwards all 'api/...' requests to the snippets app urls.py
    path('api/', include('snippets.urls')),
]