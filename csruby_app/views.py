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

def convert_arg_to_float(str):
    try:
        if str:
            return float(str)
        return None
    except:
        return None

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })

class AuthAPI(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_object(self):
        return self.request.user

class UserView(generics.GenericAPIView):
    serializer_class = UserSerializer
    user_not_found = Response(data={'detail': 'User not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        user_id = None

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                return self.user_not_found

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
                'user': UserSerializer(user).data,
            }

            response_body['user']['items_to_buy'] = []

            if items_to_buy:
                for item_to_buy in items_to_buy:
                    response_body['user']['items_to_buy'].append(ItemProfileSerializer(item).data)
            else:
                response_body['user']['items_to_buy'] = None

            response_body['user']['items_to_sell'] = []

            if items_to_sell:
                for item_to_sell in items_to_sell:
                    response_body['user']['items_to_sell'].append(ItemProfileSerializer(item).data)
            else:
                response_body['user']['items_to_sell'] = None

            return Response(response_body)
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, *args, **kwargs):
        email = ''
        user_id = None

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                return self.user_not_found

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
                'user': UserSerializer(user).data,
            }

            return Response(response_body)
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        user_id = None

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = CSRuby_User.objects.get(id__exact=user_id)
            except Exception as e:
                return self.user_not_found

            user.delete()

            return Response(data={'detail': 'User was deleted successfully'})
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ItemSearch(generics.ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        name = self.request.GET.get('name', '')
        item_rarity = self.request.GET.get('rarity', None)
        min_price = self.request.GET.get('min_price', None)
        max_price = self.request.GET.get('max_price', None)
        order_by = self.request.GET.get('order_by', '')
        min_price = convert_arg_to_float(min_price)
        max_price = convert_arg_to_float(max_price)
        queryset = Item.objects.filter(name__icontains=name)

        if item_rarity:
            queryset = queryset.filter(rarity=item_rarity)

        for item in queryset:
                lowest_price = item_utils.get_lowest_price(item)
                item.lowest_price = lowest_price

                if lowest_price:
                    if min_price and lowest_price < min_price:
                        queryset = queryset.exclude(item_id=item.item_id)

                    if max_price and lowest_price > max_price:
                        queryset = queryset.exclude(item_id=item.item_id)

        if order_by == 'price' or order_by == 'price_reverse':
            queryset = sorted(queryset, key=lambda item:item_utils.get_lowest_price(item) if item_utils.get_lowest_price(item) else 0, reverse=order_by=='price_reverse')
        elif order_by == 'rarity' or order_by == 'rarity_reverse':
            queryset = sorted(queryset, key=lambda item:item_utils.get_rarity_value(item.rarity), reverse=order_by=='rarity_reverse')
        elif order_by == 'name' or 'name_reverse':
            queryset = queryset.order_by('name' if order_by=='name' else '-name')

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
                queryset = queryset.exclude(item_id=item.item_id)

        return queryset

class ItemActions(generics.GenericAPIView):
    serializer_class = ItemActionSerializer
    item_not_found = Response(data={'detail': 'Item not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    user_not_found = Response(data={'detail': 'User not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        item = None
        user = None

        if 'item' in kwargs and 'user' in kwargs:
            item = kwargs['item']
            user = kwargs['user']

            if User_Item.objects.filter(item_id__exact=item, user_id__exact=user).exists():
                return Response(data={
                    'detail': 'Row found',
                    'user_item': UserItemSerializer(User_Item.objects.get(item_id__exact=item, user_id__exact=user)).data,
                })
            return Response(data={'detail': 'Row not found'}, status=status.HTTP_204_NO_CONTENT)
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        item = None
        user = None
        item_id = ''
        authed_user = ''
        possible_actions = ['buy', 'sell', 'fav']
        action = ''

        if request.data['action'] and request.data['item_id'] and request.data['authed_user']:
            action = request.data['action']
            item_id = request.data['item_id']
            authed_user = request.data['authed_user']

            if action in possible_actions:
                success_msg = 'Undefined'
                duplicate_msg = 'Undefined'

                try:
                    item = Item.objects.get(item_id__exact=item_id)
                except Exception as e:
                    return self.item_not_found

                try:
                    user = CSRuby_User.objects.get(id__exact=authed_user)
                except Exception as e:
                    return self.user_not_found

                if action == 'buy':
                    user_item = User_Item.objects.create_buy(item=item, user=user)
                elif action == 'sell':
                    user_item = User_Item.objects.create_sell(item=item, user=user)
                elif action == 'fav':
                    user_item = User_Item.objects.create_fav(item=item, user=user)

                user_item.save()

                return Response(data={'detail': 'Action successul', 'action': action})
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, *args, **kwargs):
        action = ''
        user = ''
        intention = ''
        possible_actions = ['buy', 'sell', 'fav']

        if request.data['action'] and request.data['authed_user'] and request.data['intention']:
            action = request.data['action']
            user = request.data['authed_user']
            intention = request.data['intention']
            user_item = None

            if action == 'buy':
                if request.data['trade']:
                    trade = request.data['trade']
                    try:
                        user_item = User_Item.objects.get(id__exact=trade)
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.buy_item = True
                        user_item.buy_created_at = timezone.now()
                        response = Response(data={'detail': 'Buy order added', 'action': action})

                    if intention == 'remove':
                        user_item.buy_item = False
                        user_item.buy_created_at = None
                        response = Response(data={'detail': 'Buy order removed', 'action': action})

                    user_item.save()

                    return response

            if action == 'sell':
                if request.data['trade']:
                    trade = request.data['trade']
                    try:
                        user_item = User_Item.objects.get(id__exact=trade)
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.sell_item = True
                        user_item.sell_created_at = timezone.now()
                        response = Response(data={'detail': 'Sell order added', 'action': action})

                    if intention == 'remove':
                        user_item.sell_item = False
                        user_item.sell_created_at = None
                        response = Response(data={'detail': 'Sell order removed', 'action': action})

                    user_item.save()

                    return response

            if action == 'fav':
                if request.data['item_id'] and request.data['authed_user']:
                    try:
                         user_item = User_Item.objects.get(user__exact=request.data['authed_user'], item__exact=request.data['item_id'])
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.favorite_item = True
                        response = Response(data={'detail': 'Added item to favorites', 'action': action, 'favorite_item': True})

                    if intention == 'remove':
                        user_item.favorite_item = False
                        response = Response(data={'detail': 'Removed item from favorites', 'action': action, 'favorite_item': False})

                    user_item.save()

                    return response
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
