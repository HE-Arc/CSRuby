from django.shortcuts import render, redirect
from .models import *
from .serializers import *
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest
from django.db import models
import csruby_app.utils.item_utils as item_utils

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
        order_by = self.request.GET.get('order_by','')
        min_price=convertArgToFloat(min_price);
        max_price=convertArgToFloat(max_price);
        queryset = Item.objects.filter(name__icontains=name)
        if item_rarity:
            queryset=queryset.filter(rarity=item_rarity)
        for item in queryset:
                lowest_price = item_utils.get_lowest_price(item)
                item.lowest_price=lowest_price
                if lowest_price:
                    if min_price and lowest_price<min_price:
                        queryset=queryset.exclude(item_id=item.item_id)
                    if max_price and lowest_price>max_price:
                        queryset=queryset.exclude(item_id=item.item_id)
        if order_by=='price' or order_by=='price_reverse':
            queryset=sorted(queryset, key=lambda item:item_utils.get_lowest_price(item) if item_utils.get_lowest_price(item) else 0, reverse=order_by=='price_reverse')
        elif order_by=='rarity' or order_by=='rarity_reverse':
            queryset=sorted(queryset, key=lambda item:item_utils.get_rarity_value(item.rarity), reverse=order_by=='rarity_reverse')
        elif order_by=='name' or 'name_reverse':
            queryset=queryset.order_by('name' if order_by=='name' else '-name')
        return queryset

class ItemPriceDetail(generics.RetrieveAPIView):
    serializer_class = ItemSerializer
    def get_queryset(self):
        queryset = Item.objects.all()
        return queryset

class ItemMostExpensive(generics.ListAPIView):
    serializer_class = ItemSerializer
    def get_queryset(self):
        queryset = Item.objects.all()
        lowest_price = -1
        for item in queryset:
            current_lowest_price = float(item.price_set.latest('timestamp').lowest_price)
            if current_lowest_price > lowest_price:
                lowest_price = current_lowest_price

        for item in queryset:
            current_lowest_price = float(item.price_set.latest('timestamp').lowest_price)
            if lowest_price > current_lowest_price:
                queryset=queryset.exclude(item_id=item.item_id)
        return queryset

class ItemAddFavorite(generics.ListCreateAPIView):
    queryset=User_Item.objects.all();
    serializer_class=UserItemSerializer;
    def create(self, request, *args, **kwargs):
        model_serializer = UserItemSerializer(data=request.data)
        model_serializer.is_valid(raise_exception=True)

        user_item = User_Item.objects.filter(user=request.data['user'],item=request.data['item']).first()
        if user_item:
            # if the user_item exists, we only update it
            model_serializer.update(user_item,model_serializer.validated_data)
        else:
            # if the user_item doesn't exists, we create it
            model_serializer.save()
        return Response(model_serializer.data)
