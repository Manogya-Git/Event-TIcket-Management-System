from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    ArtistBookingInquiryCreateView,
    BookingViewSet,
    CategoryViewSet,
    EventViewSet,
    InitiatEsewaPaymentView,
    InitiateKhaltiPaymentView,
    TicketViewSet,
    VenueBookingInquiryCreateView,
    VerifyEsewaPaymentView,
    VerifyKhaltiPaymentView,
)

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')
router.register('events', EventViewSet, basename='event')
router.register('category', CategoryViewSet, basename='category')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path(
        'payments/esewa/initiate/',
        InitiatEsewaPaymentView.as_view(),
        name='esewa-initiate',
    ),
    path(
        'payments/esewa/verify/',
        VerifyEsewaPaymentView.as_view(),
        name='esewa-verify',
    ),
    path(
        'payments/khalti/initiate/',
        InitiateKhaltiPaymentView.as_view(),
        name='khalti_initate',
    ),
    path(
        'payments/khalti/verify/',
        VerifyKhaltiPaymentView.as_view(),
        name='khalti_verify',
    ),
    path(
        'booking/venue/',
        VenueBookingInquiryCreateView.as_view(),
        name='booking_venue',
    ),
    path(
        'booking/artist/',
        ArtistBookingInquiryCreateView.as_view(),
        name='booking_artist',
    ),
] + router.urls