from django.shortcuts import render

def card(request, card_id, card_revision_id = None):
    return render(request, 'frontend/index.html')

def index(request):
    return render(request, 'frontend/index.html')
