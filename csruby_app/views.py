from django.shortcuts import render, redirect
from .models import User, Item
from .serializers import UserSerializer, ItemSerializer
from rest_framework import generics
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest

# Create your views here.
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ItemSearch(generics.ListAPIView):
    serializer_class = ItemSerializer
    def get_queryset(self):
        search_input = self.request.GET.get('name','')
        queryset = Item.objects.filter(name__istartswith=search_input)
        return queryset
