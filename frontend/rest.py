from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework.serializers import HyperlinkedModelSerializer, PrimaryKeyRelatedField, SerializerMethodField
from rest_framework.viewsets import ModelViewSet
from . import models


class CardSerializer(HyperlinkedModelSerializer):
    kanban_column = PrimaryKeyRelatedField(queryset=models.KanbanColumn.objects.all())

    class Meta:
        model = models.Card
        fields = (
            'description',
            'id',
            'is_archived',
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
        card.is_archived = data.get('is_archived', False)
        card.kanban_column = data.get('kanban_column', None)
        card.kanban_column_order = data.get('kanban_column_order', 0)
        card.title = data.get('title')
        return card

    def update(self, card, data):
        card = self.fill(card, data)
        card.save()
        return card


class KanbanColumnSerializer(HyperlinkedModelSerializer):
    cards = SerializerMethodField()
    project = PrimaryKeyRelatedField(queryset=models.Project.objects.all())

    def get_cards(self, column):
        queryset = models.Card.objects.filter(kanban_column=column, is_archived=False)
        serializer = CardSerializer(instance=queryset, many=True)
        return serializer.data

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
    queryset = models.Card.objects.filter(is_archived=False)
    serializer_class = CardSerializer


class KanbanViewSet(ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = KanbanSerializer

    @action(methods=['put'], detail=True)
    def order(self, request, pk=None, format='json'):
        project = self.get_object()
        serializer = KanbanSerializer(data=request.data)
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
    serializer_class = KanbanColumnSerializer


class ProjectViewSet(ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = ProjectSerializer


router = DefaultRouter()
router.register(r'cards', CardViewSet)
router.register(r'kanbans', KanbanViewSet)
router.register(r'kanban_columns', KanbanColumnViewSet)
router.register(r'projects', ProjectViewSet)
