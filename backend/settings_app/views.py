from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Remove: from rest_framework.viewsets import ReadOnlyModelViewSet
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
    EmployeeCategory,
    OTEligibilitySetting,
)
from .serializers import (
    CompanySerializer,
    OTEligibilitySettingSerializer,
    UnitSerializer,
    DivisionSerializer,
    DepartmentSerializer,
    SectionSerializer,
    SubSectionSerializer,
    FloorSerializer,
    LineSerializer,
    TableSerializer,
    GradeSerializer,
    DesignationSerializer,
    GroupSerializer,
    BankSerializer,
    SalarySettingSerializer,
    PFSettingSerializer,
    OTEligibilitySettingSerializer,
    EmployeeCategorySerializer,
)


# Change ALL ReadOnlyModelViewSet to ModelViewSet for organizational structure
class UnitViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        company = self.request.query_params.get(
            "company_id"
        ) or self.request.query_params.get("company")
        return qs.filter(company_id=company) if company else qs


class DivisionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        unit = self.request.query_params.get("unit")
        return qs.filter(unit_id=unit) if unit else qs


class DepartmentViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        division = self.request.query_params.get("division")
        return qs.filter(division_id=division) if division else qs


class SectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        department = self.request.query_params.get("department")
        return qs.filter(department_id=department) if department else qs


class SubSectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = SubSection.objects.all()
    serializer_class = SubSectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        section = self.request.query_params.get("section")
        return qs.filter(section_id=section) if section else qs


class DepartmentViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        division = self.request.query_params.get("division")
        return qs.filter(division_id=division) if division else qs


class SectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = super().get_queryset()
        department = self.request.query_params.get("department")
        return qs.filter(department_id=department) if department else qs


class SubSectionViewSet(viewsets.ModelViewSet):  # Changed from ReadOnlyModelViewSet
    serializer_class = SubSectionSerializer
    permission_classes = [IsAuthenticated]  # Added permission

    def get_queryset(self):
        qs = SubSection.objects.all()
        section = self.request.query_params.get("section")
        return qs.filter(section_id=section) if section else qs


class FloorViewSet(viewsets.ModelViewSet):
    queryset = Floor.objects.all()  # ← ADD THIS
    serializer_class = FloorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        section = self.request.query_params.get("section")
        return qs.filter(section_id=section) if section else qs


class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()  # ← ADD THIS
    serializer_class = LineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        floor = self.request.query_params.get("floor")
        return qs.filter(floor_id=floor) if floor else qs


# These are already ModelViewSet, so keep them as is but ensure permissions
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]


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


class EmployeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = EmployeeCategory.objects.all()
    serializer_class = EmployeeCategorySerializer
    permission_classes = [IsAuthenticated]


class OTEligibilitySettingViewSet(viewsets.ModelViewSet):
    queryset = OTEligibilitySetting.objects.all()
    serializer_class = OTEligibilitySettingSerializer
    permission_classes = [IsAuthenticated]