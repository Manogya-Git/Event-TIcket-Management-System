from rest_framework import serializers
from .models import Ticket, Event, Category

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"

    def validate(self,data):
        start = data.get("start_date",getattr(self.instance,"start_date",None))
        end = data.get("end_date",getattr(self.instance,'end_date',None))
        if start and end and end < start:
            raise serializers.ValidationError("end_Date must be after start_date")
        return data 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"