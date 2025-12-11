# geo/urls.py
from django.urls import path
from .views import (
    DivisionsView,
    DistrictsByDivisionView,
    UpazilasByDistrictView,
    UnionsByUpazilaView,
)

urlpatterns = [
    path("bd/divisions/", DivisionsView.as_view()),
    path("bd/districts/<int:division_id>/", DistrictsByDivisionView.as_view()),
    path("bd/upazilas/<int:district_id>/", UpazilasByDistrictView.as_view()),
    path("bd/unions/<int:upazila_id>/", UnionsByUpazilaView.as_view()),
]
