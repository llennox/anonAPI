from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from qapp.models import Profile, User, Comments, Photo
from django.core.files.uploadedfile import SimpleUploadedFile 
from requests.auth import HTTPBasicAuth
  


class AccountTests(APITestCase):

    def test_create_account(self):
        url = reverse('accountcreation')
        data = {'username':'test', 'password':'password', 'email':'email@example.com', 'isanon': False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test')
        return response.data['token']

    def test_logs_user_in_username_password(self):
        self.test_create_account()
        url = reverse('login')
        data = {'username':'test', 'password':'password','isanon':True}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_changes_user_password(self):
        authtoken = self.test_create_account()
        url = reverse('user' , args=['test'])
        data = {'newpassword':'newpassword', 'password':'password'}
        response = self.client.put(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_makes_user_inactive(self):
        authtoken = self.test_create_account()
        url = reverse('user' , args=['test'])
        data = {'password':'password'}
        response = self.client.delete(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)


class PhotoTests(APITestCase):
 
    def test_uploads_photo(self):
        authtoken = AccountTests.test_create_account(self)
        url = reverse('photos')
        media = SimpleUploadedFile(name='iceax.jpg', content=open('/home/gene-art/sites/anonAPI/qapp/iceax.jpg', 'rb').read(), content_type='multipart/form-data')
        data = {"lat":"12.11111", "lon":"12.11111", "caption":"this is a caption", "media":media}
        response = self.client.post(url, data, format='multipart', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response.data['uuid'], authtoken

    def test_returns_photos(self):
        authtoken = AccountTests.test_create_account(self)
        url = reverse('photos', args=['12.11111', '12.11111']) 
        response = self.client.get(url, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for photo in response.data:
            self.assertEqual(photo['distance'], True)

    def test_user_delete_photo(self):
        photouuid, authtoken = self.test_uploads_photo()
        url = reverse('photos')
        data = {'uuid':photouuid, 'password':'password'}
        response = self.client.delete(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)  
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        
class CommentTests(APITestCase):
      
    def test_can_post_comment(self):
       photouuid, authtoken = PhotoTests.test_uploads_photo(self)
       url = reverse('comments')
       data = {'photouuid':photouuid,'comment':'this must be the place'}
       response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
       self.assertEqual(response.status_code, status.HTTP_201_CREATED)    
       return  photouuid, authtoken, response.data['uuid'] 

    def test_can_change_comment(self):##here i am
       photouuid, authtoken, commentuuid = self.test_can_post_comment()
       url = reverse('comments')
       data = {'photouuid':photouuid,'commentuuid':commentuuid, 'comment':'this must be the place11111'}
       response = self.client.put(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
       self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
       comment = Comments.objects.get(uuid=commentuuid)
       self.assertEqual(comment.comment, 'this must be the place11111')       
       return response.data

    def test_can_delete_comment(self):
        photouuid, authtoken, commentuuid = self.test_can_post_comment()
        url = reverse('comments')
        data = {'uuid':commentuuid, 'password':'password'}
        response = self.client.delete(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)  
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)  

 
class ProfileTests(APITestCase):
  
    def test_to_view_profile_photos(self):
        uuid, authtoken = PhotoTests.test_uploads_photo(self)    
        url = reverse('userphotos', args=['test'])
        response = self.client.get(url, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)   


    def test_to_return_single_photo(self):
        uuid, authtoken = PhotoTests.test_uploads_photo(self)
        url = reverse('photo', args=[uuid])
        response = self.client.get(url, format='json', HTTP_AUTHORIZATION='Token ' + authtoken) 
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)   


class AnonProfileTests(APITestCase):
    
    def test_user_can_bypass_account_create(self):
        url = reverse('accountcreation')
        data = {'username':'', 'password':'', 'email':'', 'isanon': 'True'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #self.assertEqual(Profile.objects.count(), 2)
        #self.assertEqual(User.objects.get().username, 'test')
        return response.data['token']

    def test_user_can_create_username_after_creating_asanon(self):
        authtoken = self.test_user_can_bypass_account_create()
        url = reverse('change_username')
        data = {'newusername':'testusername1', 'newpassword':'thisisanewpassword', 'newemail':'anewemail@example.com'}
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return authtoken
 
    def test_user_can_change_username(self):
        authtoken = self.test_user_can_create_username_after_creating_asanon()
        url = reverse('change_username')
        data = {'newusername':'testusername1', 'password': 'thisisanewpassword'}
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_can_change_password(self):
        authtoken = self.test_user_can_create_username_after_creating_asanon()
        url = reverse('change_username')
        data = {'password': 'thisisanewpassword', 'newpassword':'thisisanewpassword1'}
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_can_change_email(self):
        authtoken = self.test_user_can_create_username_after_creating_asanon()
        url = reverse('change_username')
        data = {'password': 'thisisanewpassword', 'newemail':'a11newemail@example.com'}
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + authtoken)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#messages
#follow function
#search users function
#change user name function
#make another area in Profil that dictates if username is set not or not. make username 




        
