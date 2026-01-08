from django.contrib import admin
from .models import Employee, EmployeeOtherDocument


class EmployeeOtherDocumentInline(admin.TabularInline):
    model = EmployeeOtherDocument
    extra = 0


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("code", "first_name", "last_name", "email", "is_active")
    inlines = [EmployeeOtherDocumentInline]


@admin.register(EmployeeOtherDocument)
class EmployeeOtherDocumentAdmin(admin.ModelAdmin):
    list_display = ("employee", "title", "file", "uploaded_at")
    readonly_fields = ("uploaded_at",)
