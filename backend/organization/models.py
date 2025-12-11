# organization/models.py
from django.db import models

class GroupCompany(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Unit(models.Model):
    company = models.ForeignKey(GroupCompany, on_delete=models.CASCADE, related_name='units')
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.company.name} > {self.name}"


class Division(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='divisions')
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.unit.name} > {self.name}"


class Department(models.Model):
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Section(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Subsection(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='subsections')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Floor(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='floors')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Line(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='lines')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Table(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='tables')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
