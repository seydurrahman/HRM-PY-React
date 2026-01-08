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
from .filters import EmployeeFilter  # ✅ ADD THIS


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = (
        Employee.objects.select_related("designation", "grade")
        .prefetch_related("other_documents")
        .order_by("code")
    )

    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EmployeeFilter  # ✅ USE CUSTOM FILTER

    search_fields = ["code", "first_name", "last_name", "email"]
    ordering_fields = ["code", "first_name", "last_name"]

    def perform_create(self, serializer):
        instance = serializer.save()
        # Handle uploaded other documents
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
            instance.other_documents.create(title=title or f.name, file=f)

        # parse JSON fields that come via multipart/form-data
        for field in ("job_experiences", "educations", "trainings"):
            raw = request.data.get(field)
            if raw:
                try:
                    import json

                    parsed = json.loads(raw)
                    setattr(instance, field, parsed)
                except Exception:
                    # leave as-is if parse fails
                    pass
        instance.save()

    def perform_update(self, serializer):
        # Save first to get instance
        instance = serializer.save()
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
            instance.other_documents.create(title=title or f.name, file=f)

        # parse JSON fields that come via multipart/form-data
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
    authentication_classes = []  # <<< IMPORTANT FIX

    def get(self, request):
        return Response([{"name": name} for code, name in list(countries)])
