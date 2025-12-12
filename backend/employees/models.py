from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
from settings_app.models import (
    EmployeeType,
    EmploymentType,
    Group,
    Bank,
)

class Employee(models.Model):

    # Employee
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    code = models.CharField(max_length=20, unique=True)
    employee_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    full_name_bangla = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    # Unit -organization/unit
    # Division - organization/division
    # Department - organization/department
    # Section - organization/section
    # Subsection - organization/subsection
    # Floor - organization/floor
    # Line - organization/line
    # Designation - settings_app/designation

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
    email = models.EmailField(unique=True)
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
    nominee_division = models.CharField(max_length=50, blank=True)
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
    division = models.CharField(max_length=50, blank=True)
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
    # Grade - settings_app/grade
    device_id = models.CharField(max_length=100, blank=True)
    join_date = models.DateField()
    confirm_date = models.DateField(null=True, blank=True)
    reporting_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='reportees')
    disburse_type = models.CharField(max_length=50, blank=True)
    mfs_number = models.CharField(max_length=100, blank=True)
    shift=models.CharField(max_length=100, blank=True)
    weekends=models.CharField(max_length=100, blank=True)
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


    documents = models.FileField(upload_to='employee_docs/', null=True, blank=True)
    probation_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    bank = models.ForeignKey(Bank, on_delete=models.SET_NULL, null=True, blank=True)
    bank_account_no = models.CharField(max_length=100, blank=True)

    pf_member = models.BooleanField(default=False)
    pf_no = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.first_name} {self.last_name}".strip()
