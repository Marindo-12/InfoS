<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentApplication;
use App\Services\PayzonePaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PayzonePaymentController extends Controller
{
    public function callback(Request $request, EnrollmentApplication $application, PayzonePaymentService $payzone): JsonResponse
    {
        $this->syncPaymentStatus($application, $payzone);

        return response()->json([
            'status' => 'OK',
            'message' => 'Notification recue.',
        ]);
    }

    public function return(EnrollmentApplication $application, PayzonePaymentService $payzone): RedirectResponse
    {
        $paid = $this->syncPaymentStatus($application, $payzone);

        return redirect()
            ->route('inscriptions')
            ->with(
                $paid ? 'success' : 'warning',
                $paid
                    ? 'Paiement confirme. Votre demande '.$application->reference.' a ete envoyee.'
                    : 'Paiement non confirme pour la demande '.$application->reference.'. Vous pouvez contacter l administration.'
            );
    }

    private function syncPaymentStatus(EnrollmentApplication $application, PayzonePaymentService $payzone): bool
    {
        if (! $application->payment_reference) {
            return false;
        }

        try {
            $status = $payzone->status($application->payment_reference);
            $paid = $payzone->isSuccessfulStatus($status);

            $application->forceFill([
                'payment_status' => $paid ? 'paid' : 'pending',
                'form_data' => array_merge($application->form_data ?? [], [
                    'payzone_status' => $status,
                ]),
            ])->save();

            return $paid;
        } catch (Throwable $exception) {
            Log::warning('Impossible de synchroniser le paiement Payzone.', [
                'application_id' => $application->id,
                'message' => $exception->getMessage(),
            ]);

            return false;
        }
    }
}
