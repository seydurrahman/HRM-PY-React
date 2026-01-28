from django.db import models
from employees.models import Employee

class LeaveType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    yearly_limit = models.PositiveIntegerField(default=0)
    is_earn_leave = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class LeaveBalance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    used = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    @property
    def remaining(self):
        return self.total - self.used

    class Meta:
        unique_together = ('employee', 'leave_type')

    def __str__(self):
        return f"{self.employee.code} - {self.leave_type.name}"


class LeaveApplication(models.Model):
    STATUS = (
        ("P", "Pending"),
        ("A", "Approved"),
        ("R", "Rejected"),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    rejoin_after_leave = models.DateField(null=True, blank=True)
    application_for = models.CharField(max_length=50, blank=True)
    total_days = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(blank=True)

    status = models.CharField(max_length=1, choices=STATUS, default="P")
    approved_by = models.CharField(max_length=200, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} - {self.leave_type.name}"


class LeaveEncashment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    days_encashed = models.DecimalField(max_digits=5, decimal_places=2)
    encash_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} encashed {self.days_encashed}"
