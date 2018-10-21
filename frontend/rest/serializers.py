from collections import OrderedDict
from django.contrib.auth.models import User
from frontend import models
from rest_framework.serializers import HyperlinkedModelSerializer, PrimaryKeyRelatedField, SerializerMethodField


class CardRevisionSerializer(HyperlinkedModelSerializer):
    card = PrimaryKeyRelatedField(queryset=models.Card.objects.all())
    user = SerializerMethodField()

    def get_user(self, revision):
        return UserSerializer(instance=revision.user).data

    class Meta:
        model = models.CardRevision
        fields = (
            'card',
            'created_at',
            'description',
            'id',
            'is_archived',
            'title',
            'user',
        )
        read_only_fields = (
            'id',
            'user',
        )


class CardSerializer(HyperlinkedModelSerializer):
    card_revisions = SerializerMethodField()
    kanban_column = PrimaryKeyRelatedField(queryset=models.KanbanColumn.objects.all())

    def get_card_revisions(self, card):
        queryset = models.CardRevision.objects.filter(card=card)
        serializer = CardRevisionSerializer(instance=queryset, many=True)
        return serializer.data

    class Meta:
        model = models.Card
        fields = (
            'card_revisions',
            'id',
            'is_archived',
            'kanban_column',
            'kanban_column_order',
        )
        read_only_fields = (
            'id',
        )

    def create(self, data):
        card = self.fill(models.Card(), data)
        card.save()
        self.make_revision(card)
        return card

    def fill(self, card, data):
        card.is_archived = data.get('is_archived', False)
        card.kanban_column = data.get('kanban_column', None)
        card.kanban_column_order = data.get('kanban_column_order', 0)
        return card

    def make_revision(self, card):
        data = self.context['request'].data
        revision = models.CardRevision()
        revision.card = card
        revision.description = data.get('description', '')
        revision.is_archived = card.is_archived
        revision.title = data.get('title')
        revision.user = self.context['request'].user
        revision.save()

    def update(self, card, data):
        card = self.fill(card, data)
        card.save()
        self.make_revision(card)
        return card


class KanbanColumnSerializer(HyperlinkedModelSerializer):
    cards = SerializerMethodField()
    project = PrimaryKeyRelatedField(queryset=models.Project.objects.all())

    def get_cards(self, column):
        if isinstance(column, OrderedDict):
            column = column.get('id')
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


class KanbanOrderSerializer(HyperlinkedModelSerializer):
    kanban_columns = KanbanColumnSerializer(many=True)

    class Meta:
        model = models.Project
        fields = (
            'id',
            'kanban_columns',
        )
        read_only_fields = (
            'id',
            'kanban_columns',
        )


class KanbanSerializer(HyperlinkedModelSerializer):
    kanban_columns = KanbanColumnSerializer(many=True)
    user = SerializerMethodField()

    def get_user(self, kanban):
        return UserSerializer(instance=self.context['request'].user).data

    class Meta:
        lookup_field = 'slug'
        model = models.Project
        fields = (
            'id',
            'kanban_columns',
            'slug',
            'title',
            'user',
        )
        read_only_fields = (
            'id',
            'kanban_columns',
            'slug',
            'title',
            'user',
        )


class ProjectSerializer(HyperlinkedModelSerializer):
    class Meta:
        fields = (
            'id',
            'is_archived',
            'slug',
            'title',
        )
        lookup_field = 'slug'
        model = models.Project
        read_only_fields = (
            'id',
            'slug',
        )

    def create(self, data):
        project = models.Project(
            is_archived=False,
            title=data.get('title'),
        )
        project.save()

        models.KanbanColumn.objects.create(order=1, project=project, title="To Do")
        models.KanbanColumn.objects.create(order=2, project=project, title="In Progress")
        models.KanbanColumn.objects.create(order=3, project=project, title="QA")
        models.KanbanColumn.objects.create(order=4, project=project, title="Accepted")

        return project

    def update(self, project, data):
        project.is_archived = data.get('is_archived');
        project.title = data.get('title');
        project.save()
        return project


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'email',
            'id',
            'is_staff',
            'username',
        )
        read_only_fields = (
            'id',
            'is_staff',
            'username',
        ),
