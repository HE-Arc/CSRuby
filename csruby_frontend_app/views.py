from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'csruby_frontend_app/index.html')
