from django.contrib import admin
from .models import (
    Ticket,
    Category,
    Event,
    Booking,
    VenueBookingInquiry,
    ArtistBookingInquiry,
    Venue,
    Artist,
    ContactMessage,
)

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


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "contact_number", "subject", "created_at")
    list_filter = ("subject", "created_at")
    search_fields = ("full_name", "email", "contact_number", "details")
    readonly_fields = ("created_at",)
