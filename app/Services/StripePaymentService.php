<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class StripePaymentService
{
    private string $secret;

    private string $currency;

    public function __construct()
    {
        $this->secret = (string) config('services.stripe.secret');
        $this->currency = strtolower((string) config('services.stripe.currency', 'mad'));
    }

    public function configured(): bool
    {
        return $this->secret !== '';
    }

    public function currency(): string
    {
        return $this->currency;
    }

    /**
     * @throws RequestException
     */
    public function createPaymentIntent(float $amount, array $metadata = []): array
    {
        $this->ensureConfigured();

        $response = Http::asForm()
            ->withToken($this->secret)
            ->post('https://api.stripe.com/v1/payment_intents', [
                'amount' => $this->toMinorUnits($amount),
                'currency' => $this->currency,
                'payment_method_types[]' => 'card',
                'metadata' => $this->cleanMetadata($metadata),
            ])
            ->throw()
            ->json();

        return [
            'id' => $response['id'] ?? null,
            'client_secret' => $response['client_secret'] ?? null,
            'status' => $response['status'] ?? null,
        ];
    }

    /**
     * @throws RequestException
     */
    public function retrievePaymentIntent(string $paymentIntentId): array
    {
        $this->ensureConfigured();

        return Http::withToken($this->secret)
            ->get('https://api.stripe.com/v1/payment_intents/'.urlencode($paymentIntentId))
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function assertSucceeded(string $paymentIntentId, float $expectedAmount): array
    {
        $intent = $this->retrievePaymentIntent($paymentIntentId);

        if (($intent['status'] ?? null) !== 'succeeded') {
            throw new RuntimeException('Le paiement Stripe n est pas confirme.');
        }

        if (($intent['currency'] ?? null) !== $this->currency) {
            throw new RuntimeException('La devise du paiement Stripe ne correspond pas.');
        }

        if ((int) ($intent['amount'] ?? 0) !== $this->toMinorUnits($expectedAmount)) {
            throw new RuntimeException('Le montant du paiement Stripe ne correspond pas.');
        }

        return $intent;
    }

    public function verifyWebhookSignature(string $payload, ?string $signatureHeader): bool
    {
        $secret = (string) config('services.stripe.webhook_secret');

        if ($secret === '' || ! $signatureHeader) {
            return false;
        }

        $parts = collect(explode(',', $signatureHeader))
            ->mapWithKeys(function (string $part) {
                [$key, $value] = array_pad(explode('=', $part, 2), 2, '');

                return [$key => $value];
            });

        $timestamp = $parts->get('t');
        $signature = $parts->get('v1');

        if (! $timestamp || ! $signature) {
            return false;
        }

        $signedPayload = $timestamp.'.'.$payload;
        $expected = hash_hmac('sha256', $signedPayload, $secret);

        return hash_equals($expected, $signature);
    }

    public function toMinorUnits(float $amount): int
    {
        return (int) round($amount * 100);
    }

    private function ensureConfigured(): void
    {
        if (! $this->configured()) {
            throw new RuntimeException('Stripe n est pas configure.');
        }
    }

    private function cleanMetadata(array $metadata): array
    {
        return collect($metadata)
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->map(fn ($value) => mb_substr((string) $value, 0, 500))
            ->all();
    }
}
