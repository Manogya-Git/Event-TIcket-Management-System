from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    ArtistBookingInquiryCreateView,
        ContactMessageCreateView,
    ArtistViewSet,
    BookingViewSet,
    CategoryViewSet,
    EventViewSet,
    InitiatEsewaPaymentView,
    InitiateKhaltiPaymentView,
    TicketViewSet,
    VenueBookingInquiryCreateView,
    VenueViewSet,
    VerifyEsewaPaymentView,
    VerifyKhaltiPaymentView,
)
from .admin_views import admin_dashboard_events, admin_dashboard_stats

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')
router.register('events', EventViewSet, basename='event')
router.register('category', CategoryViewSet, basename='category')
router.register('artists', ArtistViewSet, basename='artist')
router.register('venues', VenueViewSet, basename='venue')
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
        'booking/venue-inquiries/',
        VenueBookingInquiryCreateView.as_view(),
        name='booking_venue',
    ),
    path(
        'booking/venue-inquiries/<int:pk>/',
        VenueBookingInquiryCreateView.as_view(),
        name='booking_venue_detail',
    ),
    path(
        'booking/artist-inquiries/',
        ArtistBookingInquiryCreateView.as_view(),
        name='booking_artist',
    ),
    path(
        'booking/artist-inquiries/<int:pk>/',
        ArtistBookingInquiryCreateView.as_view(),
        name='booking_artist_detail',
    ),
    path(
        'contact/',
        ContactMessageCreateView.as_view(),
        name='contact-message',
    ),
        path(
        'api/admin/dashboard-stats/',
        admin_dashboard_stats, name='admin-dashboard-stats',
    ),
    path(
        'api/admin/events/',
        admin_dashboard_events, name='event_page',
    ),

    
] + router.urls