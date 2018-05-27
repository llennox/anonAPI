try:
    from hmac import compare_digest
except ImportError:
    def compare_digest(a, b):
        return a == b


from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from knox.models import AuthToken
from django.contrib.auth.models import User
from qapp.models import Photo, Comments, Profile, Flag, Block

from knox.settings import CONSTANTS
import binascii
User = settings.AUTH_USER_MODEL
from knox.crypto import hash_token
from django.contrib.auth.models import User



class StreamConsumer(AsyncJsonWebsocketConsumer):

    def authenticate_credentials(self, token):
        '''
        Due to the random nature of hashing a salted value, this must inspect
        each auth_token individually to find the correct one.

        Tokens that have expired will be deleted and skipped
        '''
        msg = 'Invalid token.'
        token = token.decode("utf-8")
        for auth_token in AuthToken.objects.filter(
                token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH]):
            for other_token in auth_token.user.auth_token_set.all():
                if other_token.digest != auth_token.digest and other_token.expires is not None:
                    if other_token.expires < timezone.now():
                        other_token.delete()
            if auth_token.expires is not None:
                if auth_token.expires < timezone.now():
                    auth_token.delete()
                    continue
            try:
                digest = hash_token(token, auth_token.salt)
            except (TypeError, binascii.Error):
                raise exceptions.AuthenticationFailed(msg)
            if compare_digest(digest, auth_token.digest):
                return (auth_token.user, auth_token)
        # Authentication with this token has failed
        raise exceptions.AuthenticationFailed(msg)


    async def connect(self):

        await self.accept()
        

    async def disconnect(self, code):
        pass

    async def receive_json(self, action):

        if 'token' in action:
            try:
                print(action)
                token = action['token'].encode('utf-8')
                user, auth_token = self.authenticate_credentials(token)
                #user = AuthToken.objects.get(token_key=action['token'])
                if 'user_search_string' in action:
                    await self.search_user_string(action['user_search_string'])
            except Exception as e:
                await self.send('exception %s' % e)


    async def search_user_string(self, user_search_string):
        users = Profile.objects.filter(user__username__contains=user_search_string, created=True)
        return_users = {'objects':[{'userUUID': user.uuid, 'username': user.user} for user in users]}
        await self.send(str(return_users))
