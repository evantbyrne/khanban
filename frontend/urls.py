from django.conf.urls import include
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views, rest

urlpatterns = [
    path('api/', include(rest.router.urls)),
    path('api/token/', obtain_auth_token, name='auth_token'),
    path('auth/login/', views.index, name='auth_login'),
    path('', views.index, name='index')
]
