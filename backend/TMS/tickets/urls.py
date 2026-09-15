from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, EventViewSet, CategoryViewSet, BookingViewSet, InitiatEsewaPaymentView,VerifyEsewaPaymentView,InitiateKhaltiPaymentView,VerifyKhaltiPaymentView
from django.urls import path

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')
router.register('events', EventViewSet, basename='event')
router.register('category', CategoryViewSet, basename='category')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns =[  path('payments/esewa/initiate/', InitiatEsewaPaymentView.as_view(), name='esewa-initiate'),
              path('payments/esewa/verify/', VerifyEsewaPaymentView.as_view(), name='esewa-verify'),
              path('payments/khalti/initiate/',InitiateKhaltiPaymentView.as_view(),name='khalti_initate'),
              path('payments/khalti/verify/',VerifyKhaltiPaymentView.as_view(),name='khalti_verify')] + router.urls