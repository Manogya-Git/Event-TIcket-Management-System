from django.db import models

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
        
    title = models.CharField(max_length=30)
    description = models.CharField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,max_length=10,null=True, related_name='events')
    organizer = models.CharField(max_length=20)
    venue = models.CharField(max_length=10)
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
    event = models.ForeignKey(Event,on_delete=models.CASCADE)
    ticket_type = models.CharField(choices=TICKET_CHOICES,default="regular")
    price = models.IntegerField()

    def __str__(self):
        return f"{self.event.title} - {self.ticket_type}"
