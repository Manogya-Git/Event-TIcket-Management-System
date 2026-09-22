from django.db import transaction

from rest_framework import serializers
from .models import Artist, Ticket, Event, Category, Booking, Venue ,VenueBookingInquiry,ArtistBookingInquiry

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
    event = serializers.CharField(source="ticket.event.title", read_only=True)
    ticket_tier = serializers.CharField(source="ticket.ticket_type", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "ticket", "quantity", "status", "created",
            "full_name", "email", "phone_number", "address", "payment_method",
            "event", "ticket_tier"]
        read_only_fields = ["created"]


    def create(self, validated_data):
        ticket_id = validated_data['ticket'].id
        quantity = validated_data['quantity']

        with transaction.atomic():
            ticket = Ticket.objects.select_for_update().get(pk=ticket_id)
            remaining = ticket.quantity - ticket.sold_quantity

            if quantity > remaining:
                raise serializers.ValidationError(
                    "Not enough tickets available for this booking "
                )

            ticket.sold_quantity +=quantity
            ticket.save()

            booking = Booking.objects.create(**validated_data)

        return booking

class EsewaPaymentInitSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

class KhaltiPaymentInitSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

class VerifyKhaltiPaymentSerializer(serializers.Serializer):
    pidx = serializers.CharField()

class VenueBookingInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueBookingInquiry
        fields = "__all__"

class ArtistBookingInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistBookingInquiry
        fields = "__all__"

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"


