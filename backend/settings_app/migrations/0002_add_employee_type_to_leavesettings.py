# Generated migration file
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("settings_app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="leavesettings",
            name="employee_type",
            field=models.CharField(
                choices=[
                    ("PER", "Permanent"),
                    ("PRB", "Probational"),
                    ("CON", "Contractual"),
                ],
                default="PER",
                max_length=3,
            ),
        ),
        migrations.AlterUniqueTogether(
            name="leavesettings",
            unique_together={
                ("leave_year", "employee_type", "employee_category", "designation")
            },
        ),
    ]
