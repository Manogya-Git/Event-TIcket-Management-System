import hmac
import hashlib
import base64
import requests
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import render_to_string
from .models import Booking, Ticket
import io
import qrcode


def generate_esewa_signature(total_amount, transaction_uuid, product_code):
    secret_key = settings.ESEWA_SECRET_KEY
    if not secret_key:
        raise ValueError("ESEWA_SECRET_KEY is not configured")

    message = (
        f"total_amount={total_amount},"
        f"transaction_uuid={transaction_uuid},"
        f"product_code={product_code}"
    )
    secret = secret_key.encode("utf-8")
    hashed = hmac.new(secret, message.encode("utf-8"), hashlib.sha256)
    return base64.b64encode(hashed.digest()).decode("utf-8")


def verify_esewa_signature(decoded_json):
    signed_field_names = decoded_json["signed_field_names"].split(",")
    message = ",".join(
        f"{field}={decoded_json[field]}" for field in signed_field_names
    )
    
    secret = settings.ESEWA_SECRET_KEY.encode("utf-8")
    hashed = hmac.new(secret, message.encode("utf-8"), hashlib.sha256)
    computed_signature = base64.b64encode(hashed.digest()).decode("utf-8")

    return computed_signature == decoded_json["signature"]



def send_booking_confirmation_email(booking):
    first_item = booking.items.first()
    event = first_item.ticket.event

    ticket_tiers = ", ".join(
        f"{item.ticket.get_ticket_type_display()} x {item.quantity}"
        for item in booking.items.all()
    )

    total_quantity = sum(item.quantity for item in booking.items.all())
    context = {
        "booking": booking,
        "event_title": event.title,
        "event_date": event.start_date,
        "event_venue": event.venue,
        "event_organizer": event.organizer,
        "ticket_tiers": ticket_tiers,
        "total_quantity": total_quantity,
    }
    subject = f"Your ticket for {event.title} is confirmed"
    html_content = render_to_string("booking_confirmation.html", context)
    text_content = subject
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[booking.email],
    )
    email.attach_alternative(html_content, "text/html")
    qr_png = generate_qr_png(booking)
    email.attach(f"ticket-{booking.id}.png", qr_png, "image/png")
    email.send()
    

def build_qr_payload(booking):
    first_item = booking.items.first()
    event_title = first_item.ticket.event.title
    event_venue = first_item.ticket.event.venue
    event_date = first_item.ticket.event.start_date.strftime('%a, %d %b %Y')

    ticket_lines = []
    for item in booking.items.all():
        name = item.ticket.get_ticket_type_display()
        ticket_lines.append(f"{name} x {item.quantity}")


    lines = [
        
        f"Booking: {booking.id}",
        f"Name: {booking.full_name}",
        f"Event: {event_title}",
        f"Ticket: {', '.join(ticket_lines)}",
        f"Date: {event_date}",
        f"Venue: {event_venue}"
        
    ]
    return "\n".join(lines)


def generate_qr_png(booking):
    payload = build_qr_payload(booking)
    img = qrcode.make(payload)
    buffer = io.BytesIO()
    img.save(buffer,format='PNG')
    return buffer.getvalue()

