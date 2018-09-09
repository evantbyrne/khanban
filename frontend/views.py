from django.shortcuts import render

def add(request, project_slug, kanban_column_id):
    return view(request)

def card(request, project_slug, card_id, card_revision_id = None):
    return view(request)

def dashboard(request):
    return view(request)

def index(request, project_slug):
    return view(request)

def view(request):
    return render(request, 'frontend/index.html')
