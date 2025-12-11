from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LeaveType, LeaveBalance, LeaveApplication, LeaveEncashment
from .serializers import (
    LeaveTypeSerializer, LeaveBalanceSerializer,
    LeaveApplicationSerializer, LeaveEncashmentSerializer
)

class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer


class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    filterset_fields = ["employee", "leave_type"]


class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    filterset_fields = ["employee", "status"]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = "A"
        leave.approved_by = request.data.get("approved_by", "HR Admin")
        leave.save()
        return Response({"message": "Leave Approved"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = "R"
        leave.save()
        return Response({"message": "Leave Rejected"})


class LeaveEncashmentViewSet(viewsets.ModelViewSet):
    queryset = LeaveEncashment.objects.all()
    serializer_class = LeaveEncashmentSerializer
