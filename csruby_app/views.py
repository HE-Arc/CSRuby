from django.shortcuts import render, redirect
from .models import User, Item, Price
from .serializers import UserSerializer, ItemSerializer
from rest_framework import generics
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest
from django.db import models

def convertArgToFloat(str):
    try:
        if str:
            return float(str)
        return None
    except:
        return None

def get_lowest_price(item):
    try:
        return float(item.price_set.latest('timestamp').lowest_price)
    except:
        return None

# Create your views here.
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ItemSearch(generics.ListAPIView):
    serializer_class = ItemSerializer



    def get_queryset(self):
        name = self.request.GET.get('name','')
        item_rarity = self.request.GET.get('rarity',None)
        min_price = self.request.GET.get('min_price',None)
        max_price = self.request.GET.get('max_price',None)
        order_by = self.request.GET.get('order_by',None)
        min_price=convertArgToFloat(min_price);
        max_price=convertArgToFloat(max_price);
        queryset = Item.objects.filter(name__istartswith=name)
        if item_rarity:
            queryset=queryset.filter(rarity=item_rarity)
        for item in queryset:
                lowest_price = get_lowest_price(item)
                item.lowest_price=lowest_price
                if lowest_price:
                    #item.annotate(lowest_price=lowest_price)
                    if min_price and lowest_price<min_price:
                        queryset=queryset.exclude(item_id=item.item_id)
                    if max_price and lowest_price>max_price:
                        queryset=queryset.exclude(item_id=item.item_id)
        queryset=sorted(queryset, key=lambda item:get_lowest_price(item) if get_lowest_price(item) else 0, reverse=order_by and order_by=='DESC')
        return queryset
