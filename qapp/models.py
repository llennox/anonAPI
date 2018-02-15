from django.db import models
from django.contrib.auth.models import User
import requests, json
from django.utils import timezone
import re, uuid
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from knox.models import AuthToken

#return created 

class Flag(models.Model):
    photourl = models.CharField(max_length=255)
    userurl = models.CharField(max_length=255)
    flagger = models.CharField(max_length=255)

class Photo(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lat = models.FloatField()
    lon = models.FloatField()
    poster = models.CharField(max_length=50, default="anon")
    timestamp = models.DateTimeField(auto_now_add=True)
    visible = models.BooleanField(default=True)
    caption = models.CharField(max_length=255, default="")
    useruuid = models.UUIDField()
    isvideo = models.BooleanField(default=False)
    def return_comments(self):
        comments = Comments.objects.filter(photouuid=self).order_by('timestamp')
        return comments

class Comments(models.Model):
    poster = models.CharField(max_length=80, default="anon")
    photouuid = models.UUIDField(default=None)
    comment = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    useruuid = models.UUIDField()

class Messages(models.Model):
    sender = models.CharField(max_length=50, default="anon")
    date = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=255, default='')
    anontoken = models.CharField(max_length=50, default="")

#@receiver(post_save, sender=settings.AUTH_USER_MODEL)
#def create_auth_token(sender, instance=None, created=False, **kwargs):
  #  if created:
  #      AuthToken.objects.create(user=instance)

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile')
    isanon = models.BooleanField(default=False)
    bio = models.CharField(max_length=255, default='')
    profileImg = models.CharField(max_length=40, default='')
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dateCreated = models.DateTimeField(auto_now_add=True)
    created = models.BooleanField(default=False)
    deviceUUID = models.CharField(max_length=255, default='')
    banned = models.BooleanField(default=False)



