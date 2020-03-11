from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.UserListCreate.as_view()),
    path('api/item/search/', views.ItemSearch.as_view()),
]
