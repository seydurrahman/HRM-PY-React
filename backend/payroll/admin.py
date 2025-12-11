from django.contrib import admin
from .models import Increment, Promotion,BonusPolicy, BonusPayment,Salary

# Register your models here.
admin.site.register(Increment)
admin.site.register(Promotion)
admin.site.register(BonusPolicy)
admin.site.register(BonusPayment)
admin.site.register(Salary)