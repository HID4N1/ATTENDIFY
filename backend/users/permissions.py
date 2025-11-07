from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'ADMIN'


class IsProfessor(permissions.BasePermission):
    """
    Custom permission to only allow professors to access certain views.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'PROFESSOR'

