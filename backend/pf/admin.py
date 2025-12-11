from django.contrib import admin
from .models import PFContribution, PFWithdrawal, PFSetting

# Register your models here.
admin.site.register(PFContribution)
admin.site.register(PFWithdrawal)
admin.site.register(PFSetting)

# admin.site.register(Employee)