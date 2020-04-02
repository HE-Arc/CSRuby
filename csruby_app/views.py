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
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
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

            response_body =  {
                'user': UserSerializer(user).data,
            }

            items_to_buy, items_to_sell, favorite_items = CSRuby_User.objects.get_user_trades(user_id)

            response_body['user']['items_to_buy'] = []

            if items_to_buy:
                for item_to_buy in items_to_buy:
                    response_body['user']['items_to_buy'].append(ItemProfileSerializer(item_to_buy).data)
            else:
                response_body['user']['items_to_buy'] = None

            response_body['user']['items_to_sell'] = []

            if items_to_sell:
                for item_to_sell in items_to_sell:
                    response_body['user']['items_to_sell'].append(ItemProfileSerializer(item_to_sell).data)
            else:
                response_body['user']['items_to_sell'] = None

            response_body['user']['favorite_items'] = []

            if favorite_items:
                for favorite_item in favorite_items:
                    response_body['user']['favorite_items'].append(ItemProfileSerializer(favorite_item).data)
            else:
                response_body['user']['favorite_items'] = None

            return Response(response_body)
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, *args, **kwargs):
        email = ''
        user_id = None

        if 'pk' in kwargs:
            user_id = kwargs['pk']

            try:
                user = CSRuby_User.objects.patch_user(user_id, request)
            except Exception as e:
                return self.user_not_found

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

class ResetPassord(generics.GenericAPIView):
    serializer_class = UserSerializer
    subject = 'CSRuby - Requested password reset'
    sender = 'noreply@csruby.ch'
    html_message ='''
    <h2>Hello {0},</h2>

    <p>You have requested to change your password for our website.</p>

    <p>Your new password is: <b style="font-size:1.5em">{1}</b></p>

    <p>You can change this password by updating your profile.</p>

    <p>Have a nice day,<br>
    The CSRuby team</p>
    '''
    message ='''
    Hello {0},

    You have requested to change your password for our website.

    Your new password is: {1}

    You can change this password by updating your profile.

    Have a nice day,
    The CSRuby team
    '''

    def patch(self, request, *args, **kwargs):
        email = request.data['email']
        if email:
            dest=[]
            try:
                user = CSRuby_User.objects.get(email__exact=email)
                dest.append(email)
                new_password = get_random_string(8)
                try:
                    msg = self.message.format(user.username,new_password)
                    html_msg = self.html_message.format(user.username,new_password)
                    user.set_password(new_password)
                    send_mail(self.subject,msg,self.sender,dest,fail_silently=False,html_message=html_msg)
                    user.save()
                except Exception as e:
                    response_body = {
                        'user': UserSerializer(user).data,
                    }
                    return Response(response_body, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e1:
                response_body = {
                    'user': None,
                }
                return Response(response_body)

        response_body = {
            'user': None,
        }
        return Response(response_body)


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

        queryset = Item.objects.get_most_expensive_item(queryset)

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
        return User_Item.objects.patch_trade(request)
