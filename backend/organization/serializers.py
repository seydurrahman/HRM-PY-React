# organization/serializers.py
from rest_framework import serializers
from .models import *

class GroupCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupCompany
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class SubsectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsection
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'
