from django.db import models
from employees.models import Employee
from settings_app.models import SalarySetting, EmployeeCategory


class SalaryPolicy(models.Model):
    employee_type = models.ForeignKey(EmployeeCategory, on_delete=models.CASCADE)
    gross = models.DecimalField(max_digits=12, decimal_places=2)
    basic = models.JSONField(default=dict)
    house_rent = models.JSONField(default=dict)
    medical = models.JSONField(default=dict)
    mobile_allowance = models.JSONField(default=dict)
    transport = models.JSONField(default=dict)
    conveyance_allowance = models.JSONField(default=dict)
    food = models.JSONField(default=dict)
    others1 = models.JSONField(default=dict)
    others2 = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("employee_type",)

    def __str__(self):
        return f"Salary Policy - {self.employee_type.name}"


class Increment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    previous_salary = models.DecimalField(max_digits=12, decimal_places=2)
    new_salary = models.DecimalField(max_digits=12, decimal_places=2)
    increment_amount = models.DecimalField(max_digits=12, decimal_places=2)
    effective_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} Increment"


class Promotion(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    previous_designation = models.CharField(max_length=100)
    new_designation = models.CharField(max_length=100)
    effective_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)


class BonusPolicy(models.Model):
    title = models.CharField(max_length=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class BonusPayment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    bonus_policy = models.ForeignKey(BonusPolicy, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_month = models.PositiveIntegerField()
    payment_year = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    basic = models.DecimalField(max_digits=12, decimal_places=2)
    house_rent = models.DecimalField(max_digits=12, decimal_places=2)
    medical = models.DecimalField(max_digits=12, decimal_places=2)
    transport = models.DecimalField(max_digits=12, decimal_places=2)
    other_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    ot_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pf_employee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pf_employer = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    loan_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    total_earnings = models.DecimalField(max_digits=12, decimal_places=2)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)

    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "month", "year")

    def __str__(self):
        return f"{self.employee.code} Salary {self.month}/{self.year}"
