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
from knox.models import AuthToken
from django.utils import timezone
import pytz

def convertArgToFloat(str):
    try:
        if str:
            return float(str)
        return None
    except:
        return None

class RegistrationAPI(generics.GenericAPIView):
    serializer_class= RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class= LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })

class AuthAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class=UserSerializer

    def get_object(self):
        return self.request.user

class UserView(generics.GenericAPIView):
    serializer_class=UserSerializer

    def get(self, request, *args, **kwargs):
        user_id = None

        response_body = {
            'status': 'failed',
            'data': None,
        }

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                return Response(response_body)

            buy_orders = None
            buy_orders_item_ids = set()
            items_to_buy = []

            sell_orders = None
            sell_orders_item_ids = set()
            items_to_sell = []

            # Get the items from the buy and sell orders
            if User_Item.objects.filter(buy_item__exact='1', user_id__exact=user_id).exists():
                buy_orders = User_Item.objects.filter(buy_item__exact='1', user_id__exact=user_id).all()

                for buy_order in buy_orders:
                    buy_orders_item_ids.add(buy_order.item_id)

                for item_id in buy_orders_item_ids:
                    item = Item.objects.get(item_id__exact=item_id)
                    items_to_buy.append(item)

            if User_Item.objects.filter(sell_item__exact='1', user_id__exact=user_id).exists():
                sell_orders = User_Item.objects.filter(sell_item__exact='1', user_id__exact=user_id).all()

                for sell_order in sell_orders:
                    sell_orders_item_ids.add(sell_order.item_id)

                for item_id in sell_orders_item_ids:
                    item = Item.objects.get(item_id__exact=item_id)
                    items_to_buy.append(item)

            response_body =  {
                'status': 'success',
                'user_info': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'steamid': user.steamid,
                    'date_joined': user.date_joined,
                }
            }

            if items_to_buy:
                for item_to_buy in items_to_buy:
                    response_body['user_info']['items_to_buy'] = [
                        {
                            'item_id': item_to_buy.item_id,
                            'name': item_to_buy.name,
                            'item_image': item_to_buy.item_image,
                            'rarity': item_to_buy.rarity,
                        }
                    ]
            else:
                response_body['user_info']['items_to_buy'] = None

            if items_to_sell:
                for item_to_sell in items_to_sell:
                    response_body['user_info']['items_to_sell'] = [
                        {
                            'item_id': items_to_sell.item_id,
                            'name': items_to_sell.name,
                            'item_image': items_to_sell.item_image,
                            'rarity': items_to_sell.rarity,
                        }
                    ]
            else:
                response_body['user_info']['items_to_sell'] = None

        return Response(response_body)

    def patch(self, request, *args, **kwargs):
        email = ''
        user_id = None

        response_body = {
            'status': 'failed',
            'description': 'Something went wrong',
        }

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                raise

            if request.data['username']:
                username = request.data['username']
                user.username = username

            steamid = request.data['steamid']
            user.steamid = steamid

            if request.data['password']:
                password = request.data['password']
                user.set_password(password)

            user.save()
            response_body = {
                'status': 'success',
                'description': 'Your profile has been modified.',
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
            }

        return Response(response_body)

    def delete(self, request, *args, **kwargs):
        response_body = {
            'status': 'failed',
            'description': 'Something went wrong',
        }

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                raise

            user.delete()

            response_body = {
                'status': 'success',
                'description': 'Your profile has been successfully deleted.',
            }

        return Response(response_body)

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

class ItemActions(generics.GenericAPIView):
    serializer_class = ItemActionSerializer

    def post(self, request, *args, **kwargs):
        item = None
        user = None
        item_id = ''
        authed_user = ''
        possible_actions = ['buy', 'sell', 'fav']
        action = ''

        unexpected_error_response = Response({
        'status': 'failed',
        'description': 'Something went wrong'
        })

        if request.data['action'] and request.data['action'] in possible_actions:
            action = request.data['action']

            success_msg = 'Undefined'
            duplicate_msg = 'Undefined'

            if action == 'buy':
                success_msg = 'Added buy order on this item. Refresh the page to see your sell order'
                duplicate_msg = 'Buy order already placed on this item'
            elif action == 'sell':
                success_msg = 'Added sell order on this item. Refresh the page to see your sell order'
                duplicate_msg = 'Sell order already placed on this item'

            duplicate_error_response = Response({
            'status': 'failed',
            'description': duplicate_msg,
            'action': action,
            })

            success_response = Response({
            'status': 'success',
            'description': success_msg,
            'action': action,
            })

            try:
                if request.data['item_id'] and request.data['authed_user']:
                    item_id = request.data['item_id']
                    authed_user = request.data['authed_user']
                    item = Item.objects.get(item_id__exact=item_id)
                    user = CSRuby_User.objects.get(email__exact=authed_user)
            except Exception as e:
                return unexpected_error_response

            if item and user:
                if not User_Item.objects.filter(item__exact=item, user__exact=user).exists():
                    if action == 'buy':
                        user_item = User_Item.objects.create_buy(item=item, user=user)
                    elif action == 'sell':
                        user_item = User_Item.objects.create_sell(item=item, user=user)

                    try:
                        user_item.save()
                        return success_response
                    except Exception as e:
                        return unexpected_error_response

                user_item = User_Item.objects.get(item__exact=item, user__exact=user)
                if action == 'buy' and user_item.buy_item == False:
                    user_item.buy_item = True
                    user_item.buy_created_at = timezone.now()
                    user_item.save()
                    return success_response

                if action == 'sell' and user_item.sell_item == False:
                    user_item.sell_item = True
                    user_item.sell_created_at = timezone.now()
                    user_item.save()
                    return success_response
                return duplicate_error_response
            return unexpected_error_response

    def delete(self, request, *args, **kwargs):
        action = ''
        possible_actions = ['buy', 'sell', 'fav']

        if request.data['trade_id'] and request.data['action']:
            trade_id = request.data['trade_id']
            action = request.data['action']
            if User_Item.objects.filter(id__exact=trade_id).exists() and action in possible_actions:
                user_item = User_Item.objects.get(id__exact=trade_id)

                if action == 'buy':
                    user_item.buy_item = False
                if action == 'sell':
                    user_item.sell_item = False
                user_item.save()

                return Response({
                'status': 'success',
                'action': action,
                'description': 'Trade has been deleted. Refresh the page to see your modifcation',
                })

        return Response({
        'status': 'failed',
        'description': 'Something went wrong',
        'action': action,
        })
