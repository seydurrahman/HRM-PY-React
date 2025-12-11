from django.contrib import admin
from .models import LoanType, LoanRequest, LoanDisbursement, LoanInstallment

# Register your models here.
admin.site.register(LoanType)
admin.site.register(LoanRequest)
admin.site.register(LoanDisbursement)
admin.site.register(LoanInstallment)