from django.contrib import admin
from .models import Ticket, Category, Event, Booking

# Register your models here.

class EventAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug':('title',)}

admin.site.register(Ticket)
admin.site.register(Category)
admin.site.register(Event,EventAdmin)
admin.site.register(Booking)
