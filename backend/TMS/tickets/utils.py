import hmac
import hashlib
import base64
from django.conf import settings

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
