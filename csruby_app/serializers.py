from rest_framework import serializers
from .models import User, Item

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity')
