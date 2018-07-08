from django.conf.urls import include
from django.urls import path
from . import views, rest

urlpatterns = [
    path('api/', include(rest.router.urls)),
    path('', views.index, name='index'),
]
