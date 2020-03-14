from rest_framework import serializers
from .models import User, Item
from django.forms import ModelForm
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        instance.password = make_password(password)

        instance.save()
        return instance

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity')
