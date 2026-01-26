from django.contrib import admin
from .models import Grade, Designation, Group, Bank, OTEligibilitySetting, SalarySetting, PFSetting, EmployeeCategory, Unit, Division, Department, Section, SubSection, Floor, Line

admin.site.register(Grade)
admin.site.register(Designation)
admin.site.register(Group)
admin.site.register(Bank)
admin.site.register(SalarySetting)
admin.site.register(PFSetting)
admin.site.register(EmployeeCategory)
admin.site.register(OTEligibilitySetting)
admin.site.register(Unit)
admin.site.register(Division)
admin.site.register(Department)
admin.site.register(Section)
admin.site.register(SubSection)
admin.site.register(Floor)
admin.site.register(Line)
