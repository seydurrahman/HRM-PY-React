from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models

from employees.models import Employee
from attendance.models import Attendance
from settings_app.models import SalarySetting
from .models import (
    SalaryPolicy,
    Increment,
    Promotion,
    BonusPolicy,
    BonusPayment,
    Salary,
)
from .serializers import (
    SalaryPolicySerializer,
    IncrementSerializer,
    PromotionSerializer,
    BonusPolicySerializer,
    BonusPaymentSerializer,
    SalarySerializer,
)

import calendar


class SalaryPolicyViewSet(viewsets.ModelViewSet):
    queryset = SalaryPolicy.objects.all()
    serializer_class = SalaryPolicySerializer
    filterset_fields = ["employee_type"]


class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    filterset_fields = ["employee", "month", "year"]

    @action(detail=False, methods=["post"])
    def generate(self, request):
        month = int(request.data["month"])
        year = int(request.data["year"])

        employees = Employee.objects.filter(is_active=True)
        salary_data = []

        for emp in employees:
            try:
                setting = SalarySetting.objects.get(grade=emp.grade)
            except SalarySetting.DoesNotExist:
                continue

            # Earnings
            basic = setting.basic
            house_rent = setting.house_rent
            medical = setting.medical
            transport = setting.transport
            other = setting.others

            # Calculate OT
            ot_hours = (
                Attendance.objects.filter(
                    employee=emp, date__month=month, date__year=year
                ).aggregate(total=models.Sum("ot_hours"))["total"]
                or 0
            )
            ot_amount = ot_hours * 100  # Example OT rate

            # PF
            if emp.pf_member:
                pf_employee = basic * 0.08
                pf_employer = basic * 0.10
            else:
                pf_employee = 0
                pf_employer = 0

            # Loan (coming from Loans module later)
            loan_deduction = 0

            # Tax (simple example)
            tax = basic * 0.05

            total_earnings = (
                basic + house_rent + medical + transport + other + ot_amount
            )
            total_deductions = pf_employee + loan_deduction + tax
            net = total_earnings - total_deductions

            salary = Salary.objects.update_or_create(
                employee=emp,
                month=month,
                year=year,
                defaults=dict(
                    basic=basic,
                    house_rent=house_rent,
                    medical=medical,
                    transport=transport,
                    other_allowance=other,
                    ot_amount=ot_amount,
                    pf_employee=pf_employee,
                    pf_employer=pf_employer,
                    loan_deduction=loan_deduction,
                    tax_deduction=tax,
                    total_earnings=total_earnings,
                    total_deductions=total_deductions,
                    net_salary=net,
                ),
            )

        return Response({"message": "Salary generated!"})


# ----------------------------------------------------
# Increment ViewSet
# ----------------------------------------------------
class IncrementViewSet(viewsets.ModelViewSet):
    queryset = Increment.objects.all().order_by("-id")
    serializer_class = IncrementSerializer
    filterset_fields = ["employee"]


# ----------------------------------------------------
# Promotion ViewSet
# ----------------------------------------------------
class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all().order_by("-id")
    serializer_class = PromotionSerializer
    filterset_fields = ["employee"]


# ----------------------------------------------------
# Bonus Policy ViewSet
# ----------------------------------------------------
class BonusPolicyViewSet(viewsets.ModelViewSet):
    queryset = BonusPolicy.objects.all().order_by("id")
    serializer_class = BonusPolicySerializer


# ----------------------------------------------------
# Bonus Payment ViewSet
# ----------------------------------------------------
class BonusPaymentViewSet(viewsets.ModelViewSet):
    queryset = BonusPayment.objects.all().order_by("-id")
    serializer_class = BonusPaymentSerializer
    filterset_fields = ["employee", "payment_month", "payment_year"]
