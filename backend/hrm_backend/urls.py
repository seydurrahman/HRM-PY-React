from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from dashboard.views import analytics_summary
from hrm_backend.auth_views import MyTokenObtainPairView


# Import all ViewSets
from employees.views import EmployeeViewSet
from attendance.views import (
    AttendanceViewSet,
    AttendanceUploadViewSet,
    JobCardViewSet,
    OTRecordViewSet,
)

from leaves.views import (
    LeaveTypeViewSet,
    LeaveBalanceViewSet,
    LeaveApplicationViewSet,
    LeaveEncashmentViewSet,
)

from payroll.views import (
    SalaryViewSet,
    IncrementViewSet,
    PromotionViewSet,
    BonusPolicyViewSet,
    BonusPaymentViewSet,
)

from pf.views import PFSettingViewSet, PFContributionViewSet, PFWithdrawalViewSet
from loans.views import (
    LoanTypeViewSet,
    LoanRequestViewSet,
    LoanDisbursementViewSet,
    LoanInstallmentViewSet,
)

from recruitment.views import (
    JobRequisitionViewSet,
    CandidateViewSet,
    CandidateDocumentViewSet,
    InterviewViewSet,
    OfferViewSet,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from employees.views import CountryList


# Single router for the entire project
router = routers.DefaultRouter()

# Employee Module
router.register(r"employees", EmployeeViewSet, basename="employee")

# Attendance Module
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(
    r"attendance-upload", AttendanceUploadViewSet, basename="attendance-upload"
)
router.register(r"jobcard", JobCardViewSet, basename="jobcard")
router.register(r"ot", OTRecordViewSet, basename="ot")

router.register(r"leave-types", LeaveTypeViewSet, basename="leave-types")
router.register(r"leave-balances", LeaveBalanceViewSet, basename="leave-balances")
router.register(r"leave-apply", LeaveApplicationViewSet, basename="leave-apply")
router.register(r"leave-encash", LeaveEncashmentViewSet, basename="leave-encash")

router.register(r"salary", SalaryViewSet)
router.register(r"increment", IncrementViewSet)
router.register(r"promotion", PromotionViewSet)
router.register(r"bonus-policy", BonusPolicyViewSet)
router.register(r"bonus-payment", BonusPaymentViewSet)

router.register(r"pf-contribution", PFContributionViewSet)
router.register(r"pf-withdrawal", PFWithdrawalViewSet)

router.register(r"loan-types", LoanTypeViewSet)
router.register(r"loan-request", LoanRequestViewSet)
router.register(r"loan-disbursement", LoanDisbursementViewSet)
router.register(r"loan-installments", LoanInstallmentViewSet)

router.register(r"requisitions", JobRequisitionViewSet)
router.register(r"candidates", CandidateViewSet)
router.register(r"candidate-docs", CandidateDocumentViewSet)
router.register(r"interviews", InterviewViewSet)
router.register(r"offers", OfferViewSet)


urlpatterns = [
    path("api/dashboard/", analytics_summary),
    path("admin/", admin.site.urls),
    path("api/settings/", include("settings_app.urls")),
    path("api/", include(router.urls)),
    path("api/login/", MyTokenObtainPairView.as_view(), name="jwt_login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("employees.urls")),  # Employee related APIs
    path("api/countries/", CountryList.as_view(), name="country-list"),
    path("api/geo/", include("geo.urls")),  # Geo related APIs
]
