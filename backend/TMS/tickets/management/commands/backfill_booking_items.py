from django.core.management.base import BaseCommand
from tickets.models import Booking, BookingItem


class Command(BaseCommand):
    help = "Backfill BookingItem rows for existing bookings"

    def handle(self, *args, **options):
        for booking in Booking.objects.all():
            if booking.items.exists():
                continue  # already has items, skip

            BookingItem.objects.create(
    booking=booking,
    ticket=booking.ticket,
    quantity=booking.quantity,
    unit_price=booking.ticket.price,
)

            self.stdout.write(f"Backfilled booking {booking.id}")