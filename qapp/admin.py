from django.contrib import admin
from qapp.models import Photo, Profile

class PhotoAdmin(admin.ModelAdmin):
    pass
admin.site.register(Photo, PhotoAdmin)

class ProfileAdmin(admin.ModelAdmin):
    pass
admin.site.register(Profile, ProfileAdmin)
