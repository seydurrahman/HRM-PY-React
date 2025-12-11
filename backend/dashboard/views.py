from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum
from datetime import date

from employees.models import Employee
from attendance.models import Attendance
from leaves.models import LeaveApplication
from payroll.models import Salary
from pf.models import PFContribution
from loans.models import LoanRequest, LoanDisbursement
from recruitment.models import Candidate, JobRequisition


@api_view(["GET"])
def analytics_summary(request):
    today = date.today()
    month = today.month
    year = today.year

    # EMPLOYEES
    total_employees = Employee.objects.count()
    active_employees = Employee.objects.filter(is_active=True).count()

    # ATTENDANCE TODAY
    present_today = Attendance.objects.filter(date=today).count()
    absent_today = total_employees - present_today

    # LEAVES
    pending_leaves = LeaveApplication.objects.filter(status="P").count()

    # PAYROLL
    monthly_salary = Salary.objects.filter(month=month, year=year).aggregate(
        total=Sum("net_salary")
    )["total"] or 0

    ot_expense = Salary.objects.filter(month=month, year=year).aggregate(
        total=Sum("ot_amount")
    )["total"] or 0

    # PF
    pf_total = PFContribution.objects.filter(month=month, year=year).aggregate(
        total=Sum("total")
    )["total"] or 0

    # LOANS
    total_loan_requested = LoanRequest.objects.aggregate(
        total=Sum("requested_amount")
    )["total"] or 0

    loan_disbursed = LoanDisbursement.objects.aggregate(
        total=Sum("disbursed_amount")
    )["total"] or 0

    # RECRUITMENT
    active_requisitions = JobRequisition.objects.filter(status="O").count()

    stage_counts = Candidate.objects.values("status").annotate(count=Count("id"))
    stages = {row["status"]: row["count"] for row in stage_counts}

    # Monthly Attendance Trend
    monthly_attendance = list(
        Attendance.objects.filter(date__year=year)
        .values("date__month")
        .annotate(present=Count("id"))
        .order_by("date__month")
    )

    return Response({
        "employees": {
            "total": total_employees,
            "active": active_employees,
        },
        "attendance": {
            "present_today": present_today,
            "absent_today": absent_today,
            "trend": monthly_attendance,
        },
        "leaves": {
            "pending": pending_leaves,
        },
        "payroll": {
            "monthly_salary": monthly_salary,
            "ot_expense": ot_expense,
        },
        "pf": {
            "monthly_pf": pf_total,
        },
        "loans": {
            "total_requested": total_loan_requested,
            "total_disbursed": loan_disbursed,
        },
        "recruitment": {
            "active_requisitions": active_requisitions,
            "stages": stages,
        }
    })
