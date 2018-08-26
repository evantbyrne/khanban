from django.shortcuts import render

def add(request, kanban_column_id):
    return render(request, 'frontend/index.html')

def card(request, card_id, card_revision_id = None):
    return render(request, 'frontend/index.html')

def index(request):
    return render(request, 'frontend/index.html')
