from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import (
    LoanType, LoanRequest, LoanDisbursement, LoanInstallment
)
from .serializers import (
    LoanTypeSerializer, LoanRequestSerializer,
    LoanDisbursementSerializer, LoanInstallmentSerializer
)

class LoanTypeViewSet(viewsets.ModelViewSet):
    queryset = LoanType.objects.all()
    serializer_class = LoanTypeSerializer


class LoanRequestViewSet(viewsets.ModelViewSet):
    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer
    filterset_fields = ["employee", "status"]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        loan = self.get_object()
        loan.status = "A"
        loan.approved_amount = loan.requested_amount
        loan.approved_at = timezone.now()
        loan.approved_by = "HR Admin"
        loan.save()
        return Response({"message": "Loan Approved!"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        loan = self.get_object()
        loan.status = "R"
        loan.save()
        return Response({"message": "Loan Rejected!"})


class LoanDisbursementViewSet(viewsets.ModelViewSet):
    queryset = LoanDisbursement.objects.all()
    serializer_class = LoanDisbursementSerializer


class LoanInstallmentViewSet(viewsets.ModelViewSet):
    queryset = LoanInstallment.objects.all()
    serializer_class = LoanInstallmentSerializer
    filterset_fields = ["loan_request", "month", "year"]
