<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentApplication;
use App\Services\StripePaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class StripePaymentController extends Controller
{
    public function createPaymentIntent(Request $request, StripePaymentService $stripe): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:999999'],
            'training_label' => ['nullable', 'string', 'max:190'],
            'category' => ['nullable', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:190'],
            'name' => ['nullable', 'string', 'max:190'],
        ]);

        try {
            $intent = $stripe->createPaymentIntent((float) $validated['amount'], [
                'training_label' => $validated['training_label'] ?? null,
                'category' => $validated['category'] ?? null,
                'email' => $validated['email'] ?? null,
                'name' => $validated['name'] ?? null,
            ]);
        } catch (Throwable $exception) {
            Log::warning('Impossible de creer le PaymentIntent Stripe.', [
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Impossible de preparer le paiement en ligne.',
            ], 422);
        }

        return response()->json([
            'id' => $intent['id'],
            'client_secret' => $intent['client_secret'],
            'currency' => $stripe->currency(),
        ]);
    }

    public function webhook(Request $request, StripePaymentService $stripe): JsonResponse
    {
        $payload = $request->getContent();

        if (! $stripe->verifyWebhookSignature($payload, $request->header('Stripe-Signature'))) {
            return response()->json(['message' => 'Signature invalide.'], 400);
        }

        $event = json_decode($payload, true);
        $type = $event['type'] ?? null;
        $intent = $event['data']['object'] ?? [];
        $paymentIntentId = $intent['id'] ?? null;

        if ($paymentIntentId && in_array($type, ['payment_intent.succeeded', 'payment_intent.payment_failed'], true)) {
            EnrollmentApplication::query()
                ->where('payment_reference', $paymentIntentId)
                ->update([
                    'payment_status' => $type === 'payment_intent.succeeded' ? 'paid' : 'failed',
                ]);
        }

        return response()->json(['received' => true]);
    }
}
