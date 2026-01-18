from django.db import models

# Create your models here.
# geo/models.py

class Division(models.Model):
    name = models.CharField(max_length=100)

class District(models.Model):
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="districts")
    name = models.CharField(max_length=100)

class Upazila(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="upazilas")
    name = models.CharField(max_length=100)

class Union(models.Model):
    upazila = models.ForeignKey(Upazila, on_delete=models.CASCADE, related_name="unions")
    name = models.CharField(max_length=100)
