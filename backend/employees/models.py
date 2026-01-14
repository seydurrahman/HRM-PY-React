from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
from settings_app.models import (
    EmployeeType,
    EmploymentType,
    Designation,
    Grade,
    Unit,
    Division,
    Department,
    Section,
    SubSection,
    Floor,
    Line,
)


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    code = models.CharField(max_length=20, unique=True)
    employee_id = models.CharField(
        max_length=50, unique=True, blank=True, null=True
    )  # Made optional
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    full_name_bangla = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)

    # Organizational structure - ForeignKeys to settings_app models
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, blank=True)
    division = models.ForeignKey(
        Division, on_delete=models.SET_NULL, null=True, blank=True
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True
    )
    section = models.ForeignKey(
        Section, on_delete=models.SET_NULL, null=True, blank=True
    )
    subsection = models.ForeignKey(
        SubSection, on_delete=models.SET_NULL, null=True, blank=True
    )
    floor = models.ForeignKey(Floor, on_delete=models.SET_NULL, null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.SET_NULL, null=True, blank=True)

    designation = models.ForeignKey(
        Designation, on_delete=models.SET_NULL, null=True, blank=True
    )

    # Basic
    date_of_birth = models.DateField(null=True, blank=True)
    father_name = models.CharField(max_length=100, blank=True)
    f_bangla_name = models.CharField(max_length=100, blank=True)
    mother_name = models.CharField(max_length=100, blank=True)
    m_bangla_name = models.CharField(max_length=100, blank=True)
    religion = models.CharField(max_length=50, blank=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)
    nid_no = models.CharField(max_length=100, blank=True)
    birth_certificate = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)  # Removed unique constraint for flexibility
    blood_group = models.CharField(max_length=10, blank=True)
    marital_status = models.CharField(max_length=20, blank=True)
    spouse_name = models.CharField(max_length=100, blank=True)
    spouse_name_bangla = models.CharField(max_length=100, blank=True)
    spouse_mobile = models.CharField(max_length=30, blank=True)
    nominee_name = models.CharField(max_length=100, blank=True)
    nominee_name_bangla = models.CharField(max_length=100, blank=True)
    nominee_relation = models.CharField(max_length=50, blank=True)
    nominee_mobile = models.CharField(max_length=30, blank=True)
    nominee_nid = models.CharField(max_length=100, blank=True)
    nominee_country = models.CharField(max_length=50, blank=True)
    nominee_address_division = models.CharField(
        max_length=50, blank=True
    )  # Address division
    nominee_district = models.CharField(max_length=50, blank=True)
    nominee_upazila = models.CharField(max_length=50, blank=True)
    nominee_union = models.CharField(max_length=50, blank=True)
    nominee_post_code = models.CharField(max_length=20, blank=True)
    nominee_village = models.CharField(max_length=100, blank=True)
    nominee_village_bangla = models.CharField(max_length=100, blank=True)
    emg_contact_name = models.CharField(max_length=100, blank=True)
    emg_contact_phone = models.CharField(max_length=30, blank=True)
    emg_contact_relation = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    address_division = models.CharField(
        max_length=50, blank=True
    )  # Address division (not org)
    district = models.CharField(max_length=50, blank=True)
    upazila = models.CharField(max_length=50, blank=True)
    union = models.CharField(max_length=50, blank=True)
    post_code = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    village = models.TextField(blank=True)
    village_bangla = models.TextField(blank=True)
    local_auth_name = models.CharField(max_length=100, blank=True)
    local_auth_mobile = models.CharField(max_length=30, blank=True)
    local_auth_relation = models.CharField(max_length=50, blank=True)
    identity_mark = models.TextField(blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Official
    employee_type = models.CharField(
        max_length=3, choices=EmployeeType.choices, default=EmployeeType.PERMANENT
    )
    employment_type = models.CharField(
        max_length=2, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    group_name = models.CharField(max_length=100, blank=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True)
    device_id = models.CharField(max_length=100, blank=True)
    join_date = models.DateField(null=True, blank=True)  # Made optional
    confirm_date = models.DateField(null=True, blank=True)
    reporting_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reportees",
    )
    disburse_type = models.CharField(max_length=50, blank=True)
    mfs_number = models.CharField(max_length=100, blank=True)
    shift = models.CharField(max_length=100, blank=True)
    weekends = models.CharField(max_length=100, blank=True)
    office_email = models.EmailField(blank=True)
    office_mobile = models.CharField(max_length=30, blank=True)
    work_location = models.CharField(max_length=200, blank=True)
    OT_eligibility = models.BooleanField(default=False)
    software_user = models.BooleanField(default=False)
    emp_panel_user = models.BooleanField(default=False)
    bgmea_ID = models.CharField(max_length=100, blank=True)
    bkmea_ID = models.CharField(max_length=100, blank=True)
    transport = models.BooleanField(default=False)
    food_allowance = models.CharField(max_length=100, blank=True)
    bank_name = models.CharField(max_length=100, blank=True)
    branch_name = models.CharField(max_length=100, blank=True)
    account_no = models.CharField(max_length=100, blank=True)
    account_type = models.CharField(max_length=50, blank=True)
    tin_number = models.CharField(max_length=100, blank=True)

    # Salary Information
    effective_date = models.DateField(null=True, blank=True)
    salary_policy = models.CharField(max_length=200, blank=True)
    pf_applicable = models.BooleanField(default=False)
    late_deduction = models.BooleanField(default=False)
    gross_salary = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True  # Increased max_digits
    )
    basic_salary = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    house_rent = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    medical_allowance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    mobile_allowance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    transport_allowance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    conveyance_allowance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    other_allowance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    attendance_bonus = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    tax_deduction = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    insurance_deduction = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    stamp_deduction = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    other_deduction = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )

    # Leave Policy
    Leave_effective = models.DateField(null=True, blank=True)
    casual_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sick_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    earned_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    maternity_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    paternity_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    funeral_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    compensatory_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    unpaid_leave = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # JSON fields for multiple entries
    job_experiences = models.JSONField(default=list, blank=True, null=True)
    educations = models.JSONField(default=list, blank=True, null=True)
    trainings = models.JSONField(default=list, blank=True, null=True)

    # Documents upload
    emp_image = models.CharField(max_length=50, blank=True, null=True)
    emp_image_docs = models.FileField(upload_to="employee_docs/", null=True, blank=True)
    emp_id = models.CharField(max_length=50, blank=True, null=True)
    emp_id_docs = models.FileField(upload_to="employee_docs/", null=True, blank=True)
    emp_birthcertificate = models.CharField(max_length=50, blank=True, null=True)
    emp_birthcertificate_docs = models.FileField(
        upload_to="employee_docs/", null=True, blank=True
    )
    nominee_id = models.CharField(max_length=50, blank=True, null=True)
    nominee_id_docs = models.FileField(
        upload_to="employee_docs/", null=True, blank=True
    )
    job_exp_certificate = models.CharField(max_length=50, blank=True, null=True)
    job_exp_certificate_docs = models.FileField(
        upload_to="employee_docs/", null=True, blank=True
    )
    education_certificate = models.CharField(max_length=50, blank=True, null=True)
    education_certificate_docs = models.FileField(
        upload_to="employee_docs/", null=True, blank=True
    )
    training_certificate = models.CharField(max_length=50, blank=True, null=True)
    training_certificate_docs = models.FileField(
        upload_to="employee_docs/", null=True, blank=True
    )

    # system auto
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.code} - {self.first_name} {self.last_name}".strip()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class EmployeeOtherDocument(models.Model):
    """Store additional documents uploaded from Employee creation/edit form."""

    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="other_documents"
    )
    title = models.CharField(max_length=200, blank=True)
    file = models.FileField(upload_to="employee_docs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.code} - {self.title or self.file.name}"
