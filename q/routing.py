from django.conf.urls import url
from channels.routing import ProtocolTypeRouter
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
from q.consumers import StreamConsumer

application = ProtocolTypeRouter({
    "websocket":
        SessionMiddlewareStack(
            URLRouter([
                url(r'^updates/', StreamConsumer)
            ],
        )
    ),
})
