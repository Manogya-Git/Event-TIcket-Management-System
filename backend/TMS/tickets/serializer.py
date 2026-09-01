from rest_framework import serializers
from .models import Ticket, Event, Category, Booking

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"

class EventSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True,read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'category', 'organizer',
                  'venue', 'start_date', 'end_date', 'image', 'status',
                  'tickets', 'created_at', 'updated_at','slug']

    def validate(self,data):
        start = data.get("start_date",getattr(self.instance,"start_date",None))
        end = data.get("end_date",getattr(self.instance,'end_date',None))
        if start and end and end < start:
            raise serializers.ValidationError("end_Date must be after start_date")
        return data 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "ticket", "quantity", "status", "created_at"]

    def validate(self,data):
        ticket = data["ticket"]
        quantity = data["quantity"]
        remaining = ticket.quantity_available - ticket.quantity_sold

        if quantity > remaining:
            raise serializers.ValidationError("Not enough tickets available for this booking. ")
        return data

    def create(self, validate_data):
        ticket = validate_data['ticket']
        quantity = validate_data['quantity']

        booking = Booking.objects.create(**validate_data)

        ticket.quantity_sold += quantity
        ticket.save()

        return booking