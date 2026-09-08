import hmac
import hashlib
import base64
from django.conf import settings

def generate_esewa_signature(total_amount,transaction_uuid,product_code):
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    secret = settings.ESEWA_SECRET_KEY.encode("utf-8")
    hashed = hmac.new(secret, message.encode("utf-8"), hashlib.sha256)
    return base64.b64encode(hashed.digest()).decode("utf-8")
