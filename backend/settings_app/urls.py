from rest_framework.routers import DefaultRouter
from .views import (
    GradeViewSet,
    DesignationViewSet,
    GroupViewSet,
    BankViewSet,
    SalarySettingViewSet,
    PFSettingViewSet,
    OTEligibilitySettingViewSet,
    EmployeeCategoryViewSet,
    CompanyViewSet,
    TableViewSet,
    UnitViewSet,
    DivisionViewSet,
    DepartmentViewSet,
    SectionViewSet,
    SubSectionViewSet,
    FloorViewSet,
    LineViewSet,
)

router = DefaultRouter()
router.register(r"grades", GradeViewSet)
router.register(r"designations", DesignationViewSet)
router.register(r"groups", GroupViewSet)
router.register(r"banks", BankViewSet)
router.register(r"salary-settings", SalarySettingViewSet)
router.register(r"pf-settings", PFSettingViewSet)
router.register(r"employee-categories", EmployeeCategoryViewSet)
router.register(r"ot-eligibility-settings", OTEligibilitySettingViewSet)
router.register(r"companies", CompanyViewSet)
router.register("units", UnitViewSet)
router.register("divisions", DivisionViewSet, basename="division")
router.register("departments", DepartmentViewSet, basename="department")
router.register("sections", SectionViewSet, basename="section")
router.register("subsections", SubSectionViewSet, basename="subsection")
router.register("floors", FloorViewSet)
router.register("lines", LineViewSet, basename="line")
router.register("tables", TableViewSet, basename="table")

urlpatterns = router.urls
