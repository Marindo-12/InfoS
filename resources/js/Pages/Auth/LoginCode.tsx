import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function LoginCode({ email, status }: { email: string; status?: string }) {
  const { data, setData, post, processing, errors } = useForm({ code: '' });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login-code.store'));
  };

  return (
    <GuestLayout>
      <Head title="Verification de connexion" />

      <div className="mb-6 text-sm text-gray-600">
        Entrez le code a 6 chiffres envoye a <strong>{email}</strong> pour ouvrir votre dashboard.
      </div>

      {status && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{status}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <InputLabel htmlFor="code" value="Code de verification" />
          <TextInput
            id="code"
            name="code"
            value={data.code}
            className="mt-1 block w-full text-center text-xl tracking-[0.35em]"
            maxLength={6}
            inputMode="numeric"
            autoFocus
            onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <InputError message={errors.code} className="mt-2" />
        </div>

        <div className="flex items-center justify-between">
          <PrimaryButton disabled={processing}>Verifier</PrimaryButton>
          <Link href={route('logout')} method="post" as="button" className="text-sm text-gray-600 underline">
            Annuler
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
