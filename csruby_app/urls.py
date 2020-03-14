from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserListCreate.as_view()),
    path('item/search/', views.ItemSearch.as_view()),
    path('items/<int:pk>', views.ItemPriceDetail.as_view()),
]
