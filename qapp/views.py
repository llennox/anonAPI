from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
from itertools import chain
from rest_framework import viewsets, status
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from qapp.models import Photo, Comments, Profile, Flag, Block
from django.contrib.gis.geoip2 import GeoIP2
from django.utils import timezone
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from boto.s3.key import Key
from math import radians, cos, sin, asin, sqrt
import math, hashlib, sys, random, os, boto, string, datetime
from qapp.serializers import PhotoSerializer, CommentsSerializer, UserSerializer, LinkedSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
import operator
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from knox.settings import CONSTANTS
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
import uuid
from rest_framework.renderers import JSONRenderer
import json
from django.conf import settings

def main(request):
    with open('/home/connlloc/sites/q/local_lens/build/index.html') as f:
        return HttpResponse(f.read())

def terms(request):  ### popup that presents rules.

    return render(request, 'terms.html')


def api_documentation(request):  ### popup that presents rules.

    return render(request, 'link_page.html')

class blockUser(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request._auth.user
        try:
            blockee = Profile.objects.get(uuid=request.data['user_uuid'])
            blocker = Profile.objects.get(user=user)
            Block.objects.create(blocker=blocker.deviceUUID, blockee=blockee.deviceUUID)
            Block.save()
            return Response("success", status=status.HTTP_200_OK)
        except:
            blocker = "DNE"
            blockee = "DNE"
            return Response(request.data['user_uuid'], status=status.HTTP_200_OK)
        return Response("success", status=status.HTTP_200_OK)

class FlagPhoto(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request._auth.user
        try:
            flagged_user = Profile.objects.get(uuid=request.data['userUUID'])
            user_url = 'https://locallensapp.com/admin/qapp/profile/%s/change/' % flagged_user.uuid
            flagger = flagged_user.uuid
        except:
            flagger = "DNE"
            user_url = "DNE"
        try:
            photo = Photo.objects.get(uuid=request.data['photoUUID'])
        except:
            return Response("photo does not exist", status=status.HTTP_400_BAD_REQUEST)
        photo.visible = False
        photo.save()
        if photo.isvideo:
            photo_url = 'https://locallensapp.com/photos/%s.mp4' % photo.uuid
        else:
            photo_url = 'https://locallensapp.com/photos/%s.jpg' % photo.uuid
        #message = 'flagged photo: %s \n flagged user: %s' % (photo_url, user_url)
        photo_specs = 'https://locallensapp.com/admin/qapp/photo/%s/change/' % photo.uuid
        Flag.objects.create(photourl=photo_url, photospecs=photo_specs, userurl=user_url, flagger=user.username)
        #send_mail(
        #'flagged post',
        #message,
        #'gonnellcough@gmail.com',
        #['gonnellcough@gmail.com']   # later pragmatically change this send function for your moderators
        #)
        return Response("success", status=status.HTTP_200_OK)

class photosByNewest(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        photos1 = Photo.objects.filter(visible=True).order_by('timestamp').reverse()
        try:
            page = int(request.data['page'])
            page1 = 0
            first_page = 1
        except:
            maps = True
        photos = []
        for photo in photos1: # do the haversin and attach comments proly a new litt func
            data = {}
 #add points based number of comments, distance, age order by these
            uuid = photo.uuid
            comments = Photo.return_comments(uuid, profile.deviceUUID)
            data={'uuid':photo.uuid,'lat':photo.lat,'lon':photo.lon,'isvideo':photo.isvideo,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid, 'photo_distance': 'n/a',\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}

            photos.append(data)
        if maps:
            t = photos
        else:
            t = photos[first_page:page1]
        returnphotos = {}
        returnphotos['objects'] = t
        return Response(returnphotos, status=status.HTTP_200_OK, headers={'Content-Type': 'application/json'})

#class logOut(APIView):
 #   authentication_classes = (TokenAuthentication,)
  #  permission_classes = (IsAuthenticated,)

   # def post(self, request, format=None):
    #    user = request._auth.user
     #   try:



class isanonSwitch(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request._auth.user
        try:
            uuid = request.data['user_uuid']
            profile = Profile.objects.get(user=user, uuid=uuid)
            if profile.created == True and profile.isanon == True:
                profile.isanon = False
                profile.save()
                return Response(False, status=status.HTTP_201_CREATED)
            elif profile.created == True and profile.isanon == False:
                profile.isanon = True
                profile.save()
                return Response(True, status=status.HTTP_201_CREATED)
            else:
                return Response("failed", status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response("failed", status=status.HTTP_400_BAD_REQUEST)

class ChangeUsername(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None): # this is for creating an account from anon or changing, password, username or email
        user = request._auth.user
        try:
            newusername = request.data['newusername']
        except:
            newusername = None
        try:
            newpassword = request.data['newpassword']
        except:
            newpassword = None
        try:
            newemail = request.data['newemail']
        except:
            newemail = None
        try:
            password = request.data['password']
        except:
            password = ''
        if newusername != None and newemail != None and newpassword != None:
            user.username = newusername
            user.email = newemail
            profile = Profile.objects.get(user=user)
            profile.created = True
            if User.objects.filter(email=newemail).exists() or User.objects.filter(username=newusername).exists():
                return Response("that email or username is already in use", status=status.HTTP_400_BAD_REQUEST)
            user.set_password(newpassword)
            user.save()
            profile.save()
            serializer = UserSerializer()
            data = serializer.data
            user.auth_token_set.all().delete()
            token = AuthToken.objects.create(user)
            data['created'] = True
            data['username'] = newusername
            data['token'] = token
            data['password']= newpassword
            data['user_uuid']= profile.uuid
            return Response(data, status=status.HTTP_201_CREATED)

        elif newusername != None:
            if User.objects.filter(username=newusername).exclude(username=user.username).exists():
                return Response("that username is taken", status=status.HTTP_400_BAD_REQUEST)
            user.username = newusername

            user.save()
            return Response("username changed", status=status.HTTP_201_CREATED)
        elif newemail != None:
            if User.objects.filter(email=newemail).exists():
                return Response("that email is taken", status=status.HTTP_400_BAD_REQUEST)
            user.email = newemail
           # profile.created = True
            return Response("email changed", status=status.HTTP_201_CREATED)
        elif newpassword != None:
            user.set_password(newpassword)
            return Response("pass changed", status=status.HTTP_201_CREATED)
        else:
            return Response("failed", status=status.HTTP_400_BAD_REQUEST)

class ChangePassword(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None): # send an email write a get this is password/username recovery
        user = request._auth.user

        if request.data['email'] == user.email:
            print('######SSSSSSSEEEEND AN EMAIL')
            return Response("comment updated", status=status.HTTP_201_CREATED)
        return Response("comment updated", status=status.HTTP_400_BAD_REQUEST)

class AccountCreation(APIView):

    def post(self, request, format=None): # user creation return token and log in

        try:
           uu = uuid.uuid4()
           user = User.objects.create_user(str(uu), 'anonemail@anonshot.com',  str(uu))
           user.save()
           profile = Profile.objects.create(user=user, isanon=True, created=False, deviceUUID=request.data['deviceUUID'])
           token = AuthToken.objects.create(user)
           serializer = UserSerializer()
           data = serializer.data
           data['created'] = False
           data['username'] = uu
           data['token'] = token
           data['password']= uu
           data['user_uuid']= profile.uuid
           return Response(data, status=status.HTTP_201_CREATED)
        except:
           return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LILOViewSet(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


    def post(self, request, format=None):# refreshes token changes isanon
    #   olduser = User.objects.get(username=request.data['username'])
        olduser = request._auth.user
        username = request.data['username']
        password = request.data['password']
        user = User.objects.get(username=username)

        if user.check_password(password):
            user.is_active = True
            user.save()
            profile = Profile.objects.get(user=user)
            profile.isanon = False
            profile.save()
            user = authenticate(username=username, password=password)
            login(request, user)
            user.auth_token_set.all().delete()
            token = AuthToken.objects.create(user)
            oldprofile = Profile.objects.get(user=olduser)
            oldprofile.delete()
            olduser.delete()
            data = {}
            data['user_uuid'] = profile.uuid
            data['created'] = profile.created
            data['username'] = user.username
            data['token'] = token
            return Response(data, status=status.HTTP_202_ACCEPTED)
        else:
            return HttpResponse('wrong username or password', status=status.HTTP_400_BAD_REQUEST)



    def get(self, request, *args, format=None): # this doesn't work. doesn't really matter cause we can delete key on the phone side \
        return HttpResponse('user has been logged out', status=status.HTTP_202_ACCEPTED)


class ReturnUserPhotos(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):# return 60~ photos close to current gps give photos a points value I guess, return comments
        # first query database find gps data closest to users then retrieve the 60 most similar going up and down
# then find all comments attached to those photos and assign point system based on date published distance to user and comments
        #
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        photos1 = Photo.objects.filter(poster=request.data['username']).order_by('timestamp').reverse()
        lat1 = float(request.data['lat'])
        lon1 = float(request.data['lon'])
        page = int(request.data['page'])
        page1 = page * 8
        first_page = page1 - 8
        photos = []
        for photo in photos1: # do the haversin and attach comments proly a new litt func
            data = {}
            lat2 = float(photo.lat)
            lon2 = float(photo.lon)
            #photo.distance = self.haversine(lon1, lat1, lon2, lat2) #add points based number of comments, distance, age order by these
            lat = round(photo.lat, 6)
            lon = round(photo.lon, 6)
            uuid = photo.uuid
            comments = Photo.return_comments(uuid, profile.deviceUUID)
            data={'uuid':photo.uuid,'lat':lat,'lon':lon,'isvideo':photo.isvideo,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid,'photo_distance':'n/a',\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}

            photos.append(data)
        t = photos[first_page:page1]
        returnphotos = {}
        returnphotos['objects'] = t
        return Response(returnphotos, status=status.HTTP_200_OK, headers={'Content-Type': 'application/json'})


class UserViewSet(APIView):  # need to make a
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


    def put(self, request, *args, format=None):# change password or username make this more secure in the future
        user = request._auth.user
        if args[0] == user.username and user.check_password(request.data['password']) == True:
            user.set_password(request.data['newpassword'])
            user.save()
            return Response('new password has been set', status=status.HTTP_202_ACCEPTED)
        else:
            return Response('username and authtoken and or password do not match', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, format=None):

        user = request._auth.user
        if args[0] == user.username and user.check_password(request.data['password']) == True:
            user.is_active = False
            user.save()
            return Response('user has been made inactive', status=status.HTTP_202_ACCEPTED)
        else:
            return Response('username and authtoken and or password do not match', status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, format=None): # if arg is uuid return photo if arg is username return users photos
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        photos = []  # fix this please
        if user.username == args[0]:
            photos1 = Photo.objects.filter(useruuid=profile.uuid).order_by('timestamp')
            serializer = PhotoSerializer(photos, many=True)
            for photo in photos1: # do the haversin and attach comments proly a new litt func
                if photo.visible:
                    data = {}
                    lat2 = float(photo.lat)
                    lon2 = float(photo.lon)
                    photo.distance = self.haversine(lon1, lat1, lon2, lat2) #add points based number of comments, distance, age order by these
                    lat = round(photo.lat, 6)
                    lon = round(photo.lon, 6)
                    uuid = photo.uuid
                    comments = Photo.return_comments(uuid, profile.deviceUUID)
                    data={'uuid':photo.uuid,'lat':lat, 'photo_distance': photo.distance,'lon':lon,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid,'photo_distance':'n/a',\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}

                    photos.append(data)

            returnphotos = {}
            returnphotos['objects'] = photos
            return Response(returnphotos, status=status.HTTP_202_ACCEPTED, headers={'Content-Type': 'application/json'})
        try:
            photo = Photo.objects.get(uuid=args[0])
            uuid = args[0]
            comments = Photo.return_comments(uuid, profile.deviceUUID)
            data={'uuid':photo.uuid,'lat':photo.lat,'lon':photo.lon,'isvideo':photo.isvideo,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid,'photo_distance': 'n/a',\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}
            return Response(data, status=status.HTTP_202_ACCEPTED, headers={'Content-Type': 'application/json'})
        except Photo.DoesNotExist:
            return Response("photo or user not found", status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=args[0])
            photos1 = Photo.objects.filter(useruuid=profile.uuid, poster=user.username).order_by('timestamp')
            serializer = PhotoSerializer(photos, many=True)
            for photo in photos1: # do the haversin and attach comments proly a new litt func
                data = {}
                lat2 = float(photo.lat)
                lon2 = float(photo.lon)
                photo.distance = self.haversine(lon1, lat1, lon2, lat2) #add points based number of comments, distance, age order by these
                lat = round(photo.lat, 6)
                lon = round(photo.lon, 6)

                uuid = photo.uuid
                comments = Photo.return_comments(uuid, profile.deviceUUID)
                data={'uuid':photo.uuid,'lat':lat, 'photo_distance': photo.distance,'lon':lon,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid,'photo_distance':'n/a',\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}

            photos.append(data)

            returnphotos = {}
            returnphotos['objects'] = photos
            return Response(returnphotos, status=status.HTTP_202_ACCEPTED, headers={'Content-Type': 'application/json'})
        except User.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("photo or user not found", status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request._auth.user

        try:
            user = request.user
            profile = Profile.objects.get(user=user)
        except:
            return Response("user not found", status=status.HTTP_400_BAD_REQUEST)
        print("here1")
        data = request.data.copy()
        data['useruuid'] = str(profile.uuid)
        if profile.isanon == True:
            data['poster'] = 'anon'
        else:
            data['poster'] = user.username
        serializer = CommentsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, format=None):
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        try:
            comment = Comments.objects.get(uuid=request.data['uuid'])
            if profile.uuid == comment.useruuid:
                comment.delete()
                return Response("comment deleted", status=status.HTTP_202_ACCEPTED)
            else:
                return Response("user does not own comment", status=status.HTTP_400_BAD_REQUEST)
        except Comments.DoesNotExist:
            return Response("failure to delete comment", status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        comment = Comments.objects.get(uuid=request.data['commentuuid'])
        if comment.useruuid == profile.uuid:
            comment.comment = request.data['comment']
            comment.save()
            return Response("comment updated", status=status.HTTP_201_CREATED)
        else:
            return Response("user does not own comment", status=status.HTTP_400_BAD_REQUEST)


class DeletePhotoViewSet(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request): # make sure user owns photo delete comments too
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        try:
            photo = Photo.objects.get(uuid=request.data['uuid'])
            if profile.uuid == photo.useruuid:
                if photo.isvideo == True:
                    uuid_str = ('/home/connlloc/sites/q/photos/%s.mp4' % request.data['uuid'])
                else:
                    uuid_str = ('/home/connlloc/sites/q/photos/%s.jpg' % request.data['uuid'])
                comments = Comments.objects.filter(photouuid=photo.uuid)
                photo.delete()
                comments.delete()
                os.remove(uuid_str)
                #self.delete_picture_from_s3(request.data['uuid'])
                return Response("photo deleted", status=status.HTTP_202_ACCEPTED)
            else:
                return Response("user does not own photo", status=status.HTTP_400_BAD_REQUEST)
        except Photo.DoesNotExist:
            return Response("failure to delete photo from server", status=status.HTTP_400_BAD_REQUEST)

class BanCheck(APIView):

    def BanCheck(self, request):
        deviceUUID = request['deviceUUID']
        user_set = Profile.objects.filter(deviceUUID=deviceUUID)
        for user in user_set:
            if user.banned:
                return True
        return False


    def post(self, request, format=None):
        deviceUUID = request.data['deviceUUID']
        user_set = Profile.objects.filter(deviceUUID=deviceUUID)
        for user in user_set:
            if user.banned:
                return Response(True, status=status.HTTP_202_ACCEPTED)
        return Response(False, status=status.HTTP_202_ACCEPTED)


class PhotoViewSet(APIView):  #need to issue tokens for anon users and logged in users.
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

#serializer = UserSerializer()
          # data = serializer.data
          # data['username'] = uu
          # data['token'] = token
          # data['password']= uu


    def get(self, request, *args, format=None):# return 60~ photos close to current gps give photos a points value I guess, return comments
        # first query database find gps data closest to users then retrieve the 60 most similar going up and down
# then find all comments attached to those photos and assign point system based on date published distance to user and comments

        user = request._auth.user
        profile = Profile.objects.get(user=user)
        photos1 = self.returnObjects(*args)
        lat1 = float(args[0])
        lon1 = float(args[1])
        page = int(args[2])
        page1 = page * 8
        first_page = page1 - 8
        photos = []
        for photo in photos1: # do the haversin and attach comments proly a new litt func
            if photo.visible and self.blockCheck(photo.useruuid, profile.deviceUUID) == True:
                data = {}
                lat2 = float(photo.lat)
                lon2 = float(photo.lon)
                photo.distance = self.haversine(lon1, lat1, lon2, lat2) #add points based number of comments, distance, age order by these
                lat = round(photo.lat, 6)
                lon = round(photo.lon, 6)
                uuid = photo.uuid
                comments = Photo.return_comments(uuid, profile.deviceUUID)
                data={'uuid':photo.uuid,'lat':lat,'lon':lon,'isvideo':photo.isvideo,'poster':photo.poster,'timestamp':photo.timestamp,\
'caption':photo.caption,'useruuid':photo.useruuid,'photo_distance':photo.distance,\
'comments':[{'photouuid':com.photouuid,'comments':com.comment,'poster':com.poster,'timestamp':com.timestamp,'uuid':com.uuid,'useruuid':com.useruuid} for com in comments]}

                photos.append(data)


        #d = sorted(photos, key=lambda k: k['timestamp'])
        #rank = 0
        #for p in d:
            #p['rank'] = rank
            #rank = rank + 1
        t = sorted(photos, key=lambda k: k['photo_distance'])
        rank = 0
        #for p in t:
        #    p['rank'] = p['rank'] + rank
        #    rank = rank + 1
        g = t[first_page:page1]
        returnphotos = {}
        returnphotos['objects'] = g
        return Response(returnphotos, status=status.HTTP_200_OK, headers={'Content-Type': 'application/json'})


    def blockCheck(self, useruuid, deviceUUID):
        profiles = Profile.objects.filter(uuid=useruuid)
        for profile in profiles:
            if Block.objects.filter(blockee=profile.deviceUUID, blocker=deviceUUID).exists():
                return False
        return True



    def haversine(self, lon1, lat1, lon2, lat2):
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371 # Radius of earth in kilometers. Use 3956 for miles
        distance = c * r
        stringDistance = str(distance)
        distance = stringDistance[:7]
        distance = float(distance)
        return distance


    def returnObject(self, *args):
        uuid = args[0]
        photo = Photo.objects.get(uuid=uuid)
        return photo


    def returnObjects(self, *args):
        lat = float(args[0])
        lon = float(args[1])
        lat = int(lat)
        lon = int(lon)
        #lon = int(lon)
        latp = lat + 1
        latm = lat - 1
        lonp = lon + 1
        lonm = lon -1
        photos = Photo.objects.filter(lat__lte=latp, lon__lte=lonp,lat__gte=latm,lon__gte=lonm)
        return photos# attach comments and do the haversine
        #for arg in *args search query database for ex. 32.32*, 23.23* if .count() >= 60: otherfunc(query) else query for 32.3*, 23.2*
        # and so on and so forth



    def post(self, request, format=None):#save photo to amazon save url, uuid, lat, long, timestamp, visible IO, poster uuid
        user = request._auth.user
        profile = Profile.objects.get(user=user)
        request.data['useruuid'] = str(profile.uuid)
        if profile.isanon == True:
            request.data['poster'] = 'anon'
        else:
            request.data['poster'] = user.username
        if request.data['isvideo'] == 'True':
            request.data['isvideo'] = True
        else:
            request.data['isvideo'] = False
        request.data['visible'] = True
        #self.roundgps('lon' ,request)
        #self.roundgps('lat' ,request)
        serializer = PhotoSerializer(data=request.data)
        print(serializer.initial_data)
        if serializer.is_valid(): # save info to model then send to amazon, if fail delete photo
            serializer.save()
            uuid = serializer.data['uuid']
            f=request.data['file']

            try:
                if request.data['isvideo'] == True:
                    destination=open('/home/connlloc/sites/q/photos/%s.mp4' % uuid, 'wb+')
                    photo = '%s' % uuid
                    for chunk in f.chunks():
                        destination.write(chunk) ####delete this later writes photos to memory
                    destination.close()
                elif request.data['isvideo'] == False:
                    destination=open('/home/connlloc/sites/q/photos/%s.jpg' % uuid, 'wb+')
                    photo = '%s' % uuid
                    for chunk in f.chunks():
                        destination.write(chunk) ####delete this later writes photos to memory
                    destination.close()
                else:
                    return Response("data sent is not valid", status=status.HTTP_400_BAD_REQUEST)
            except:
                Photo.objects.get(uuid=uuid).delete()
                return Response("fail", status=status.HTTP_400_BAD_REQUEST)
            data = serializer.data
            return Response(data, status=status.HTTP_201_CREATED)
        return Response("data sent is not valid", status=status.HTTP_400_BAD_REQUEST)


    def clean_content(self, form):
        content = form.cleaned_data['photo']
        content_type = content.content_type.split('/')[0]
        #print(content_type)
        if content_type in settings.CONTENT_TYPES:
            if content._size > settings.MAX_UPLOAD_SIZE:
                return False
        else:
            return False
        return content

    def roundGET(self, var, n):
        wasNegative = False
        var = float(var)
        if var < 0:
            var = var * -1
            wasNegative = True
        var = math.floor(var * 10 ** n) / 10 ** n
        if wasNegative == True:
            var = var * -1
        return var


    def push_picture_to_cloudinary(self, uuid):
        try:
            image = '%s' % uuid
            response = cloudinary.uploader.upload(str(image), public_id=str(uuid))
            return
        except:
            raise Exception
            return HttpResponse(status=500)

    def roundgps(self, fl, request):
        var = request.data[fl]
        var = float(var)
        wasNegative = False
        if var < 0:
            var = var * -1
            wasNegative = True
        var = math.floor(var * 10 ** 5) / 10 ** 5
        if wasNegative == True:
            var = var * -1
        request.data[fl]=var
        var = str(var)
        if var[::-1].find('.') == 5:
            return request
        else:
            request.data[fl]='fail'
            return request
