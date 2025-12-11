from rest_framework import serializers
from .models import Attendance, AttendanceUpload, JobCard, OTRecord

class AttendanceSerializer(serializers.ModelSerializer):
    employee_code = serializers.CharField(source="employee.code", read_only=True)
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = "__all__"

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class AttendanceUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceUpload
        fields = "__all__"


class JobCardSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = JobCard
        fields = "__all__"

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"


class OTRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = OTRecord
        fields = "__all__"

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"
