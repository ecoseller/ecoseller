from rest_framework import serializers
from . import models


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = "__all__"
        read_only_fields = ["token", "create_at"]
