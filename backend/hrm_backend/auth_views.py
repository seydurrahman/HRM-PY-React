from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
