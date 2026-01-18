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


class EmployeeSerializer(serializers.ModelSerializer):
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
     # Add these as regular CharFields
    nominee_country = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    address_division = serializers.CharField(required=False, allow_blank=True)
    
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

    def to_internal_value(self, data):
        # Allow organization fields to be provided as names (or ids). When a name is
        # received, try to resolve to an existing object, or create a minimal one if
        # possible (e.g., Unit, Grade, Designation). For multi-level parents (Division -> Unit)
        # prefer the provided parent id/name to create dependent objects.
        d = data.copy()

        def ensure_unit(val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                obj, _ = Unit.objects.get_or_create(name=val)
                return obj.pk
            return val

        def ensure_division(val, unit_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                # try to find existing by name
                try:
                    return Division.objects.get(name=val).pk
                except Division.DoesNotExist:
                    # Need unit to create
                    if unit_val:
                        unit_pk = (
                            Unit.objects.get(pk=int(unit_val)).pk
                            if str(unit_val).isdigit()
                            else Unit.objects.get(name=unit_val).pk
                        )
                        obj = Division.objects.create(name=val, unit_id=unit_pk)
                        return obj.pk
                    raise serializers.ValidationError(
                        {"division": "Provide unit when creating a division by name."}
                    )
            return val

        def ensure_department(val, division_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                try:
                    return Department.objects.get(name=val).pk
                except Department.DoesNotExist:
                    if division_val:
                        div_pk = (
                            Division.objects.get(pk=int(division_val)).pk
                            if str(division_val).isdigit()
                            else Division.objects.get(name=division_val).pk
                        )
                        obj = Department.objects.create(name=val, division_id=div_pk)
                        return obj.pk
                    raise serializers.ValidationError(
                        {
                            "department": "Provide division when creating a department by name."
                        }
                    )
            return val

        def ensure_section(val, department_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                try:
                    return Section.objects.get(name=val).pk
                except Section.DoesNotExist:
                    if department_val:
                        dep_pk = (
                            Department.objects.get(pk=int(department_val)).pk
                            if str(department_val).isdigit()
                            else Department.objects.get(name=department_val).pk
                        )
                        obj = Section.objects.create(name=val, department_id=dep_pk)
                        return obj.pk
                    raise serializers.ValidationError(
                        {
                            "section": "Provide department when creating a section by name."
                        }
                    )
            return val

        def ensure_subsection(val, section_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                try:
                    return SubSection.objects.get(name=val).pk
                except SubSection.DoesNotExist:
                    if section_val:
                        sec_pk = (
                            Section.objects.get(pk=int(section_val)).pk
                            if str(section_val).isdigit()
                            else Section.objects.get(name=section_val).pk
                        )
                        obj = SubSection.objects.create(name=val, section_id=sec_pk)
                        return obj.pk
                    raise serializers.ValidationError(
                        {
                            "subsection": "Provide section when creating a subsection by name."
                        }
                    )
            return val

        def ensure_floor(val, section_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                try:
                    return Floor.objects.get(name=val).pk
                except Floor.DoesNotExist:
                    # Floor.section allows null, so create without section if needed
                    sec_pk = None
                    if section_val:
                        sec_pk = (
                            Section.objects.get(pk=int(section_val)).pk
                            if str(section_val).isdigit()
                            else Section.objects.get(name=section_val).pk
                        )
                    obj = Floor.objects.create(name=val, section_id=sec_pk)
                    return obj.pk
            return val

        def ensure_line(val, floor_val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                try:
                    return Line.objects.get(name=val).pk
                except Line.DoesNotExist:
                    if floor_val:
                        fl_pk = (
                            Floor.objects.get(pk=int(floor_val)).pk
                            if str(floor_val).isdigit()
                            else Floor.objects.get(name=floor_val).pk
                        )
                        obj = Line.objects.create(name=val, floor_id=fl_pk)
                        return obj.pk
                    raise serializers.ValidationError(
                        {"line": "Provide floor when creating a line by name."}
                    )
            return val

        def ensure_designation(val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                obj, _ = Designation.objects.get_or_create(name=val)
                return obj.pk
            return val

        def ensure_grade(val):
            if not val:
                return None
            if isinstance(val, str) and not val.isdigit():
                obj, _ = Grade.objects.get_or_create(name=val)
                return obj.pk
            return val

        # Resolve in dependency order
        if "unit" in d:
            d["unit"] = ensure_unit(d.get("unit"))
        if "division" in d:
            d["division"] = ensure_division(d.get("division"), d.get("unit"))
        if "department" in d:
            d["department"] = ensure_department(d.get("department"), d.get("division"))
        if "section" in d:
            d["section"] = ensure_section(d.get("section"), d.get("department"))
        if "subsection" in d:
            d["subsection"] = ensure_subsection(d.get("subsection"), d.get("section"))
        if "floor" in d:
            d["floor"] = ensure_floor(d.get("floor"), d.get("section"))
        if "line" in d:
            d["line"] = ensure_line(d.get("line"), d.get("floor"))
        if "designation" in d:
            d["designation"] = ensure_designation(d.get("designation"))
        if "grade" in d:
            d["grade"] = ensure_grade(d.get("grade"))

        return super().to_internal_value(d)

    def create(self, validated_data):
        # Set defaults
        validated_data.setdefault("employee_type", "PER")
        validated_data.setdefault("employment_type", "FT")
        validated_data.setdefault("is_active", True)

        # Ensure JSON fields are lists
        for field in ["job_experiences", "educations", "trainings"]:
            if field not in validated_data:
                validated_data[field] = []

        return super().create(validated_data)
