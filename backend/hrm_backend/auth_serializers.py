from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        groups = list(user.groups.values_list("name", flat=True))
        token["role"] = groups[0] if groups else "Employee"

        token["username"] = user.username

        return token
