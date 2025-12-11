from django.db import models
from employees.models import Employee

class LoanType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # yearly interest %

    def __str__(self):
        return self.name


class LoanRequest(models.Model):
    STATUS = (
        ("P", "Pending"),
        ("A", "Approved"),
        ("R", "Rejected"),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    loan_type = models.ForeignKey(LoanType, on_delete=models.CASCADE)

    requested_amount = models.DecimalField(max_digits=12, decimal_places=2)
    installment_months = models.PositiveIntegerField()

    reason = models.TextField(blank=True)
    status = models.CharField(max_length=1, choices=STATUS, default="P")

    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.CharField(max_length=100, blank=True)

    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} Loan Request"


class LoanDisbursement(models.Model):
    loan_request = models.OneToOneField(LoanRequest, on_delete=models.CASCADE)
    disbursed_amount = models.DecimalField(max_digits=12, decimal_places=2)
    disbursement_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Loan Disbursement for {self.loan_request.employee.code}"


class LoanInstallment(models.Model):
    loan_request = models.ForeignKey(LoanRequest, on_delete=models.CASCADE)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("loan_request", "month", "year")

    def __str__(self):
        return f"Installment {self.month}/{self.year}"
