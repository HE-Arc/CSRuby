from rest_framework import serializers
from .models import User
from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    profilename = serializers.CharField()
    steamid = serializers.CharField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()

    error_message = []

    def validate_email(self, email):
        existing = User.objects.filter(email=email).first()
        if existing:
            error_message.append(ValidationError(_("This email is already taken!"), code="email"),)
            # error_message["email"] = "This email is already taken!"
            # raise serializers.ValidationError("Someone with that email "
            #     "address has already registered. Was it you?")

        return email

    def validate(self, data):
        if not data.get('password') or not data.get('confirm_password'):
            # error_message["password"] = "Please confirm your password"
            error_message.append(ValidationError(_("Please confirm your password"), code="password"),)

            # raise serializers.ValidationError("Please enter a password and "
            #     "confirm it.")

        if data.get('password') != data.get('confirm_password'):
            # error_message["password"] = "The password doesn't match!"
            error_message.append(ValidationError(_("The password doesn't match!"), code="confirm_password"),)

            # raise serializers.ValidationError("The password doesn't match!")

        if(len(error_message) > 0):
            raise serializers.ValidationError(error_message)

        return data
