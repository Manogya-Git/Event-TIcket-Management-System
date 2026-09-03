from django.db import models
from django.conf import settings
from django.utils.text import slugify

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

    def save(self,*args,**kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter +=1
            self.slug = slug
        super().save(*args, **kwargs)


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




