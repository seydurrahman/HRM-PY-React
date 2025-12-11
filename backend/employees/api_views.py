from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Max
import re

from .models import Employee


# ---------- AUTO GENERATE NEXT EMPLOYEE CODE ----------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def next_employee_code(request):
    """
    Returns next code like EMP-0001 → EMP-0002
    """

    # Get the max existing code
    max_code = Employee.objects.aggregate(max_code=Max("code"))["max_code"]

    if max_code:
        # Extract trailing number
        match = re.search(r"(\d+)$", max_code)
        if match:
            next_num = int(match.group(1)) + 1
        else:
            next_num = Employee.objects.count() + 1
    else:
        next_num = 1

    next_code = f"EMP-{str(next_num).zfill(4)}"

    return Response({"next_code": next_code})


# ---------- VALIDATE IF EMPLOYEE CODE EXISTS ----------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_employee_code(request):
    """
    ?code=EMP-0001 → { "exists": true/false }
    """
    code = request.query_params.get("code")

    if not code:
        return Response({"error": "Code parameter is required"}, status=400)

    exists = Employee.objects.filter(code=code).exists()

    return Response({"exists": exists})
