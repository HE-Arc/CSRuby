# Generated by Django 3.0.3 on 2020-02-27 13:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('csruby_app', '0004_add_barter_manyToMany_model'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Barter',
            new_name='User_Item',
        ),
    ]