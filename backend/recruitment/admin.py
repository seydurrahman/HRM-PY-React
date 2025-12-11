from django.contrib import admin
from .models import JobRequisition, Candidate, CandidateDocument, Interview, Offer

# Register your models here.
admin.site.register(JobRequisition)
admin.site.register(Candidate)
admin.site.register(CandidateDocument)
admin.site.register(Interview)
admin.site.register(Offer)
