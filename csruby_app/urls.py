from django.urls import path, include
from . import views
from knox import views as knox_views

urlpatterns = [
    path('item/search/', views.ItemSearch.as_view()),
    path('items/<int:pk>', views.ItemPriceDetail.as_view()),
    path('item/buyItem', views.ItemActions.as_view()),
    path('item/sellItem', views.ItemActions.as_view()),
    path('items/getMostExpensive', views.ItemMostExpensive.as_view()),
    path('auth/', include('knox.urls')),
    path('auth/register', views.RegistrationAPI.as_view()),
    path('auth/login', views.LoginAPI.as_view()),
    path('auth/user', views.UserAPI.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
]
