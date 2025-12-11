from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from employees.models import Employee
from settings_app.models import SalarySetting
from payroll.models import Salary

from .models import PFSetting, PFContribution, PFWithdrawal
from .serializers import (
    PFSettingSerializer,
    PFContributionSerializer,
    PFWithdrawalSerializer
)


class PFSettingViewSet(viewsets.ModelViewSet):
    queryset = PFSetting.objects.all()
    serializer_class = PFSettingSerializer


class PFContributionViewSet(viewsets.ModelViewSet):
    queryset = PFContribution.objects.all()
    serializer_class = PFContributionSerializer
    filterset_fields = ["employee", "month", "year"]

    @action(detail=False, methods=["post"])
    def generate(self, request):
        month = int(request.data["month"])
        year = int(request.data["year"])

        try:
            pf_setting = PFSetting.objects.get(active=True)
        except PFSetting.DoesNotExist:
            return Response({"error": "No PF settings found"}, status=400)

        employees = Employee.objects.filter(pf_member=True)

        for emp in employees:
            try:
                salary = Salary.objects.get(employee=emp, month=month, year=year)
            except Salary.DoesNotExist:
                return Response({
                    "error": f"Salary not generated for {emp.code}"
                })

            employee_contri = salary.basic * (pf_setting.employee_percent / 100)
            employer_contri = salary.basic * (pf_setting.employer_percent / 100)
            total = employee_contri + employer_contri

            PFContribution.objects.update_or_create(
                employee=emp,
                month=month,
                year=year,
                defaults=dict(
                    employee_amount=employee_contri,
                    employer_amount=employer_contri,
                    total=total
                )
            )

        return Response({"message": "PF Contribution Generated!"})


class PFWithdrawalViewSet(viewsets.ModelViewSet):
    queryset = PFWithdrawal.objects.all()
    serializer_class = PFWithdrawalSerializer

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        wd = self.get_object()
        wd.approved = True
        wd.approved_by = "HR Admin"
        wd.save()
        return Response({"message": "Approved!"})
