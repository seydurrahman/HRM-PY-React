from rest_framework import serializers
from .models import (
    Company,
    Unit,
    Division,
    Department,
    Section,
    SubSection,
    Floor,
    Line,
    Table,
    Grade,
    Designation,
    Group,
    Bank,
    SalarySetting,
    PFSetting,
    OTSetting,
)

# Organization hierarchy
# ========================


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name"]


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name", "company"]

    def to_internal_value(self, data):
        # allow company to be provided as id or name
        company = data.get("company")
        if isinstance(company, str):
            from .models import Company

            obj, _ = Company.objects.get_or_create(name=company)
            data["company"] = obj.pk
        return super().to_internal_value(data)


class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ["id", "name", "unit"]

    def to_internal_value(self, data):
        unit = data.get("unit")
        if isinstance(unit, str):
            obj, _ = Unit.objects.get_or_create(name=unit)
            data["unit"] = obj.pk
        return super().to_internal_value(data)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "division"]

    def to_internal_value(self, data):
        division = data.get("division")
        if isinstance(division, str):
            obj, _ = Division.objects.get_or_create(name=division)
            data["division"] = obj.pk
        return super().to_internal_value(data)


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name", "department"]

    def to_internal_value(self, data):
        department = data.get("department")
        if isinstance(department, str):
            obj, _ = Department.objects.get_or_create(name=department)
            data["department"] = obj.pk
        return super().to_internal_value(data)


class SubSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSection
        fields = ["id", "name", "section"]

    def to_internal_value(self, data):
        section = data.get("section")
        if isinstance(section, str):
            obj, _ = Section.objects.get_or_create(name=section)
            data["section"] = obj.pk
        return super().to_internal_value(data)


class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = ["id", "name", "section"]

    def to_internal_value(self, data):
        section = data.get("section")
        if isinstance(section, str):
            obj, _ = Section.objects.get_or_create(name=section)
            data["section"] = obj.pk
        return super().to_internal_value(data)


class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = ["id", "name", "floor"]

    def to_internal_value(self, data):
        floor = data.get("floor")
        if isinstance(floor, str):
            obj, _ = Floor.objects.get_or_create(name=floor)
            data["floor"] = obj.pk
        return super().to_internal_value(data)


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ["id", "name", "floor"]

    def to_internal_value(self, data):
        floor = data.get("floor")
        if isinstance(floor, str):
            obj, _ = Floor.objects.get_or_create(name=floor)
            data["floor"] = obj.pk
        return super().to_internal_value(data)


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = "__all__"


class SalarySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalarySetting
        fields = "__all__"


class PFSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PFSetting
        fields = "__all__"


class OTSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTSetting
        fields = "__all__"
