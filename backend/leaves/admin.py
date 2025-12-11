from django.contrib import admin
from .models import LeaveType, LeaveApplication, LeaveEncashment, LeaveBalance

# Register your models here.
admin.site.register(LeaveType)
admin.site.register(LeaveBalance)
admin.site.register(LeaveEncashment)
admin.site.register(LeaveApplication)

# admin.site.register(LeaveEncashment)
# admin.site.register(LeaveType)
# admin.site.register(LeaveApplication)