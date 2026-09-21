import base64
import json

import requests

from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Artist, Ticket, Event, Category, Booking, Venue,   VenueBookingInquiry,ArtistBookingInquiry
from .serializer import (
    ArtistSerializer,
    TicketSerializer,
    EventSerializer,
    CategorySerializer,
    BookingSerializer,
    EsewaPaymentInitSerializer,
    KhaltiPaymentInitSerializer,
    VenueSerializer,
    VerifyKhaltiPaymentSerializer,
    VenueBookingInquirySerializer,
    ArtistBookingInquirySerializer
 
)
from .utils import generate_esewa_signature, verify_esewa_signature, send_booking_confirmation_email
import uuid
from django.conf import settings
from rest_framework.viewsets import ReadOnlyModelViewSet



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
    queryset = Booking.objects.select_related("ticket__event").all()
    serializer_class = BookingSerializer

    @action(detail=False,methods=['get']) 
    def retrieve_by_transaction(self,request):
        transaction_uuid = request.query_params.get("transaction_uuid")
        if not transaction_uuid:
            return Response(
                            {"detail": "this uuid is not available "},
                            status=400,
                        )
        booking = get_object_or_404(
                    Booking,
                    transaction_uuid=transaction_uuid
                )
        serializer = self.serializer_class(booking)
        return Response(serializer.data)
        



class InitiatEsewaPaymentView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EsewaPaymentInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = get_object_or_404(
            Booking, pk=serializer.validated_data["booking_id"]
        )

        if booking.status != "PENDING":
            return Response(
                {"detail": "this booking is not eligible for payment"},
                status=400,
            )

        amount = f"{booking.total_price():.2f}"
        tax_amount = "0.00"
        service_charge = "0.00"
        delivery_charge = "0.00"
        total_amount = f"{float(amount) + float(tax_amount) + float(service_charge) + float(delivery_charge):.2f}"
        transaction_uuid = f"{booking.id}-{uuid.uuid4().hex}"
        booking.transaction_uuid = transaction_uuid
        booking.save(update_fields=["transaction_uuid"])

        signature = generate_esewa_signature(
            total_amount=total_amount,
            transaction_uuid=transaction_uuid,
            product_code=settings.ESEWA_PRODUCT_CODE,
        )

        payload = {
            "amount": amount,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
            "product_code": settings.ESEWA_PRODUCT_CODE,
            "product_service_charge": service_charge,
            "product_delivery_charge": delivery_charge,
            "success_url": settings.ESEWA_SUCCESS_URL,
            "failure_url": settings.ESEWA_FAILURE_URL,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": signature,
        }
        return Response(
            {
                "form_url": settings.ESEWA_FORM_URL,
                "payload": payload,
            }
        )
        

class VerifyEsewaPaymentView(APIView):
    def post(self,request):
        encoded_data = request.data.get("data")
        if not encoded_data:
            return Response({"error":"Missing data"},status=400)

        decoded_bytes = base64.b64decode(encoded_data)
        decoded_json = json.loads(decoded_bytes)
        is_valid = verify_esewa_signature(decoded_json)
        if not is_valid:
            return Response({"error":"Invalid Signature"},status = 400)
        transaction_uuid = decoded_json["transaction_uuid"]
        booking = get_object_or_404(
            Booking,
            transaction_uuid=transaction_uuid
        )

        confirmed = Booking.objects.filter(
            pk=booking.pk,
            status="PENDING",
        ).update(status="CONFIRMED")
        if confirmed:
            send_booking_confirmation_email(booking)
        booking.status = "CONFIRMED"

        return Response({
            "message": "Payment verified successfully",
            "booking_id": booking.id,
            "status": booking.status,
        })

class InitiateKhaltiPaymentView(APIView):
    def post(self,request):
        serializer = KhaltiPaymentInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = get_object_or_404(Booking,pk=serializer.validated_data["booking_id"])

        if booking.status != "PENDING":
            return Response({"error":"this booking id is not available"},status=400)

        purchase_order_id = f"{booking.id}-{uuid.uuid4().hex}"
        amount = booking.total_price() * 100
        purchase_order_name = f"{booking.ticket.event.title} -{booking.ticket.ticket_type} "
        customer_info = {
            "name":booking.full_name,
            "email":booking.email,
            "phone":booking.phone_number

        }
        payload_dict ={
            "return_url":settings.KHALTI_SUCCESS_URL,
            "website_url": settings.FRONTEND_URL,
            "amount":amount,
            "purchase_order_id":purchase_order_id,
            "purchase_order_name":purchase_order_name,
            "customer_info": customer_info

        }

        response = requests.post(
            settings.KHALTI_INITIATE_URL,
            json=payload_dict,
            headers={
                "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
                "Content-Type": "application/json",

            },
        )
        if response.status_code != 200:
            return Response({
                "error":"Failed to initiate Khalti payment"
            },status=400)

        khalti_data = response.json()

        pidx = khalti_data["pidx"]
        payment_url = khalti_data["payment_url"]
        booking.payment_method = "KHALTI"
        booking.khalti_pidx = pidx
        booking.save(update_fields=["khalti_pidx","payment_method"])
        return Response({
            "payment_url":payment_url
        })
        
class VerifyKhaltiPaymentView(APIView):
    def post(self, request):
        serializer = VerifyKhaltiPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pidx = serializer.validated_data["pidx"]

        response = requests.post(
            settings.KHALTI_LOOKUP_URL,
            json={"pidx": pidx},
            headers={
                "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
                "Content-Type": "application/json",
            },
        )
        if response.status_code != 200:
            return Response({
                "error":"ailed to verify Khalti payment"
            },status =400)
        lookup_data = response.json()
        if lookup_data["status"] != "Completed":
            return Response({
                "error":"Payment not completed "
            },status=400)

        booking = get_object_or_404(Booking,khalti_pidx=pidx)
        confirmed = Booking.objects.filter(
            pk=booking.pk,
            status="PENDING",
        ).update(status="CONFIRMED")
        if confirmed:
            send_booking_confirmation_email(booking)
        booking.status = "CONFIRMED"
        return Response({
               "message": "Payment verified successfully",
                        "booking_id": booking.id,
                        "status": booking.status,
        })

class VenueBookingInquiryCreateView(generics.CreateAPIView):
    queryset = VenueBookingInquiry.objects.all()
    serializer_class = VenueBookingInquirySerializer

class ArtistBookingInquiryCreateView(generics.CreateAPIView):
    queryset = ArtistBookingInquiry.objects.all()
    serializer_class = ArtistBookingInquirySerializer


class VenueViewSet(ReadOnlyModelViewSet):
    queryset = Venue.objects.all()
    serializer_class =  VenueSerializer

class ArtistViewSet(ReadOnlyModelViewSet):
    queryset = Artist.objects.all()
    serializer_class =  ArtistSerializer
        





