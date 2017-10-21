
from qapp.models import Photo, Comments
from rest_framework import serializers
from django.contrib.auth.models import User, Group

class CommentsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comments
        fields = ('photouuid', 'comment', 'poster', 'timestamp', 'uuid', 'useruuid')


class PhotoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Photo

        fields = ('uuid', 'lat', 'lon', 'poster','timestamp', 'visible', 'caption','useruuid')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        write_only_fields = ('password')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined')


class LinkedSerializer(serializers.Serializer):
    uuid = serializers.UUIDField(read_only=True)
    lat = serializers.FloatField()
    lon = serializers.FloatField()
    poster = serializers.CharField(max_length=50, required=False)
    timestamp = serializers.DateTimeField(read_only=True)
    #visible = serializers.BooleanField(required=False)
    caption = serializers.CharField(max_length=125, required=False)
    useruuid = serializers.UUIDField()
    photo_distance=serializers.FloatField()
    comments = CommentsSerializer(many=True)


    




