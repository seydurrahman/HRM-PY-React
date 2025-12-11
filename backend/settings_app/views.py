from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import (
    Grade, Designation, Group, Bank,
    SalarySetting, PFSetting, OTSetting
)
from .serializers import (
    GradeSerializer, DesignationSerializer, GroupSerializer, BankSerializer,
    SalarySettingSerializer, PFSettingSerializer, OTSettingSerializer
)

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
