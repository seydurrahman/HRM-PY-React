from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryList

from .views import EmployeeViewSet
from . import api_views


router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employees")

urlpatterns = [
    path("employees-next-code/", api_views.next_employee_code, name="next-employee-code"),
    path("employees-check-code/", api_views.check_employee_code, name="check-employee-code"),
    path("countries/", CountryList.as_view()),
]

urlpatterns += router.urls
