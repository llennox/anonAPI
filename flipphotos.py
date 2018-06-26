from PIL import Image, ExifTags
import os

for file in os.listdir('/home/connlloc/sites/q/photos/'):
    try:
        filepath='/home/connlloc/sites/q/photos/%s' % file
        image=Image.open(filepath)
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation]=='Orientation':
                break
        exif=dict(image._getexif().items())

        if exif[orientation] == 3:
            image=image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image=image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image=image.rotate(90, expand=True)
        image.save(filepath)
        image.close()

    except (AttributeError, KeyError, IndexError):
    # cases: image don't have getexif
        pass
