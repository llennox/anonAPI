from django.contrib import admin
from qapp.models import Photo, Profile, Comments

class PhotoAdmin(admin.ModelAdmin):
    pass
admin.site.register(Photo, PhotoAdmin)

class ProfileAdmin(admin.ModelAdmin):
    pass
admin.site.register(Profile, ProfileAdmin)

class CommentAdmin(admin.ModelAdmin):
    pass
admin.site.register(Comments, CommentAdmin)
