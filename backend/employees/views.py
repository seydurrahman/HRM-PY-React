from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Employee
from .serializers import EmployeeSerializer
from .filters import EmployeeFilter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related(
        "designation", "grade", "unit", "division", 
        "department", "section", "subsection", "floor", "line"
    ).prefetch_related("other_documents").order_by("code")

    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EmployeeFilter

    search_fields = ["code", "first_name", "last_name", "email", "employee_id"]
    ordering_fields = ["code", "first_name", "last_name", "join_date"]

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Handle other documents
        request = self.request
        other_docs_raw = request.data.get("other_docs")
        other_docs_meta = []
        
        if other_docs_raw:
            try:
                import json
                other_docs_meta = json.loads(other_docs_raw)
            except Exception:
                other_docs_meta = []

        files = request.FILES.getlist("other_doc_files")
        for i, f in enumerate(files):
            title = None
            if i < len(other_docs_meta):
                title = other_docs_meta[i].get("title")
            if not instance.other_documents.filter(file__icontains=f.name).exists():
                instance.other_documents.create(title=title or f.name, file=f)

        # Handle JSON fields
        for field in ("job_experiences", "educations", "trainings"):
            raw = request.data.get(field)
            if raw:
                try:
                    import json
                    parsed = json.loads(raw)
                    setattr(instance, field, parsed)
                except Exception:
                    pass
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        request = self.request
        
        # Handle other documents for updates
        other_docs_raw = request.data.get("other_docs")
        other_docs_meta = []
        
        if other_docs_raw:
            try:
                import json
                other_docs_meta = json.loads(other_docs_raw)
            except Exception:
                other_docs_meta = []

        files = request.FILES.getlist("other_doc_files")
        for i, f in enumerate(files):
            title = None
            if i < len(other_docs_meta):
                title = other_docs_meta[i].get("title")
            if not instance.other_documents.filter(file__icontains=f.name).exists():
                instance.other_documents.create(title=title or f.name, file=f)

        # Update JSON fields
        for field in ("job_experiences", "educations", "trainings"):
            raw = request.data.get(field)
            if raw:
                try:
                    import json
                    parsed = json.loads(raw)
                    setattr(instance, field, parsed)
                except Exception:
                    pass
        instance.save()


class CountryList(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        from django_countries import countries
        return Response([{"name": name} for code, name in list(countries)])