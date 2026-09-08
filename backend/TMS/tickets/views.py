from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Ticket, Event, Category,Booking
from .serializer import TicketSerializer,EventSerializer,CategorySerializer, BookingSerializer,EsewaPaymentInitSerializer

from .utils import generate_esewa_signature
import uuid
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView



class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class InitiatEsewaPaymentView(APIView):
    def post(self,request):
        serializer = EsewaPaymentInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = get_object_or_404(Booking,pk=serializer.validated_data["booking_id"])

        if booking.status !="PENDING":
            return Response({"detail":"this booking is not eligible for payment"},status=400)
        total_amount = booking.total_price()
        transaction_uuid = str(uuid.uuid4())
        booking.transaction_uuid = transaction_uuid
        booking.save()

        signature = generate_esewa_signature(total_amount=total_amount,transaction_uuid=transaction_uuid,product_code=settings.ESEWA_PRODUCT_CODE)

        payload = {
            "amount": total_amount,
            "tax_amount": 0,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
            "product_code": settings.ESEWA_PRODUCT_CODE,
            "product_service_charge": 0,
            "product_delivery_charge": 0,
            "success_url": settings.ESEWA_SUCCESS_URL,
            "failure_url": settings.ESEWA_FAILURE_URL,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": signature,

        }
        return Response(payload)
        




