from rest_framework import serializers
from .models import (
    Grade, Designation, Group, Bank,
    SalarySetting, PFSetting, OTSetting
)

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = "__all__"

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = "__all__"

class SalarySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalarySetting
        fields = "__all__"

class PFSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PFSetting
        fields = "__all__"

class OTSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTSetting
        fields = "__all__"
