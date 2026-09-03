from django.contrib import admin
from .models import Ticket, Category, Event, Booking


admin.site.register(Ticket)
admin.site.register(Category)
admin.site.register(Event)
admin.site.register(Booking)
