# Generated by Django 3.0.3 on 2020-03-23 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csruby_app', '0003_added_new_item_rarities'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_item',
            name='buy_created_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='user_item',
            name='sell_created_at',
            field=models.DateTimeField(null=True),
        ),
    ]
