# organization/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("companies/", views.GroupCompanyList.as_view()),
    path("units/", views.UnitList.as_view()),
    path("divisions/", views.DivisionList.as_view()),
    path("departments/", views.DepartmentList.as_view()),
    path("sections/", views.SectionList.as_view()),
    path("subsections/", views.SubsectionList.as_view()),
    path("floors/", views.FloorList.as_view()),
    path("lines/", views.LineList.as_view()),
    path("tables/", views.TableList.as_view()),
]
