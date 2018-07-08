from django.db import models
from uuslug import uuslug


class Card(models.Model):
    description = models.TextField(blank=True, default="")
    kanban_column = models.ForeignKey(
        'KanbanColumn',
        blank=True,
        on_delete=models.SET_NULL,
        null=True,
        related_name='cards',
        related_query_name='card',
    )
    kanban_column_order = models.PositiveIntegerField(blank=True, default=0)
    title = models.CharField(max_length=255)

    class Meta:
        ordering = ['kanban_column_order']


class KanbanColumn(models.Model):
    order = models.PositiveIntegerField()
    project = models.ForeignKey(
        'Project',
        on_delete=models.CASCADE,
        related_name='kanban_columns',
        related_query_name='kanban_column',
    )
    title = models.CharField(max_length=255)

    class Meta:
        ordering = ['order']


class Project(models.Model):
    slug = models.SlugField(blank=True, max_length=255, unique=True)
    title = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = uuslug(self.title, instance=self)

        super(Project, self).save(*args, **kwargs)
