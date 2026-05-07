<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Throwable;

class PublicContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'subject' => ['required', Rule::in(['inscription', 'information', 'partnership', 'other'])],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ], [
            'name.required' => 'Veuillez entrer votre nom complet.',
            'email.required' => 'Veuillez entrer votre adresse email.',
            'email.email' => 'Adresse email invalide.',
            'subject.required' => 'Veuillez choisir un sujet.',
            'subject.in' => 'Sujet invalide.',
            'message.required' => 'Veuillez ecrire votre message.',
            'message.min' => 'Votre message doit contenir au moins 10 caracteres.',
            'message.max' => 'Votre message est trop long.',
        ]);

        $subjectLabels = [
            'inscription' => "Demande d'inscription",
            'information' => "Demande d'information",
            'partnership' => 'Partenariat',
            'other' => 'Autre',
        ];

        $recipient = config('mail.contact_to') ?: config('mail.from.address');
        $subjectLabel = $subjectLabels[$validated['subject']];
        $body = implode("\n", [
            'Nouveau message depuis la page Contact Info Saloua',
            '',
            'Nom: '.$validated['name'],
            'Email: '.$validated['email'],
            'Sujet: '.$subjectLabel,
            '',
            'Message:',
            $validated['message'],
        ]);

        try {
            Mail::raw($body, function ($message) use ($recipient, $validated, $subjectLabel) {
                $message
                    ->to($recipient)
                    ->replyTo($validated['email'], $validated['name'])
                    ->subject('Contact Info Saloua - '.$subjectLabel);
            });

            Log::info('Message de contact envoye.', [
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'recipient' => $recipient,
            ]);

            return back()->with('success', 'Message envoye avec succes. Nous vous repondrons rapidement.');
        } catch (Throwable $exception) {
            Log::warning('Impossible d envoyer le message de contact.', [
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'recipient' => $recipient,
                'message' => $exception->getMessage(),
            ]);

            return back()->withErrors([
                'contact' => 'Le message n a pas pu etre envoye. Verifiez la configuration email puis reessayez.',
            ]);
        }
    }
}
