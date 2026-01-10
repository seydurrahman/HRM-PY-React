from rest_framework import serializers
from .models import Employee, EmployeeOtherDocument
from settings_app.models import (
    Designation,
    Grade,
    Division,
    Department,
    Section,
    SubSection,
    Unit,
    Floor,
    Line,
)
from django_countries.serializers import CountryFieldMixin


class EmployeeOtherDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeOtherDocument
        fields = ["id", "title", "file", "uploaded_at"]


class EmployeeSerializer(CountryFieldMixin, serializers.ModelSerializer):
    designation_name = serializers.CharField(
        source="designation.name",
        read_only=True,
    )
    grade_name = serializers.CharField(
        source="grade.name",
        read_only=True,
    )
    department_name = serializers.CharField(source="department.name", read_only=True)
    unit_name = serializers.CharField(source="unit.name", read_only=True)
    division_name = serializers.CharField(source="division.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True)
    subsection_name = serializers.CharField(source="subsection.name", read_only=True)
    floor_name = serializers.CharField(source="floor.name", read_only=True)
    line_name = serializers.CharField(source="line.name", read_only=True)
    
    # Alias for legacy field name
    leave_effective = serializers.DateField(
        source="Leave_effective", required=False, allow_null=True
    )

    other_documents = EmployeeOtherDocumentSerializer(many=True, read_only=True)

    # JSON fields
    job_experiences = serializers.JSONField(required=False, default=list)
    educations = serializers.JSONField(required=False, default=list)
    trainings = serializers.JSONField(required=False, default=list)

    class Meta:
        model = Employee
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]

    def validate_email(self, value):
        """Make email optional and handle empty strings"""
        if value == "":
            return None
        return value

    def validate_join_date(self, value):
        """Set default join date if not provided"""
        if not value:
            from datetime import date
            return date.today()
        return value

    def create(self, validated_data):
        # Set defaults
        validated_data.setdefault("employee_type", "PER")
        validated_data.setdefault("employment_type", "FT")
        validated_data.setdefault("is_active", True)
        
        # Ensure JSON fields are lists
        for field in ['job_experiences', 'educations', 'trainings']:
            if field not in validated_data:
                validated_data[field] = []
                
        return super().create(validated_data)