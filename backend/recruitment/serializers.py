from rest_framework import serializers
from .models import JobRequisition, Candidate, CandidateDocument, Interview, Offer

class JobRequisitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRequisition
        fields = "__all__"


class CandidateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateDocument
        fields = "__all__"


class CandidateSerializer(serializers.ModelSerializer):
    requisition_title = serializers.CharField(source="requisition.title", read_only=True)
    documents = CandidateDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Candidate
        fields = "__all__"


class InterviewSerializer(serializers.ModelSerializer):
    panel_list = serializers.SerializerMethodField()

    class Meta:
        model = Interview
        fields = "__all__"

    def get_panel_list(self, obj):
        return [f"{p.code} - {p.first_name} {p.last_name}" for p in obj.panel.all()]


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"
