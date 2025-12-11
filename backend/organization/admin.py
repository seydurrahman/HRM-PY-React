from django.contrib import admin
from .models import (
    GroupCompany,
    Unit,
    Division,
    Department,
    Section,
    Subsection,
    Floor,
    Line,
    Table,
)

# Register your models here.
admin.site.register(GroupCompany)
admin.site.register(Unit)
admin.site.register(Division)
admin.site.register(Department)
admin.site.register(Section)
admin.site.register(Subsection)
admin.site.register(Floor)
admin.site.register(Line)
admin.site.register(Table)