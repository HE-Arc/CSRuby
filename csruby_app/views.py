from django.shortcuts import render, redirect
from .models import Users
from .serializers import UsersSerializer
from rest_framework import generics

# Create your views here.
class UsersListCreate(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
