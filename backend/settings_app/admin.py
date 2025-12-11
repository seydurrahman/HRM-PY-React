from django.contrib import admin
from .models import Grade, Designation, Group, Bank, SalarySetting, PFSetting, OTSetting

admin.site.register(Grade)
admin.site.register(Designation)
admin.site.register(Group)
admin.site.register(Bank)
admin.site.register(SalarySetting)
admin.site.register(PFSetting)
admin.site.register(OTSetting)
