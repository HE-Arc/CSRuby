from django.shortcuts import render, redirect
from .models import User, Item, Price
from .serializers import UserSerializer, ItemSerializer
from rest_framework import generics
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
            try:
                lowest_price = float(item.price_set.latest('timestamp').lowest_price)
                if min_price and lowest_price<min_price:
                    queryset=queryset.exclude(item_id=item.item_id)
                if max_price and lowest_price>max_price:
                    queryset=queryset.exclude(item_id=item.item_id)
            except:
                pass
        return queryset
