from django.urls import path
from .views import TicketCreateView,TicketDetailView

urlpatterns = [
path('tickets/',TicketCreateView.as_view(), name='TicketList'),
path('tickets/<int:pk>/',TicketDetailView.as_view(),name="TIcketDetailView")

]