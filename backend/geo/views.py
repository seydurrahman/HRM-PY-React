# geo/views.py
import requests
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

BASE = "https://bdapi.vercel.app/api/v.1"
CACHE_TTL = 60 * 60 * 24  # Cache for 1 day

class DivisionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        key = "bd_divisions"
        data = cache.get(key)
        if data:
            return Response(data)

        r = requests.get(f"{BASE}/division")
        data = r.json()
        cache.set(key, data, CACHE_TTL)
        return Response(data)


class DistrictsByDivisionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, division_id):
        key = f"bd_districts_{division_id}"
        data = cache.get(key)
        if data:
            return Response(data)

        r = requests.get(f"{BASE}/district/{division_id}")
        data = r.json()
        cache.set(key, data, CACHE_TTL)
        return Response(data)


class UpazilasByDistrictView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, district_id):
        key = f"bd_upazilas_{district_id}"
        data = cache.get(key)
        if data:
            return Response(data)

        r = requests.get(f"{BASE}/district/{district_id}")  # API uses same endpoint
        data = r.json()
        cache.set(key, data, CACHE_TTL)
        return Response(data)


class UnionsByUpazilaView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, upazila_id):
        key = f"bd_unions_{upazila_id}"
        data = cache.get(key)
        if data:
            return Response(data)

        # Union endpoint sometimes unclear; using same as district for now
        r = requests.get(f"{BASE}/district/{upazila_id}")
        data = r.json()
        cache.set(key, data, CACHE_TTL)
        return Response(data)
