from django.shortcuts import render, redirect
from .models import User, Item, Price
from .serializers import UserSerializer, ItemSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest

def convertArgToFloat(str):
    try:
        if str:
            return float(str)
        return None
    except:
        return None

# Create your views here.
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    renderer_classes = [JSONRenderer]
    permission_classes = [
        permissions.AllowAny
    ]

    def create(self, request, *args, **kwargs):
        model_serializer = UserSerializer(data=request.data)
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
        min_price=convertArgToFloat(min_price);
        max_price=convertArgToFloat(max_price);
        queryset = Item.objects.filter(name__istartswith=name)
        if item_rarity:
            queryset=queryset.filter(rarity=item_rarity)
        for item in queryset:
            lowest_price = float(item.price_set.latest('timestamp').lowest_price)
            if min_price and lowest_price<min_price:
                queryset=queryset.exclude(item_id=item.item_id)
            if max_price and lowest_price>max_price:
                queryset=queryset.exclude(item_id=item.item_id)
        return queryset
