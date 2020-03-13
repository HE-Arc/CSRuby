from django.shortcuts import render, redirect
from .models import User, Item, Price
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

class ItemPriceDetail(generics.ListAPIView):
    serializer_class = ItemPricesSerializer
    def get_queryset(self):
        item_id = self.request.GET.get('item','')
        timestamp = self.request.GET.get('timestamp',None)
        lowest_price = self.request.GET.get('lowest_price',None)
        median_price = self.request.GET.get('median_price',None)
        queryset = Price.objects.filter(item_id__exact=item)
        return queryset
