from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_countries import countries
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by("code")
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    # ADD THIS ↓↓
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["employee_type", "employment_type", "designation", "grade"]
    search_fields = ["code", "first_name", "last_name", "email"]
    ordering_fields = ["code", "first_name", "last_name"]

class CountryList(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # <<< IMPORTANT FIX

    def get(self, request):
        return Response([
            {"name": name}
            for code, name in list(countries)
        ])