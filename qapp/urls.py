from django.conf.urls import url, include
from qapp import views
from rest_framework import routers



urlpatterns = [
	
    url(r'^photos/$', views.PhotoViewSet.as_view(), name='photos'),
    url(r'^comments/$', views.CommentViewSet.as_view(), name='comments'),
    url(r'^photos/(\-?\d{1,2}\.\d{5,10})/(\-?\d{1,2}\.\d{5,10})/([0-9a-z]{40}\Z)$', views.PhotoViewSet.as_view(), name='photos'),
    url(r'^user/(.+)$', views.UserViewSet.as_view(), name='user'),
    url(r'^user/$', views.UserViewSet.as_view(), name='user'),
    url(r'^userphotos/(.+)/([0-9a-z]{40}\Z)$', views.UserViewSet.as_view(), name='userphotos'),
    url(r'^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/([0-9a-z]{40}\Z)$', views.UserViewSet.as_view(), name='photo'),
    url(r'^login/$', views.LILOViewSet.as_view(), name='login'),
    url(r'^logout/([0-9a-z]{40}\Z)$', views.LILOViewSet.as_view(), name='logout'),
    url(r'^$', views.api_documentation, name='api_documentation'),

] 

