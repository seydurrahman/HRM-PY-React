from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import JobRequisition, Candidate, CandidateDocument, Interview, Offer
from .serializers import (
    JobRequisitionSerializer, CandidateSerializer,
    CandidateDocumentSerializer, InterviewSerializer, OfferSerializer
)

class JobRequisitionViewSet(viewsets.ModelViewSet):
    queryset = JobRequisition.objects.all().order_by("-created_at")
    serializer_class = JobRequisitionSerializer
    filterset_fields = ["status", "department"]


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all().order_by("-applied_at")
    serializer_class = CandidateSerializer
    filterset_fields = ["requisition", "status", "email"]

    # endpoint: POST /api/candidates/{pk}/advance_status/  body: {"status":"SH", "notes":"..." }
    @action(detail=True, methods=["post"])
    def advance_status(self, request, pk=None):
        cand = self.get_object()
        new_status = request.data.get("status")
        notes = request.data.get("notes", "")
        if new_status not in dict(Candidate.STATUS):
            return Response({"error":"Invalid status"}, status=400)
        cand.status = new_status
        if notes:
            cand.notes = f"{timezone.now().isoformat()} - {notes}\n\n" + cand.notes
        cand.save()
        return Response({"message":"Status updated", "status": cand.status})

    @action(detail=True, methods=["post"])
    def upload_resume(self, request, pk=None):
        cand = self.get_object()
        file = request.FILES.get("resume")
        if not file:
            return Response({"error":"No file"}, status=400)
        cand.resume = file
        cand.save()
        return Response({"message":"Resume uploaded"})

class CandidateDocumentViewSet(viewsets.ModelViewSet):
    queryset = CandidateDocument.objects.all()
    serializer_class = CandidateDocumentSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all().order_by("-scheduled_at")
    serializer_class = InterviewSerializer

    @action(detail=True, methods=["post"])
    def set_result(self, request, pk=None):
        iv = self.get_object()
        iv.result = request.data.get("result", "")
        iv.notes = request.data.get("notes", iv.notes)
        iv.save()
        return Response({"message":"Result set"})

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by("-issued_at")
    serializer_class = OfferSerializer

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        offer = self.get_object()
        offer.accepted = True
        offer.accepted_at = timezone.now()
        offer.save()
        return Response({"message":"Offer accepted"})
