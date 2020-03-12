from django.shortcuts import render, redirect
from .models import User
from .serializers import UserSerializer
from .serializers import UserRegistrationSerializer
from rest_framework import generics, permissions

# Create your views here.
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def create(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Everything's valid, so send it to the UserSerializer
        model_serializer = UserSerializer(data=serializer.data)
        model_serializer.is_valid(raise_exception=True)
        model_serializer.save()

        return Response(model_serializer.data)
