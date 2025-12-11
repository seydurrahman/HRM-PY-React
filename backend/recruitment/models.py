from django.db import models
from django.contrib.auth.models import User
from employees.models import Employee

class JobRequisition(models.Model):
    STATUS = (("D","Draft"),("O","Open"),("C","Closed"))
    code = models.CharField(max_length=40, unique=True)
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=200, blank=True)
    grade = models.CharField(max_length=100, blank=True)
    vacancies = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS, default="D")

    def __str__(self):
        return f"{self.code} - {self.title}"


class Candidate(models.Model):
    STATUS = (
        ("AP","Applied"),
        ("SC","Screening"),
        ("SH","Shortlisted"),
        ("IV","Interview"),
        ("OF","Offered"),
        ("RJ","Rejected"),
        ("HI","Hired"),
    )

    requisition = models.ForeignKey(JobRequisition, on_delete=models.CASCADE, related_name="candidates", null=True, blank=True)
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    resume = models.FileField(upload_to="candidates/resumes/", null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    current_company = models.CharField(max_length=200, blank=True)
    current_ctc = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    expected_ctc = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=2, choices=STATUS, default="AP")
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class CandidateDocument(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=150)
    file = models.FileField(upload_to="candidates/documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Interview(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="interviews")
    scheduled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    scheduled_at = models.DateTimeField()
    mode = models.CharField(max_length=50, default="Onsite")  # Onsite / Zoom / Phone
    panel = models.ManyToManyField(Employee, blank=True)
    result = models.CharField(max_length=200, blank=True)  # e.g., Passed / Failed / Pending
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Offer(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="offers")
    offered_ctc = models.DecimalField(max_digits=12, decimal_places=2)
    joining_date = models.DateField(null=True, blank=True)
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)
    accepted_at = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True)
