type PaymentIntentPayload = {
  amount: number;
  training_label?: string;
  category?: string;
  email?: string;
  name?: string;
};

type PaymentIntentResponse = {
  id: string;
  client_secret: string;
  currency: string;
};

const csrfToken = () =>
  document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

export async function createStripePaymentIntent(payload: PaymentIntentPayload): Promise<PaymentIntentResponse> {
  const response = await fetch(route('stripe.payment-intents.store'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? 'Impossible de preparer le paiement en ligne.');
  }

  return data as PaymentIntentResponse;
}
