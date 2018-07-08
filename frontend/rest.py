from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.serializers import HyperlinkedModelSerializer, PrimaryKeyRelatedField
from rest_framework.viewsets import ModelViewSet
from . import models


class CardSerializer(HyperlinkedModelSerializer):
    kanban_column = PrimaryKeyRelatedField(queryset=models.KanbanColumn.objects.all())

    class Meta:
        model = models.Card
        fields = (
            'description',
            'id',
            'kanban_column',
            'kanban_column_order',
            'title',
        )
        read_only_fields = (
            'id',
        )

    def create(self, data):
        card = self.fill(models.Card(), data)
        card.save()
        return card

    def fill(self, card, data):
        card.description = data.get('description')
        card.kanban_column = data.get('kanban_column', None)
        card.kanban_column_order = data.get('kanban_column_order', 0)
        card.title = data.get('title')
        return card

    def update(self, card, data):
        card = self.fill(card, data)
        card.save()
        return card


class KanbanColumnSerializer(HyperlinkedModelSerializer):
    cards = CardSerializer(many=True)
    project = PrimaryKeyRelatedField(queryset=models.Project.objects.all())

    class Meta:
        model = models.KanbanColumn
        fields = (
            'cards',
            'id',
            'order',
            'project',
            'title',
        )
        read_only_fields = (
            'id',
        )

    def create(self, data):
        kanban_column = self.fill(models.KanbanColumn(), data)
        kanban_column.save()
        return kanban_column

    def fill(self, kanban_column, data):
        kanban_column.order = data.get('order')
        kanban_column.project = data.get('project')
        kanban_column.title = data.get('title')
        return kanban_column

    def update(self, kanban_column, data):
        kanban_column = self.fill(kanban_column, data)
        kanban_column.save()
        return kanban_column


class KanbanSerializer(HyperlinkedModelSerializer):
    kanban_columns = KanbanColumnSerializer(many=True)

    class Meta:
        model = models.Project
        fields = (
            'id',
            'kanban_columns',
        )
        read_only_fields = (
            'id',
        ),


class ProjectSerializer(HyperlinkedModelSerializer):
    class Meta:
        fields = (
            'id',
            'slug',
            'title',
        )
        model = models.Project
        read_only_fields = (
            'id',
            'slug',
        )

    def create(self, data):
        project = models.Project(
            title=data.get('title'),
        )
        project.save()
        return project


class CardViewSet(ModelViewSet):
    queryset = models.Card.objects.all()
    serializer_class = CardSerializer


class KanbanViewSet(ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = KanbanSerializer


class KanbanColumnViewSet(ModelViewSet):
    queryset = models.KanbanColumn.objects.all()
    serializer_class = KanbanColumnSerializer


class ProjectViewSet(ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = ProjectSerializer


router = DefaultRouter()
router.register(r'cards', CardViewSet)
router.register(r'kanbans', KanbanViewSet)
router.register(r'kanban_columns', KanbanColumnViewSet)
router.register(r'projects', ProjectViewSet)
