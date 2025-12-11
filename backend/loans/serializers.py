from rest_framework import serializers
from .models import LoanType, LoanRequest, LoanDisbursement, LoanInstallment

class LoanTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanType
        fields = "__all__"


class LoanRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)
    loan_type_name = serializers.CharField(source="loan_type.name", read_only=True)

    class Meta:
        model = LoanRequest
        fields = "__all__"


class LoanDisbursementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanDisbursement
        fields = "__all__"


class LoanInstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanInstallment
        fields = "__all__"
