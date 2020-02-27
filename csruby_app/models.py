from django.db import models
from django.db.models.signals import post_save, post_delete

# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=255)
    profilename = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    steamid = models.CharField(max_length=17)
    created_at = models.DateTimeField(auto_now_add=True)

class Role(models.Model):
    role_id = models.BigIntegerField();
    email = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
