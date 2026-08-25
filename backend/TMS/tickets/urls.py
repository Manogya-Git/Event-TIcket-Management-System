from django.urls import path
from .views import TicketListCreateView,TicketDetailView, EventCreateView,EventDetailView,CategoryListView,CategoryDetailView

urlpatterns = [
path('tickets/',TicketListCreateView.as_view(), name='TicketList'),
path('tickets/<int:pk>/',TicketDetailView.as_view(),name="TicketDetailView"),
path('events/',EventCreateView.as_view(), name='EventList'),
path('events/<int:pk>/',EventDetailView.as_view(),name="EventDetailView"),
path('category/',CategoryListView.as_view(), name='CategoryList'),
path('category/<int:pk>/',CategoryDetailView.as_view(),name="CategoryDetailView"),

]