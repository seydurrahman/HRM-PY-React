from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
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

class UnitViewSet(ReadOnlyModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class DivisionViewSet(ReadOnlyModelViewSet):
    serializer_class = DivisionSerializer

    def get_queryset(self):
        qs = Division.objects.all()
        unit = self.request.query_params.get("unit")
        return qs.filter(unit_id=unit) if unit else qs

class DepartmentViewSet(ReadOnlyModelViewSet):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        qs = Department.objects.all()
        division = self.request.query_params.get("division")
        return qs.filter(division_id=division) if division else qs

class SectionViewSet(ReadOnlyModelViewSet):
    serializer_class = SectionSerializer

    def get_queryset(self):
        qs = Section.objects.all()
        department = self.request.query_params.get("department")
        return qs.filter(department_id=department) if department else qs

class SubSectionViewSet(ReadOnlyModelViewSet):
    serializer_class = SubSectionSerializer

    def get_queryset(self):
        qs = SubSection.objects.all()
        section = self.request.query_params.get("section")
        return qs.filter(section_id=section) if section else qs

class FloorViewSet(ReadOnlyModelViewSet):
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer

class LineViewSet(ReadOnlyModelViewSet):
    serializer_class = LineSerializer

    def get_queryset(self):
        qs = Line.objects.all()
        floor = self.request.query_params.get("floor")
        return qs.filter(floor_id=floor) if floor else qs

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
