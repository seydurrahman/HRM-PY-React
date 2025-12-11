from rest_framework.routers import DefaultRouter
from .views import (
    GradeViewSet, DesignationViewSet, GroupViewSet, BankViewSet,
    SalarySettingViewSet, PFSettingViewSet, OTSettingViewSet
)

router = DefaultRouter()
router.register(r'grades', GradeViewSet)
router.register(r'designations', DesignationViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'banks', BankViewSet)
router.register(r'salary-settings', SalarySettingViewSet)
router.register(r'pf-settings', PFSettingViewSet)
router.register(r'ot-settings', OTSettingViewSet)

urlpatterns = router.urls
