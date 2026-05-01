<?php

namespace App\Support;

use Illuminate\Support\Str;

class EmailMessageTemplate
{
    public static function render(string $key, array $data): array
    {
        $fallbacks = [
            'access_activated' => [
                'subject' => 'Votre acces etudiant Info Saloua',
                'body' => "Bonjour {{name}},\n\nVotre acces Info Saloua est active.\nEmail: {{email}}\nMot de passe: {{password}}\n\nLors de la connexion, un code de verification vous sera envoye par email avant l acces au dashboard.",
            ],
            'login_code' => [
                'subject' => 'Code de verification Info Saloua',
                'body' => "Votre code de verification Info Saloua est: {{code}}\n\nIl expire dans 10 minutes.",
            ],
        ];

        $template = $fallbacks[$key] ?? ['subject' => $key, 'body' => ''];
        $path = resource_path('email-messages.xml');

        if (is_file($path)) {
            $xml = @simplexml_load_file($path);
            if ($xml !== false) {
                foreach ($xml->message as $message) {
                    if ((string) $message['key'] === $key) {
                        $template = [
                            'subject' => trim((string) $message->subject),
                            'body' => trim((string) $message->body),
                        ];
                        break;
                    }
                }
            }
        }

        return [
            'subject' => self::replace($template['subject'], $data),
            'body' => self::replace($template['body'], $data),
        ];
    }

    private static function replace(string $value, array $data): string
    {
        return Str::of($value)
            ->replaceMatches('/{{\s*([a-zA-Z0-9_]+)\s*}}/', fn ($matches) => (string) ($data[$matches[1]] ?? ''))
            ->toString();
    }
}
