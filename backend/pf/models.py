from django.db import models
from employees.models import Employee

class PFSetting(models.Model):
    employee_percent = models.DecimalField(max_digits=5, decimal_places=2, default=8.00)
    employer_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    active = models.BooleanField(default=True)

    def __str__(self):
        return "PF Settings"


class PFContribution(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    employee_amount = models.DecimalField(max_digits=12, decimal_places=2)
    employer_amount = models.DecimalField(max_digits=12, decimal_places=2)

    total = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "month", "year")

    def __str__(self):
        return f"PF {self.employee.code} {self.month}/{self.year}"


class PFWithdrawal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    withdrawal_date = models.DateField()
    reason = models.TextField(blank=True)

    approved = models.BooleanField(default=False)
    approved_by = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} PF Withdrawal"
