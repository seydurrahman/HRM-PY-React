from rest_framework import serializers
from .models import (
    Increment, Promotion, BonusPolicy, BonusPayment, Salary
)

class IncrementSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = Increment
        fields = "__all__"


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = "__all__"


class BonusPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusPolicy
        fields = "__all__"


class BonusPaymentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = BonusPayment
        fields = "__all__"


class SalarySerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = Salary
        fields = "__all__"
