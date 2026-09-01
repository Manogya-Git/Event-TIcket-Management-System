from django.db import models
from django.conf import settings

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Event(models.Model):
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("CANCELLED", "Cancelled"),
        ("PUBLISHED", "Published"),
        ("COMPLETED", "Completed"),
    ]
        
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=150, unique=True,blank=True, null=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,null=True,blank=True, related_name='events')
    organizer = models.CharField(max_length=100)
    venue = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    image = models.ImageField(upload_to='uploads/events/',blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT"
    )
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
            condition=models.Q(end_date__gte=models.F("start_date")),
            name="end_date_after_start_date",
        )
        ]
    def __str__(self):
        return self.title


class Ticket(models.Model):
    TICKET_CHOICES = [
        ("REGULAR", "Regular"),
        ("VIP", "VIP"),
        ("VVIP", "VVIP"),
    ]
    event = models.ForeignKey(Event,on_delete=models.CASCADE,related_name='tickets')
    ticket_type = models.CharField(choices=TICKET_CHOICES,default="REGULAR",max_length=10)
    quantity = models.PositiveIntegerField(default=0)
    sold_quantity = models.PositiveIntegerField(default=0)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.event.title} - {self.ticket_type}"

class Booking(models.Model):
    STATUS_CHOICE = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='bookings')
    ticket = models.ForeignKey(Ticket,on_delete=models.CASCADE,related_name='bookings')
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20,choices=STATUS_CHOICE, default='PENDING')
    created = models.DateTimeField(auto_now=True)

    def total_price(self):
        return self.ticket.price * self.quantity




