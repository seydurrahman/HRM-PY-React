from rest_framework import serializers
from .models import PFSetting, PFContribution, PFWithdrawal

class PFSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PFSetting
        fields = "__all__"


class PFContributionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = PFContribution
        fields = "__all__"


class PFWithdrawalSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = PFWithdrawal
        fields = "__all__"
