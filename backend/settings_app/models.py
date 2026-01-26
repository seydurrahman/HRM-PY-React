from django.db import models


class EmployeeType(models.TextChoices):
    PERMANENT = "PER", "Permanent"
    CONTRACT = "CON", "Contract"
    INTERN = "INT", "Intern"
    PART_TIME = "PT", "Part Time"


class EmploymentType(models.TextChoices):
    FULL_TIME = "FT", "Full Time"
    PART_TIME = "PT", "Part Time"
    CASUAL = "CS", "Casual"


class Company(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Unit(models.Model):
    name = models.CharField(max_length=100)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True
    )
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("company", "name")

    def __str__(self):
        return self.name


class Division(models.Model):
    name = models.CharField(max_length=100, unique=True)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=100, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class SubSection(models.Model):
    name = models.CharField(max_length=100, unique=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Floor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, null=True, blank=True
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Line(models.Model):
    name = models.CharField(max_length=100, unique=True)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Table(models.Model):
    name = models.CharField(max_length=150)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("floor", "name")

    def __str__(self):
        return self.name


class Grade(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    level = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.name

class EmployeeCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Designation(models.Model):
    name = models.CharField(max_length=100, unique=True)
    employee_category = models.ForeignKey(EmployeeCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Bank(models.Model):
    name = models.CharField(max_length=150)
    branch = models.CharField(max_length=150, blank=True)
    routing_no = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class SalarySetting(models.Model):
    grade = models.OneToOneField(Grade, on_delete=models.CASCADE)
    basic = models.DecimalField(max_digits=12, decimal_places=2)
    house_rent = models.DecimalField(max_digits=12, decimal_places=2)
    medical = models.DecimalField(max_digits=12, decimal_places=2)
    transport = models.DecimalField(max_digits=12, decimal_places=2)
    others = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.grade.name} salary structure"


class PFSetting(models.Model):
    is_active = models.BooleanField(default=True)
    employee_percent = models.DecimalField(max_digits=5, decimal_places=2)  # e.g. 8.00
    employer_percent = models.DecimalField(max_digits=5, decimal_places=2)
    

class OTEligibilitySetting(models.Model):
   employee_category = models.ForeignKey(EmployeeCategory, on_delete=models.CASCADE)
   designation = models.ForeignKey(Designation, on_delete=models.CASCADE)
   is_eligible = models.BooleanField(default=True)
   class Meta:
        unique_together = ("employee_category", "designation")
   def __str__(self):
        return f"OT Eligibility for {self.designation.name} in {self.employee_category.name}: {'Eligible' if self.is_eligible else 'Not Eligible'}"