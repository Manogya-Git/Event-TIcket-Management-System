const ESEWA_FIELDS = [
  "amount",
  "tax_amount",
  "total_amount",
  "transaction_uuid",
  "product_code",
  "product_service_charge",
  "product_delivery_charge",
  "success_url",
  "failure_url",
  "signed_field_names",
  "signature",
];

export function redirectToEsewa(payload, formActionUrl) {
  if (!payload || !formActionUrl) {
    throw new Error("Missing eSewa form payload or URL");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = formActionUrl;
  form.acceptCharset = "UTF-8";
  form.style.display = "none";

  ESEWA_FIELDS.forEach((key) => {
    const value = payload[key];
    if (value == null || value === "") return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
