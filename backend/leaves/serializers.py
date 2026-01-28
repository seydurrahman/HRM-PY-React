from rest_framework import serializers
from .models import LeaveType, LeaveBalance, LeaveApplication, LeaveEncashment


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source="leave_type.name", read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    class Meta:
        model = LeaveBalance
        fields = [
            "id",
            "employee_id",
            "employee_name",
            "leave_type_name",
            "total",
            "used",
            "remaining",
        ]


class LeaveApplicationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
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
