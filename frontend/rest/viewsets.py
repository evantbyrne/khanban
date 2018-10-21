from django.contrib.auth.models import User
from frontend import models
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.viewsets import ModelViewSet
from . import serializers


class CardViewSet(ModelViewSet):
    queryset = models.Card.objects.filter(is_archived=False)
    serializer_class = serializers.CardSerializer


class KanbanViewSet(ModelViewSet):
    lookup_field = 'slug'
    queryset = models.Project.objects.all()
    serializer_class = serializers.KanbanSerializer

    @action(methods=['put'], detail=True)
    def order(self, request, slug=None, format='json'):
        project = self.get_object()
        serializer = serializers.KanbanOrderSerializer(data=request.data)
        if serializer.is_valid():
            for kanban_column in request.data.get('kanban_columns', []):
                i = 0
                column = models.KanbanColumn(pk=kanban_column.get('id'))
                for card in kanban_column.get('cards', []):
                    card_record = models.Card.objects.get(pk=card.get('id'))
                    card_record.kanban_column = column
                    card_record.kanban_column_order = i
                    card_record.save()
                    i += 1
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KanbanColumnViewSet(ModelViewSet):
    queryset = models.KanbanColumn.objects.all()
    serializer_class = serializers.KanbanColumnSerializer


class ProjectViewSet(ModelViewSet):
    lookup_field = 'slug'
    queryset = models.Project.objects.filter(is_archived=False)
    serializer_class = serializers.ProjectSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.filter(is_active=True).order_by('username')
    serializer_class = serializers.UserSerializer


router = DefaultRouter()
router.register(r'cards', CardViewSet)
router.register(r'kanbans', KanbanViewSet)
router.register(r'kanban_columns', KanbanColumnViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'users', UserViewSet)
