from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, EventViewSet, CategoryViewSet, BookingViewSet, InitiatEsewaPaymentView,VerifyEsewaPaymentView
from django.urls import path

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')
router.register('events', EventViewSet, basename='event')
router.register('category', CategoryViewSet, basename='category')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns =[  path('payments/esewa/initiate/', InitiatEsewaPaymentView.as_view(), name='esewa-initiate'),
              path('payments/esewa/verify/', VerifyEsewaPaymentView.as_view(), name='esewa-verify'),] + router.urls