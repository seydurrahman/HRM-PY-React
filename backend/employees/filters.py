import django_filters
from .models import Employee

class EmployeeFilter(django_filters.FilterSet):
    designation = django_filters.NumberFilter(field_name="designation_id")
    grade = django_filters.NumberFilter(field_name="grade_id")

    class Meta:
        model = Employee
        fields = [
            "employee_type",
            "employment_type",
            "designation",
            "grade",
        ]
