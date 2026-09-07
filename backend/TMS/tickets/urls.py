from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, EventViewSet, CategoryViewSet, BookingViewSet

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')
router.register('events', EventViewSet, basename='event')
router.register('category', CategoryViewSet, basename='category')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns = router.urls