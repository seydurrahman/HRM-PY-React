from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Attendance, AttendanceUpload, JobCard, OTRecord
from .serializers import (
    AttendanceSerializer,
    AttendanceUploadSerializer,
    JobCardSerializer,
    OTRecordSerializer,
)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filterset_fields = ["employee", "date", "status"]
    search_fields = ["employee__code", "employee__first_name"]


class AttendanceUploadViewSet(viewsets.ModelViewSet):
    queryset = AttendanceUpload.objects.all()
    serializer_class = AttendanceUploadSerializer

    @action(detail=True, methods=["post"])
    def process(self, request, pk=None):
        upload = self.get_object()
        # TODO: CSV Process Logic
        upload.processed = True
        upload.save()
        return Response({"message": "Processed!"})


class JobCardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobCard.objects.all()
    serializer_class = JobCardSerializer
    filterset_fields = ["employee", "month", "year"]


class OTRecordViewSet(viewsets.ModelViewSet):
    queryset = OTRecord.objects.all()
    serializer_class = OTRecordSerializer
    filterset_fields = ["employee", "date", "approved"]
