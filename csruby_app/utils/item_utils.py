from django.shortcuts import render, redirect
from csruby_app.models import User, Item, Price
from rest_framework import generics
from django.http import HttpResponse, HttpResponseForbidden, HttpRequest
from django.db import models

def get_lowest_price(item):
    try:
        return float(item.price_set.latest('timestamp').lowest_price)
    except:
        return None

def get_rarity_value(rarity):
    items_rarity={'COG':0,'ING':1,'MIS':2,'RST':3,'CLA':4,'COV':5,'EXR':6,'CON':7,'HGS':8,'RES':9,'EXS':10,'EXG':11}
    if rarity in items_rarity:
        return items_rarity[rarity]
    else:
        return -1
