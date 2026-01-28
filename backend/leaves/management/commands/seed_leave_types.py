from django.core.management.base import BaseCommand
from leaves.models import LeaveType


class Command(BaseCommand):
    help = "Seed LeaveType data"

    def handle(self, *args, **options):
        leave_types = [
            {"name": "Casual Leave", "yearly_limit": 12, "is_earn_leave": False},
            {"name": "Sick Leave", "yearly_limit": 12, "is_earn_leave": False},
            {"name": "Earned Leave", "yearly_limit": 20, "is_earn_leave": True},
            {"name": "Maternity Leave", "yearly_limit": 90, "is_earn_leave": False},
            {"name": "Paternity Leave", "yearly_limit": 7, "is_earn_leave": False},
            {"name": "Funeral Leave", "yearly_limit": 3, "is_earn_leave": False},
            {"name": "Compensatory Leave", "yearly_limit": 5, "is_earn_leave": False},
            {"name": "Unpaid Leave", "yearly_limit": 30, "is_earn_leave": False},
        ]

        for leave_type in leave_types:
            obj, created = LeaveType.objects.get_or_create(
                name=leave_type["name"],
                defaults={
                    "yearly_limit": leave_type["yearly_limit"],
                    "is_earn_leave": leave_type["is_earn_leave"],
                },
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created LeaveType: {leave_type["name"]}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'LeaveType already exists: {leave_type["name"]}'
                    )
                )
