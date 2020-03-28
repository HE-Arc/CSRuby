# Generated by Django 3.0.3 on 2020-03-17 17:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CSRuby_User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('username', models.CharField(max_length=150)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('steamid', models.CharField(blank=True, default=None, max_length=17, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('item_image', models.CharField(max_length=255)),
                ('rarity', models.CharField(choices=[('COG', 'Consumer grade'), ('ING', 'Industrial grade'), ('MIS', 'Mil-spec'), ('RST', 'Restricted'), ('CLA', 'Classified'), ('COV', 'Covert'), ('EXR', 'Exceedingly Rare'), ('CON', 'Contraband'), ('RES', 'Remarkable Sticker'), ('HGS', 'High Grade Sticker'), ('EXS', 'Extraordinary Sticker'), ('EXG', 'Extraordinary Gloves')], default='COG', max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='User_Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buy_created_at', models.DateTimeField()),
                ('sell_created_at', models.DateTimeField()),
                ('buy_item', models.BooleanField(default=False)),
                ('sell_item', models.BooleanField(default=False)),
                ('favorite_item', models.BooleanField(default=False)),
                ('item', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='csruby_app.Item')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Price',
            fields=[
                ('price_id', models.AutoField(primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField()),
                ('lowest_price', models.FloatField()),
                ('median_price', models.FloatField(null=True)),
                ('item_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='csruby_app.Item')),
            ],
        ),
    ]
