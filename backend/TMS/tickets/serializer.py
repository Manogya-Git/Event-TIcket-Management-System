from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .utils import validate_promocode
from .models import (
    Artist,
    BookingItem,
    PromoCode,
    Ticket,
    Event,
    Category,
    Booking,
    Venue,
    VenueBookingInquiry,
    ArtistBookingInquiry,
    ContactMessage,
    
)

class TicketSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "event",
            "event_title",
            "ticket_type",
            "quantity",
            "sold_quantity",
            "price",
        ]

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

class BookingItemSerializer(serializers.ModelSerializer):
    ticket_type = serializers.SerializerMethodField()

    def get_ticket_type(self,obj):
        return obj.ticket.get_ticket_type_display()
    class Meta:
        model = BookingItem
        fields = ["ticket","quantity","ticket_type"]

class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True)
    event = serializers.SerializerMethodField()
    
    # ✅ Write-only field to accept promo code string from frontend
    promo_code = serializers.CharField(
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    
    class Meta:
        model = Booking
        fields = ["id", "status", "created", "items", "event",
            "full_name", "email", "phone_number", "address", "payment_method","promo_code"]
        read_only_fields = ["created"]

    def get_event(self, obj):
        if obj.items.exists():
            return obj.items.first().ticket.event.title
        return "-"

    def create(self, validated_data):
        items = validated_data.pop("items")
        promo_code = validated_data.pop("promo_code", None)
        
        promocode_obj = None
        discount_amount = None
        
        if promo_code:
            promocode_obj = get_object_or_404(PromoCode, code=promo_code.upper())
            event_id = items[0]['ticket'].event.id

            try:
                validate_promocode(promo_code=promocode_obj, event_id=event_id)
            except ValidationError as e:
                raise serializers.ValidationError(str(e))

            subtotal = 0
            for item in items:
                ticket = item['ticket']
                quantity = item['quantity']
                subtotal += ticket.price * quantity

            discount_amount = (subtotal * promocode_obj.discount) / 100

        with transaction.atomic():
            for item in items:
                ticket = Ticket.objects.select_for_update().get(pk=item['ticket'].id)
                quantity = item['quantity']
                remaining = ticket.quantity - ticket.sold_quantity
                if quantity > remaining:
                    raise serializers.ValidationError("Not enough tickets available")
            

            booking = Booking.objects.create(
                **validated_data,
                promocode=promocode_obj,
                discount_amount=discount_amount
            )

            for item in items:
                ticket = Ticket.objects.select_for_update().get(pk=item['ticket'].id)
                quantity = item['quantity']
                BookingItem.objects.create(
                    booking=booking,
                    ticket=ticket,
                    quantity=quantity,
                    unit_price=ticket.price
                )
                ticket.sold_quantity += quantity
                ticket.save()
            
            return booking



class EsewaPaymentInitSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

class KhaltiPaymentInitSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

class VerifyKhaltiPaymentSerializer(serializers.Serializer):
    pidx = serializers.CharField()

class VenueBookingInquirySerializer(serializers.ModelSerializer):
    venue_name = serializers.CharField(source="venue.name", read_only=True)

    class Meta:
        model = VenueBookingInquiry
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "address",
            "event_name",
            "event_category",
            "company_name",
            "company_address",
            "event_date",
            "message",
            "venue",
            "venue_name",
        ]

class ArtistBookingInquirySerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source="artist.name", read_only=True)

    class Meta:
        model = ArtistBookingInquiry
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "address",
            "event_name",
            "event_category",
            "company_name",
            "company_address",
            "event_date",
            "message",
            "artist",
            "artist_name",
        ]

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "full_name", "email", "contact_number", "subject", "details", "created_at"]
        read_only_fields = ["id", "created_at"]


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ["code","active","discount","valid_from",
        "valid_to",
        "applicable_events",
         "id",
        ]



