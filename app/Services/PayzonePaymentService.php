<?php

namespace App\Services;

use App\Models\EnrollmentApplication;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PayzonePaymentService
{
    private string $baseUrl;

    private string $originatorId;

    private string $password;

    private string $currency;

    private string $apiVersion;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.payzone.base_url', 'https://paiement.payzone.ma'), '/');
        $this->originatorId = (string) config('services.payzone.originator_id');
        $this->password = (string) config('services.payzone.password');
        $this->currency = strtoupper((string) config('services.payzone.currency', 'MAD'));
        $this->apiVersion = (string) config('services.payzone.api_version', '002.70');
    }

    public function configured(): bool
    {
        return $this->originatorId !== '' && $this->password !== '';
    }

    /**
     * @throws RequestException
     */
    public function preparePayment(EnrollmentApplication $application): array
    {
        $this->ensureConfigured();

        $firstName = trim($application->first_name) ?: 'Client';
        $lastName = trim($application->last_name) ?: 'Info Saloua';

        $payload = [
            'apiVersion' => $this->apiVersion,
            'paymentMethod' => 'CreditCard',
            'paymentMode' => 'Single',
            'operation' => 'Sale',
            'secure3d' => true,
            'amount' => $this->toMinorUnits((float) $application->amount),
            'currency' => $this->currency,
            'orderID' => $application->reference,
            'orderDescription' => $application->training_label,
            'shippingType' => 'Virtual',
            'shopperID' => (string) ($application->user_id ?: $application->id),
            'shopperFirstName' => $firstName,
            'shopperLastName' => $lastName,
            'shopperEmail' => $application->email,
            'shopperPhone' => $application->phone ?: 'NA',
            'shopperAddress' => 'NA',
            'shopperZipcode' => '00000',
            'shopperCity' => 'NA',
            'shopperCountryCode' => 'MA',
            'ctrlRedirectURL' => route('payzone.return', ['application' => $application->id]),
            'ctrlCallbackURL' => route('payzone.callback', ['application' => $application->id]),
            'ctrlCustomData' => (string) $application->id,
        ];

        $response = Http::withBasicAuth($this->originatorId, $this->password)
            ->acceptJson()
            ->asJson()
            ->post($this->baseUrl.'/payment/prepare', $payload)
            ->throw()
            ->json();

        if (($response['code'] ?? null) !== '200') {
            throw new RuntimeException($response['message'] ?? 'Preparation Payzone refusee.');
        }

        return [
            'customer_token' => $response['customerToken'] ?? null,
            'merchant_token' => $response['merchantToken'] ?? null,
            'redirect_url' => $this->customerRedirectUrl((string) ($response['customerToken'] ?? '')),
        ];
    }

    /**
     * @throws RequestException
     */
    public function status(string $merchantToken): array
    {
        $this->ensureConfigured();

        return Http::withBasicAuth($this->originatorId, $this->password)
            ->acceptJson()
            ->get($this->baseUrl.'/payment/'.urlencode($merchantToken).'/status', [
                'apiVersion' => $this->apiVersion,
            ])
            ->throw()
            ->json();
    }

    public function isSuccessfulStatus(array $status): bool
    {
        return ($status['errorCode'] ?? null) === '000'
            || strcasecmp((string) ($status['status'] ?? ''), 'Authorized') === 0;
    }

    public function customerRedirectUrl(string $customerToken): string
    {
        if ($customerToken === '') {
            throw new RuntimeException('Token client Payzone manquant.');
        }

        return $this->baseUrl.'/payment/'.rawurlencode($customerToken);
    }

    public function toMinorUnits(float $amount): int
    {
        return (int) round($amount * 100);
    }

    private function ensureConfigured(): void
    {
        if (! $this->configured()) {
            throw new RuntimeException('Payzone n est pas configure.');
        }
    }
}
