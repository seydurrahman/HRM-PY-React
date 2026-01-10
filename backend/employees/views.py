from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_countries import countries
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


from .models import Employee
from .serializers import EmployeeSerializer
from .filters import EmployeeFilter  # ✅ ADD THIS

# Import org models to map incoming org IDs to settings_app models
from organization.models import (
    Unit as OrgUnit,
    Division as OrgDivision,
    Department as OrgDepartment,
    Section as OrgSection,
    Subsection as OrgSubsection,
    Floor as OrgFloor,
    Line as OrgLine,
)
from settings_app.models import (
    Unit as SettingsUnit,
    Division as SettingsDivision,
    Department as SettingsDepartment,
    Section as SettingsSection,
    SubSection as SettingsSubSection,
    Floor as SettingsFloor,
    Line as SettingsLine,
)


from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = (
        Employee.objects.select_related("designation", "grade")
        .prefetch_related("other_documents")
        .order_by("code")
    )

    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EmployeeFilter  # ✅ USE CUSTOM FILTER

    search_fields = ["code", "first_name", "last_name", "email"]
    ordering_fields = ["code", "first_name", "last_name"]

    def _map_org_to_settings(self, data):
        """Map organization model IDs from request data to settings_app model IDs.
        This converts org.* IDs into settings_app.* IDs by name, creating settings
        entries as needed so the Employee serializer receives valid PKs.
        """
        mapped = dict(data)

        import re

        # Flatten single-element list values and stringified single-item list values
        # so parent lookups are reliable (incoming QueryDict often has single-item lists).
        for k, v in list(mapped.items()):
            if isinstance(v, (list, tuple)) and len(v) == 1:
                mapped[k] = v[0]
            if isinstance(mapped[k], str):
                s = mapped[k].strip()
                m = re.match(r"^\[\s*['\"]?([^'\"\]]+)['\"]?\s*\]$", s)
                if m:
                    mapped[k] = m.group(1)

        # Helper to map a single field
        PARENT_SETTING_MODEL = {
            "unit": SettingsUnit,
            "division": SettingsDivision,
            "department": SettingsDepartment,
            "section": SettingsSection,
            "floor": SettingsFloor,
        }

        # Information to allow recursive parent creation when necessary
        FIELD_INFO = {
            "unit": (OrgUnit, SettingsUnit, None),
            "division": (OrgDivision, SettingsDivision, "unit"),
            "department": (OrgDepartment, SettingsDepartment, "division"),
            "section": (OrgSection, SettingsSection, "department"),
            "subsection": (OrgSubsection, SettingsSubSection, "section"),
            "floor": (OrgFloor, SettingsFloor, None),
            "line": (OrgLine, SettingsLine, "floor"),
        }

        def map_field(
            field_name,
            org_model,
            settings_model,
            parent_field=None,
            parent_name=None,
            _visited=None,
        ):
            """Map a single org field -> settings field, creating parent settings recursively if needed.

            If the org PK is provided (numeric), this will:
            - return early when the value already matches an existing settings PK
            - try to create a settings entry with the same name as the org object
            - ensure parent settings exist before creating a child (recursively mapping the parent)
            """
            if _visited is None:
                _visited = set()
            if field_name in _visited:
                return
            _visited.add(field_name)

            val = mapped.get(field_name)
            if not val:
                return

            # Normalize list-like and stringified single-item lists
            if isinstance(val, (list, tuple)):
                if len(val) == 0:
                    return
                val = val[0]

            if isinstance(val, str):
                s = val.strip()
                m = re.match(r"^\[\s*['\"]?([^'\"\]]+)['\"]?\s*\]$", s)
                if m:
                    val = m.group(1)

            try:
                pk = int(val)
            except Exception:
                # not an org PK — could already be a settings PK or a name; we won't touch it
                return

            # if it looks like a settings PK already, accept it
            if settings_model.objects.filter(pk=pk).exists():
                mapped[field_name] = str(pk)
                return

            # find org object; if missing, give up
            try:
                org_obj = org_model.objects.get(pk=pk)
            except org_model.DoesNotExist:
                return

            # prepare kwargs for creating the settings object
            kwargs = {"name": getattr(org_obj, "name", str(org_obj))}

            # Ensure parent settings exists if required
            if parent_field and parent_name:
                parent_val = mapped.get(parent_name)
                # normalize
                if isinstance(parent_val, (list, tuple)) and len(parent_val) >= 1:
                    parent_val = parent_val[0]
                if isinstance(parent_val, str):
                    s2 = parent_val.strip()
                    mm = re.match(r"^\[\s*['\"]?([^'\"\]]+)['\"]?\s*\]$", s2)
                    if mm:
                        parent_val = mm.group(1)

                parent_pk = None
                try:
                    parent_pk = int(parent_val) if parent_val else None
                except Exception:
                    parent_pk = None

                parent_settings_model = PARENT_SETTING_MODEL.get(parent_name)

                # If parent isn't present or resolvable from the payload, try deriving from the org object
                if not parent_pk:
                    try:
                        org_parent_obj = getattr(org_obj, parent_name, None)
                    except Exception:
                        org_parent_obj = None
                    if getattr(org_parent_obj, "pk", None):
                        # set the mapped parent to the org parent's PK so recursive mapping can run
                        mapped[parent_name] = str(org_parent_obj.pk)
                        parent_val = mapped.get(parent_name)
                        try:
                            parent_pk = int(parent_val) if parent_val else None
                        except Exception:
                            parent_pk = None

                # If the parent isn't a settings PK yet, attempt to map/create it by recursion
                if not parent_pk or (
                    parent_settings_model
                    and not parent_settings_model.objects.filter(pk=parent_pk).exists()
                ):
                    # Attempt to map parent using FIELD_INFO
                    parent_info = FIELD_INFO.get(parent_name)
                    if parent_info:
                        parent_org_model, parent_settings_model2, parent_parent_name = (
                            parent_info
                        )
                        # recursively map parent; this may set mapped[parent_name]
                        map_field(
                            parent_name,
                            parent_org_model,
                            parent_settings_model2,
                            parent_field=parent_parent_name,
                            parent_name=parent_parent_name,
                            _visited=_visited,
                        )
                        # re-fetch parent_val after recursion
                        parent_val = mapped.get(parent_name)
                        try:
                            parent_pk = int(parent_val) if parent_val else None
                        except Exception:
                            parent_pk = None

                if not parent_pk:
                    # We couldn't resolve a parent settings PK — avoid creating a child with a missing FK
                    return

                # attach actual parent settings object
                try:
                    parent_obj = parent_settings_model.objects.get(pk=parent_pk)
                    kwargs[parent_field] = parent_obj
                except Exception:
                    # parent settings doesn't exist — abort to avoid FK violation
                    return

            defaults = {k: v for k, v in kwargs.items() if k != "name"}
            settings_obj, _ = settings_model.objects.get_or_create(
                name=kwargs["name"], defaults=defaults
            )
            mapped[field_name] = str(settings_obj.pk)

        # Map in dependency order
        map_field("unit", OrgUnit, SettingsUnit)
        map_field(
            "division",
            OrgDivision,
            SettingsDivision,
            parent_field="unit",
            parent_name="unit",
        )
        map_field(
            "department",
            OrgDepartment,
            SettingsDepartment,
            parent_field="division",
            parent_name="division",
        )
        map_field(
            "section",
            OrgSection,
            SettingsSection,
            parent_field="department",
            parent_name="department",
        )
        map_field(
            "subsection",
            OrgSubsection,
            SettingsSubSection,
            parent_field="section",
            parent_name="section",
        )
        map_field("floor", OrgFloor, SettingsFloor)
        map_field(
            "line", OrgLine, SettingsLine, parent_field="floor", parent_name="floor"
        )

        try:
            print("DEBUG EMP _map_org_to_settings ->", mapped)
        except Exception:
            pass
        return mapped

    def create(self, request, *args, **kwargs):
        # Make a mutable copy of request.data and map org IDs -> settings IDs
        data = request.data.copy()

        # TEMP DEBUG: show what DRF parsed from the incoming multipart/form-data
        try:
            lists = dict(request.data.lists())
            print("DEBUG EMP CREATE - request.data.lists():", lists)
        except Exception as e:
            print("DEBUG EMP CREATE - could not get request.data.lists():", e)
        try:
            files = list(request.FILES.keys())
            print("DEBUG EMP CREATE - request.FILES keys:", files)
        except Exception as e:
            print("DEBUG EMP CREATE - could not list FILES:", e)

        mapped = self._map_org_to_settings(data)
        if mapped is not None:
            # Merge mapped scalar values back into the mutable data copy while preserving files
            try:
                file_keys = set(request.FILES.keys())
            except Exception:
                file_keys = set()
            try:
                for k, v in mapped.items():
                    # don't overwrite file inputs with stringified values
                    if k in file_keys:
                        continue
                    data[k] = v
            except Exception:
                # If data isn't writable like a QueryDict, fall back to replacing
                data = mapped

        # Accept common frontend alias keys so fields don't get lost:
        # - frontend uses `other_deductions` but model expects `other_deduction`
        # - frontend uses `leave_effective` (lowercase) but model field is `Leave_effective`
        try:
            if isinstance(data, dict):
                if "other_deductions" in data and "other_deduction" not in data:
                    data["other_deduction"] = data.pop("other_deductions")
                # Ensure serializer receives lowercase 'leave_effective' (serializer expects this field)
                # Accept either 'Leave_effective' (legacy DB field) or 'leave_effective' (frontend)
                if "Leave_effective" in data and "leave_effective" not in data:
                    data["leave_effective"] = data.pop("Leave_effective")
                # if frontend already sent 'leave_effective', leave it as-is
            else:
                # QueryDict-like object
                if data.get("other_deductions") and not data.get("other_deduction"):
                    data["other_deduction"] = data.get("other_deductions")
                if data.get("Leave_effective") and not data.get("leave_effective"):
                    data["leave_effective"] = data.get("Leave_effective")
        except Exception:
            pass

        # Debug resolved leave_effective value to aid troubleshooting
        try:
            print(
                "DEBUG EMP CREATE - resolved leave_effective:",
                data.get("leave_effective"),
                data.get("Leave_effective"),
            )
        except Exception:
            pass

        # Normalize incoming data: collapse single-item lists into scalars and coerce booleans/numerics
        try:
            for k, v in list(data.lists()):
                if isinstance(v, (list, tuple)) and len(v) == 1:
                    data[k] = v[0]
        except Exception:
            # If data isn't a QueryDict with lists(), fall back to simple check
            for k, v in list(data.items()):
                if isinstance(v, (list, tuple)) and len(v) == 1:
                    data[k] = v[0]

        # Coerce boolean-like strings to actual booleans for known fields
        bool_fields = {
            "OT_eligibility",
            "software_user",
            "emp_panel_user",
            "transport",
            "pf_applicable",
            "late_deduction",
            "is_active",
        }
        for k in bool_fields:
            val = data.get(k)
            if isinstance(val, str):
                low = val.strip().lower()
                if low in ("true", "yes"):
                    data[k] = True
                elif low in ("false", "no"):
                    data[k] = False

        # Sanitize numeric-like strings (remove commas)
        numeric_candidates = [
            "attendance_bonus",
            "gross_salary",
            "basic_salary",
            "house_rent",
            "medical_allowance",
            "mobile_allowance",
            "transport_allowance",
            "conveyance_allowance",
            "other_allowance",
            "tax_deduction",
            "insurance_deduction",
            "stamp_deduction",
            "other_deduction",
            "casual_leave",
            "sick_leave",
            "earned_leave",
            "maternity_leave",
            "paternity_leave",
            "funeral_leave",
            "compensatory_leave",
            "unpaid_leave",
            "weight",
            "height",
        ]
        for k in numeric_candidates:
            val = data.get(k)
            if isinstance(val, str):
                cleaned = val.replace(",", "").strip()
                # if it looks numeric, replace
                if cleaned and (cleaned.replace(".", "", 1).lstrip("-").isdigit()):
                    data[k] = cleaned

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        data = request.data.copy()
        mapped = self._map_org_to_settings(data)
        if mapped is not None:
            # Merge mapped scalar values back into the mutable data copy while preserving files
            try:
                file_keys = set(request.FILES.keys())
            except Exception:
                file_keys = set()
            try:
                for k, v in mapped.items():
                    if k in file_keys:
                        continue
                    data[k] = v
            except Exception:
                data = mapped

        # TEMP DEBUG: show what DRF parsed for update (helps diagnose multipart+PUT/PATCH issues)
        try:
            lists = dict(request.data.lists())
            print("DEBUG EMP UPDATE - request.data.lists():", lists)
        except Exception as e:
            print("DEBUG EMP UPDATE - could not get request.data.lists():", e)
        try:
            files = list(request.FILES.keys())
            print("DEBUG EMP UPDATE - request.FILES keys:", files)
        except Exception as e:
            print("DEBUG EMP UPDATE - could not list FILES:", e)

        # Accept frontend alias keys here as well (keep update consistent with create)
        try:
            if isinstance(data, dict):
                if "other_deductions" in data and "other_deduction" not in data:
                    data["other_deduction"] = data.pop("other_deductions")
                # Ensure serializer receives lowercase 'leave_effective' (serializer expects this field)
                # Accept either 'Leave_effective' (legacy DB field) or 'leave_effective' (frontend)
                if "Leave_effective" in data and "leave_effective" not in data:
                    data["leave_effective"] = data.pop("Leave_effective")
                # if frontend already sent 'leave_effective', leave it as-is
            else:
                if data.get("other_deductions") and not data.get("other_deduction"):
                    data["other_deduction"] = data.get("other_deductions")
                if data.get("Leave_effective") and not data.get("leave_effective"):
                    data["leave_effective"] = data.get("Leave_effective")
        except Exception:
            pass

        # Debug resolved leave_effective value to aid troubleshooting
        try:
            print(
                "DEBUG EMP UPDATE - resolved leave_effective:",
                data.get("leave_effective"),
                data.get("Leave_effective"),
            )
        except Exception:
            pass

        # Normalize incoming data on update as we do on create: collapse single-item lists and coerce booleans/numerics
        try:
            for k, v in list(data.lists()):
                if isinstance(v, (list, tuple)) and len(v) == 1:
                    data[k] = v[0]
        except Exception:
            for k, v in list(data.items()):
                if isinstance(v, (list, tuple)) and len(v) == 1:
                    data[k] = v[0]

        # Coerce boolean-like strings to actual booleans for known fields
        bool_fields = {
            "OT_eligibility",
            "software_user",
            "emp_panel_user",
            "transport",
            "pf_applicable",
            "late_deduction",
            "is_active",
        }
        for k in bool_fields:
            val = data.get(k)
            if isinstance(val, str):
                low = val.strip().lower()
                if low in ("true", "yes"):
                    data[k] = True
                elif low in ("false", "no"):
                    data[k] = False

        # Sanitize numeric-like strings (remove commas)
        numeric_candidates = [
            "attendance_bonus",
            "gross_salary",
            "basic_salary",
            "house_rent",
            "medical_allowance",
            "mobile_allowance",
            "transport_allowance",
            "conveyance_allowance",
            "other_allowance",
            "tax_deduction",
            "insurance_deduction",
            "stamp_deduction",
            "other_deduction",
            "casual_leave",
            "sick_leave",
            "earned_leave",
            "maternity_leave",
            "paternity_leave",
            "funeral_leave",
            "compensatory_leave",
            "unpaid_leave",
            "weight",
            "height",
        ]
        for k in numeric_candidates:
            val = data.get(k)
            if isinstance(val, str):
                cleaned = val.replace(",", "").strip()
                # if it looks numeric, replace
                if cleaned and (cleaned.replace(".", "", 1).lstrip("-").isdigit()):
                    data[k] = cleaned

        serializer = self.get_serializer(instance, data=data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            try:
                print(
                    "DEBUG EMP UPDATE - serializer.errors:",
                    getattr(serializer, "errors", None),
                )
            except Exception:
                pass
            raise
        self.perform_update(serializer)

        if getattr(instance, "prefetch_related", None):
            instance = self.get_object()

        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save()
        # Handle uploaded other documents
        request = self.request
        other_docs_raw = request.data.get("other_docs")
        other_docs_meta = []
        if other_docs_raw:
            try:
                import json

                other_docs_meta = json.loads(other_docs_raw)
            except Exception:
                other_docs_meta = []

        files = request.FILES.getlist("other_doc_files")
        for i, f in enumerate(files):
            title = None
            if i < len(other_docs_meta):
                title = other_docs_meta[i].get("title")
            # Avoid creating duplicate other_documents with the same file name
            if not instance.other_documents.filter(file__icontains=f.name).exists():
                instance.other_documents.create(title=title or f.name, file=f)

        # parse JSON fields that come via multipart/form-data
        for field in ("job_experiences", "educations", "trainings"):
            raw = request.data.get(field)
            if raw:
                try:
                    import json

                    parsed = json.loads(raw)
                    setattr(instance, field, parsed)
                except Exception:
                    # leave as-is if parse fails
                    pass
        instance.save()

    def perform_update(self, serializer):
        # Save first to get instance
        instance = serializer.save()
        request = self.request
        other_docs_raw = request.data.get("other_docs")
        other_docs_meta = []
        if other_docs_raw:
            try:
                import json

                other_docs_meta = json.loads(other_docs_raw)
            except Exception:
                other_docs_meta = []

        files = request.FILES.getlist("other_doc_files")
        for i, f in enumerate(files):
            title = None
            if i < len(other_docs_meta):
                title = other_docs_meta[i].get("title")
            # Avoid creating duplicate other_documents with the same file name
            if not instance.other_documents.filter(file__icontains=f.name).exists():
                instance.other_documents.create(title=title or f.name, file=f)

        # parse JSON fields that come via multipart/form-data
        for field in ("job_experiences", "educations", "trainings"):
            raw = request.data.get(field)
            if raw:
                try:
                    import json

                    parsed = json.loads(raw)
                    setattr(instance, field, parsed)
                except Exception:
                    pass
        instance.save()


class CountryList(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # <<< IMPORTANT FIX

    def get(self, request):
        return Response([{"name": name} for code, name in list(countries)])

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload_files(self, request, pk=None):
        """Upload one-or-more file fields to an existing Employee instance.

        This is a focused endpoint to avoid multipart+PATCH edge cases in certain
        environments. Clients can POST FormData with only the file fields and the
        files will be attached to the Employee record.
        """
        instance = self.get_object()
        file_fields = [
            "emp_id_docs",
            "emp_birthcertificate_docs",
            "nominee_id_docs",
            "job_exp_certificate_docs",
            "education_certificate_docs",
            "training_certificate_docs",
        ]

        saved = []
        # Set direct file fields on the Employee model
        for f in file_fields:
            if f in request.FILES:
                try:
                    setattr(instance, f, request.FILES[f])
                    saved.append(f)
                except Exception as e:
                    print(f"DEBUG EMP upload_files - could not set {f}:", e)

        # Handle other documents arrays: accept both 'other_doc_files' (main flow) and
        # 'others_docs_file' (input name used in UI). Create EmployeeOtherDocument entries.
        other_created = []
        for key in ("other_doc_files", "others_docs_file"):
            files = request.FILES.getlist(key)
            for f in files:
                # Avoid duplicates by filename
                if not instance.other_documents.filter(file__icontains=f.name).exists():
                    instance.other_documents.create(title=f.name, file=f)
                    other_created.append(f.name)
        if other_created:
            saved.append("other_documents")

        if saved:
            instance.save()
        return Response(
            {"saved": saved, "other_created": other_created, "id": instance.pk}
        )
