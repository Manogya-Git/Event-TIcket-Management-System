from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Event, Booking


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    total_events = Event.objects.count()
    upcoming_events = Event.objects.filter(start_date__gte=timezone.now()).count()
    total_bookings = Booking.objects.count()
    pending_bookings = Booking.objects.filter(status='PENDING').count()
    return Response({
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "total_bookings": total_bookings,
        "pending_bookings":pending_bookings
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_events(request):
    total_events = Event.objects.count()
    return Response({
        "total_events": total_events,
    })

