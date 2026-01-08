from rest_framework import serializers
from .models import (
    Unit, Division, Department, Section, SubSection, Floor, Line,
    Grade, Designation, Group, Bank,
    SalarySetting, PFSetting, OTSetting
)
# Organization hierarchy
# ========================

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name"]

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ["id", "name", "unit"]

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "division"]

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name", "department"]

class SubSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSection
        fields = ["id", "name", "section"]

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = ["id", "name"]

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = ["id", "name", "floor"]

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
