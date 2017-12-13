from django.conf.urls import url, include
from qapp import views
from rest_framework import routers



urlpatterns = [
	
    url(r'^api/photos/$', views.PhotoViewSet.as_view(), name='photos'),
    url(r'^api/change-username/$', views.ChangeUsername.as_view(), name='change_username'),
    url(r'^api/change-password/$', views.ChangePassword.as_view(), name='change_password'),
    url(r'^api/comments/$', views.CommentViewSet.as_view(), name='comments'),
    url(r'^api/photos/(\-?\d{1,2}\.\d{5,40})/(\-?\d{1,2}\.\d{5,40})$', views.PhotoViewSet.as_view(), name='photos'),
    url(r'^api/user/(.+)$', views.UserViewSet.as_view(), name='user'),
    url(r'^api/user/$', views.UserViewSet.as_view(), name='user'),
    url(r'^api/create-user/$', views.AccountCreation.as_view(), name='accountcreation'),
    url(r'^api/userphotos/(.+)$', views.UserViewSet.as_view(), name='userphotos'),
    url(r'^api/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$', views.UserViewSet.as_view(), name='photo'),
    url(r'^api/login/$', views.LILOViewSet.as_view(), name='login'),
    url(r'^api/logout/$', views.LILOViewSet.as_view(), name='logout'),
    url(r'^$', views.api_documentation, name='api_documentation'),
    url(r'api/auth/', include('knox.urls'))
] 

