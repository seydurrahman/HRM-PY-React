from rest_framework import generics
from .models import *
from .serializers import *

class GroupCompanyList(generics.ListCreateAPIView):
    queryset = GroupCompany.objects.all()
    serializer_class = GroupCompanySerializer


class UnitList(generics.ListCreateAPIView):
    serializer_class = UnitSerializer

    def get_queryset(self):
        company_id = self.request.query_params.get('company_id')
        if company_id:
            return Unit.objects.filter(company_id=company_id)
        return Unit.objects.all()


class DivisionList(generics.ListCreateAPIView):
    serializer_class = DivisionSerializer

    def get_queryset(self):
        unit_id = self.request.query_params.get('unit_id')
        if unit_id:
            return Division.objects.filter(unit_id=unit_id)
        return Division.objects.all()


class DepartmentList(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        division_id = self.request.query_params.get('division_id')
        if division_id:
            return Department.objects.filter(division_id=division_id)
        return Department.objects.all()


class SectionList(generics.ListCreateAPIView):
    serializer_class = SectionSerializer

    def get_queryset(self):
        department_id = self.request.query_params.get('department_id')
        if department_id:
            return Section.objects.filter(department_id=department_id)
        return Section.objects.all()


class SubsectionList(generics.ListCreateAPIView):
    serializer_class = SubsectionSerializer

    def get_queryset(self):
        section_id = self.request.query_params.get('section_id')
        if section_id:
            return Subsection.objects.filter(section_id=section_id)
        return Subsection.objects.all()


class FloorList(generics.ListCreateAPIView):
    serializer_class = FloorSerializer

    def get_queryset(self):
        section_id = self.request.query_params.get('section_id')
        if section_id:
            return Floor.objects.filter(section_id=section_id)
        return Floor.objects.all()


class LineList(generics.ListCreateAPIView):
    serializer_class = LineSerializer

    def get_queryset(self):
        floor_id = self.request.query_params.get('floor_id')
        if floor_id:
            return Line.objects.filter(floor_id=floor_id)
        return Line.objects.all()


class TableList(generics.ListCreateAPIView):
    serializer_class = TableSerializer

    def get_queryset(self):
        floor_id = self.request.query_params.get('floor_id')
        if floor_id:
            return Table.objects.filter(floor_id=floor_id)
        return Table.objects.all()
