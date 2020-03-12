from django.shortcuts import render, redirect

from .models import User, Item
from .serializers import UserSerializer, UserRegistrationSerializer, ItemSerializer
from .serializers import UserRegistrationSerializer
from rest_framework import generics, permissions
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest

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


class ItemSearch(generics.ListAPIView):
    serializer_class = ItemSerializer
    def get_queryset(self):
        name = self.request.GET.get('name','')
        item_rarity = self.request.GET.get('rarity',None)
        min_price = self.request.GET.get('min_price',None)
        max_price = self.request.GET.get('max_price',None)
        queryset = Item.objects.filter(name__istartswith=name)
        if item_rarity:
            queryset=queryset.filter(rarity=item_rarity)
        if min_price:
            pass
        if max_price:
            pass
        return queryset
