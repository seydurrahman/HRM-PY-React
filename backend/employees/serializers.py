from rest_framework import serializers
from .models import Employee, EmployeeOtherDocument
from settings_app.models import Designation, Grade
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

    other_documents = EmployeeOtherDocumentSerializer(many=True, read_only=True)

    # Accept JSON in multipart/form-data as well
    job_experiences = serializers.JSONField(required=False, allow_null=True)
    educations = serializers.JSONField(required=False, allow_null=True)
    trainings = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = Employee
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]

    def validate_designation(self, value):
        # value may be an instance or an id depending on how it's passed.
        pk = getattr(value, "id", value)
        if pk and not Designation.objects.filter(id=pk).exists():
            raise serializers.ValidationError("Invalid designation selected.")
        return value

    def validate_grade(self, value):
        pk = getattr(value, "id", value)
        if pk and not Grade.objects.filter(id=pk).exists():
            raise serializers.ValidationError("Invalid grade selected.")
        return value

    def create(self, validated_data):
        validated_data.setdefault("employee_type", "PER")
        validated_data.setdefault("employment_type", "FT")
        validated_data.setdefault("is_active", True)

        if "join_date" not in validated_data:
            from datetime import date

            validated_data["join_date"] = date.today()

        return super().create(validated_data)

    def validate_date_of_birth(self, value):
        if value:
            from datetime import date

            if value > date.today():
                raise serializers.ValidationError(
                    "Date of birth cannot be in the future."
                )
        return value
