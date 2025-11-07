from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):

    class roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        PROFESOR = 'PROFESSOR', 'professor'

    role = models.CharField(max_length=20, choices=roles.choices, default=roles.ADMIN)
    email = models.EmailField(unique=True)
    matricule = models.CharField(max_length=100, unique=True, null=True, blank=True)


    def __str__(self):
        return self.username
