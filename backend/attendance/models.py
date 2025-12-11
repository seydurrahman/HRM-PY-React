from django.db import models
from employees.models import Employee

class Attendance(models.Model):
    STATUS = (
        ("P", "Present"),
        ("A", "Absent"),
        ("W", "Weekend"),
        ("H", "Holiday"),
        ("L", "Leave"),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    in_time = models.TimeField(null=True, blank=True)
    out_time = models.TimeField(null=True, blank=True)
    work_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    status = models.CharField(max_length=1, choices=STATUS, default="A")

    ot_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_manual = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "date")
        ordering = ("-date",)

    def __str__(self):
        return f"{self.employee.code} - {self.date}"

class AttendanceUpload(models.Model):
    file = models.FileField(upload_to="attendance/uploads/")
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=100, blank=True)

    total_rows = models.PositiveIntegerField(default=0)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Upload {self.id} - {self.upload_date}"


class JobCard(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    total_present = models.PositiveIntegerField(default=0)
    total_absent = models.PositiveIntegerField(default=0)
    total_leave = models.PositiveIntegerField(default=0)
    total_weekend = models.PositiveIntegerField(default=0)
    total_holiday = models.PositiveIntegerField(default=0)
    total_ot_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "month", "year")

    def __str__(self):
        return f"{self.employee.code} - {self.month}/{self.year}"

class OTRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    ot_hours = models.DecimalField(max_digits=5, decimal_places=2)
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-date",)

    def __str__(self):
        return f"{self.employee.code} - {self.date} - {self.ot_hours}h"
