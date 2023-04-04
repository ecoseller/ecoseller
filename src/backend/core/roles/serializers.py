from .roles_manager import ManagerPermission
from rest_framework import serializers


class ManagerPermissionSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    model = serializers.CharField(max_length=100)
    description = serializers.CharField()
    type = serializers.CharField(max_length=100)

    def create(self, validated_data):
        obj, _ = ManagerPermission.objects.get_or_create(**validated_data)
        return obj


class ManagerGroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    description = serializers.CharField()
    permissions = ManagerPermissionSerializer(many=True)
