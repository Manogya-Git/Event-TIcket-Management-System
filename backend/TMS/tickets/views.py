from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from .models import Ticket, Event, Category,Booking
from .serializer import TicketSerializer,EventSerializer,CategorySerializer, BookingSerializer



class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class EventCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self,serializer):
        serializer.save(user=self.request.user)

