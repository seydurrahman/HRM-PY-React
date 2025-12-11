from rest_framework import serializers
from .models import LeaveType, LeaveBalance, LeaveApplication, LeaveEncashment

class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.name", read_only=True)
    employee_name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = LeaveBalance
        fields = "__all__"


class LeaveApplicationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    leave_type_name = serializers.CharField(source="leave_type.name", read_only=True)

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    class Meta:
        model = LeaveApplication
        fields = "__all__"


class LeaveEncashmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveEncashment
        fields = "__all__"
