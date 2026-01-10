from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
# Remove: from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import (
    Unit, Division, Department, Section, SubSection, Floor, Line,
    Grade, Designation, Group, Bank,
    SalarySetting, PFSetting, OTSetting
)
from .serializers import (
    UnitSerializer, DivisionSerializer, DepartmentSerializer,
    SectionSerializer, SubSectionSerializer, FloorSerializer, LineSerializer,
    GradeSerializer, DesignationSerializer, GroupSerializer, BankSerializer,
    SalarySettingSerializer, PFSettingSerializer, OTSettingSerializer
)

# Change ALL ReadOnlyModelViewSet to ModelViewSet for organizational structure
class UnitViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [IsAuthenticated]  # Added permission


class DivisionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = DivisionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = Division.objects.all()
        unit = self.request.query_params.get("unit")
        return qs.filter(unit_id=unit) if unit else qs


class DepartmentViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = Department.objects.all()
        division = self.request.query_params.get("division")
        return qs.filter(division_id=division) if division else qs


class SectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = Section.objects.all()
        department = self.request.query_params.get("department")
        return qs.filter(department_id=department) if department else qs


class SubSectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = SubSectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = SubSection.objects.all()
        section = self.request.query_params.get("section")
        return qs.filter(section_id=section) if section else qs


class FloorViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer
    permission_classes = [IsAuthenticated]  # Added permission


class LineViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = LineSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = Line.objects.all()
        floor = self.request.query_params.get("floor")
        return qs.filter(floor_id=floor) if floor else qs


# These are already ModelViewSet, so keep them as is but ensure permissions
class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by("level")
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all().order_by("name")
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    permission_classes = [IsAuthenticated]


class SalarySettingViewSet(viewsets.ModelViewSet):
    queryset = SalarySetting.objects.all()
    serializer_class = SalarySettingSerializer
    permission_classes = [IsAuthenticated]


class PFSettingViewSet(viewsets.ModelViewSet):
    queryset = PFSetting.objects.all()
    serializer_class = PFSettingSerializer
    permission_classes = [IsAuthenticated]


class OTSettingViewSet(viewsets.ModelViewSet):
    queryset = OTSetting.objects.all()
    serializer_class = OTSettingSerializer
    permission_classes = [IsAuthenticated]