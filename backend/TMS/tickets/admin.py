from django.contrib import admin
from .models import Ticket, Category, Event, Booking, VenueBookingInquiry, ArtistBookingInquiry, Venue,Artist

# class EventAdmin(admin.ModelAdmin):
    # prepopulated_fields = {"slug": ("title",)}
admin.site.register(Ticket)
admin.site.register(Category)
admin.site.register(Event)
admin.site.register(Booking)
admin.site.register(VenueBookingInquiry)
admin.site.register(ArtistBookingInquiry)
admin.site.register(Venue)
admin.site.register(Artist)
